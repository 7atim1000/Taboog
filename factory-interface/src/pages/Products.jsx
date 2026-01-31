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
  MdOutlineFileDownload
} from "react-icons/md";
import { 
  LiaEditSolid,
  LiaEyeSolid
} from "react-icons/lia";
import { 
  FaBox,
  FaTags,
  FaChartLine,
  FaWarehouse,
  FaUndo
} from "react-icons/fa";
import { 
  TbCurrencyDinar,
  TbArrowsSort
} from "react-icons/tb";
import { api } from '../https';
import { toast } from 'react-toastify'
import BackButton from '../components/shared/BackButton';
import bricks from '../assets/images/brickProduct.jpg' 
import BottomNav from '../components/shared/BottomNav';
import ProductAdd from '../components/products/ProductAdd';
import ProductEdit from '../components/products/ProductEdit';

const Products = () => {
    // State management
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    
    // Modal states
    const [isAddProductModal, setIsAddProductModal] = useState(false);
    const [isEditProductModal, setIsEditProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/product/fetch', {
                search,
                sort,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });

            if (response.data.success) {
                setList(response.data.data || []);
                
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
                toast.error(response.data.message || 'قائمة المنتجات فارغة');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'فشل في جلب المنتجات');
        } finally {
            setLoading(false);
        }
    };

    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchProducts();
        } else {
            const timer = setTimeout(() => {
                fetchProducts();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    // Calculate total values
    const totalQuantity = list.reduce((sum, product) => sum + (product.qty || 0), 0);
    const totalValue = list.reduce((sum, product) => sum + ((product.qty || 0) * (product.price || 0)), 0);

    // Handle edit
    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditProductModal(true);
    };

    // Handle delete
    const removeProduct = async (id) => {
        try {
            const response = await api.post('/api/product/remove', { id });
            if (response.data.success) {
                toast.success('تم حذف المنتج بنجاح');
                await fetchProducts();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'فشل في حذف المنتج');
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
                    عرض <span className="font-bold text-blue-700">{list.length}</span> من <span className="font-bold text-blue-700">{pagination.totalItems}</span> منتج
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
                                <FaBox className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-white">إدارة المنتجات</h1>
                                <p className="text-xs text-blue-200">إدارة وتتبع كافة المنتجات</p>
                            </div>
                        </div>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddProductModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <MdOutlineAddToDrive className="h-5 w-5" />
                        <span>إضافة منتج جديد</span>
                    </motion.button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 sm:px-6 py-3 bg-white border-b border-blue-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                            <p className="text-xl font-bold text-blue-700">{pagination.totalItems}</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <FaWarehouse className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">الكمية الإجمالية</p>
                            <p className="text-xl font-bold text-blue-700">{totalQuantity} وحدة</p>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                            <FaTags className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">القيمة الإجمالية</p>
                            <p className="text-xl font-bold text-blue-700">{totalValue.toFixed(2)} ر.ع</p>
                        </div>
                        {/* <div className="p-2 rounded-full bg-blue-100">
                            <TbCurrencyDinar className="h-5 w-5 text-blue-600" />
                        </div> */}
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
                            placeholder="ابحث عن منتج..."
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
                            <option value="productName">بالاسم (أ-ي)</option>
                            <option value="-productName">بالاسم (ي-أ)</option>
                            <option value="category">بالتصنيف</option>
                            <option value="price">بسعر البيع (منخفض)</option>
                            <option value="-price">بسعر البيع (مرتفع)</option>
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
                            <p className="text-gray-600">جاري تحميل المنتجات...</p>
                        </div>
                    </div>
                ) : viewMode === 'list' ? (
                    // List View
                    <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-50">
                                    <tr className="text-right text-sm font-semibold text-gray-700">
                                        <th className="px-4 py-3">الصورة</th>
                                        <th className="px-4 py-3">اسم المنتج</th>
                                        <th className="px-4 py-3">التصنيف</th>
                                        <th className="px-4 py-3">سعر البيع</th>
                                        <th className="px-4 py-3">الكمية</th>
                                        <th className="px-4 py-3">الوحدة</th>
                                        <th className="px-4 py-3">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                                        <FaBox className="h-8 w-8 text-blue-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد منتجات</h3>
                                                    <p className="text-gray-500">
                                                        {search ? `لا توجد نتائج لـ "${search}"` : 'قائمة المنتجات فارغة حالياً'}
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
                                        list.map((product, index) => (
                                            <motion.tr
                                                key={product._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-blue-200">
                                                        <img 
                                                            src={product.image || bricks} 
                                                            alt={product.productName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {product.productName}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                        {product.category || 'غير محدد'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-blue-700">
                                                    {product.price?.toFixed(2)} ج.س
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-medium ${product.qty < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {product.qty || 0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {product.unit || 'وحدة'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                            title="تعديل"
                                                        >
                                                            <LiaEditSolid className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProduct(product);
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
                                        ))
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
                                        <FaBox className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد منتجات</h3>
                                    <p className="text-gray-500">
                                        {search ? `لا توجد نتائج لـ "${search}"` : 'قائمة المنتجات فارغة حالياً'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            list.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="h-12 w-12 rounded-lg overflow-hidden border border-blue-200">
                                                <img 
                                                    src={product.image || bricks} 
                                                    alt={product.productName}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                {product.category || 'غير محدد'}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-bold text-gray-800 mb-1 truncate">
                                            {product.productName}
                                        </h3>
                                        
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">السعر</p>
                                                <p className="font-bold text-blue-700">{product.price?.toFixed(2)} ر.ع</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">المخزون</p>
                                                <p className={`font-bold ${product.qty < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {product.qty || 0} {product.unit || 'وحدة'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between border-t border-blue-100 pt-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                    title="تعديل"
                                                >
                                                    <LiaEditSolid className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
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
                                                <span>عرض التفاصيل</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isAddProductModal && (
                    <ProductAdd
                        setIsAddProductModal={setIsAddProductModal}
                        fetchProducts={fetchProducts}
                    />
                )}
                
                {isEditProductModal && currentProduct && (
                    <ProductEdit
                        product={currentProduct}
                        setIsEditProductModal={setIsEditProductModal}
                        fetchProducts={fetchProducts}
                    />
                )}
                
                {deleteModalOpen && (
                    <ConfirmModal
                        open={deleteModalOpen}
                        productName={selectedProduct?.productName}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={() => {
                            removeProduct(selectedProduct._id);
                            setDeleteModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, productName }) => {
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
                        هل أنت متأكد من حذف المنتج
                        <span className="font-bold text-red-600 mx-1">"{productName}"</span>؟
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

export default Products;



// import React ,{useState, useEffect, useRef, useCallback,} from 'react'

// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";

// import { api } from '../https';
// import { toast } from 'react-toastify'
// import BackButton from '../components/shared/BackButton';
// import bricks from '../assets/images/brickProduct.jpg' 


// import BottomNav from '../components/shared/BottomNav';

// import ProductAdd from '../components/products/ProductAdd';
// import ProductEdit from '../components/products/ProductEdit';


// const Products = () => {
    
//     const addBtn = [{ label: 'اضافه منتج', action: 'product', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} /> }]

//     const [isAddProductModal, setIsAddProductModal] = useState(false)
//     const handleAddProductModal = (action) => {
//         if (action === 'product') setIsAddProductModal(true)
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

//     const [isEditProductModal, setIsEditProductModal] = useState(false);
//     const [currentProduct, setCurrentProduct] = useState(null);

//     const fetchProducts = async () => {
//      setLoading(true);

//         try {
//             const response = await api.post('/api/product/fetch',
//                 {
//                     search,
//                     sort,
//                     page: pagination.currentPage,
//                     limit: pagination.itemsPerPage
//                 }
//             )

//             if (response.data.success) {
//                 setList(response.data.data || []);
//                 console.log(response.data.data)

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
//                 toast.error(response.data.message || 'Empty products list')
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         } 
//         finally {
//             setLoading(false);
//         }

//     }

//     const isInitialMount = useRef(true);
//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//         } else {
//             fetchProducts();
//         }
//     }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    
    
//     // Handle edit
//     const handleEdit = (product) => {
//         setCurrentProduct(product);
//         setIsEditProductModal(true);
//     };



//     // remove 
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);

//     const removeProduct = async (id) => {

//         try {
//             const response = await api.post('/api/product/remove', { id },)

//             if (response.data.success) {
//                 // toast.success(response.data.message)
//                  toast.success('تم مسح المنتج بنجاح')

//                 //Update the LIST after Remove
//                 await fetchProducts();

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

//     // decorater decorate template

//     return (
//         <section dir ='rtl' className ='overflow-y-scroll scrollbar-hidden h-[calc(100vh)]'>

//             <div className='flex justify-between items-center px-5 py-2 shadow-xl'>
//                 <div className='flex items-center'>
//                     <BackButton />
//                     <h1 className='text-sm font-semibold text-[#1a1a1a]'>اداره المنتجات</h1>
//                 </div>

//                 <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {addBtn.map(({ label, icon, action }) => {
//                         return (
//                             <button className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                 font-semibold text-xs flex items-center gap-2 rounded-full'
//                                  onClick={() => handleAddProductModal(action)}
//                             >
//                                 {label} {icon}
//                             </button>
//                         )
//                     })}

//                 </div>

//                 {isAddProductModal &&
//                     <ProductAdd
//                         setIsAddProductModal= {setIsAddProductModal}
//                         fetchProducts= {fetchProducts}

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
//                 <div className="mt-4 flex justify-center text-xs font-normal">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs font-normal"></div>
//                     <span className="ml-2">تحميل ...</span>
//                 </div>
//             )}


//             {/** table  */}
//             <div className='mt-5 bg-white py-1 px-10'>

//                 <div className='overflow-x-auto'>
//                     <table className='text-right w-full'>
//                         <thead className=''>
//                             <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>

//                                 <th className='p-1'>اسم المنتج</th>
//                                 <th className='p-1'>سعر البيع</th>
//                                 <th className='p-1'>رصيد الكميه</th>

//                                 <th className='p-1'></th>
//                                 <th className='p-1'></th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {/* {list.length === 0
//                                 ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your items list is empty . Start adding items !</p>)
//                                 : list.map((item, index) => ( */}
//                             {
//                                 list.map((product, index) => (
//                                     <tr
//                                         key ={index}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                         hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-1' hidden>{product._id}</td>
//                                         <td className='p-1'>{product.productName}</td>
//                                         <td className='p-1'>{product.price}<span className='text-xs font-normal text-yellow-700'> AED</span></td>
                                        
//                                         <td className='p-1'>{product.qty}
//                                             <span> {product.unit}</span>
//                                         </td>

//                                         <td className='p-1'>
//                                             <img className='rounded-full border-b-2 border-yellow-700 w-9 h-9' 
//                                             src={product.image || bricks} />
//                                         </td>
//                                         <td className='p-1'>

//                                             <button className={`text-[#0ea5e9] cursor-pointer text-sm font-semibold `}>
//                                                 <LiaEditSolid size={20}
//                                                     className='w-5 h-5 text-[#ea5e9] rounded-full'
//                                                     onClick={() => handleEdit(product)}
//                                                 />
//                                             </button>

//                                             <button className={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
//                                                 <MdDeleteForever
//                                                     onClick={() => { setSelectedProduct(product); setDeleteModalOpen(true); }} size={20}
//                                                     className='w-5 h-5 text-[#be3e3f] rounded-full'
//                                                 />
//                                             </button>
//                                         </td>
//                                     </tr>

//                                 ))}
//                         </tbody>
//                         <tfoot>
//                             <tr className="bg-[#F1E8D9] border-t-2 border-emerald-600 text-emerald-600 text-xs font-semibold">

//                                 <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> منتج</span></td>

//                                 <td className="p-1" colSpan={4}></td>

//                             </tr>
//                         </tfoot>
//                     </table>
//                     {!loading && list.length === 0 && (

//                         <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
//                             {search
//                                 ? `عفوا لايوجد منتج باسم "${search}"`
//                                 : `قائمه المنتجات فارغه حاليا !`}
//                         </p>

//                     )}
//                     {/* Pagination  */}
//                     {list.length > 0 && <PaginationControls />}
//                 </div>
//             </div>

//             {/* Edit Service Modal */}
//             {isEditProductModal && currentProduct && (
//                 <ProductEdit
//                     product ={currentProduct}
//                     setIsEditProductModal={setIsEditProductModal}
//                     fetchProducts={fetchProducts}
//                 />
//             )}




//             <ConfirmModal

//                 open={deleteModalOpen}
//                 productName={selectedProduct?.productName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeProduct(selectedProduct._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />
//             <BottomNav />
//         </section>
//     )
// };


// const ConfirmModal = ({ open, onClose, onConfirm, productName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(56, 2, 2, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">هل انت متأكد من مسح المنتج  <span className="font-semibold text-red-600">{productName}</span> ؟</p>
//         <div className="flex justify-end gap-3">
//           <button
//             className="px-4 py-2 rounded bg-white hover:bg-gray-300 cursor-pointer shadow-lg/30 text-sm"
//             onClick={onClose}
//           >
//             الغاء
//           </button>
//           <button
//             className="px-4 py-2 rounded bg-red-600 text-white hover:bg-[#be3e3f] cursor-pointer shadow-lg/30 text-sm"
//             onClick={onConfirm}
//           >
//             مسح
//           </button>
//         </div>
//       </div>

//     </div>
//   )};

// export default Products ;