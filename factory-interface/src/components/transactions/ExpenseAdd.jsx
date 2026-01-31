import React, { useState } from 'react'
import { addExpense } from '../../https';
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { IoCloseCircle } from 'react-icons/io5';

const ExpenseAdd = ({ setIsExpenseModalOpen }) => {
    const [formData, setFormData] = useState({
        expenseName: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        ExpenseMutation.mutate(formData);
    }

    const ExpenseMutation = useMutation({
        mutationFn: (reqData) => addExpense(reqData),

        onSuccess: (res) => {
            const { data } = res;
            toast.success('تم فتح واضافه حساب فتح الصرف بنجاح', {
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
            setIsExpenseModalOpen(false);
        },

        onError: (error) => {
            const { response } = error;
            toast.error(response?.data?.message || 'حدث خطأ', {
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
        setIsExpenseModalOpen(false);
    };

    return (
        <div 
            dir="rtl"
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
            onClick={handleClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl w-full max-w-md'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
                    <h2 className='text-blue-800 text-lg font-bold'>إضافة حساب جديد</h2>
                    <button 
                        onClick={handleClose} 
                        className='text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded-full transition-colors duration-200'
                    >
                        <IoCloseCircle size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <form className='p-5 space-y-6' onSubmit={handleSubmit}>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='text-blue-700 text-sm font-semibold block'>
                                اسم الحساب :
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    name='expenseName'
                                    value={formData.expenseName}
                                    onChange={handleInputChange}
                                    placeholder='الرجاء كتابة اسم الحساب'
                                    className='w-full px-4 py-3 pr-10 text-sm border border-blue-200 rounded-lg 
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             bg-white shadow-sm text-gray-800 placeholder-gray-400
                                             transition-all duration-200'
                                    required
                                    autoComplete='off'
                                />
                                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>
                                أدخل اسم الحساب الذي ترغب في إضافته للنظام
                            </p>
                        </div>

                        <div className='pt-4'>
                            <button
                                type='submit'
                                disabled={ExpenseMutation.isPending}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white text-sm
                                         transition-all duration-300 shadow-lg hover:shadow-xl
                                         ${ExpenseMutation.isPending 
                                            ? 'bg-blue-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                         }`}
                            >
                                {ExpenseMutation.isPending ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        جاري الحفظ...
                                    </span>
                                ) : 'حفظ الحساب'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className='p-4 border-t border-blue-100 bg-blue-50/50 rounded-b-xl'>
                    <p className='text-xs text-blue-600 text-center'>
                        سيتم إضافة الحساب إلى قائمة حسابات الصرف المتاحة
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ExpenseAdd;

// import React , {useState} from 'react'
// import { addExpense } from '../../https';
// import { motion } from 'framer-motion'

// import { useMutation } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { IoCloseCircle } from 'react-icons/io5';

// const ExpenseAdd = ({setIsExpenseModalOpen}) => {
//     const [formData, setFormData] = useState({
//         expenseName: ""
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };


//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData)

//         ExpenseMutation.mutate(formData)
//         window.location.reload()
//         setIsExpenseModalOpen(false)
//     }

//     const ExpenseMutation = useMutation({
//         mutationFn: (reqData) => addExpense(reqData),

//         onSuccess: (res) => {

//             const { data } = res;
//             //console.log(data)
//             enqueueSnackbar('تم فتح واضافه حساب فتح الصرف', { variant: "success" });
//         },

//         onError: (error) => {
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error" });

//             console.log(error);
//         },
//     });


//     const handleClose = () => {
//         setIsExpenseModalOpen(false)
//     };



//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
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
//                                     name='expenseName'
//                                     value={formData.expenseName}
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


// export default ExpenseAdd ;
