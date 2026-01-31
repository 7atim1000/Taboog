import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MdOutlineClose,
  MdSwapVerticalCircle,
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown
} from "react-icons/md";
import { 
  FcGenericSortingAsc,
  FcGenericSortingDesc
} from "react-icons/fc";
import { 
  FaChartLine,
  FaMoneyBillWave,
  FaCalculator,
  FaPiggyBank,
  FaBalanceScale,
  FaRegChartBar
} from "react-icons/fa";
import { 
  TbReportSearch,
  TbCurrencyDollar
} from "react-icons/tb";

const FinanModal = ({ setIsFinanModalOpen }) => {
    const navigate = useNavigate();

    const handleClose = () => {
        setIsFinanModalOpen(false);
    }

    // Financial menu items
    const financialItems = [
        {
            id: 'incomes',
            label: 'حسابات الايرادات',
            icon: <FcGenericSortingDesc className="h-6 w-6 sm:h-7 sm:w-7" />,
            subIcon: <MdTrendingUp className="h-4 w-4 text-green-500" />,
            color: 'white',
            description: 'إدارة وتتبع مصادر الدخل',
            amount: 'ج.س 45,800',
            trend: '+12%',
            navigate: '/incomes'
        },
        {
            id: 'expenses',
            label: 'حسابات المصروفات',
            icon: <FcGenericSortingAsc className="h-6 w-6 sm:h-7 sm:w-7" />,
            subIcon: <MdTrendingDown className="h-4 w-4 text-red-500" />,
            color: 'white',
            description: 'مراقبة وتصنيف المصروفات',
            amount: 'ج.س 28,400',
            trend: '-8%',
            navigate: '/expenses'
        },
        {
            id: 'financials',
            label: 'إدارة الحسابات',
            icon: <MdSwapVerticalCircle className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />,
            subIcon: <FaBalanceScale className="h-4 w-4 text-blue-500" />,
            color: 'white',
            description: 'الإدارة الشاملة للحسابات المالية',
            amount: 'ج.س 17,400',
            trend: '+5%',
            navigate: '/financials'
        },
        // {
        //     id: 'reports',
        //     label: 'التقارير المالية',
        //     icon: <TbReportSearch className="h-6 w-6 sm:h-7 sm:w-7" />,
        //     subIcon: <FaRegChartBar className="h-4 w-4 text-purple-500" />,
        //     color: 'from-purple-500 to-purple-600',
        //     description: 'تقارير وتحليلات مالية مفصلة',
        //     amount: '24 تقرير',
        //     trend: 'جديد',
        //     navigate: '/financial-reports'
        // },
        // {
        //     id: 'budget',
        //     label: 'الميزانية والتخطيط',
        //     icon: <FaCalculator className="h-6 w-6 sm:h-7 sm:w-7" />,
        //     subIcon: <FaPiggyBank className="h-4 w-4 text-amber-500" />,
        //     color: 'from-amber-500 to-amber-600',
        //     description: 'تخطيط الميزانية والتحكم',
        //     amount: 'ج.س 120,000',
        //     trend: 'مخطط',
        //     navigate: '/budget'
        // },
        // {
        //     id: 'cashflow',
        //     label: 'تدفق النقدية',
        //     icon: <FaMoneyBillWave className="h-6 w-6 sm:h-7 sm:w-7" />,
        //     subIcon: <TbCurrencyDollar className="h-4 w-4 text-emerald-500" />,
        //     color: 'from-emerald-500 to-emerald-600',
        //     description: 'مراقبة تدفقات النقدية',
        //     amount: 'ج.س 89,200',
        //     trend: 'مستقر',
        //     navigate: '/cashflow'
        // }
    ];

    // Financial summary stats
    const financialStats = [
        { label: 'صافي الربح', value: 'ج.س 17,400', color: 'text-green-600', icon: <MdTrendingUp /> },
        { label: 'الإيرادات', value: 'ج.س 45,800', color: 'text-blue-600', icon: <FaChartLine /> },
        { label: 'المصروفات', value: 'ج.س 28,400', color: 'text-red-600', icon: <MdTrendingDown /> }
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
                            <MdAttachMoney className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">الإدارة المالية</h2>
                            <p className="text-xs text-blue-200">نظام إدارة الحسابات والمالية</p>
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

                {/* Financial Summary */}
                {/* <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {financialStats.map((stat, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">{stat.label}</span>
                                    <div className={`p-1 rounded-full ${stat.color.replace('text', 'bg')}/10`}>
                                        {React.cloneElement(stat.icon, { className: `h-3 w-3 ${stat.color}` })}
                                    </div>
                                </div>
                                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                    {/* Financial Modules Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {financialItems.map((item) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    navigate(item.navigate);
                                    setIsFinanModalOpen(false);
                                }}
                                className="group relative overflow-hidden bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 text-right"
                                dir="rtl"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                
                                {/* Content */}
                                <div className="relative p-4 sm:p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        {/* Main Icon */}
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                                            {item.icon}
                                        </div>
                                        
                                        {/* Trend/Status */}
                                        <div className="flex items-center gap-2">
                                            {item.subIcon}
                                            <span className={`text-xs font-semibold ${
                                                item.trend.includes('+') ? 'text-green-600' :
                                                item.trend.includes('-') ? 'text-red-600' :
                                                'text-blue-600'
                                            }`}>
                                                {item.trend}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Label */}
                                  
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-gray-900 mb-1">
                                        {item.label}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-xs text-gray-600 mb-3">
                                        {item.description}
                                    </p>
                                    
                                    {/* Amount/Value */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-50">
                                        {/* <span className="text-sm font-bold text-gray-800">
                                            {item.amount}
                                        </span> */}
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span className="text-xs text-gray-500">مباشر</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Border */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Financial Overview */}
                    {/* <div className="mt-6 sm:mt-8 pt-6 border-t border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <FaChartLine className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">ملخص الأداء المالي</h3>
                                <p className="text-sm text-gray-600">إحصائيات وأداء مالي</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-green-700">معدل الربحية</span>
                                    <MdTrendingUp className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-800">38%</p>
                                    <p className="text-xs text-green-600 mt-1">تحسن 4% عن الربع السابق</p>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-blue-700">التدفق النقدي</span>
                                    <TbCurrencyDollar className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-blue-800">إيجابي</p>
                                    <p className="text-xs text-blue-600 mt-1">صافي تدفق إيجابي مستمر</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 border-t border-blue-100 bg-blue-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-gray-700">النظام المالي نشط</span>
                        </div>
                        <div className="text-xs text-gray-600 text-center">
                            نظام الإدارة المالية المتكامل - الإصدار 2.5
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

export default FinanModal;


// import React from 'react'
// import {useNavigate} from 'react-router-dom'
// import { IoCloseCircle } from "react-icons/io5";
// import { MdOutlineClose } from "react-icons/md";
// import { motion } from 'framer-motion'
// import { TbReportSearch } from "react-icons/tb";
// import { LuFilePlus2 } from "react-icons/lu";
// import { MdSwapVerticalCircle } from "react-icons/md";
// import { FcGenericSortingAsc } from "react-icons/fc";
// import { FcGenericSortingDesc } from "react-icons/fc";

// const FinanModal = ({setIsFinanModalOpen}) =>{
//     const navigate = useNavigate();

//        const handleClose = () => {
//         setIsFinanModalOpen(false)
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
//                     <h2 className='text-black text-sm font-semibold'>Financials</h2>
//                     <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
//                         <MdOutlineClose size={25} />
//                     </button>
//                 </div>

         

//             <div className='flex flex-col gap-7 justify-between items-center px-2 mt-2'>
                
               
//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex w-full justify-between items-center  '>
//                             <button onClick={() => navigate('/incomes')}
//                                 className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 حسابات الايرادات <FcGenericSortingDesc size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>

//                     </div>
//                      <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex w-full justify-between items-center  '>
//                             <button onClick={() => navigate('/expenses')}
//                                 className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 حسابات المصروفات <FcGenericSortingAsc size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>

//                     </div>
//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex w-full justify-between items-center  '>
//                             <button onClick={() => navigate('/financials')}
//                                 className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 اداره الحسابات <MdSwapVerticalCircle size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
                       
//                     </div>
//             </div>
            
//             </motion.div>

//        </div>
//     );
// }


// export default FinanModal ;