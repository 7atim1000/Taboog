import React from 'react'
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const MiniCard = ({ title, icon, number, footerNum }) => {
    
    // Theme configuration based on title
    const getCardTheme = () => {
        switch(title) {
            case 'مبيعات':
                return {
                    bg: 'from-green-50 to-green-100',
                    text: 'text-green-700',
                    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
                    border: 'border-green-200',
                    shadow: 'shadow-green-100',
                    numberColor: 'text-green-800'
                };
            case 'انتاج':
                return {
                    bg: 'from-amber-50 to-amber-100',
                    text: 'text-amber-700',
                    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
                    border: 'border-amber-200',
                    shadow: 'shadow-amber-100',
                    numberColor: 'text-amber-800'
                };
            case 'مصروفات':
                return {
                    bg: 'from-red-50 to-red-100',
                    text: 'text-red-700',
                    iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
                    border: 'border-red-200',
                    shadow: 'shadow-red-100',
                    numberColor: 'text-red-800'
                };
            case 'ايرادات':
                return {
                    bg: 'from-emerald-50 to-emerald-100',
                    text: 'text-emerald-700',
                    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
                    border: 'border-emerald-200',
                    shadow: 'shadow-emerald-100',
                    numberColor: 'text-emerald-800'
                };
            default:
                return {
                    bg: 'from-blue-50 to-blue-100',
                    text: 'text-blue-700',
                    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
                    border: 'border-blue-200',
                    shadow: 'shadow-blue-100',
                    numberColor: 'text-blue-800'
                };
        }
    };

    const theme = getCardTheme();
    const isPositive = footerNum >= 0;
    
    // Format number with Arabic formatting
    const formatNumber = (num) => {
        if (typeof num === 'number') {
            return num.toLocaleString('ar-EG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return num;
    };

    return (
        <div className={`w-[50%] bg-gradient-to-br ${theme.bg} rounded-lg border ${theme.border} shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme.shadow} hover:-translate-y-1 transition-transform duration-300`}>
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xs sm:text-sm font-bold ${theme.text} tracking-wide`}>
                        {title}
                    </h2>
                    
                    <div className={`${theme.iconBg} p-2 sm:p-2.5 rounded-lg text-white shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105`}>
                        <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                            {icon}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-xs text-gray-600 font-medium">ج.س</span>
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme.numberColor}`}>
                            {formatNumber(number)}
                        </h3>
                    </div>

                    {/* Footer with trend indicator */}
                    {footerNum !== undefined && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/50">
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border ${isPositive ? 'border-green-200' : 'border-red-200'}`}>
                                    {isPositive ? (
                                        <FaArrowUp className="h-2 w-2" />
                                    ) : (
                                        <FaArrowDown className="h-2 w-2" />
                                    )}
                                    <span className="text-xs font-semibold">
                                        {Math.abs(footerNum)}%
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600">
                                    {isPositive ? 'زيادة' : 'انخفاض'}
                                </span>
                            </div>
                            
                            {/* Status indicator */}
                            <div className="flex items-center gap-1">
                                <div className={`h-2 w-2 rounded-full animate-pulse ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-xs text-gray-500">اليوم</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Decorative bottom accent */}
                <div className={`mt-4 h-1 w-full rounded-full ${theme.iconBg.replace('bg-gradient-to-br', 'bg-gradient-to-r')} opacity-50`}></div>
            </div>
        </div>
    );
};

export default MiniCard;


// import React from 'react'
// const MiniCard = ({title, icon , number, footerNum}) => {
    
//     return (
//         <div className= 'bg-white py-3 px-5 rounded-lg w-[50%] shadow-lg/30 border-b-3 border-[#e3d1b9]'>
//             <div className='flex items-start justify-between'>  
//                 <h1 className='text-[#0ea5e9] font-semibold text-xs tracking-wide'>{title}</h1>
//                 <button className={` ${title === 'مبيعات' ? 'bg-green-600 ' : 'bg-[#0ea5e9]' }
//                     ${title === 'انتاج' ? 'bg-[#f6b100]' : '' }
//                     ${title === 'مصروفات' ? 'bg-[#be3e3f]' : '' }
//                     ${title === 'ايرادات' ? 'bg-green-600' : '' } 
                
//                     p-3 rounded-sm text-white text-sm mt-2 shadow-xl`}>{icon}</button>
//             </div>
           
//             <div>
//                 <h1 className={`text-lg font-bold 
//                     ${title === 'مصروفات' ? 'text-[#be3e3f]' : 'text-[#1a1a1a]'}`}>
//                     <span className ='text-xs font-normal text-[#1a1a1a]'>ج.س </span>
//                     {number}
//                 </h1>
          
//             </div>
//         </div>
//     )
// };

// export default MiniCard;