import React, { useState, useEffect, useCallback, useRef } from 'react'
import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { PiListMagnifyingGlassFill } from "react-icons/pi"
import { TfiWrite } from "react-icons/tfi";
import { FaCcAmazonPay } from "react-icons/fa";
import { toast } from 'react-toastify';
import BackButton from '../components/shared/BackButton';
import SupplierAdd from '../components/suppliers/SupplierAdd';
import BottomNav from '../components/shared/BottomNav';
import { setSupplier } from '../redux/slices/supplierSlice';
import SupplierPayment from '../components/suppliers/SupplierPayment';
import DetailsModalSupplier from '../components/suppliers/DetailsModalSupplier';
import { useDispatch } from 'react-redux'
import { api } from '../https';
import SupplierEdit from '../components/suppliers/SupplierEdit';

const Suppliers = () => {
    const dispatch = useDispatch();

    const Button = [
        { label: 'اضافه مورد', icon: <MdOutlineAddToDrive className='text-white' size={20} />, action: 'supplier' }
    ];

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

    const handleOpenModal = (action) => {
        if (action === 'supplier') setIsSupplierModalOpen(true)
    }

    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    const [isEditSupplierModal, setIsEditSupplierModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/supplier/fetch',
                {
                    search,
                    sort,
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
                });

            if (response.data.success) {
                setList(response.data.suppliers)

                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        currentPage: response.data.pagination.currentPage ?? prev.currentPage,
                        itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
                        totalItems: response.data.pagination.total ?? prev.totalItems,
                        totalPages: response.data.pagination.totalPages ?? prev.totalPages
                    }));
                };
            } else {
                toast.error(response.data.message || 'supplier not found')
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message)
            }
            console.log(error)
        } finally {
            setLoading(false);
        }
    });

    const isInitialMount = useRef(true);
    useEffect(() => {
        fetchSuppliers();
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    const handleEdit = (supplier) => {
        setCurrentSupplier(supplier);
        setIsEditSupplierModal(true);
    };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const removeSupplier = async (id) => {
        try {
            const response = await api.post('/api/supplier/remove', { id },)
            if (response.data.success) {
                toast.success('تم مسح المورد بنجاح')
                await fetchSuppliers();
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const detailsButton = [
        { label: '', icon: <PiListMagnifyingGlassFill className='text-blue-500' size={20} />, action: 'details' }
    ]

    const [isDetailsModal, setIsDetailsModal] = useState(false);

    const handleDetailsModal = (supplierId, supplierName, balance, email, action) => {
        dispatch(setSupplier({ supplierId, supplierName, balance, email }));
        if (action === 'details') setIsDetailsModal(true);
    };

    const paymentButton = [
        { label: '', icon: <FaCcAmazonPay className='text-blue-500' size={20} />, action: 'payment' }
    ]

    const [isPaymentModal, setIsPaymentModal] = useState(false);

    const handlePaymentModal = (supplierId, supplierName, balance, action) => {
        dispatch(setSupplier({ supplierId, supplierName, balance }));
        if (action === 'payment') setIsPaymentModal(true);
    };

    const PaginationControls = () => {
        const handlePageChange = (newPage) => {
            setPagination(prev => ({
                ...prev,
                currentPage: newPage
            }));
        };

        const handleItemsPerPageChange = (newItemsPerPage) => {
            setPagination(prev => ({
                ...prev,
                itemsPerPage: newItemsPerPage,
                currentPage: 1
            }));
        };

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-2 py-3 px-3 sm:px-5 
            bg-gradient-to-r from-blue-50 to-white shadow-md rounded-lg text-xs font-medium border border-blue-200">
                <div className="mb-2 sm:mb-0 text-blue-700">
                    Showing
                    <span className='font-bold text-blue-800'> {list.length} </span>
                    of
                    <span className='font-bold text-blue-800'> {pagination.totalItems} </span>
                    records
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1.5 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 
                        text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="px-3 py-1.5 text-blue-700">
                        Page
                        <span className='font-bold text-blue-800 mx-1'> {pagination.currentPage} </span>
                        of
                        <span className='font-bold text-blue-800 mx-1'> {pagination.totalPages} </span>
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-1.5 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 
                        text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>

                    <select
                        value={pagination.itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="px-3 py-1.5 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 
                        text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <section dir='rtl' className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>

            {/* Header Section */}
            <div className='sticky top-0 z-10 bg-white shadow-lg px-4 py-3 sm:px-6 border-b border-blue-200'>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                        <BackButton />
                        <h1 className='text-lg sm:text-xl font-bold text-blue-900'>اداره الموردين</h1>
                    </div>

                    <div className='flex gap-2'>
                        {Button.map(({ label, icon, action }) => {
                            return (
                                <button
                                    onClick={() => handleOpenModal(action)}
                                    className='bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-white 
                                    font-semibold text-sm flex items-center gap-2 rounded-lg hover:from-blue-700 
                                    hover:to-blue-800 transition-all shadow-md hover:shadow-lg'
                                >
                                    {label} {icon}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {isSupplierModalOpen &&
                    <SupplierAdd
                        setIsSupplierModalOpen={setIsSupplierModalOpen}
                        fetchSuppliers={fetchSuppliers}
                    />
                }
            </div>

            {/* Search and Filter Section */}
            <div className="px-4 py-4 sm:px-6 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 max-w-7xl mx-auto">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="بحث عن مورد ..."
                            className="w-full border-2 border-blue-200 p-3 rounded-xl text-sm font-medium
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                            transition-all duration-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select
                            className="w-full sm:w-auto border-2 border-blue-200 p-3 rounded-xl text-blue-900 
                            text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                            focus:outline-none transition-all duration-200"
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                            }}
                        >
                            <option value="-createdAt">الأحدث أولاً</option>
                            <option value="createdAt">الأقدم أولاً</option>
                            <option value="supplierName">بالاسم (أ-ي)</option>
                            <option value="-supplierName">بالاسم (ي-أ)</option>
                            <option value='balance'>الرصيد (منخفض-مرتفع)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 
                    border-t-blue-600 mb-3"></div>
                    <span className="text-blue-700 font-medium">جاري التحميل...</span>
                </div>
            )}

            {/* Main Content */}
            <div className='px-3 sm:px-6 py-4 max-w-7xl mx-auto'>
                <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100'>
                    
                    {/* Table Container */}
                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[800px]'>
                            <thead>
                                <tr className='bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200'>
                                    <th className='p-4 text-right text-blue-900 font-bold text-sm'>المورد</th>
                                    <th className='p-4 text-right text-blue-900 font-bold text-sm'>البريد الإلكتروني</th>
                                    <th className='p-4 text-right text-blue-900 font-bold text-sm'>رقم الهاتف</th>
                                    <th className='p-4 text-right text-blue-900 font-bold text-sm'>العنوان</th>
                                    <th className='p-4 text-right text-blue-900 font-bold text-sm'>الرصيد</th>
                                    <th className='p-4 text-right text-blue-900 font-bold text-sm'>الإجراءات</th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.map((supplier, index) => (
                                    <tr
                                        key={supplier._id}
                                        className='border-b border-blue-50 hover:bg-blue-50/50 transition-colors duration-200'
                                    >
                                        <td className='p-4'>
                                            <div className='font-semibold text-blue-900'>{supplier.supplierName}</div>
                                        </td>
                                        <td className='p-4 text-blue-700'>{supplier.email}</td>
                                        <td className='p-4 text-blue-700'>{supplier.contactNo}</td>
                                        <td className='p-4 text-blue-700 max-w-xs truncate'>{supplier.address}</td>
                                        <td className={`p-4 font-semibold ${supplier.balance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {supplier.balance.toFixed(2)}
                                            <span className='text-blue-700 font-normal mr-1'>ر.ع</span>
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex gap-2 justify-end'>
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    className='p-2 bg-blue-50 hover:bg-blue-100 rounded-lg 
                                                    transition-colors duration-200'
                                                    title="تعديل"
                                                >
                                                    <LiaEditSolid size={20} className='text-blue-600' />
                                                </button>
                                                
                                                <button
                                                    onClick={() => { setSelectedSupplier(supplier); setDeleteModalOpen(true); }}
                                                    className='p-2 bg-red-50 hover:bg-red-100 rounded-lg 
                                                    transition-colors duration-200'
                                                    title="حذف"
                                                >
                                                    <MdDeleteForever size={20} className='text-red-600' />
                                                </button>
                                                
                                                {detailsButton.map(({ icon, action }) => (
                                                    <button
                                                        key={action}
                                                        onClick={() => handleDetailsModal(supplier._id, supplier.supplierName, 
                                                            supplier.balance, supplier.email, action)}
                                                        className='p-2 bg-blue-50 hover:bg-blue-100 rounded-lg 
                                                        transition-colors duration-200'
                                                        title="التفاصيل"
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                                
                                                {paymentButton.map(({ icon, action }) => (
                                                    <button
                                                        key={action}
                                                        onClick={() => handlePaymentModal(supplier._id, supplier.supplierName, 
                                                            supplier.balance, action)}
                                                        className='p-2 bg-blue-50 hover:bg-blue-100 rounded-lg 
                                                        transition-colors duration-200'
                                                        title="الدفع"
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            
                            <tfoot>
                                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                                    <td className="p-4">
                                        <div className='font-bold text-blue-900'>
                                            {list.length}
                                            <span className='font-normal text-blue-700 mr-1'> مورد</span>
                                        </div>
                                    </td>
                                    <td className="p-4" colSpan={4}></td>
                                    <td className="p-4"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Empty State */}
                    {!loading && list.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="text-4xl mb-4 text-blue-300">📋</div>
                            <p className='text-blue-700 font-medium'>
                                {search
                                    ? `عفواً لا يوجد مورد باسم "${search}"`
                                    : 'قائمة الموردين فارغة حالياً!'}
                            </p>
                            <p className='text-blue-500 text-sm mt-2'>
                                {search ? 'جرب بحثاً مختلفاً' : 'ابدأ بإضافة مورد جديد'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="px-3 sm:px-6 py-4 border-t border-blue-200">
                        <PaginationControls />
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isEditSupplierModal && currentSupplier && (
                <SupplierEdit
                    supplier={currentSupplier}
                    setIsEditSupplierModal={setIsEditSupplierModal}
                    fetchSuppliers={fetchSuppliers}
                />
            )}

            {isDetailsModal && <DetailsModalSupplier setIsDetailsModal={setIsDetailsModal} />}

            {isPaymentModal &&
                <SupplierPayment
                    setIsPaymentModal={setIsPaymentModal}
                    fetchSuppliers={fetchSuppliers}
                />
            }

            <BottomNav />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                supplierName={selectedSupplier?.supplierName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeSupplier(selectedSupplier._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, supplierName }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-blue-100">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdDeleteForever className="text-red-600 text-3xl" />
                    </div>
                    <h2 className="text-xl font-bold text-blue-900 mb-2">تأكيد الحذف</h2>
                    <p className="text-blue-700">
                        هل أنت متأكد من مسح المورد
                        <span className="font-bold text-red-600 mx-1">{supplierName}</span>
                        ؟
                    </p>
                    <p className="text-sm text-blue-500 mt-2">لا يمكن التراجع عن هذا الإجراء</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        className="flex-1 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium
                        hover:bg-blue-100 transition-colors border border-blue-200"
                        onClick={onClose}
                    >
                        إلغاء
                    </button>
                    <button
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white 
                        rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all"
                        onClick={onConfirm}
                    >
                        تأكيد الحذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;


// import React, { useState , useEffect ,useCallback, useRef  } from 'react'
// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";
// import { PiListMagnifyingGlassFill } from "react-icons/pi"
// import { TfiWrite } from "react-icons/tfi";
// import { FaCcAmazonPay } from "react-icons/fa";

// import { toast } from 'react-toastify';
// import BackButton from '../components/shared/BackButton';
// import SupplierAdd from '../components/suppliers/SupplierAdd';
// import BottomNav from '../components/shared/BottomNav';
// import { setSupplier } from '../redux/slices/supplierSlice';

// import SupplierPayment from '../components/suppliers/SupplierPayment';
// import DetailsModalSupplier from '../components/suppliers/DetailsModalSupplier';
// import { useDispatch } from 'react-redux'
// import { api } from '../https';
// import SupplierEdit from '../components/suppliers/SupplierEdit';

// const Suppliers = () => {

//     const dispatch = useDispatch();

//     const Button = [
//         { label : 'اضافه مورد' , icon : <MdOutlineAddToDrive className ='text-yellow-700' size={20} />, action :'supplier' }
//     ];

//     const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

//     const handleOpenModal = (action) => {
//         if (action === 'supplier') setIsSupplierModalOpen(true)
//     }

            
//     const [list, setList] = useState([]);
//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');
//     const [loading, setLoading] = useState(false);
//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         itemsPerPage: 10,
//         totalItems: 0,
//         totalPages: 1
//     });
    
//     const [isEditSupplierModal, setIsEditSupplierModal] = useState(false);
//     const [currentSupplier, setCurrentSupplier] = useState(null);

//     const fetchSuppliers = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/api/supplier/fetch',
//                 {
//                     search,
//                     sort,
//                     page: pagination.currentPage,
//                     limit: pagination.itemsPerPage
//                 });

//             if (response.data.success) {
//                 setList(response.data.suppliers)

//                 if (response.data.pagination) {
//                     setPagination(prev => ({
//                         ...prev,  // Keep existing values
//                         currentPage: response.data.pagination.currentPage ?? prev.currentPage,
//                         itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
//                         totalItems: response.data.pagination.total ?? prev.totalItems,
//                         totalPages: response.data.pagination.totalPages ?? prev.totalPages
//                     }));
//                 };
//             } else {
//                 toast.error(response.data.message || 'supplier not found')
//             }

//         } catch (error) {
//             // Show backend error message if present in error.response
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message)
//             }
//             console.log(error)
//         } finally {
//             setLoading(false);
//         }
//     });

//     const isInitialMount = useRef(true);
//     useEffect(() => {
//         //if (isInitialMount.current) {
//         //    isInitialMount.current = false;
//         //} else {
//             fetchSuppliers();
//         //}
//     }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);


//     // Handle edit
//     const handleEdit = (supplier) => {
//         setCurrentSupplier(supplier);
//         setIsEditSupplierModal(true);
//     };

                
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedSupplier, setSelectedSupplier] = useState(null);
    
//     const removeSupplier = async (id) => {
                      
//         try {
                
//         const response = await api.post('/api/supplier/remove', { id }, )
//         if (response.data.success){
//         toast.success('تم مسح المورد بنجاح')
                       
//         //Update the LIST after Remove
//         await fetchSuppliers();
                        
//         } else{
//             toast.error(response.data.message)
//         }
                    
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };



//     const detailsButton = [
//         { label: '', icon: <PiListMagnifyingGlassFill className='text-green-600' size={20} />, action: 'details' }
//     ]

//     const [isDetailsModal, setIsDetailsModal] = useState(false);

//     const handleDetailsModal = (supplierId, supplierName, balance, email, action) => {

//         dispatch(setSupplier({ supplierId, supplierName, balance, email }));
//         if (action === 'details') setIsDetailsModal(true);

//         // console.log(customerId)
//     };

//     const paymentButton = [
//         { label: '', icon: <FaCcAmazonPay className='text-[#0ea5e9]' size={20} />, action: 'payment' }
//     ]

//     const [isPaymentModal, setIsPaymentModal] = useState(false);

//     const handlePaymentModal = (supplierId, supplierName, balance, action) => {

//         dispatch(setSupplier({ supplierId, supplierName, balance }));
//         if (action === 'payment') setIsPaymentModal(true);

//         // console.log(customerId, customerName , balance)

//     };


//     // pagination
//     const PaginationControls = () => {

//         const handlePageChange = (newPage) => {
//             setPagination(prev => ({
//                 ...prev,
//                 currentPage: newPage
//             }));
//         };

//         const handleItemsPerPageChange = (newItemsPerPage) => {
//             setPagination(prev => ({
//                 ...prev,
//                 itemsPerPage: newItemsPerPage,
//                 currentPage: 1  // Reset to first page only when items per page changes
//             }));
//         };


//         return (  //[#0ea5e9]
//             <div className="flex justify-between items-center mt-2 py-2 px-5 bg-white shadow-lg/30 rounded-lg
//             text-xs font-medium border-b border-yellow-700 border-t border-yellow-700">
//                 <div>
//                     Showing
//                     <span className='text-yellow-700'> {list.length} </span>
//                     of
//                     <span className='text-yellow-700'> {pagination.totalItems} </span>
//                     records
//                 </div>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => handlePageChange(pagination.currentPage - 1)}
//                         disabled={pagination.currentPage === 1}
//                         className="px-2 py-1 shadow-lg/30 border-b border-yellow-700
//                         text-xs font-normal disabled:opacity-50"
//                     >
//                         Previous
//                     </button>

//                     <span className="px-3 py-1">
//                         Page
//                         <span className='text-yellow-700'> {pagination.currentPage} </span>
//                         of
//                         <span className='text-yellow-700'> {pagination.totalPages} </span>
//                     </span>

//                     <button
//                         onClick={() => handlePageChange(pagination.currentPage + 1)}
//                         disabled={pagination.currentPage === pagination.totalPages}
//                         className="px-2 py-1 shadow-lg/30 border-b border-yellow-700 text-xs font-normal disabled:opacity-50"
//                     >
//                         Next
//                     </button>

//                     <select
//                         value={pagination.itemsPerPage}
//                         onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                         className="border-b border-yellow-700 px-2 font-normal shadow-lg/30"
//                     >
//                         <option value="5">5 per page</option>
//                         <option value="10">10 per page</option>
//                         <option value="20">20 per page</option>
//                         <option value="50">50 per page</option>
//                     </select>
//                 </div>
//             </div>
//         );
//     };

//     return(
//         <section dir ='rtl' className ='h-[100vh] overflow-y-scroll scrollbar-hidden'>

//             <div className='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                 <div className='flex items-center gap-2'>
//                     <BackButton />
//                     <h1 className='text-sm font-semibold text-[#1a1a1a]'>اداره الموردين</h1>
//                 </div>
                                                                
//                 <div className ='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {Button.map(({ label, icon, action}) => {
//                         return(
//                         <button 
//                             onClick = {() => handleOpenModal(action)}
//                             className ='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'> 
//                             {label} {icon}
//                         </button>
//                         )
//                     })}
//                 </div>
                                                            
//                 {isSupplierModalOpen && 
//                 <SupplierAdd 
//                 setIsSupplierModalOpen ={setIsSupplierModalOpen} 
//                 fetchSuppliers ={fetchSuppliers}
//                 />
//                 }
                                                            
//             </div>

//             {/* Search and sorting and Loading */}
//             <div className="flex items-center px-15 py-2 shadow-xl">
//                 <input
//                     type="text"
//                     placeholder="بحث ..."
//                     className="border border-yellow-700 p-1 rounded-lg w-full text-xs font-semibold"
//                     // max-w-md
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//                 {/* Optional: Sort dropdown */}
//                 <select
//                     className="mr-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
//                     value={sort}

//                     onChange={(e) => {
//                         setSort(e.target.value);
//                         setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                     }}
//                 >
//                     <option value="-createdAt">Newest First</option>
//                     <option value="createdAt">Oldest First</option>
//                     <option value="supplierName">By Name (A-Z)</option>
//                     <option value="-supplierName">By Name (Z-A)</option>
//                     <option value='balance'>Balance (Low to High)</option>
//                 </select>
//             </div>

//             {/* Loading Indicator */}
//             {loading && (
//                 <div className="mt-4 flex gap-2 justify-center">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
//                     <span className="ml-2">تحميل...</span>
//                 </div>
//             )}


//             <div className='mt-5 bg-white py-1 px-10' >

//                 <div className='overflow-x-auto'>
//                     <table className='text-left w-full'>
//                         <thead>
//                             <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                 <th className='p-2'>المورد</th>
//                                 <th className='p-2'>البريد اللاكتروني</th>
//                                 <th className='p-2'>رقم الهاتف</th>
//                                 <th className='p-2'>العنوان</th>
//                                 <th className='p-2'>الرصيد</th>

//                                 <th className='p-2'></th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {/* {list.length === 0 
//                         ? (<p className ='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>Your supplieres list is empty . Start adding suppliers !</p>) 
//                         :
//                          */}

//                             {
//                                 list.map((supplier, index) => (

//                                     <tr
//                                         // key ={index}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                             hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-2' hidden>{supplier._id}</td>
//                                         <td className='p-2'>{supplier.supplierName}</td>
//                                         <td className='p-2'>{supplier.email}</td>
//                                         <td className='p-2'>{supplier.contactNo}</td>
//                                         <td className='p-2'>{supplier.address}</td>
//                                         <td className={`p-2 ${supplier.balance === 0 ? 'text-green-600' : 'text-[#be3e3f]'}`}>
//                                             {supplier.balance.toFixed(2)}
//                                             <span className='text-[#1a1a1a] font-normal'> ج.س</span>
//                                         </td>


//                                         <td className='p-1 text-center flex gap-1'>
//                                             <button
//                                             >
//                                                 <LiaEditSolid size={20}
//                                                     className='w-5 h-5 text-[#0ea5e9] rounded-full flex justify-end cursor-pointer hover:bg-[#0ea5e9]/30'
//                                                     onClick={() => handleEdit(supplier)}
//                                                 />
//                                             </button>

//                                             <button
//                                             >
//                                                 <MdDeleteForever onClick={() => { setSelectedSupplier(supplier); setDeleteModalOpen(true); }}
//                                                     size={20}
//                                                     className='w-5 h-5 text-[#be3e3f] rounded-full cursor-pointer hover:bg-[#be3e3f]/30' />
//                                             </button>

//                                             {detailsButton.map(({ label, icon, action }) => {

//                                                 return (
//                                                     <button
//                                                         className='cursor-pointer hover:bg-emerald-600/30 rounded-full'
//                                                         onClick={() => handleDetailsModal(supplier._id, supplier.supplierName, supplier.balance, supplier.email,action)}
//                                                     >
//                                                         {label} {icon}
//                                                     </button>
//                                                 )
//                                             })}


//                                             {paymentButton.map(({ label, icon, action }) => {

//                                                 return (
//                                                     <button
//                                                         className='cursor-pointer rounded-full  text-xs font-semibold text-sm flex 
//                                                         items-center ml-1'
//                                                         onClick={() => handlePaymentModal(supplier._id, supplier.supplierName, supplier.balance, action)}
//                                                     >
//                                                         {label} {icon}
//                                                     </button>
//                                                 )
//                                             })}

//                                         </td>


//                                     </tr>
//                                 ))}
//                         </tbody>
//                         <tfoot>
//                             <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-600 text-xs font-semibold">
//                                 <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> مورد</span></td>

//                                 <td className="p-2" colSpan={3}></td>
//                                 <td className="p-2"></td>
//                                 <td className="p-2" colSpan={1}></td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                     {!loading && list.length === 0 && (
//                         <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
//                             {search
//                                 ? `عفوا لايوجد مورد باسم "${search}"`
//                                 : `قائمه الموردين فارغه حاليا !`}

//                         </p>
//                     )}
//                 </div>
//                 <PaginationControls />
//             </div>

//             {isEditSupplierModal && currentSupplier && (
//                 <SupplierEdit
//                     supplier= {currentSupplier}
//                     setIsEditSupplierModal= {setIsEditSupplierModal}
//                     fetchSuppliers= {fetchSuppliers}
//                 />
//             )}

               
//             {isDetailsModal && <DetailsModalSupplier setIsDetailsModal={setIsDetailsModal} />} 
            
//             {isPaymentModal && 
//             <SupplierPayment 
//             setIsPaymentModal={setIsPaymentModal} 
//             fetchSuppliers ={fetchSuppliers}
//             />
//             }    
                         
            

//             <BottomNav />

//             {/* Place the ConfirmModal here */}
//             <ConfirmModal
//                 open={deleteModalOpen}
//                 supplierName={selectedSupplier?.supplierName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeSupplier(selectedSupplier._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />

//         </section>
//     );
// };

// // You can put this at the bottom of your Services.jsx file or in a separate file
// const ConfirmModal = ({ open, onClose, onConfirm, supplierName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">هل انت متاكد من مسح المورد  <span className="font-semibold text-red-600">{supplierName}</span>?</p>
//         <div className="flex justify-end gap-3">
//           <button
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
//             onClick={onClose}
//           >
//             الغاء
//           </button>
//           <button
//             className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
//             onClick={onConfirm}
//           >
//             مسح
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Suppliers ;