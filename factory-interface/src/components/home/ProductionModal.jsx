import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MdOutlineClose,
  MdFactory,
  MdDashboard,
  MdPoll
} from "react-icons/md";
import { 
  FaCogs,
  FaChartLine,
  FaBox,
  FaClipboardList,
  FaIndustry,
  FaChartBar
} from "react-icons/fa";
import { 
  TbReportSearch,
  TbBrandProducthunt,
  TbAssembly
} from "react-icons/tb";
import { 
  BsListStars,
  BsGear,
  BsKanban
} from "react-icons/bs";

const ProductionModal = ({ setIsProductionModal }) => {
    const navigate = useNavigate();

    const handleClose = () => {
        setIsProductionModal(false);
    }

    // Production menu items
    const productionItems = [
        {
            id: 'products',
            label: 'المنتجات',
            icon: <TbBrandProducthunt className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-blue-500 to-blue-600',
            description: 'إدارة المنتجات والمواصفات',
            navigate: '/products'
        },
        {
            id: 'production-invoices',
            label: 'فواتير الانتاج',
            icon: <FaChartBar className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-blue-500 to-indigo-600',
            description: 'فواتير وطلبات الإنتاج',
            navigate: '/production'
        },
        {
            id: 'production-management',
            label: 'إدارة الانتاج',
            icon: <TbReportSearch className="h-6 w-6 sm:h-7 sm:w-7" />,
            color: 'from-blue-500 to-blue-700',
            description: 'إدارة عمليات الإنتاج',
            navigate: '/proinvoices'
        },
        // {
        //     id: 'assembly',
        //     label: 'خط التجميع',
        //     icon: <TbAssembly className="h-6 w-6 sm:h-7 sm:w-7" />,
        //     color: 'from-blue-500 to-purple-600',
        //     description: 'عمليات التجميع والتركيب',
        //     navigate: '/assembly'
        // },
        // {
        //     id: 'quality-control',
        //     label: 'مراقبة الجودة',
        //     icon: <FaClipboardList className="h-6 w-6 sm:h-7 sm:w-7" />,
        //     color: 'from-blue-500 to-cyan-600',
        //     description: 'فحص ومراقبة الجودة',
        //     navigate: '/quality'
        // },
        // {
        //     id: 'production-planning',
        //     label: 'تخطيط الإنتاج',
        //     icon: <BsKanban className="h-6 w-6 sm:h-7 sm:w-7" />,
        //     color: 'from-blue-500 to-blue-800',
        //     description: 'جدولة وتخطيط الإنتاج',
        //     navigate: '/planning'
        // }
    ];

    // Quick stats
    const productionStats = [
        { label: 'مستمر', value: '24', color: 'bg-blue-500' },
        { label: 'معلق', value: '8', color: 'bg-blue-400' },
        { label: 'مكتمل', value: '156', color: 'bg-blue-600' },
        { label: 'إجمالي', value: '188', color: 'bg-blue-700' }
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
                {/* Header - Blue Theme */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                            <MdFactory className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">إدارة الانتاج</h2>
                            <p className="text-xs text-blue-200">نظام إدارة عمليات الإنتاج</p>
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

                {/* Production Stats */}
                {/* <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {productionStats.map((stat, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className={`h-2 w-2 rounded-full ${stat.color} animate-pulse`}></div>
                                    <span className="text-xs text-gray-600">{stat.label}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                    {/* Production Modules Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {productionItems.map((item) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    navigate(item.navigate);
                                    setIsProductionModal(false);
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
                                        
                                        {/* Status Indicator */}
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span className="text-xs text-gray-500">نشط</span>
                                        </div>
                                    </div>
                                    
                                    {/* Label */}
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-gray-900 mb-2">
                                        {item.label}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-xs text-gray-600 mb-3">
                                        {item.description}
                                    </p>
                                    
                                    {/* Progress Bar (for active processes) */}
                                    {item.id === 'production-invoices' && (
                                        <div className="mt-3">
                                            <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                                    style={{ width: '75%' }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">75% مكتمل</span>
                                                <span className="text-xs text-blue-600 font-medium">جاري</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Hover Border */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Production Overview */}
                    {/* <div className="mt-6 sm:mt-8 pt-6 border-t border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <FaIndustry className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">نظرة عامة على الإنتاج</h3>
                                <p className="text-sm text-gray-600">إحصائيات وأداء الإنتاج</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-blue-700">كفاءة الإنتاج</span>
                                    <FaChartLine className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-blue-800">94%</p>
                                    <p className="text-xs text-blue-600 mt-1">زيادة 2% عن الشهر الماضي</p>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-cyan-700">وقت التشغيل</span>
                                    <FaCogs className="h-4 w-4 text-cyan-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-cyan-800">98%</p>
                                    <p className="text-xs text-cyan-600 mt-1">من وقت التشغيل المخطط</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 border-t border-blue-100 bg-blue-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-xs text-gray-700">وحدة الإنتاج نشطة</span>
                        </div>
                        <div className="text-xs text-gray-600 text-center">
                            نظام إدارة الإنتاج المتكامل
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

export default ProductionModal;
// import React from 'react'
// import {useNavigate} from 'react-router-dom'
// import { FaSquarePollVertical } from "react-icons/fa6";
// import { TbReportSearch } from "react-icons/tb";
// import { MdOutlineClose } from "react-icons/md";
// import { motion } from 'framer-motion'
// import { BsListStars } from "react-icons/bs";
// import { TbBrandProducthunt } from "react-icons/tb";

// const ProductionModal = ({setIsProductionModal}) =>{
//     const navigate = useNavigate();

//        const handleClose = () => {
//         setIsProductionModal(false)
//     }

//     return (

//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' 
//         style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
//            <motion.div
//                 initial ={{opacity :0 , scale :0.9}}
//                 animate ={{opacity :1, scale :1}}
//                 exit ={{opacity :0, scale :0.9}}
//                 transition ={{durayion :0.3 , ease: 'easeInOut'}}

//                 className ='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50% md:mt-0 mt-0 h-[calc(100vh-5rem)]'
//             >

//                 <div className='flex justify-between items-center shadow-xl p-5'>
//                     <h2 className='text-black text-sm font-semibold'>اداره الانتاج</h2>
//                     <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
//                         <MdOutlineClose size={25} />
//                     </button>
//                 </div>

         

//             <div className='flex flex-col gap-7 justify-between items-center px-2 mt-2'>

//                 <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                     <div className='flex justify-between items-center  w-full'>
                         
//                             <button onClick={() => navigate('/products')} className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 المنتجات  <TbBrandProducthunt className='text-[#0ea5e9] inline' size={25} />
//                             </button>
//                     </div>
                  

//                 </div>
//                 <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                     <div className='flex justify-between items-center  w-full'>
//                             <button onClick ={()=> navigate('/production')} 
//                                 className='w-full h-15 shadow-lg/30 bg-white rounded-lg  p-2 text-xs text-black font-semibold cursor-pointer'>
//                                 فواتير الانتاج  <FaSquarePollVertical size={25} className='inline text-[#0ea5e9]' />
//                             </button>

//                     </div>

//                 </div>
//                 <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                     <div className='flex justify-between items-center  w-full'>
//                             <button onClick={() => navigate('/proinvoices')} 
//                                 className='w-full h-15 shadow-lg/30 bg-white rounded-lg  p-2 text-xs text-black font-semibold cursor-pointer'>
//                                 اداره الانتاج  <TbReportSearch size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                     </div>

//                 </div>
                 
//             </div>
            
//             </motion.div>

//        </div>
//     );
// }

// export default ProductionModal ;