import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdDeleteForever, 
  MdOutlineAddToDrive,
  MdSearch,
  MdSort,
  MdFilterList,
  MdGridView,
  MdList,
  MdWarehouse,
  MdInventory2
} from "react-icons/md";
import { 
  LiaEditSolid,
  LiaEyeSolid
} from "react-icons/lia";
import { 
  FaBox,
  FaTags,
  FaChartLine,
  FaWeightHanging,
  FaUndo,
  FaIndustry
} from "react-icons/fa";
import { 
  TbCurrencyDinar,
  TbArrowsSort
} from "react-icons/tb";
import { api } from '../https';
import { toast } from 'react-toastify'
import BackButton from '../components/shared/BackButton';
import BottomNav from '../components/shared/BottomNav';
import ItemAdd from '../components/items/ItemAdd';
import ItemEdit from '../components/items/ItemEdit';

const Items = () => {    
    // State management
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    
    // Modal states
    const [isAddItemModal, setIsAddItemModal] = useState(false);
    const [isEditItemModal, setIsEditItemModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    // Fetch items
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/item/fetch', {
                search,
                sort,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });

            if (response.data.success) {
                setList(response.data.items || response.data.data || []);
                
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
                toast.error(response.data.message || 'قائمة المواد الخام فارغة');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'فشل في جلب المواد الخام');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    // Calculate total values
    const totalQuantity = list.reduce((sum, item) => sum + (item.qty || 0), 0);
    const totalValue = list.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0);
    const lowStockItems = list.filter(item => (item.qty || 0) < 10).length;

    // Handle edit
    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsEditItemModal(true);
    };

    // Handle delete
    const removeItem = async (id) => {
        try {
            const response = await api.post('/api/item/remove', { id });
            if (response.data.success) {
                toast.success('تم حذف الصنف بنجاح');
                await fetchItems();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'فشل في حذف الصنف');
        }
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
                    عرض <span className="font-bold text-blue-700">{list.length}</span> من <span className="font-bold text-blue-700">{pagination.totalItems}</span> صنف
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
                                <MdInventory2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-white">إدارة المواد الخام</h1>
                                <p className="text-xs text-blue-200">إدارة وتتبع مواد الإنتاج</p>
                            </div>
                        </div>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddItemModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <MdOutlineAddToDrive className="h-5 w-5" />
                        <span>إضافة صنف جديد</span>
                    </motion.button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 sm:px-6 py-3 bg-white border-b border-blue-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">إجمالي الأصناف</p>
                            <p className="text-xl font-bold text-blue-700">{pagination.totalItems}</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <FaBox className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">الكمية الإجمالية</p>
                            <p className="text-xl font-bold text-blue-700">{totalQuantity} وحدة</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <FaWeightHanging className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">أصناف منخفضة المخزون</p>
                            <p className="text-xl font-bold text-red-600">{lowStockItems}</p>
                        </div>
                        <div className="p-2 rounded-full bg-red-100">
                            <FaIndustry className="h-5 w-5 text-red-600" />
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
                            placeholder="ابحث عن صنف..."
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
                            <option value="itemName">بالاسم (أ-ي)</option>
                            <option value="-itemName">بالاسم (ي-أ)</option>
                            <option value="category">بالتصنيف</option>
                            <option value="price">بسعر الشراء (منخفض)</option>
                            <option value="-price">بسعر الشراء (مرتفع)</option>
                            <option value="qty">بالكمية (منخفض)</option>
                            <option value="-qty">بالكمية (مرتفع)</option>
                        </select>
                        <TbArrowsSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                        >
                            <MdList className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                        >
                            <MdGridView className="h-5 w-5" />
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
                            <p className="text-gray-600">جاري تحميل المواد الخام...</p>
                        </div>
                    </div>
                ) : viewMode === 'list' ? (
                    // List View
                    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-50">
                                    <tr className="text-right text-sm font-semibold text-gray-700">
                                        <th className="px-4 py-3">اسم الصنف</th>
                                        <th className="px-4 py-3">التصنيف</th>
                                        <th className="px-4 py-3">سعر الشراء</th>
                                        <th className="px-4 py-3">الكمية</th>
                                        <th className="px-4 py-3">الوحدة</th>
                                        <th className="px-4 py-3">الحالة</th>
                                        <th className="px-4 py-3">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                                        <MdWarehouse className="h-8 w-8 text-blue-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد مواد خام</h3>
                                                    <p className="text-gray-500">
                                                        {search ? `لا توجد نتائج لـ "${search}"` : 'قائمة المواد الخام فارغة حالياً'}
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
                                        list.map((item, index) => {
                                            const isLowStock = (item.qty || 0) < 10;
                                            const isOutOfStock = (item.qty || 0) <= 0;
                                            
                                            return (
                                                <motion.tr
                                                    key={item._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className={`border-b border-blue-50 hover:bg-blue-50/50 transition-colors ${
                                                        isOutOfStock ? 'bg-red-50/50' : isLowStock ? 'bg-amber-50/50' : ''
                                                    }`}
                                                >
                                                    <td className="px-4 py-3 font-medium text-gray-800">
                                                        {item.itemName}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                            {item.category || 'غير محدد'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-blue-700">
                                                        {item.price?.toFixed(2)} ج.س
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`font-medium ${
                                                            isOutOfStock ? 'text-red-600' : 
                                                            isLowStock ? 'text-amber-600' : 
                                                            'text-green-600'
                                                        }`}>
                                                            {item.qty || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {item.unit || 'وحدة'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                            isOutOfStock ? 'bg-red-100 text-red-700' :
                                                            isLowStock ? 'bg-amber-100 text-amber-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {isOutOfStock ? 'نفذ' : isLowStock ? 'منخفض' : 'متوفر'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                                title="تعديل"
                                                            >
                                                                <LiaEditSolid className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedItem(item);
                                                                    setDeleteModalOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                                title="حذف"
                                                            >
                                                                <MdDeleteForever className="h-4 w-4" />
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
                                        <MdWarehouse className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد مواد خام</h3>
                                    <p className="text-gray-500">
                                        {search ? `لا توجد نتائج لـ "${search}"` : 'قائمة المواد الخام فارغة حالياً'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            list.map((item, index) => {
                                const isLowStock = (item.qty || 0) < 10;
                                const isOutOfStock = (item.qty || 0) <= 0;
                                
                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`bg-white rounded-xl border ${
                                            isOutOfStock ? 'border-red-200' : 
                                            isLowStock ? 'border-amber-200' : 
                                            'border-blue-100'
                                        } shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                                    >
                                        <div className="p-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                    {item.category || 'غير محدد'}
                                                </span>
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                    isOutOfStock ? 'bg-red-100 text-red-700' :
                                                    isLowStock ? 'bg-amber-100 text-amber-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {isOutOfStock ? 'نفذ' : isLowStock ? 'منخفض' : 'متوفر'}
                                                </span>
                                            </div>
                                            
                                            {/* Item Name */}
                                            <h3 className="font-bold text-gray-800 mb-3 truncate">
                                                {item.itemName}
                                            </h3>
                                            
                                            {/* Details */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">سعر الشراء</span>
                                                    <span className="font-bold text-blue-700">{item.price?.toFixed(2)} ج.س</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">المخزون</span>
                                                    <span className={`font-bold ${
                                                        isOutOfStock ? 'text-red-600' : 
                                                        isLowStock ? 'text-amber-600' : 
                                                        'text-green-600'
                                                    }`}>
                                                        {item.qty || 0} {item.unit || 'وحدة'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex items-center justify-between border-t border-blue-100 pt-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                        title="تعديل"
                                                    >
                                                        <LiaEditSolid className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                        title="حذف"
                                                    >
                                                        <MdDeleteForever className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                    <LiaEyeSolid className="h-3 w-3" />
                                                    <span>التفاصيل</span>
                                                </button>
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
                {isAddItemModal && (
                    <ItemAdd
                        setIsAddItemModal={setIsAddItemModal}
                        fetchItems={fetchItems}
                    />
                )}
                
                {isEditItemModal && currentItem && (
                    <ItemEdit
                        item={currentItem}
                        setIsEditItemModal={setIsEditItemModal}
                        fetchItems={fetchItems}
                    />
                )}
                
                {deleteModalOpen && (
                    <ConfirmModal
                        open={deleteModalOpen}
                        itemName={selectedItem?.itemName}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={() => {
                            removeItem(selectedItem._id);
                            setDeleteModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, itemName }) => {
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
                        هل أنت متأكد من حذف الصنف
                        <span className="font-bold text-red-600 mx-1">"{itemName}"</span>؟
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

export default Items;


// import React ,{useState, useEffect, useRef, useCallback,} from 'react'

// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";

// import { api } from '../https';
// import { toast } from 'react-toastify'
// import BackButton from '../components/shared/BackButton';

// import BottomNav from '../components/shared/BottomNav';
// import ItemAdd from '../components/items/ItemAdd';
// import ItemEdit from '../components/items/ItemEdit';

// const Items = () => {    
    
//     const addBtn = [{ label: 'اضافه صنف', action: 'item', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} /> }]

//     const [isAddItemModal, setIsAddItemModal] = useState(false)
//     const handleAddItemModal = (action) => {
//         if (action === 'item') setIsAddItemModal(true)
//     };
    
//     //fetch items
//     const [list, setList] = useState([]);
//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');

//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         itemsPerPage: 10,
//         totalItems: 0,
//         totalPages: 1
//     });

//     const [loading, setLoading] = useState(false);

//     const [isEditItemModal, setIsEditItemModal] = useState(false);
//     const [currentItem, setCurrentItem] = useState(null);

//     const fetchItems = async () => {
//         setLoading(true);

//         try {
//             const response = await api.post('/api/item/fetch',
//                 {
//                     search,
//                     sort,
//                     page: pagination.currentPage,
//                     limit: pagination.itemsPerPage
//                 }
//             )

//             if (response.data.success) {
//                 setList(response.data.items || response.data.data || []);

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
//                 toast.error(response.data.message || 'Empty items list')
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         } finally {
//             setLoading(false);
//         }

//     }

//     const isInitialMount = useRef(true);
//     useEffect(() => {
//         //if (isInitialMount.current) {
//         //    isInitialMount.current = false;
//         //} else {
//             fetchItems();
//         //}
//     }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);


    
//     // Handle edit
//     const handleEdit = (item) => {
//         setCurrentItem(item);
//         setIsEditItemModal(true);
//     };

//     // remove 
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);

//     const removeItem = async (id) => {

//         try {
//             const response = await api.post('/api/item/remove', { id },)

//             if (response.data.success) {
//                 // toast.success(response.data.message)
//                 toast.success('تم مسح الصنف بنجاح')

//                 //Update the LIST after Remove
//                 await fetchItems();

//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
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
        
//         <section dir='rtl' className='overflow-y-scroll scrollbar-hidden h-[calc(100vh)]'>

//             <div className='flex justify-between items-center px-5 py-2 shadow-xl'>
                
//                 <div className='flex items-center'>
//                     <BackButton />
//                     <h1 className='text-sm font-semibold text-[#1a1a1a]'>اداره المواد الخام</h1>
//                 </div>

//                 <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {addBtn.map(({ label, icon, action }) => {
//                         return (
//                             <button className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                 font-semibold text-xs flex items-center gap-2 rounded-full'
//                                 onClick={() => handleAddItemModal(action)}
//                             >
//                                 {label} {icon}
//                             </button>
//                         )
//                     })}

//                 </div>

//                 {isAddItemModal &&
//                     <ItemAdd
//                         setIsAddItemModal={setIsAddItemModal}
//                         fetchItems ={fetchItems}

//                     />}

//             </div>
//             {/* Search and sorting */}
//             <div className="flex items-center px-15 py-2 shadow-xl gap-2">
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
//                     className="ml-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
//                     value={sort}

//                     onChange={(e) => {
//                         setSort(e.target.value);
//                         setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                     }}
//                 >
//                     <option value="-createdAt">Newest First</option>
//                     <option value="createdAt">Oldest First</option>
//                     <option value="category">By Categories (A-Z)</option>
//                     <option value="serviceName">By Name (A-Z)</option>
//                     <option value="-serviceName">By Name (Z-A)</option>
//                 </select>
//             </div>

//             {/* Loading Indicator */}
//             {loading && (
//                 <div className="mt-4 flex gap-2 justify-center">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
//                     <span className="ml-2">تحميل...</span>
//                 </div>
//             )}


//             {/** table  */}
//             <div className='mt-5 bg-white py-1 px-10'>

//                 <div className='overflow-x-auto'>
//                     <table className='text-right w-full'>
//                         <thead className=''>
//                             <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>

//                                 <th className='p-1'>الصنف</th>
//                                 <th className='p-1'>سعر الشراء</th>
//                                 <th className='p-1'>رصيد الكميه</th>
//                                 <th className='p-1'></th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {
//                                 list.map((item, index) => (
//                                     <tr
//                                         // key ={index}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                         hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-1' hidden>{item._id}</td>
//                                         <td className='p-1'>{item.itemName}</td>
//                                         <td className='p-1'>{item.price}<span className='text-xs font-normal text-yellow-700'> ر.ع</span></td>

//                                         <td className='p-1'>{item.qty}
//                                             <span> {item.unit}</span>
//                                         </td>

//                                         <td className='p-1'>

//                                             <button className={`text-[#0ea5e9] cursor-pointer text-sm font-semibold `}>
//                                                 <LiaEditSolid size={20}
//                                                     className='w-5 h-5 text-[#ea5e9] rounded-full'
//                                                     onClick={() => handleEdit(item)}
//                                                 />
//                                             </button>

//                                             <button className={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
//                                                 <MdDeleteForever
//                                                     onClick={() => { setSelectedItem(item); setDeleteModalOpen(true); }} size={20}
//                                                     className='w-5 h-5 text-[#be3e3f] rounded-full'
//                                                 />
//                                             </button>
//                                         </td>
//                                     </tr>

//                                 ))}
//                         </tbody>
//                         <tfoot>
//                             <tr className="bg-[#F1E8D9] border-t-2 border-emerald-600 text-emerald-600 text-xs font-semibold">

//                                 <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> صنف</span></td>

//                                 <td className="p-1" colSpan={4}></td>

//                             </tr>
//                         </tfoot>
//                     </table>
//                     {!loading && list.length === 0 && (

//                         <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
//                             {search
//                                 ? `لايوجد منتج باسم  "${search}"`
//                                 : `قائمه الاصناف فارغه حاليا !`}
//                         </p>

//                     )}
//                     {/* Pagination  */}
//                     {list.length > 0 && <PaginationControls />}
//                 </div>
//             </div>

//             {/* Edit Service Modal */}
//             {isEditItemModal && currentItem && (
//                 <ItemEdit
//                     item ={currentItem}
//                     setIsEditItemModal ={setIsEditItemModal}
//                     fetchItems= {fetchItems}
//                 />
//             )}




//             <ConfirmModal

//                 open ={deleteModalOpen}
//                 itemName ={selectedItem?.itemName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeItem(selectedItem._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />
//             <BottomNav />
//         </section>
//     )
// };


// const ConfirmModal = ({ open, onClose, onConfirm,itemName }) => {
//     if (!open) return null;
//     return (
//         <div
//             className="fixed inset-0 flex items-center justify-center z-50"
//             style={{ backgroundColor: 'rgba(56, 2, 2, 0.4)' }}  //rgba(0,0,0,0.4)
//         >

//             <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//                 {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//                 <p className="mb-6">هل انت متأكد من مسح الصنف  <span className="font-semibold text-[#be3e3f]">{itemName}</span> ؟</p>
//                 <div className="flex justify-end gap-3">
//                     <button
//                         className="px-4 py-2 rounded bg-white hover:bg-gray-300 cursor-pointer shadow-lg/30 text-sm"
//                         onClick={onClose}
//                     >
//                         الغاء
//                     </button>
//                     <button
//                         className="px-4 py-2 rounded bg-red-600 text-white hover:bg-[#be3e3f] cursor-pointer shadow-lg/30 text-sm"
//                         onClick={onConfirm}
//                     >
//                         مسح
//                     </button>
//                 </div>
//             </div>

//         </div>
//     )
// };

// export default Items ;