import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdDeleteForever, 
  MdOutlineAddToDrive,
  MdSearch,
  MdSort,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdAccountBalanceWallet,
  MdPersonAdd
} from "react-icons/md";
import { 
  LiaEditSolid,
  LiaEyeSolid,
  LiaReceiptSolid
} from "react-icons/lia";
import { 
  FaCcAmazonPay,
  FaUserCircle,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaUndo,
  FaFilter
} from "react-icons/fa";
import { 
  TbCurrencyDinar,
  TbArrowsSort,
  TbUserSearch
} from "react-icons/tb";
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import BackButton from '../components/shared/BackButton';
import CustomerAdd from '../components/customers/CustomerAdd';
import BottomNav from '../components/shared/BottomNav';
import { setCustomer } from '../redux/slices/customerSlice';
import DetailsModal from '../components/customers/DetailsModal';
import CustomerPayment from '../components/customers/CustomerPayment';
import { api } from '../https';
import CustomerUpdate from '../components/customers/CustomerUpdate';

const Customers = () => {
    const dispatch = useDispatch();

    // State management
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    
    // Modal states
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isEditCustomerModal, setIsEditCustomerModal] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDetailsModal, setIsDetailsModal] = useState(false);
    const [isPaymentModal, setIsPaymentModal] = useState(false);
    
    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    // Fetch customers
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/customer/fetch', {
                search,
                sort,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });

            if (response.data.success) {
                setList(response.data.customers || []);
                
                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        currentPage: response.data.pagination.currentPage ?? prev.currentPage,
                        itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
                        totalItems: response.data.pagination.total ?? prev.totalItems,
                        totalPages: response.data.pagination.totalPages ?? prev.totalPages
                    }));
                }
            } else {
                toast.error(response.data.message || 'لم يتم العثور على العملاء');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || 'فشل في جلب العملاء');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    // Calculate totals
    const totalCustomers = pagination.totalItems;
    const totalBalance = list.reduce((sum, customer) => sum + (customer.balance || 0), 0);
    const activeCustomers = list.filter(customer => (customer.balance || 0) === 0).length;
    const overdueCustomers = list.filter(customer => (customer.balance || 0) > 0).length;

    // Handle edit
    const handleEdit = (customer) => {
        setCurrentCustomer(customer);
        setIsEditCustomerModal(true);
    };

    // Handle delete
    const removeCustomer = async (id) => {
        try {
            const response = await api.post('/api/customer/remove', { id });
            if (response.data.success) {
                toast.success('تم حذف العميل بنجاح');
                await fetchCustomers();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'فشل في حذف العميل');
        }
    };

    // Handle details modal
    const handleDetailsModal = (customerId, customerName, balance, action) => {
        dispatch(setCustomer({ customerId, customerName, balance }));
        if (action === 'details') setIsDetailsModal(true);
    };

    // Handle payment modal
    const handlePaymentModal = (customerId, customerName, balance, action) => {
        dispatch(setCustomer({ customerId, customerName, balance }));
        if (action === 'payment') setIsPaymentModal(true);
    };

    // Pagination controls
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="text-sm text-gray-700">
                    عرض <span className="font-bold text-blue-700">{list.length}</span> من <span className="font-bold text-blue-700">{totalCustomers}</span> عميل
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1.5 text-sm bg-white border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        السابق
                    </button>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                        <span>صفحة</span>
                        <span className="font-bold text-blue-700">{pagination.currentPage}</span>
                        <span>من</span>
                        <span className="font-bold text-blue-700">{pagination.totalPages}</span>
                    </div>
                    
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-1.5 text-sm bg-white border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        التالي
                    </button>
                    
                    <select
                        value={pagination.itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="px-3 py-1.5 text-sm bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="5">5 لكل صفحة</option>
                        <option value="10">10 لكل صفحة</option>
                        <option value="20">20 لكل صفحة</option>
                        <option value="50">50 لكل صفحة</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <BackButton />
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                <FaUsers className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-white">إدارة العملاء</h1>
                                <p className="text-xs text-blue-200">إدارة وتتبع قاعدة بيانات العملاء</p>
                            </div>
                        </div>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCustomerModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <MdPersonAdd className="h-5 w-5" />
                        <span>إضافة عميل جديد</span>
                    </motion.button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 sm:px-6 py-3 bg-white border-b border-blue-100">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">إجمالي العملاء</p>
                            <p className="text-xl font-bold text-blue-700">{totalCustomers}</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <FaUsers className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">إجمالي الرصيد</p>
                            <p className="text-xl font-bold text-blue-700">{totalBalance.toFixed(2)} ر.ع</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <MdAccountBalanceWallet className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">عملاء نشطين</p>
                            <p className="text-xl font-bold text-green-600">{activeCustomers}</p>
                        </div>
                        <div className="p-2 rounded-full bg-green-100">
                            <FaChartLine className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">مدينين</p>
                            <p className="text-xl font-bold text-amber-600">{overdueCustomers}</p>
                        </div>
                        <div className="p-2 rounded-full bg-amber-100">
                            <FaMoneyBillWave className="h-5 w-5 text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="ابحث عن عميل..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-10 pl-4 py-2.5 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 bg-white"
                        />
                    </div>
                    
                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                            }}
                            className="appearance-none w-full sm:w-48 pr-10 pl-4 py-2.5 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 bg-white"
                        >
                            <option value="-createdAt">الأحدث أولاً</option>
                            <option value="createdAt">الأقدم أولاً</option>
                            <option value="customerName">بالاسم (أ-ي)</option>
                            <option value="-customerName">بالاسم (ي-أ)</option>
                            <option value="balance">الرصيد (منخفض)</option>
                            <option value="-balance">الرصيد (مرتفع)</option>
                            <option value="contactNo">برقم الهاتف</option>
                        </select>
                        <TbArrowsSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                        >
                            <MdSort className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                        >
                            <FaFilter className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 pb-20">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-600">جاري تحميل العملاء...</p>
                        </div>
                    </div>
                ) : viewMode === 'list' ? (
                    // List View
                    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-50">
                                    <tr className="text-right text-sm font-semibold text-gray-700">
                                        <th className="px-4 py-3">العميل</th>
                                        <th className="px-4 py-3">معلومات التواصل</th>
                                        <th className="px-4 py-3">العنوان</th>
                                        <th className="px-4 py-3">الرصيد</th>
                                        <th className="px-4 py-3">الحالة</th>
                                        <th className="px-4 py-3">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                                        <TbUserSearch className="h-8 w-8 text-blue-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد عملاء</h3>
                                                    <p className="text-gray-500">
                                                        {search ? `لا توجد نتائج لـ "${search}"` : 'قائمة العملاء فارغة حالياً'}
                                                    </p>
                                                    {search && (
                                                        <button
                                                            onClick={() => setSearch('')}
                                                            className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                        >
                                                            <FaUndo className="h-3 w-3" />
                                                            إعادة تعيين البحث
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        list.map((customer, index) => {
                                            const hasBalance = (customer.balance || 0) > 0;
                                            
                                            return (
                                                <motion.tr
                                                    key={customer._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className={`border-b border-blue-50 hover:bg-blue-50/50 transition-colors ${
                                                        hasBalance ? 'bg-red-50/20' : ''
                                                    }`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                                                                <FaUserCircle className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800">{customer.customerName}</p>
                                                                <p className="text-xs text-gray-500">#{customer.customerCode || 'غير محدد'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <MdEmail className="h-3 w-3 text-gray-400" />
                                                                <span className="text-gray-600">{customer.email || 'غير محدد'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <MdPhone className="h-3 w-3 text-gray-400" />
                                                                <span className="text-gray-600">{customer.contactNo || 'غير محدد'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <MdLocationOn className="h-3 w-3 text-gray-400 mt-0.5" />
                                                            <span className="text-gray-600">{customer.address || 'غير محدد'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`font-bold ${hasBalance ? 'text-red-600' : 'text-green-600'}`}>
                                                            {customer.balance?.toFixed(2)} ر.ع
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                            hasBalance ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {hasBalance ? 'مدين' : 'نشط'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(customer)}
                                                                className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                                title="تعديل"
                                                            >
                                                                <LiaEditSolid className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedCustomer(customer);
                                                                    setDeleteModalOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                                title="حذف"
                                                            >
                                                                <MdDeleteForever className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDetailsModal(customer._id, customer.customerName, customer.balance, 'details')}
                                                                className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                                                title="التفاصيل"
                                                            >
                                                                <LiaEyeSolid className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, 'payment')}
                                                                className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                                                                title="سداد"
                                                            >
                                                                <FaCcAmazonPay className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {list.length > 0 && (
                            <div className="px-4 py-3 border-t border-blue-100">
                                <PaginationControls />
                            </div>
                        )}
                    </div>
                ) : (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {list.length === 0 ? (
                            <div className="col-span-full">
                                <div className="flex flex-col items-center justify-center h-64">
                                    <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <TbUserSearch className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد عملاء</h3>
                                    <p className="text-gray-500">
                                        {search ? `لا توجد نتائج لـ "${search}"` : 'قائمة العملاء فارغة حالياً'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            list.map((customer, index) => {
                                const hasBalance = (customer.balance || 0) > 0;
                                
                                return (
                                    <motion.div
                                        key={customer._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`bg-white rounded-xl border ${
                                            hasBalance ? 'border-red-200' : 'border-blue-100'
                                        } shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                                    >
                                        <div className="p-4">
                                            {/* Customer Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                                                        <FaUserCircle className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">{customer.customerName}</h3>
                                                        <p className="text-xs text-gray-500">#{customer.customerCode || 'غير محدد'}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                    hasBalance ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {hasBalance ? 'مدين' : 'نشط'}
                                                </span>
                                            </div>
                                            
                                            {/* Customer Info */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MdEmail className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600 truncate">{customer.email || 'غير محدد'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MdPhone className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-600">{customer.contactNo || 'غير محدد'}</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm">
                                                    <MdLocationOn className="h-3 w-3 text-gray-400 mt-0.5" />
                                                    <span className="text-gray-600 line-clamp-2">{customer.address || 'غير محدد'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Balance */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">الرصيد الحالي</span>
                                                    <span className={`font-bold ${hasBalance ? 'text-red-600' : 'text-green-600'}`}>
                                                        {customer.balance?.toFixed(2)} ر.ع
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex items-center justify-between border-t border-blue-100 pt-3">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(customer)}
                                                        className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                        title="تعديل"
                                                    >
                                                        <LiaEditSolid className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomer(customer);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                        title="حذف"
                                                    >
                                                        <MdDeleteForever className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDetailsModal(customer._id, customer.customerName, customer.balance, 'details')}
                                                        className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                                        title="التفاصيل"
                                                    >
                                                        <LiaEyeSolid className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, 'payment')}
                                                        className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                                                        title="سداد"
                                                    >
                                                        <FaCcAmazonPay className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isCustomerModalOpen && (
                    <CustomerAdd
                        setIsCustomerModalOpen={setIsCustomerModalOpen}
                        fetchCustomers={fetchCustomers}
                    />
                )}
                
                {isEditCustomerModal && currentCustomer && (
                    <CustomerUpdate
                        customer={currentCustomer}
                        setIsEditCustomerModal={setIsEditCustomerModal}
                        fetchCustomers={fetchCustomers}
                    />
                )}
                
                {isDetailsModal && (
                    <DetailsModal setIsDetailsModal={setIsDetailsModal} />
                )}
                
                {isPaymentModal && (
                    <CustomerPayment
                        setIsPaymentModal={setIsPaymentModal}
                        fetchCustomers={fetchCustomers}
                    />
                )}
                
                {deleteModalOpen && (
                    <ConfirmModal
                        open={deleteModalOpen}
                        customerName={selectedCustomer?.customerName}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={() => {
                            removeCustomer(selectedCustomer._id);
                            setDeleteModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, customerName }) => {
    if (!open) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-2xl w-[95vw] sm:w-[400px] p-6 border border-red-100"
            >
                <div className="text-center mb-6">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdDeleteForever className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
                    <p className="text-gray-600">
                        هل أنت متأكد من حذف العميل
                        <span className="font-bold text-red-600 mx-1">"{customerName}"</span>؟
                    </p>
                    <p className="text-sm text-gray-500 mt-2">لا يمكن التراجع عن هذا الإجراء</p>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <MdDeleteForever className="h-4 w-4" />
                        تأكيد الحذف
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Customers;

// import React, { useState , useEffect, useCallback, useRef } from 'react'
// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";
// import { PiListMagnifyingGlassFill } from "react-icons/pi"
// import { FaCcAmazonPay } from "react-icons/fa";
// import { useDispatch } from 'react-redux'

// import { toast } from 'react-toastify';

// import BackButton from '../components/shared/BackButton';
// import CustomerAdd from '../components/customers/CustomerAdd';
// import BottomNav from '../components/shared/BottomNav';
// import { setCustomer } from '../redux/slices/customerSlice';
// import DetailsModal from '../components/customers/DetailsModal';
// import CustomerPayment from '../components/customers/CustomerPayment';
// import { api } from '../https';
// import CustomerUpdate from '../components/customers/CustomerUpdate';


// const Customers = () => {
//     const dispatch = useDispatch();

//     const Button = [
//         { label : 'اضافه عميل' , icon : <MdOutlineAddToDrive className ='text-yellow-700' size={20} />, action :'customer' }
//     ];

//     const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

//     const handleOpenModal = (action) => {
//         if(action === 'customer') setIsCustomerModalOpen(true);
//     };
        
//     // fetch customers - any error on .map or length check next function
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

//     const [isEditCustomerModal, setIsEditCustomerModal] = useState(false);
//     const [currentCustomer, setCurrentCustomer] = useState(null);

//     const fetchCustomers = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/api/customer/fetch',
//                 {
//                     search,
//                     sort,
//                     page: pagination.currentPage,
//                     limit: pagination.itemsPerPage
//                 });
        
//             if (response.data.success) {
//                 setList(response.data.customers)
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
//                 toast.error(response.data.message || 'customer not found')
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
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//         } else {
//             fetchCustomers();
//         }
//     }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

//     // Handle edit
//     const handleEdit = (customer) => {
//         setCurrentCustomer(customer);
//         setIsEditCustomerModal(true);
//     };
    
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedCustomer, setSelectedCustomer] = useState(null);

//     const removeCustomer = async (id) => {
              
//         try {
//             const response = api.post('/api/customer/remove', { id }, )
//             if (response.data.success){
//                 toast.success(response.data.message)
               
//                 //Update the LIST after Remove
//                 await fetchCustomers();
                
//             } else{
//                 toast.error(response.data.message)
//             }
            
//             } catch (error) {
//                 console.log(error)
//                 toast.error(error.message)
//             }
//     };

    
//     const detailsButton = [
//         { label : '' , icon : <PiListMagnifyingGlassFill className ='text-green-600' size={20} />, action :'details' }
//     ]

//     const [isDetailsModal, setIsDetailsModal] = useState(false);

//     const handleDetailsModal = (customerId, customerName, balance, action) => {
//         dispatch(setCustomer({ customerId, customerName, balance  }));
//         if (action === 'details') setIsDetailsModal(true);

//        // console.log(customerId)
//     };



//     const paymentButton = [
//         { label : 'Payment' , icon : <FaCcAmazonPay className ='text-[#0ea5e9]' size={20} />, action :'payment' }
//     ]

//     const [isPaymentModal, setIsPaymentModal] = useState(false);

//     const handlePaymentModal = (customerId, customerName ,balance, action) => {
//         dispatch(setCustomer({ customerId, customerName , balance }));
//         if (action === 'payment') setIsPaymentModal(true);

//        // console.log(customerId, customerName , balance)
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

//     return (
//         <section dir ='rtl' className ='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
            
//             <div  className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
               
//                 <div className ='flex items-center gap-2'>
//                     <BackButton />
//                     <h1 className ='text-sm font-semibold text-[#1a1a1a]'>اداره العملاء</h1>
//                 </div>
                                        
//                 <div className ='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {Button.map(({ label, icon, action}) => {
//                         return(
//                             <button 
//                                 onClick = {() => handleOpenModal(action)}
//                                 className ='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'> 
//                                 {label} {icon}
//                             </button>
//                             )
//                         })}
//                 </div>
                                    
//                 {isCustomerModalOpen && 
//                 <CustomerAdd 
//                 setIsCustomerModalOpen ={setIsCustomerModalOpen} 
//                 fetchCustomers ={fetchCustomers}
//                 />} 
                                    
//             </div>

    
//             {/* Search and sorting and Loading */}
//                 <div className="flex items-center px-15 py-2 shadow-xl">
//                     <input
//                         type="text"
//                         placeholder="بحث ..."
//                         className="border border-yellow-700 p-1 rounded-lg w-full text-xs font-semibold"
//                         // max-w-md
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                     {/* Optional: Sort dropdown */}
//                     <select
//                         className="mr-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
//                         value={sort}

//                         onChange={(e) => {
//                             setSort(e.target.value);
//                             setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                         }}
//                     >
//                         <option value="-createdAt">Newest First</option>
//                         <option value="createdAt">Oldest First</option>
//                         <option value="customerName">By Name (A-Z)</option>
//                         <option value="-customerName">By Name (Z-A)</option>
//                         <option value ='balance'>Balance (Low to High)</option>
//                     </select>
//                 </div>

//             {/* Loading Indicator */}
//             {loading && (
//                 <div className="mt-4 flex gap-2 justify-center">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
//                     <span className="ml-2">تحميل...</span>
//                 </div>
//             )}

            
//             <div className ='mt-5 bg-white py-1 px-10'>
                      
//             <div className ='overflow-x-auto'>
//                 <table className ='text-left w-full'>
//                     <thead className =''>
//                         <tr className ='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                             <th className ='p-2'>العميل</th>
//                             <th className ='p-2'>البريد اللاكتروني</th>
//                             <th className ='p-2'>رقم الهاتف</th>
//                             <th className ='p-2'>العنوان</th>
//                             <th className ='p-2'>الرصيد</th>
                        
//                             <th className ='p-1' style={{ marginRight: '0px'}}></th>  
//                         </tr>
//                     </thead>
                        
//                 <tbody>
                    
//                     {/* {list.length === 0 
//                     ? (<p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your customers list is empty . Start adding customers !</p>) 
//                     :list.map((customer, index) => ( */}
//                     {
//                     list.map((customer, index) => (
                    
//                     <tr
//                        // key ={index}
//                         className ='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                             hover:bg-[#F1E8D9] cursor-pointer'
//                     >
//                         <td className ='p-2' hidden>{customer._id}</td>
//                         <td className ='p-2'>{customer.customerName}</td>
//                         <td className ='p-2'>{customer.email}</td>
//                         <td className ='p-2'>{customer.contactNo}</td>
//                         <td className ='p-2'>{customer.address}</td>
//                         <td className ={`p-2 ${customer.balance === 0 ? 'text-green-600' : 'text-[#be3e3f]'}`}>
//                             {customer.balance.toFixed(2)}
//                             <span className ='text-[#1a1a1a] font-normal'> ج.س</span>
//                         </td>
                 
                        
//                         <td className ='p-1 flex flex-wrap gap-2 justify-center bg-zinc-1' style={{ marginRight: '0px'}}>

//                             <button className ={`cursor-pointer text-sm font-semibold `}>
//                                 <LiaEditSolid size ={20} 
//                                 className ='w-5 h-5 text-sky-600 rounded-full' 
//                                 onClick={() => handleEdit(customer)}
//                                 />
//                             </button>
                            
//                             <button 
//                                 className ={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
//                                 <MdDeleteForever 
//                                 onClick={()=> {setSelectedCustomer(customer); setDeleteModalOpen(true); }} 
//                                 className ='w-5 h-5 text-[#be3e3f] rounded-full'/> 
//                             </button>
                           
//                                 {detailsButton.map(({ label, icon, action }) => {
//                                     return (
//                                         <button className='cursor-pointer 
//                                         rounded-lg text-green-600 font-semibold text-sm '
//                                             onClick={() => handleDetailsModal(customer._id, customer.customerName, customer.balance, action)}
//                                         >
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}


//                                 {paymentButton.map(({ label, icon, action }) => {
//                                     return (
//                                         <button className='cursor-pointer 
//                                         rounded-xs text-[#0ea5e9] text-xs font-normal flex items-center gap-1'
//                                             onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, action)}
//                                         >
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}
//                         </td>             
//                     </tr>
//                ))}
//                     </tbody>
//                         <tfoot>
//                             <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-600 text-xs font-semibold">
//                                 <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> عميل</span></td>

//                                 <td className="p-2" colSpan={3}></td>
//                                 <td className="p-2"></td>
//                                 <td className="p-2" colSpan={1}></td>
//                             </tr>
//                         </tfoot>
//                 </table>
//                 {!loading && list.length === 0 && (
//                     <p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
//                         {search
//                         ? `عفوا لايوجد عميل باسم  "${search}"` 
//                         : `قائمه العملاء فارغه حاليا`}
                        
//                     </p>
//                 )}


//         <PaginationControls/>
//             </div>
            
//             {isDetailsModal && <DetailsModal setIsDetailsModal={setIsDetailsModal} />} 
           
//             {isPaymentModal && 
//             <CustomerPayment 
//             setIsPaymentModal={setIsPaymentModal} 
//             fetchCustomers= {fetchCustomers}
//             />
//             }    
                     
//         </div>

//             {isEditCustomerModal && currentCustomer && (
//                 <CustomerUpdate
//                     customer= {currentCustomer}
//                     setIsEditCustomerModal= {setIsEditCustomerModal}
//                     fetchCustomers= {fetchCustomers}
//                 />
//             )}

//             <BottomNav />

//             {/* Place the ConfirmModal here */}
//             <ConfirmModal
//                 open={deleteModalOpen}
//                 customerName={selectedCustomer?.customerName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeCustomer(selectedCustomer._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />

//         </section>
//     )
// };


// // You can put this at the bottom of your Services.jsx file or in a separate file
// const ConfirmModal = ({ open, onClose, onConfirm, customerName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">هل انت متاكد من مسح العميل  <span className="font-semibold text-red-600">{customerName}</span>?</p>
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

// export default Customers ;