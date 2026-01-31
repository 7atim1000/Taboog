import React, {useState} from 'react'
import { formatDate, getAvatarName } from '../../utils';
import { useSelector } from 'react-redux';
import { FaUserCircle, FaCalendarAlt, FaUserTag } from 'react-icons/fa';
import { MdReceipt } from 'react-icons/md';

const CustomerInfo = () => {
    const customerData = useSelector(state => state.customer);
    const userData = useSelector(state => state.user);
    // get current date and time 
    const [dateTime, setDateTime] = useState(new Date());
    
    return (
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-3 h-auto'>
            {/* Compact Header */}
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                    <FaUserCircle className='text-white w-4 h-4' />
                    <h3 className='text-sm font-semibold text-white'>معلومات العميل</h3>
                </div>
                
                <div className='flex items-center gap-1 bg-white/20 px-2 py-1 rounded'>
                    <MdReceipt className='text-white w-3 h-3' />
                    <span className='text-xs font-medium text-white'>
                        #{customerData.saleId || 'NA'}
                    </span>
                </div>
            </div>

            {/* Main Content - Compact Layout */}
            <div className='space-y-2'>
                {/* Customer Row */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
                            <span className='text-blue-700 font-bold text-sm'>
                                {getAvatarName(customerData.customerName || 'ع')}
                            </span>
                        </div>
                        <div>
                            <h4 className='text-xs text-blue-100 mb-0.5'>العميل</h4>
                            <h3 className='text-sm font-bold text-white truncate max-w-[120px]'>
                                {customerData.customerName || 'الرجاء اختيار العميل'}
                            </h3>
                        </div>
                    </div>
                    
                    {customerData.balance !== undefined && (
                        <div className='text-right'>
                            <span className='text-xs text-blue-100 block'>الرصيد</span>
                            <span className={`text-sm font-bold ${
                                Number(customerData.balance) >= 0 
                                    ? 'text-green-300' 
                                    : 'text-red-300'
                            }`}>
                                {Number(customerData.balance || 0).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Date & User Row */}
                <div className='flex items-center justify-between pt-2 border-t border-white/20'>
                    <div className='flex items-center gap-2'>
                        <FaCalendarAlt className='text-blue-200 w-3 h-3' />
                        <div>
                            <p className='text-xs text-blue-100'>{formatDate(dateTime)}</p>
                            <p className='text-xs text-blue-200'>
                                {dateTime.toLocaleTimeString('ar-SA', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                        <div className='w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center'>
                            <span className='text-white font-bold text-xs'>
                                {getAvatarName(userData.name || 'م')}
                            </span>
                        </div>
                        <div className='text-right'>
                            <p className='text-xs text-blue-100'>بواسطة</p>
                            <p className='text-xs font-medium text-white truncate max-w-[100px]'>
                                {userData.name || 'المستخدم'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Indicator */}
            <div className='mt-2 pt-2 border-t border-white/20'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <div className={`w-2 h-2 rounded-full ${
                            customerData.customerName 
                                ? 'bg-green-400' 
                                : 'bg-yellow-400'
                        }`}></div>
                        <span className='text-xs text-blue-100'>
                            {customerData.customerName 
                                ? 'تم الاختيار' 
                                : 'بانتظار العميل'}
                        </span>
                    </div>
                    
                    <span className='text-xs text-blue-200'>
                        {userData.role ? `(${userData.role})` : ''}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;

// import React, {useState} from 'react'
// import { formatDate, getAvatarName } from '../../utils';
// import { useSelector } from 'react-redux';

// const CustomerInfo = () => {
//     const customerData = useSelector(state => state.customer);
//     const userData = useSelector(state => state.user);
//     // get current date and time 
//     const [dateTime, setDateTime] = useState(new Date());
    
//     return (
        
//         <div className ='flex bg-white items-center justify-between px-2 py-1 shadow-xl'>
//             {/*customer Info */}
//             <div className ='flex flex-col items-start'>

//                 <div className='flex items-center justify-between gap-25'>
//                     <h1 className='text-xs text-yellow-700 font-semibold mb-2'>{customerData.customerName || 'العميل'}</h1>
//                     <p className='text-[#1a1a1a] text-xs font-normal'>#{customerData.saleId || 'NA'}</p>
//                 </div>
            
//                 <p className ='text-[#1a1a1a] text-xs font-normal'>{formatDate(dateTime)}</p>
//                 <p className ='text-[#1a1a1a] text-xs font-semibold mt-2'>
//                     By : <span className ='text-yellow-700'>{userData.name || 'User Name'} / </span>
//                     <span className ='font-normal'>{userData.role}</span>
//                 </p>
//             </div>
//             {/* <button className ='bg-[#f5f5f5] shadow-xl/40 text-yellow-700 rounded-full p-3 h-10 mt-2 text-xs font-semibold'>
//                 {getAvatarName(customerData.customerName || 'Customer Name')}
//             </button>    */}
//         </div>

//     );
// };

// export default CustomerInfo;