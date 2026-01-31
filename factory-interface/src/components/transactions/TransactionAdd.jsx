import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from "react-icons/io5";
import { IoCheckmarkCircle, IoCalendar, IoCard, IoReceipt, IoCash } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast';
import { api } from '../../https';

const TransactionAdd = ({ setIsAddTransactionModalOpen, fetchTransactions }) => {

    const userData = useSelector((state) => state.user); 
    const [formData, setFormData] = useState({
        amount: "", 
        type: "", 
        category: "", 
        refrence: "", 
        description: "", 
        transactionNumber: `${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        user: userData._id,
        paymentMethod: "نقدي"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsAddTransactionModalOpen(false)
    };

    function getCurrentShift() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'صباحي' : 'مسائي';
    }

    const formDataWithShift = {
        ...formData,
        shift: getCurrentShift(),
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/transactions/add-transaction', formDataWithShift)

            if (response.data.success) {
                toast.success('تم إضافة الإجراء المحاسبي بنجاح', {
                    duration: 4000,
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
                fetchTransactions();
                setIsAddTransactionModalOpen(false);
            } else {
                toast.error(response.data.message || 'فشل في إضافة الإجراء!', {
                    duration: 4000,
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
                });
            }

        } catch (error) {
            toast.error('فشل في إضافة الإجراء الجديد!', {
                duration: 4000,
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
            });
        }
    };

    const [list, setList] = useState([])
    const fetchList = async () => {
        try {
            const response = await api.get('/api/expenses/')
            if (response.data.success) {
                setList(response.data.expenses);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const [incomes, setIncome] = useState([])
    const fetchIncomes = async () => {
        try {
            const response = await api.get('/api/incomes/')
            if (response.data.success) {
                setIncome(response.data.incomes);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    useEffect(() => {
        fetchList();
        fetchIncomes();
    }, [])

    const paymentMethods = [
        { value: "نقدي", label: "نقدي", icon: <IoCash /> },
        { value: "Online", label: "أونلاين", icon: <IoCard /> },
    ];

    return (
        <div dir='rtl' className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={handleClose}>
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white via-blue-50 to-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hidden'
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                            <IoReceipt className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className='text-blue-800 text-base sm:text-lg font-bold'>إضافة إجراء محاسبي جديد</h2>
                            <p className='text-blue-600 text-xs mt-1'>إضافة عملية مالية جديدة للنظام</p>
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
                <form className='p-4 sm:p-6 space-y-6 text-sm' onSubmit={handleSubmit}>

                    {/* Type Selection */}
                    <div className='space-y-3'>
                        <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                            <span className='bg-blue-100 p-1.5 rounded-lg'>
                                📊
                            </span>
                            نوع العملية :
                        </label>
                        <div className='grid grid-cols-2 gap-3'>
                            <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 
                                ${formData.type === 'Income'
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-700 shadow-lg shadow-green-100'
                                    : 'bg-white border-blue-200 text-gray-600 hover:border-blue-300 hover:shadow-md'
                                }`}>
                                <input
                                    type='radio'
                                    name='type'
                                    value='Income'
                                    checked={formData.type === 'Income'}
                                    onChange={handleInputChange}
                                    className='hidden'
                                    required
                                />
                                <div className={`p-3 rounded-full mb-2 ${formData.type === 'Income' ? 'bg-green-100' : 'bg-blue-50'}`}>
                                    <span className={`text-xl ${formData.type === 'Income' ? 'text-green-500' : 'text-blue-400'}`}>💰</span>
                                </div>
                                <span className='font-semibold text-sm'>إيراد</span>
                                <span className='text-xs text-gray-500 mt-1'>دخل للشركة</span>
                            </label>

                            <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 
                                ${formData.type === 'Expense'
                                    ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400 text-red-700 shadow-lg shadow-red-100'
                                    : 'bg-white border-blue-200 text-gray-600 hover:border-blue-300 hover:shadow-md'
                                }`}>
                                <input
                                    type='radio'
                                    name='type'
                                    value='Expense'
                                    checked={formData.type === 'Expense'}
                                    onChange={handleInputChange}
                                    className='hidden'
                                    required
                                />
                                <div className={`p-3 rounded-full mb-2 ${formData.type === 'Expense' ? 'bg-red-100' : 'bg-blue-50'}`}>
                                    <span className={`text-xl ${formData.type === 'Expense' ? 'text-red-500' : 'text-blue-400'}`}>💸</span>
                                </div>
                                <span className='font-semibold text-sm'>مصروف</span>
                                <span className='text-xs text-gray-500 mt-1'>نفقات الشركة</span>
                            </label>
                        </div>
                    </div>

                    {/* Category Selection */}
                    {(formData.type === 'Income' || formData.type === 'Expense') && (
                        <div className='space-y-3'>
                            <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                                <span className='bg-blue-100 p-1.5 rounded-lg'>
                                    📋
                                </span>
                                {formData.type === 'Income' ? 'حساب الإيراد' : 'حساب المصروف'} :
                            </label>
                            <div className='relative'>
                                <select
                                    className='w-full px-4 py-3 pr-10 border-2 border-blue-200 rounded-xl 
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400
                                             bg-white shadow-sm text-gray-800 text-sm
                                             transition-all duration-200 appearance-none'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    name='category'
                                    required
                                >
                                    <option value="" className='text-gray-400'>
                                        {formData.type === 'Income' ? 'اختر حساب الإيراد ...' : 'اختر حساب المصروف ...'}
                                    </option>
                                    {(formData.type === 'Income' ? incomes : list).map((item, index) => (
                                        <option key={index} value={formData.type === 'Income' ? item.incomeName : item.expenseName}>
                                            {formData.type === 'Income' ? item.incomeName : item.expenseName}
                                        </option>
                                    ))}
                                </select>
                                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none'>
                                    <IoCheckmarkCircle size={20} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Method */}
                    <div className='space-y-3'>
                        <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                            <span className='bg-blue-100 p-1.5 rounded-lg'>
                                💳
                            </span>
                            طريقة الدفع :
                        </label>
                        <div className='grid grid-cols-2 gap-3'>
                            {paymentMethods.map((method, index) => (
                                <label key={index} 
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                                        ${formData.paymentMethod === method.value
                                            ? 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-400 text-blue-700 shadow-md'
                                            : 'bg-white border-blue-200 text-gray-600 hover:border-blue-300'
                                        }`}>
                                    <input
                                        type='radio'
                                        name='paymentMethod'
                                        value={method.value}
                                        checked={formData.paymentMethod === method.value}
                                        onChange={handleInputChange}
                                        className='hidden'
                                        required
                                    />
                                    <span className={`text-lg ${formData.paymentMethod === method.value ? 'text-blue-500' : 'text-gray-400'}`}>
                                        {method.icon}
                                    </span>
                                    <span className='font-medium text-sm'>{method.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Amount */}
                    <div className='space-y-3'>
                        <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                            <span className='bg-blue-100 p-1.5 rounded-lg'>
                                💰
                            </span>
                            المبلغ :
                        </label>
                        <div className='relative'>
                            <input
                                type='number'
                                name='amount'
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder='أدخل المبلغ'
                                className='w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-xl 
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400
                                         bg-white shadow-sm text-gray-800 placeholder-gray-400 text-sm
                                         transition-all duration-200'
                                required
                                autoComplete='off'
                                min="0"
                                step="0.01"
                            />
                            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'>
                                ر.ع
                            </div>
                        </div>
                    </div>

                    {/* Reference */}
                    <div className='space-y-3'>
                        <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                            <span className='bg-blue-100 p-1.5 rounded-lg'>
                                👤
                            </span>
                            المرجع :
                        </label>
                        <input
                            type='text'
                            name='refrence'
                            value={formData.refrence}
                            onChange={handleInputChange}
                            placeholder='اسم المستلم أو الدافع (إن وجد)'
                            className='w-full px-4 py-3 border-2 border-blue-200 rounded-xl 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400
                                     bg-white shadow-sm text-gray-800 placeholder-gray-400 text-sm
                                     transition-all duration-200'
                            autoComplete='off'
                        />
                    </div>

                    {/* Description */}
                    <div className='space-y-3'>
                        <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                            <span className='bg-blue-100 p-1.5 rounded-lg'>
                                📝
                            </span>
                            الوصف :
                        </label>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder='وصف الإجراء (إن وجد)'
                            className='w-full px-4 py-3 border-2 border-blue-200 rounded-xl 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400
                                     bg-white shadow-sm text-gray-800 placeholder-gray-400 text-sm
                                     transition-all duration-200 min-h-[80px] resize-none'
                            autoComplete='off'
                            rows="3"
                        />
                    </div>

                    {/* Date */}
                    <div className='space-y-3'>
                        <label className='text-blue-700 text-sm font-semibold flex items-center gap-2'>
                            <span className='bg-blue-100 p-1.5 rounded-lg'>
                                <IoCalendar className="h-4 w-4" />
                            </span>
                            التاريخ :
                        </label>
                        <div className='relative'>
                            <input
                                type='date'
                                name='date'
                                value={formData.date}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 border-2 border-blue-200 rounded-xl 
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400
                                         bg-white shadow-sm text-gray-800 text-sm
                                         transition-all duration-200'
                                required
                                autoComplete='off'
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='pt-4'>
                        <button
                            type='submit'
                            className='w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm sm:text-base
                                     bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                                     active:scale-95'
                        >
                            <span className='flex items-center justify-center gap-2'>
                                <IoCheckmarkCircle size={20} />
                                إضافة الإجراء
                            </span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default TransactionAdd;


// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { IoCloseCircle } from "react-icons/io5";
// import { useSelector } from 'react-redux'

// import { toast } from 'react-toastify';
// import { api } from '../../https';

// const TransactionAdd = ({ setIsAddTransactionModalOpen, fetchTransactions }) => {

//     const userData = useSelector((state) => state.user); 
//     const [formData, setFormData] = useState({
//         amount: "", 
//         type: "", 
//         category: "", 
//         refrence: "", 
//         description: "", 
//         transactionNumber: `${Date.now()}`,
//         date: new Date().toISOString().slice(0, 10),
//         user: userData._id,
//         paymentMethod: "نقدي" // Default payment method
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleClose = () => {
//         setIsAddTransactionModalOpen(false)
//     };

//     function getCurrentShift() {
//         const hour = new Date().getHours();
//         return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
//     }

//     const formDataWithShift = {
//         ...formData,
//         shift: getCurrentShift(),
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await api.post('/api/transactions/add-transaction', formDataWithShift)

//             if (response.data.success) {
//                 // toast.success(response.data.message);
//                 toast.success('تم اضافه الاجراء المحاسبي بنجاح');
//                 fetchTransactions();
//                 setIsAddTransactionModalOpen(false);
//             } else {
//                 toast.error(response.data.message || 'Failed to add transaction!');
//             }

//         } catch (error) {
//             toast.error('Failed to add new transaction!')
//         }
//     };

//     // Fetch expenses for selection
//     const [list, setList] = useState([])
//     const fetchList = async () => {
//         try {
//             const response = await api.get('/api/expenses/')
//             if (response.data.success) {
//                 setList(response.data.expenses);
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };

//     // Fetch incomes for selection
//     const [incomes, setIncome] = useState([])
//     const fetchIncomes = async () => {
//         try {
//             const response = await api.get('/api/incomes/')
//             if (response.data.success) {
//                 setIncome(response.data.incomes);
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };

//     useEffect(() => {
//         fetchList();
//         fetchIncomes();
//     }, [])

//     // Payment method options
//     const paymentMethods = [
//         { value: "Cash", label: "Cash" },
//         { value: "Online", label: "Online" },
//         // { value: "Debit Card", label: "Debit Card" },
//         // { value: "Bank Transfer", label: "Bank Transfer" },
//         // { value: "Digital Wallet", label: "Digital Wallet" },
//         // { value: "Check", label: "Check" }
//     ];

//     return (
//         <div dir='rtl' className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
//             style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>

//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'
//             >
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-bold'>اضافه اجراء</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>

//                 {/* Modal Body */}
//                 <form className='mt-5 space-y-6 text-sm' onSubmit={handleSubmit}>

//                     {/* Type Selection */}
//                     <div className='flex items-center justify-between'>
//                         <label className='text-[#1f1f1f] block mb-2 mt-3 text-sm font-normal'>النوع :</label>
//                         <div className='flex items-center gap-3 rounded-lg p-3 bg-white shadow-lg/30'>
//                             <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Income'
//                                     ? 'bg-green-50 text-green-700 ring-2 ring-green-500'
//                                     : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                                 }`}>
//                                 <input
//                                     type='radio'
//                                     name='type'
//                                     value='Income'
//                                     checked={formData.type === 'Income'}
//                                     onChange={handleInputChange}
//                                     className='hidden'
//                                     required
//                                 />
//                                 <span className='text-green-500'>💰</span>
//                                 <span className='text-xs font-semibold'>Income</span>
//                             </label>

//                             <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Expense'
//                                     ? 'bg-red-50 text-red-700 ring-2 ring-red-500'
//                                     : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                                 }`}>
//                                 <input
//                                     type='radio'
//                                     name='type'
//                                     value='Expense'
//                                     checked={formData.type === 'Expense'}
//                                     onChange={handleInputChange}
//                                     className='hidden'
//                                     required
//                                 />
//                                 <span className='text-red-500'>💸</span>
//                                 <span className='text-xs font-semibold'>Expense</span>
//                             </label>
//                         </div>
//                     </div>

//                     {/* Conditionally render category dropdown based on selected type */}
//                     {formData.type === 'Income' && (
//                         <div className='flex items-center justify-between'>
//                             <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الحساب :</label>
//                             <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                     name='category'
//                                     required
//                                 >
//                                     <option value="">اختر اسم الحساب ...</option>
//                                     {incomes.map((income, index) => (
//                                         <option key={index} value={income.incomeName}>
//                                             {income.incomeName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     )}

//                     {formData.type === 'Expense' && (
//                         <div className='flex items-center justify-between'>
//                             <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الحساب :</label>
//                             <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                     name='category'
//                                     required
//                                 >
//                                     <option value="">اختر اسم الحساب</option>
//                                     {list.map((expense, index) => (
//                                         <option key={index} value={expense.expenseName}>
//                                             {expense.expenseName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     )}

//                     {/* Payment Method Field */}
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>طريقه الدفع :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <select
//                                 className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
//                                 value={formData.paymentMethod}
//                                 onChange={handleInputChange}
//                                 name='paymentMethod'
//                                 required
//                             >
//                                 {paymentMethods.map((method, index) => (
//                                     <option key={index} 
//                                         value={method.value}>
//                                         {method.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المبلغ :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='amount'
//                                 value={formData.amount}
//                                 onChange={handleInputChange}
//                                 placeholder='مبلغ الصرف او الايراد'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المرجع :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='refrence'
//                                 value={formData.refrence}
//                                 onChange={handleInputChange}
//                                 placeholder='اسم المستلم او الدافع ان وجد'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الوصف :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='description'
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 placeholder='وصف الاجراء ان وجد'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>التاريخ :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='date'
//                                 name='date'
//                                 value={formData.date}
//                                 onChange={handleInputChange}
//                                 placeholder='تاريخ الاجراء'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <button
//                         type='submit'
//                         className='p-3 rounded-xs mt-2 py-3 text-sm bg-[#0ea5e9] text-white font-semibold cursor-pointer w-full'
//                     >
//                         اضافه
//                     </button>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default TransactionAdd;