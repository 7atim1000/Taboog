import React, { useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TbReportSearch, 
  TbBrandProducthunt, 
  TbUsersGroup, 
  TbFileInvoice,
  TbShoppingCart
} from "react-icons/tb";
import { 
  BsListStars, 
  BsFileEarmarkPptFill, 
  BsGear, 
  BsPeople,
  BsCartCheck
} from "react-icons/bs";
import { 
  TiGroupOutline,
  TiShoppingCart
} from "react-icons/ti";
import { 
  FaFileInvoiceDollar,
  FaBox,
  FaUsers,
  FaUserTie,
  FaChartLine,
  FaCogs
} from "react-icons/fa";

const InvoiceModal = ({ setIsInvoiceModalOpen }) => {
    const navigate = useNavigate();

    const handleClose = () => {
        setIsInvoiceModalOpen(false);
    }

    // Menu items configuration
    const menuItems = [
        {
            id: 'products',
            label: 'المنتجات',
            icon: <TbBrandProducthunt className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-blue-500 to-blue-600',
            navigate: '/products'
        },
        {
            id: 'raw-materials',
            label: 'اداره المواد الخام',
            icon: <BsListStars className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-blue-500 to-indigo-600',
            navigate: '/items'
        },
        {
            id: 'customers',
            label: 'العملاء',
            icon: <TiGroupOutline className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-blue-500 to-blue-700',
            navigate: '/customers'
        },
        {
            id: 'suppliers',
            label: 'الموردين',
            icon: <TbUsersGroup className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-blue-500 to-blue-800',
            navigate: '/suppliers'
        },
        {
            id: 'sales',
            label: 'المبيعات',
            icon: <TbReportSearch className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-green-500 to-green-600',
            navigate: '/sales'
        },
        {
            id: 'purchases',
            label: 'المشتروات',
            icon: <BsFileEarmarkPptFill className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-purple-500 to-purple-600',
            navigate: '/purchases'
        },
        {
            id: 'invoices',
            label: 'اداره الفواتير',
            icon: <FaCogs className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-amber-500 to-amber-600',
            navigate: '/invoices'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-gradient-to-b from-white to-blue-50 rounded-xl sm:rounded-2xl shadow-2xl w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-h-[90vh] overflow-hidden border border-blue-100"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                            <FaFileInvoiceDollar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">إدارة الفواتير</h2>
                            <p className="text-xs text-blue-200">الوصول السريع لوحدات النظام</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                        aria-label="إغلاق"
                    >
                        <MdOutlineClose className="h-5 w-5 sm:h-6 sm:w-6 text-white hover:text-blue-100 transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {menuItems.map((item) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    navigate(item.navigate);
                                    setIsInvoiceModalOpen(false);
                                }}
                                className="group relative overflow-hidden bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 text-right"
                                dir="rtl"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                
                                {/* Content */}
                                <div className="relative p-4 sm:p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        {/* Icon */}
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                                            {item.icon}
                                        </div>
                                        
                                        {/* Decorative Corner */}
                                        <div className="text-blue-200 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Label */}
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-gray-900 mb-2">
                                        {item.label}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-xs text-gray-600">
                                        {getDescription(item.id)}
                                    </p>
                                    
                                    {/* Status Indicator */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-xs text-gray-500">مستعد</span>
                                        </div>
                                        <div className="text-xs text-blue-600 font-medium">
                                            الوصول
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Border */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 sm:mt-8 pt-6 border-t border-blue-100">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                                <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaBox className="h-4 w-4 text-blue-600" />
                                </div>
                                <p className="text-xs text-gray-600">المنتجات</p>
                                <p className="text-sm font-bold text-blue-700">248</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                                <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaUsers className="h-4 w-4 text-blue-600" />
                                </div>
                                <p className="text-xs text-gray-600">العملاء</p>
                                <p className="text-sm font-bold text-blue-700">156</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                                <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaUserTie className="h-4 w-4 text-blue-600" />
                                </div>
                                <p className="text-xs text-gray-600">الموردين</p>
                                <p className="text-sm font-bold text-blue-700">89</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                                <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaChartLine className="h-4 w-4 text-blue-600" />
                                </div>
                                <p className="text-xs text-gray-600">المعاملات</p>
                                <p className="text-sm font-bold text-blue-700">1,234</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 border-t border-blue-100 bg-blue-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-gray-700">النظام نشط</span>
                        </div>
                        <div className="text-xs text-gray-600 text-center">
                            نظام إدارة الفواتير المتكامل - الإصدار 2.5
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            إغلاق النافذة
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Helper function for descriptions
const getDescription = (id) => {
    const descriptions = {
        'products': 'إدارة كافة المنتجات والمخزون',
        'raw-materials': 'المواد الخام والمكونات',
        'customers': 'قاعدة بيانات العملاء',
        'suppliers': 'إدارة الموردين والعقود',
        'sales': 'عمليات البيع والفواتير',
        'purchases': 'عمليات الشراء والتوريد',
        'invoices': 'الإعدادات والإدارة المتقدمة'
    };
    return descriptions[id] || 'الوصول السريع للنظام';
};

export default InvoiceModal;


// import React, { useState } from 'react'
// import { MdOutlineClose } from "react-icons/md";
// import {useNavigate} from 'react-router-dom'
// import { IoCloseCircle } from "react-icons/io5";
// import { motion } from 'framer-motion'
// import { TbReportSearch } from "react-icons/tb";
// import { IoSettings } from "react-icons/io5";

// import { TbBrandProducthunt } from "react-icons/tb";
// import { BsListStars } from "react-icons/bs";

// import { TbUsersGroup } from "react-icons/tb";
// import { TiGroupOutline } from "react-icons/ti";

// import { BsFileEarmarkPptFill } from "react-icons/bs";

// const InvoiceModal = ({setIsInvoiceModalOpen}) =>{
//     const navigate = useNavigate();

//        const handleClose = () => {
//         setIsInvoiceModalOpen(false)
//     }

       
    
//         const saleBtn = [{ label: "Sales Invocies", action: 'sale'}];

//         const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
       
//         const handleSaleModalOpen = (action) => {
//             if (action === 'sale') setIsSaleModalOpen(true)
//             //setIsInvoiceModalOpen(false)

//         }


//         const buyBtn = [{ label: "Purchase Invoice", action: 'buy'}];
    
//         const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
      
//         const handleBuyModalOpen = (action) => {
//             if (action === 'buy') setIsBuyModalOpen(true)
//         }
    

//     return (
//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' 
//         style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}

//                 className='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50% md:mt-0 mt-0 h-[calc(100vh-5rem)]'
//             >

//                 <div className='flex justify-between items-center shadow-xl p-5'>
//                     <h2 className='text-black text-sm font-semibold'>اداره الفواتير</h2>
//                     <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
//                         <MdOutlineClose size={25} />
//                     </button>
//                 </div>

         

//             <div className ='flex flex-col gap-7 justify-between items-center px-8 mt-2'>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center'>
//                             <button onClick={() => navigate('/products')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 المنتجات  <TbBrandProducthunt className='text-[#0ea5e9] inline' size={25} />
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center'>
//                             <button onClick={() => navigate('/items')}
//                                 className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  p-2 text-xs text-black font-semibold cursor-pointer'>
//                                 اداره المواد الخام <BsListStars size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>

//                     </div>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center '>
//                             <button onClick={() => navigate('/customers')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 العملاء <TiGroupOutline size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center '>
//                             <button onClick={() => navigate('/suppliers')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 الموردين  <TbUsersGroup size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>

//                     </div>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center'>
//                             <button onClick={() => navigate('/sales')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 المبيعات <TbReportSearch size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center '>
//                             <button onClick={() => navigate('/purchases')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 المشتروات <BsFileEarmarkPptFill size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                     </div>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center w-full'>
//                             <button onClick={() => navigate('/invoices')} className='w-full h-15  shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 اداره الفواتير <IoSettings size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
                       
//                     </div>
                
            
//             </div>

//                 {isSaleModalOpen && <SaleModal setIsSaleModalOpen={setIsSaleModalOpen} />}
//                 {isBuyModalOpen && <BuyModal setIsBuyModalOpen={setIsBuyModalOpen} />}
            
//             </motion.div>

    
//        </div>
//     )
// }

// export default InvoiceModal ;