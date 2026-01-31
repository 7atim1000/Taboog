import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../https';
import { toast } from 'react-hot-toast';
import { IoCloseCircle, IoCheckmarkCircle, IoCalendar, IoCard, IoReceipt, IoCash, IoPencil } from 'react-icons/io5';

const TransactionUpdate = ({ transaction, setIsEditTransactionModal, fetchTransactions }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Payment method options
    const paymentMethods = [
        { value: "Cash", label: "نقدي", icon: <IoCash /> },
        { value: "Online", label: "أونلاين", icon: <IoCard /> }
    ];

    const [formData, setFormData] = useState({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        refrence: transaction.refrence,
        description: transaction.description,
        paymentMethod: transaction.paymentMethod || "نقدي",
        status: 'updated'
    });

    // Fetch categories when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const [incomesResponse, expensesResponse] = await Promise.all([
                api.get('/api/incomes/'),
                api.get('/api/expenses/')
            ]);

            if (incomesResponse.data.success) {
                setIncomes(incomesResponse.data.data || incomesResponse.data.incomes || []);
            }
            
            if (expensesResponse.data.success) {
                setExpenses(expensesResponse.data.data || expensesResponse.data.expenses || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('فشل في تحميل الفئات', {
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
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await api.put(`/api/transactions/${transaction._id}`, formData);
            if (data.success) {
                toast.success('تم تعديل الإجراء المحاسبي بنجاح', {
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
                handleClose();
            } else {
                toast.error(data.message, {
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
            toast.error(error.response?.data?.message || error.message, {
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

    const handleClose = () => {
        setIsEditTransactionModal(false);
    };

    if (loading) {
        return (
            <div dir='rtl' className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'
                onClick={handleClose}>
                <div className='bg-white rounded-xl p-8 shadow-2xl'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className='text-blue-700 font-medium'>جاري تحميل البيانات...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div dir='rtl' className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4'
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
                            <IoPencil className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className='text-blue-800 text-base sm:text-lg font-bold'>تعديل إجراء محاسبي</h2>
                            <p className='text-blue-600 text-xs mt-1'>رقم العملية: {transaction.transactionNumber}</p>
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
                <form className='p-4 sm:p-6 space-y-6 text-sm' onSubmit={onSubmitHandler}>

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
                                    {(formData.type === 'Income' ? incomes : expenses).map((item, index) => (
                                        <option key={index} value={formData.type === 'Income' ? item.incomeName || item.name : item.expenseName || item.name}>
                                            {formData.type === 'Income' ? item.incomeName || item.name : item.expenseName || item.name}
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

                    {/* Transaction Info */}
                    <div className='bg-blue-50/50 p-4 rounded-xl border border-blue-100'>
                        <div className='grid grid-cols-2 gap-3 text-xs'>
                            <div className='space-y-1'>
                                <p className='text-blue-600 font-medium'>رقم العملية:</p>
                                <p className='text-gray-700 font-semibold'>{transaction.transactionNumber}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-blue-600 font-medium'>تاريخ الإنشاء:</p>
                                <p className='text-gray-700'>{new Date(transaction.createdAt).toLocaleDateString('ar-EG')}</p>
                            </div>
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
                                <IoPencil size={18} />
                                حفظ التعديلات
                            </span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default TransactionUpdate;

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { api } from '../../https';
// import { toast } from 'react-toastify';
// import { IoCloseCircle } from 'react-icons/io5';

// const TransactionUpdate = ({ transaction, setIsEditTransactionModal, fetchTransactions }) => {
//     const [incomes, setIncomes] = useState([]);
//     const [expenses, setExpenses] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     // Payment method options
//     const paymentMethods = [
//         { value: "Cash", label: "Cash" },
//         { value: "Online", label: "Online" }
    
    
//     ];

//     const [formData, setFormData] = useState({
//         amount: transaction.amount,
//         type: transaction.type,
//         category: transaction.category,
//         refrence: transaction.refrence,
//         description: transaction.description,
//         paymentMethod: transaction.paymentMethod || "نقدي", // Add paymentMethod with default
//         status: 'updated'
//     });

//     // Fetch categories when component mounts
//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         try {
//             setLoading(true);
//             // Fetch both incomes and expenses
//             const [incomesResponse, expensesResponse] = await Promise.all([
//                 api.get('/api/incomes/'),
//                 api.get('/api/expenses/')
//             ]);

//             if (incomesResponse.data.success) {
//                 setIncomes(incomesResponse.data.data || []);
//             }
            
//             if (expensesResponse.data.success) {
//                 setExpenses(expensesResponse.data.data || []);
//             }
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//             toast.error('Failed to load categories');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();
//         try {
//             const { data } = await api.put(`/api/transactions/${transaction._id}`, formData);
//             if (data.success) {
//                 // toast.success(data.message);
//                 toast.success('تم تعديل الاجراء المحاسبي بنجاح')
//                 fetchTransactions();
//                 handleClose();
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };

//     const handleClose = () => {
//         setIsEditTransactionModal(false);
//     };

//     if (loading) {
//         return (
//             <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50'
//                 style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//                 <div className='bg-white p-6 rounded-lg shadow-lg'>
//                     <p>Loading categories...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div dir='rtl'  className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-auto'
//             >
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل الاجراء</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>

//                 {/* Modal Body */}
//                 <form className='mt-3 space-y-6 p-2 text-sm' onSubmit={onSubmitHandler}>
//                     {/* Type Radio Buttons */}
//                     <div className='flex items-center justify-between'>
//                         <label className='text-[#1f1f1f] block mb-2 mt-3 text-xs font-normal'>النوع:</label>
//                         <div className='flex items-center gap-3 rounded-lg p-3 bg-white shadow-lg/30'>
//                             <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
//                                 formData.type === 'Income' 
//                                     ? 'bg-green-50 text-green-700 ring-2 ring-green-500' 
//                                     : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                             }`}>
//                                 <input
//                                     type='radio'
//                                     name='type'
//                                     value='Income'
//                                     checked={formData.type === 'Income'}
//                                     onChange={handleInputChange}
//                                     className='hidden'
//                                 />
//                                 <span className='text-green-500'>💰</span>
//                                 <span className='text-xs font-semibold'>Income</span>
//                             </label>

//                             <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
//                                 formData.type === 'Expense' 
//                                     ? 'bg-red-50 text-red-700 ring-2 ring-red-500' 
//                                     : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                             }`}>
//                                 <input
//                                     type='radio'
//                                     name='type'
//                                     value='Expense'
//                                     checked={formData.type === 'Expense'}
//                                     onChange={handleInputChange}
//                                     className='hidden'
//                                 />
//                                 <span className='text-red-500'>💸</span>
//                                 <span className='text-xs font-semibold'>Expense</span>
//                             </label>
//                         </div>
//                     </div>

//                     {/* Category Dropdown - Conditionally Rendered */}
//                     {formData.type === 'Income' && (
//                         <div className='flex items-center justify-between'>
//                             <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الحساب :</label>
//                             <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
//                                     name='category'
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                 >
//                                     <option value="">اختر اسم الحساب</option>
//                                     {incomes && incomes.map((income, index) => (
//                                         <option key={index} value={income.incomeName || income.name}>
//                                             {income.incomeName || income.name}
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
//                                     name='category'
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                 >
//                                     <option value="">اختر اسم الحساب</option>
//                                     {expenses && expenses.map((expense, index) => (
//                                         <option key={index} value={expense.expenseName || expense.name}>
//                                             {expense.expenseName || expense.name}
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
//                                 name='paymentMethod'
//                                 value={formData.paymentMethod}
//                                 onChange={handleInputChange}
//                             >
//                                 {paymentMethods.map((method, index) => (
//                                     <option key={index} value={method.value}>
//                                         {method.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Amount */}
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المبلغ :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='number'
//                                 name='amount'
//                                 value={formData.amount}
//                                 onChange={handleInputChange}
//                                 placeholder='المستلم او الدافع ان وجد'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='off'
//                             />
//                         </div>
//                     </div>

//                     {/* Reference */}
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>المرجع :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='refrence'
//                                 value={formData.refrence}
//                                 onChange={handleInputChange}
//                                 placeholder='المرجع ...'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 autoComplete='off'
//                             />
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>الوصف :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='description'
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 placeholder='الوصف ...'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 autoComplete='off'
//                             />
//                         </div>
//                     </div>

//                     <button
//                         type='submit'
//                         className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold cursor-pointer w-full'
//                     >
//                         تعديل
//                     </button>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default TransactionUpdate;