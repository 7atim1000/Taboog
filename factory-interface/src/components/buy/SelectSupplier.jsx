import React, {useState, useEffect, useCallback} from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux'
import { PiUserCircleCheckLight } from "react-icons/pi";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWallet, FaTruck } from "react-icons/fa";
import { toast } from 'react-toastify'
import { setSupplier } from '../../redux/slices/supplierSlice';
import { api } from '../../https';

const SelectSupplier = ({setIsSelectSupplierModalOpen}) => {
    const dispatch = useDispatch();
    
    const handleSelectSupplier = (supplierId, supplierName, email, balance) => {
        dispatch(setSupplier({ supplierId, supplierName, email, balance }));
        setIsSelectSupplierModalOpen(false);
        toast.success(`تم اختيار المورد: ${supplierName}`);
    };

    // State variables
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch suppliers function
    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/supplier/fetch', {
                search: debouncedSearch,
                sort,
                page: 1,
                limit: 1000
            });
        
            if (response.data.success) {
                setList(response.data.suppliers);
            } else {
                toast.error(response.data.message || 'Supplier not found');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, sort]);
        
    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    return (
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4'
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col'
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <div className='flex items-center gap-3'>
                            <div className='bg-white/20 p-2 rounded-lg'>
                                <FaTruck className='text-white w-5 h-5' />
                            </div>
                            <div>
                                <h2 className='text-white font-bold text-lg'>اختيار المورد</h2>
                                <p className='text-blue-100 text-sm'>اختر مورداً لاستكمال عملية الشراء</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSelectSupplierModalOpen(false)}
                            className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                            title="إغلاق"
                        >
                            <IoCloseCircle size={24} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className='p-4 border-b border-blue-100'>
                    <div className='relative'>
                        <div className='absolute right-3 top-3 text-blue-400'>
                            <FaSearch className='w-5 h-5' />
                        </div>
                        <input
                            type='text'
                            placeholder='ابحث عن مورد بالاسم أو البريد الإلكتروني...'
                            className='w-full border border-blue-200 rounded-lg pl-10 pr-12 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className='absolute left-3 top-2'>
                            <span className='text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded'>
                                {list.length} مورد
                            </span>
                        </div>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className='text-blue-600 font-medium'>جاري تحميل الموردين...</p>
                        <p className='text-gray-500 text-sm mt-2'>يرجى الانتظار</p>
                    </div>
                ) : (
                    /* Supplier List */
                    <div className='flex-1 overflow-hidden'>
                        {list.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-full p-8'>
                                <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                                    <FaTruck className='text-blue-500 w-10 h-10' />
                                </div>
                                <h3 className='text-gray-600 font-medium text-lg mb-2'>
                                    {debouncedSearch ? 'لا توجد نتائج' : 'لا يوجد موردين'}
                                </h3>
                                <p className='text-gray-400 text-center text-sm max-w-md'>
                                    {debouncedSearch 
                                        ? `لم يتم العثور على مورد يتطابق مع "${debouncedSearch}"`
                                        : 'لم يتم إضافة أي موردين بعد. يمكنك إضافة مورد جديد من خلال قائمة الموردين.'}
                                </p>
                            </div>
                        ) : (
                            <div className='h-full overflow-y-auto p-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {list.map((supplier) => (
                                        <motion.div
                                            key={supplier._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            whileHover={{ scale: 1.02 }}
                                            className='bg-white border border-blue-100 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition duration-200 cursor-pointer group'
                                            onClick={() => handleSelectSupplier(supplier._id, supplier.supplierName, supplier.email, supplier.balance)}
                                        >
                                            <div className='flex items-start justify-between mb-3'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center'>
                                                        <span className='text-white font-bold text-lg'>
                                                            {supplier.supplierName?.charAt(0) || 'م'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className='font-bold text-blue-900 group-hover:text-blue-700'>
                                                            {supplier.supplierName}
                                                        </h3>
                                                        <div className='flex items-center gap-1 mt-1'>
                                                            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
                                                                ID: {supplier._id?.slice(-6) || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    className='p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition duration-150'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectSupplier(supplier._id, supplier.supplierName, supplier.email, supplier.balance);
                                                    }}
                                                    title="اختيار هذا المورد"
                                                >
                                                    <PiUserCircleCheckLight className='w-6 h-6' />
                                                </button>
                                            </div>

                                            <div className='space-y-2'>
                                                {supplier.email && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <FaEnvelope className='text-gray-400 w-3.5 h-3.5' />
                                                        <span className='text-gray-600 truncate'>{supplier.email}</span>
                                                    </div>
                                                )}
                                                
                                                {supplier.contactNo && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <FaPhone className='text-gray-400 w-3.5 h-3.5' />
                                                        <span className='text-gray-600'>{supplier.contactNo}</span>
                                                    </div>
                                                )}
                                                
                                                {supplier.address && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <FaMapMarkerAlt className='text-gray-400 w-3.5 h-3.5' />
                                                        <span className='text-gray-600 truncate'>{supplier.address}</span>
                                                    </div>
                                                )}
                                                
                                                <div className='flex items-center gap-2 text-sm pt-2 border-t border-gray-100 mt-2'>
                                                    <FaWallet className='text-gray-400 w-3.5 h-3.5' />
                                                    <span className={`font-medium ${supplier.balance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        الرصيد: {(Number(supplier.balance) || 0).toFixed(2)} ر.ع
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className='border-t border-blue-100 p-4 bg-blue-50 rounded-b-xl'>
                    <div className='flex justify-between items-center'>
                        <div className='text-sm text-gray-600'>
                            <span className='font-medium text-blue-700'>{list.length}</span> مورد متاح للاختيار
                        </div>
                        <div className='flex gap-2'>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className='border border-blue-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                            >
                                <option value='-createdAt'>الأحدث أولاً</option>
                                <option value='createdAt'>الأقدم أولاً</option>
                                <option value='supplierName'>حسب الاسم (أ-ي)</option>
                                <option value='-supplierName'>حسب الاسم (ي-أ)</option>
                            </select>
                            <button
                                onClick={() => setIsSelectSupplierModalOpen(false)}
                                className='px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm font-medium'
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SelectSupplier;

// import React, {useState, useEffect, useCallback} from 'react'
// import { motion } from 'framer-motion'
// import { IoCloseCircle } from 'react-icons/io5';
// import { useDispatch } from 'react-redux'
// import { PiUserCircleCheckLight } from "react-icons/pi";
// import { toast } from 'react-toastify'

// import { setSupplier } from '../../redux/slices/supplierSlice';
// import { api } from '../../https';

// const SelectSupplier = ({setIsSelectSupplierModalOpen}) => {

//      const dispatch = useDispatch();
    
//     const handleClose = (supplierId, supplierName, email, balance) => {
//         dispatch(setSupplier({ supplierId, supplierName, email, balance }));
//         setIsSelectSupplierModalOpen(false);
//     };

//     // fetch supplier - any error on .map or length check next function
//     const [list, setList] = useState([]);
//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');
//     const [loading, setLoading] = useState(false);
//     const [debouncedSearch, setDebouncedSearch] = useState('');

//     // Debounce search input
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedSearch(search);
//         }, 400);

//         return () => clearTimeout(timer);
//     }, [search]);


//     const fetchSuppliers = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/api/supplier/fetch', {
//                 search: debouncedSearch,
//                 sort,
//                 page: 1,
//                 limit: 1000
//             });
        
//             if (response.data.success) {
//                 setList(response.data.suppliers)
//                 console.log(response.data.suppliers)
//             } else {
//                 toast.error(response.data.message || 'supplier not found')
//             }


//         } catch (error) {
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message);
//             }
//             console.error(error);

//         } finally {
//             setLoading(false);
//         }
//     }, [debouncedSearch, sort]);
        
 
//     useEffect(() => {
//         fetchSuppliers();
//     }, [fetchSuppliers]  // was[fetchSuppliers()] have error :-

// );




//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
//             
                //>

//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-3 rounded-lg shadow-lg/30 w-175 h-[calc(100vh-2rem)] md:mt-5 mt-5 
//                        border-b-3 border-yellow-700'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-semibold underline'>الرجاء اختيار المورد</h2>
//                     <button
//                         onClick={() => setIsSelectSupplierModalOpen(false)}
//                         className='rounded-sm border-b border-[#be3e3f] text-[#be3e3f]
//                             cursor-pointer hover:bg-[#be3e3f]/30 transition-all duration-150 ease-in-out'
//                     >
//                         <IoCloseCircle size={25} />
//                     </button>
//                 </div>
//                 {/* Search Input */}
//                 <div className='flex items-center p-2 shadow-xl'>
//                     <input
//                         type='text'
//                         placeholder='بحث ...'
//                         className='w-full border-b border-yellow-700 bg-[#F1E8D9] p-2 text-sm focus:outline-none rounded-sm'
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>
//                 {/* Loading Indicator */}
//                 {loading && (
//                     <div className="mt-4 flex justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9]"></div>
//                         <span className="ml-2">تحميل...</span>
//                     </div>
//                 )}


//                 {/*Modal Body*/}
//                 <div className='mt-5'>


//                     <div className='overflow-x-auto'>
//                         <table className='text-left w-full'>
//                             <thead>
//                                 <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                     <th className='p-2'>المورد</th>
//                                     <th className='p-2'>الايميل</th>
//                                     <th className='p-2'>التليفون</th>
//                                     <th className='p-2'>العنوان</th>
//                                     <th className='p-2'>الرصيد</th>
//                                     <th className='p-2'></th>
//                                 </tr>
//                             </thead>

//                             <tbody>

//                                 {list.map((supplier) => (

//                                     <tr
//                                         // key={supplier._id}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-2' hidden>{supplier._id}</td>
//                                         <td className='p-4'>{supplier.supplierName}</td>
//                                         <td className='p-4'>{supplier.email}</td>
//                                         <td className='p-2'>{supplier.contactNo}</td>
//                                         <td className='p-2'>{supplier.address}</td>

//                                         <td
//                                             className={`p-2 ${supplier.balance === 0 ? 'text-[#1a1a1a]' : 'text-[#be3e3f]'} font-semibold`}>
//                                             {(Number(supplier.balance) || 0).toFixed(2)}
//                                         </td>

//                                         <td className='p-2'>
//                                             <button >
//                                                 <PiUserCircleCheckLight
//                                                     className='w-7 h-7 text-[#0ea5e9] rounded-full flex justify-end cursor-pointer'
//                                                     onClick={() => handleClose(supplier._id, supplier.supplierName, supplier.email, supplier.balance)} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         {!loading && list.length === 0 && (
//                             <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
//                                 {debouncedSearch
//                                     ? `عفوا لايوجد مورد باسم "${debouncedSearch}"`
//                                     : 'قائمه الموردين فارغه حاليا !'}
//                             </p>
//                         )}

//                     </div>
//                 </div>
//                 <div className='mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500'>
//                     {list.length} مورد
//                 </div>

//             </motion.div>
//         </div>
//     );
// }


// export default SelectSupplier ;