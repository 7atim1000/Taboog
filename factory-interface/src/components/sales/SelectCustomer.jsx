import React, {useState, useEffect, useCallback} from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux'
import { PiUserCircleCheckLight } from "react-icons/pi";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWallet } from "react-icons/fa";
import { toast } from 'react-toastify'
import { setCustomer } from '../../redux/slices/customerSlice';
import { api } from '../../https';

const SelectCustomer = ({setIsSelectCustomerModalOpen}) => {
    const dispatch = useDispatch();

    const handleSelectCustomer = (customerId, customerName, email, balance) => {
        dispatch(setCustomer({ customerId, customerName, email, balance }));
        setIsSelectCustomerModalOpen(false);
        toast.success(`تم اختيار العميل: ${customerName}`);
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

    // Fetch customers function
    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/customer/fetch', {
                search: debouncedSearch,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setList(response.data.customers);
            } else {
                toast.error(response.data.message || 'Customer not found');
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

    // Fetch customers when debounced search or sort changes
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return (
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
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
                                <FaUser className='text-white w-5 h-5' />
                            </div>
                            <div>
                                <h2 className='text-white font-bold text-lg'>اختيار العميل</h2>
                                <p className='text-blue-100 text-sm'>اختر عميلاً لاستكمال عملية البيع</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsSelectCustomerModalOpen(false)} 
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
                            placeholder='ابحث عن عميل بالاسم أو البريد الإلكتروني...' 
                            className='w-full border border-blue-200 rounded-lg pl-10 pr-12 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className='absolute left-3 top-2'>
                            <span className='text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded'>
                                {list.length} عميل
                            </span>
                        </div>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className='text-blue-600 font-medium'>جاري تحميل العملاء...</p>
                        <p className='text-gray-500 text-sm mt-2'>يرجى الانتظار</p>
                    </div>
                ) : (
                    /* Customer List */
                    <div className='flex-1 overflow-hidden'>
                        {list.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-full p-8'>
                                <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                                    <FaUser className='text-blue-500 w-10 h-10' />
                                </div>
                                <h3 className='text-gray-600 font-medium text-lg mb-2'>
                                    {debouncedSearch ? 'لا توجد نتائج' : 'لا يوجد عملاء'}
                                </h3>
                                <p className='text-gray-400 text-center text-sm max-w-md'>
                                    {debouncedSearch 
                                        ? `لم يتم العثور على عميل يتطابق مع "${debouncedSearch}"`
                                        : 'لم يتم إضافة أي عملاء بعد. يمكنك إضافة عميل جديد من خلال قائمة العملاء.'}
                                </p>
                            </div>
                        ) : (
                            <div className='h-full overflow-y-auto p-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {list.map((customer) => (
                                        <motion.div
                                            key={customer._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            whileHover={{ scale: 1.02 }}
                                            className='bg-white border border-blue-100 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition duration-200 cursor-pointer group'
                                            onClick={() => handleSelectCustomer(customer._id, customer.customerName, customer.email, customer.balance)}
                                        >
                                            <div className='flex items-start justify-between mb-3'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                                                        <span className='text-white font-bold text-lg'>
                                                            {customer.customerName?.charAt(0) || 'ع'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className='font-bold text-blue-900 group-hover:text-blue-700'>
                                                            {customer.customerName}
                                                        </h3>
                                                        <div className='flex items-center gap-1 mt-1'>
                                                            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
                                                                ID: {customer._id.slice(-6)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    className='p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition duration-150'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectCustomer(customer._id, customer.customerName, customer.email, customer.balance);
                                                    }}
                                                    title="اختيار هذا العميل"
                                                >
                                                    <PiUserCircleCheckLight className='w-6 h-6' />
                                                </button>
                                            </div>

                                            <div className='space-y-2'>
                                                {customer.email && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <FaEnvelope className='text-gray-400 w-3.5 h-3.5' />
                                                        <span className='text-gray-600 truncate'>{customer.email}</span>
                                                    </div>
                                                )}
                                                
                                                {customer.contactNo && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <FaPhone className='text-gray-400 w-3.5 h-3.5' />
                                                        <span className='text-gray-600'>{customer.contactNo}</span>
                                                    </div>
                                                )}
                                                
                                                {customer.address && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <FaMapMarkerAlt className='text-gray-400 w-3.5 h-3.5' />
                                                        <span className='text-gray-600 truncate'>{customer.address}</span>
                                                    </div>
                                                )}
                                                
                                                <div className='flex items-center gap-2 text-sm pt-2 border-t border-gray-100 mt-2'>
                                                    <FaWallet className='text-gray-400 w-3.5 h-3.5' />
                                                    <span className={`font-medium ${customer.balance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        الرصيد: {(Number(customer.balance) || 0).toFixed(2)} ر.ع
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
                            <span className='font-medium text-blue-700'>{list.length}</span> عميل متاح للاختيار
                        </div>
                        <div className='flex gap-2'>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className='border border-blue-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                            >
                                <option value='-createdAt'>الأحدث أولاً</option>
                                <option value='createdAt'>الأقدم أولاً</option>
                                <option value='customerName'>حسب الاسم (أ-ي)</option>
                                <option value='-customerName'>حسب الاسم (ي-أ)</option>
                            </select>
                            <button
                                onClick={() => setIsSelectCustomerModalOpen(false)}
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

export default SelectCustomer;


// import React, {useState, useEffect, useCallback} from 'react'
// import { motion } from 'framer-motion'
// import { IoCloseCircle } from 'react-icons/io5';
// import { useDispatch } from 'react-redux'
// import { PiUserCircleCheckLight } from "react-icons/pi";
// import { toast } from 'react-toastify'
// import { setCustomer } from '../../redux/slices/customerSlice';
// import { api } from '../../https';

// const SelectCustomer = ({setIsSelectCustomerModalOpen}) => {
//     const dispatch = useDispatch();

//     const handleClose = (customerId, customerName, email, balance) => {
//         dispatch(setCustomer({ customerId, customerName, email, balance }));
//         setIsSelectCustomerModalOpen(false);
//     };

//     // State variables
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

//     // Fetch customers function with useCallback to prevent unnecessary recreations
//     const fetchCustomers = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/api/customer/fetch', {
//                 search: debouncedSearch,
//                 sort,
//                 page: 1,
//                 limit: 1000
//             });

//             if (response.data.success) {
//                 setList(response.data.customers);
//                 console.log(response.data.customers)
//             } else {
//                 toast.error(response.data.message || 'Customer not found');
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

//     // Fetch customers when debounced search or sort changes
//     useEffect(() => {
//         fetchCustomers();
//     }, [fetchCustomers]);

//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50' 
//             style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)'}}
// >
           
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-3 rounded-lg shadow-lg/30 w-175 h-[calc(100vh-2rem)] md:mt-5 mt-5 
//                 border-b-3 border-yellow-700'
//             >
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-xs font-semibold underline'>الرجاء اختيار العميل</h2>
//                     <button 
//                         onClick={() => setIsSelectCustomerModalOpen(false)} 
//                         className='rounded-sm border-b border-[#be3e3f] text-[#be3e3f]
//                         cursor-pointer hover:bg-[#be3e3f]/30 transition-all duration-150 ease-in-out'
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
//                     <div className="mt-4 flex gap-2 justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
//                         <span className="ml-2">تحميل...</span>
//                     </div>
//                 )}

//                 {/* Modal Body */}
//                 <div className='mt-5'>
//                     <div className='overflow-x-auto'>
//                         <table className='text-left w-full'>
//                             <thead>
//                                 <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                     <th className='p-2'>الاسم</th>
//                                     <th className='p-2'>الايميل</th>
//                                     <th className='p-2'>التليفون</th>
//                                     <th className='p-2'>العنوان</th>
//                                     <th className='p-2'>الرصيد</th>
//                                     <th className='p-2'></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {list.map((customer) => (
//                                     <tr
//                                         key={customer._id}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-4'>{customer.customerName}</td>
//                                         <td className='p-2'>{customer.email}</td>
//                                         <td className='p-2'>{customer.contactNo}</td>
//                                         <td className='p-2'>{customer.address}</td>
//                                         <td 
//                                             className={`p-2 ${customer.balance === 0 ? 'text-[#1a1a1a]' : 'text-[#be3e3f]'} font-semibold`}>
//                                             {(Number(customer.balance) || 0).toFixed(2)}
//                                         </td>
//                                         <td className='p-2'>
//                                             <button 
//                                                 onClick={() => handleClose(customer._id, customer.customerName, customer.email, customer.balance)}
//                                             >
//                                                 <PiUserCircleCheckLight
//                                                     className='w-7 h-7 text-[#0ea5e9] rounded-full flex justify-end cursor-pointer'
//                                                 />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
                        
//                         {!loading && list.length === 0 && (
//                             <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
//                                 {debouncedSearch 
//                                     ? `عفوا لايوجد عميل باسم  "${debouncedSearch}"` 
//                                     : 'قائمه العملاء فارغه حاليا!'}
//                             </p>
//                         )}
//                     </div>          
//                 </div>

//                 {/* Footer */}
//                 <div className='mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500'>
//                     {list.length} عميل
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default SelectCustomer;