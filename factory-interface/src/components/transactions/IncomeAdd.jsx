import React, { useState } from 'react'
import { addIncome } from '../../https';
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { IoCloseCircle } from 'react-icons/io5';

const IncomeAdd = ({ setIsIncomeModalOpen }) => {
    const [formData, setFormData] = useState({
        incomeName: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        IncomeMutation.mutate(formData);
    }

    const IncomeMutation = useMutation({
        mutationFn: (reqData) => addIncome(reqData),

        onSuccess: (res) => {
            const { data } = res;
            toast.success('تم فتح وإضافة حساب الإيراد بنجاح', {
                duration: 5000,
                position: 'top-left',
                style: {
                    borderRight: '4px solid #10b981',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    textAlign: 'right',
                    padding: '12px 16px',
                },
                iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                },
            });
            window.location.reload();
            setIsIncomeModalOpen(false);
        },

        onError: (error) => {
            const { response } = error;
            toast.error(response?.data?.message || 'حدث خطأ في إضافة الحساب', {
                duration: 5000,
                position: 'top-left',
                style: {
                    borderRight: '4px solid #ef4444',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    textAlign: 'right',
                    padding: '12px 16px',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
            console.log(error);
        },
    });

    const handleClose = () => {
        setIsIncomeModalOpen(false);
    };

    return (
        <div 
            dir="rtl"
            className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4'
            onClick={handleClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white via-blue-50 to-white rounded-2xl shadow-2xl w-full max-w-md mx-2'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 sm:p-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className='text-blue-800 text-base sm:text-lg font-bold'>إضافة حساب إيراد</h2>
                            <p className='text-blue-600 text-xs mt-1'>إضافة مصدر دخل جديد للنظام</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose} 
                        className='text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-1.5 rounded-full transition-all duration-200'
                        aria-label="إغلاق النافذة"
                    >
                        <IoCloseCircle size={26} />
                    </button>
                </div>

                {/* Modal Body */}
                <form className='p-4 sm:p-6 space-y-6' onSubmit={handleSubmit}>
                    <div className='space-y-6'>
                        <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                                <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                                    <span className='bg-blue-100 p-1.5 rounded-lg'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    اسم حساب الإيراد :
                                </label>
                                <span className='text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full'>مطلوب</span>
                            </div>
                            
                            <div className='relative group'>
                                <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300'></div>
                                <div className='relative'>
                                    <input
                                        type='text'
                                        name='incomeName'
                                        value={formData.incomeName}
                                        onChange={handleInputChange}
                                        placeholder='أدخل اسم حساب الإيراد هنا'
                                        className='w-full px-4 py-3.5 pr-12 text-sm sm:text-base border-2 border-blue-200 rounded-xl
                                                 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-400
                                                 bg-white shadow-sm text-gray-800 placeholder-gray-400
                                                 transition-all duration-300 hover:border-blue-300'
                                        required
                                        autoComplete='off'
                                        disabled={IncomeMutation.isPending}
                                    />
                                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p className='text-xs text-blue-600 mt-2 mr-1 flex items-center gap-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    مثال: مبيعات، خدمات، إيرادات عقارية، إلخ.
                                </p>
                            </div>
                        </div>

                        <div className='pt-2'>
                            <button
                                type='submit'
                                disabled={IncomeMutation.isPending || !formData.incomeName.trim()}
                                className={`w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm sm:text-base
                                         transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                                         ${IncomeMutation.isPending || !formData.incomeName.trim() 
                                            ? 'bg-blue-300 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95'
                                         }`}
                            >
                                {IncomeMutation.isPending ? (
                                    <span className='flex items-center justify-center gap-3'>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className='font-medium'>جاري إضافة الحساب...</span>
                                    </span>
                                ) : (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        حفظ الحساب
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className='p-4 border-t border-blue-100 bg-blue-50/60 rounded-b-2xl'>
                    <div className='flex items-center justify-center gap-2 text-xs text-blue-700'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className='text-center'>سيظهر الحساب الجديد في قائمة مصادر الإيرادات مباشرة</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default IncomeAdd;


// import React , {useState} from 'react'
// import { addIncome } from '../../https';
// import { motion } from 'framer-motion'

// import { useMutation } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { IoCloseCircle } from 'react-icons/io5';

// const IncomeAdd = ({setIsIncomeModalOpen}) => {
//     const [formData, setFormData] = useState({
//         incomeName: ""
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };


//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData)

//         IncomeMutation.mutate(formData)
//         window.location.reload()
//         setIsIncomeModalOpen(false)
//     }

//     const IncomeMutation = useMutation({
//         mutationFn: (reqData) => addIncome(reqData),

//         onSuccess: (res) => {

//             const { data } = res;
//             //console.log(data)
//             enqueueSnackbar('تم فتح واضافه حساب الايراد', { variant: "success" });
//         },

//         onError: (error) => {
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error" });

//             console.log(error);
//         },
//     });


//     const handleClose = () => {
//         setIsIncomeModalOpen(false)
//     };



//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-3 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-semibold'>اضافه حساب</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>

//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={handleSubmit}>
//                     <div className='mt-5'>
//                         <label className='text-[#0ea5e9] block mb-2 mt-3 px-4 text-xs font-medium'>اسم الحساب :</label>

//                         <div className='mt-5 flex items-center justify-between gap-5'>

//                             <div className='w-full flex items-center rounded-lg p-3 bg-white shadow-xl'>
//                                 <input
//                                     type='text'
//                                     name='incomeName'
//                                     value={formData.incomeName}
//                                     onChange={handleInputChange}

//                                     placeholder='الرجاء كتابه اسم الحساب'
//                                     className='bg-transparent text-[#1a1a1a] focus:outline-none border-b border-yellow-700 w-full text-xs font-semibold'
//                                     required
//                                     autoComplete='none'
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             type='submit'
//                             className='rounded-xs px-3 py-3 text-sm font-semibold bg-sky-500 text-white cursor-pointer 
//                             mt-10 w-full'
//                         >
//                             حفظ
//                         </button>

//                     </div>
                    
//                 </form>
//             </motion.div>
//         </div> 
//     )
// };

// export default IncomeAdd ;
