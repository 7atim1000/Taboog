import React, { useState } from 'react'
import { MdDelete } from "react-icons/md";
import { IoAddCircle, IoChevronBack, IoReceipt, IoWarning } from "react-icons/io5";
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api, getExpenses } from '../https';
import { toast } from 'react-hot-toast';
import ExpenseAdd from '../components/transactions/ExpenseAdd';
import BottomNav from '../components/shared/BottomNav';

const Expense = () => {
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);    
    const [selectedExpense, setSelectedExpense] = useState(null);

    // fetch expenses
    const { data: responseData, isError, isLoading } = useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            return await getExpenses();
        },
        placeholderData: keepPreviousData,
    });

    if (isError) {
        toast.error('حدث خطأ في تحميل البيانات!', {
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

    // remove Expense
    const removeExpense = async (id) => {
        try {
            const response = await api.post('/api/expenses/remove', { id })
            if (response.data.success) {
                toast.success('تم حذف حساب المصروف بنجاح', {
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
                window.location.reload();
            } else {
                toast.error(response.data.message, {
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
            console.log(error)
            toast.error(error.message, {
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

    // Loading state
    if (isLoading) {
        return (
            <div dir='rtl' className='h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className='text-blue-700 font-medium'>جاري تحميل حسابات المصروفات...</p>
                </div>
            </div>
        );
    }

    const expenses = responseData?.data?.data || [];

    return (
        <section dir='rtl' className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
            {/* Header */}
            <div className='sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-xl'>
                <div className='container mx-auto flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <button 
                            onClick={() => window.history.back()}
                            className='p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200'
                        >
                            <IoChevronBack size={20} />
                        </button>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-white/20 rounded-lg'>
                                <IoReceipt size={24} />
                            </div>
                            <div>
                                <h1 className='text-lg font-bold'>إدارة حسابات المصروفات</h1>
                                <p className='text-blue-100 text-xs mt-1'>إجمالي الحسابات: {expenses.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setIsExpenseModalOpen(true)}
                        className='flex items-center gap-2 px-4 py-3 bg-white text-blue-700 hover:bg-blue-50 
                                 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                                 transform hover:-translate-y-0.5'
                    >
                        <IoAddCircle size={22} />
                        <span className='text-sm'>إضافة حساب</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className='container mx-auto p-4 sm:p-6'>
                {expenses.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-16 text-center'>
                        <div className='p-6 bg-blue-100 rounded-full mb-4'>
                            <IoReceipt size={48} className='text-blue-500' />
                        </div>
                        <h3 className='text-blue-800 text-lg font-bold mb-2'>لا توجد حسابات مصروفات</h3>
                        <p className='text-blue-600 mb-6 max-w-md'>لم يتم إضافة أي حسابات مصروفات بعد. قم بإضافة حساب جديد للبدء.</p>
                        <button
                            onClick={() => setIsExpenseModalOpen(true)}
                            className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                                     text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'
                        >
                            <IoAddCircle size={20} />
                            إضافة أول حساب مصروف
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {expenses.map((expense, index) => (
                            <div 
                                key={expense._id}
                                className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-blue-100
                                         transition-all duration-300 transform hover:-translate-y-1 overflow-hidden'
                            >
                                <div className='p-5'>
                                    {/* Card Header */}
                                    <div className='flex items-center justify-between mb-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className={`p-3 rounded-xl bg-gradient-to-r from-rose-100 to-pink-100`}>
                                                <IoReceipt className={`text-rose-600`} size={22} />
                                            </div>
                                            <div>
                                                <div className='text-xs text-rose-500 bg-rose-50 px-2 py-1 rounded-full'>
                                                    حساب مصروف
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-1'>
                                            <button
                                                onClick={() => { 
                                                    setSelectedExpense(expense); 
                                                    setDeleteModalOpen(true); 
                                                }}
                                                className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 
                                                         rounded-full transition-all duration-200'
                                                aria-label="حذف الحساب"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div>
                                        <h3 className='text-blue-800 text-base font-bold mb-2 truncate'>
                                            {expense.expenseName}
                                        </h3>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                            <span className='text-xs'>معرف:</span>
                                            <span className='font-mono text-xs bg-gray-100 px-2 py-1 rounded'>
                                                {expense._id?.slice(-8) || 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className='mt-4 pt-4 border-t border-blue-50'>
                                        <div className='flex items-center justify-between text-xs'>
                                            <span className='text-gray-500'>تاريخ الإنشاء:</span>
                                            <span className='text-blue-700 font-medium'>
                                                {new Date(expense.createdAt).toLocaleDateString('ar-EG')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect */}
                                <div className='h-1 bg-gradient-to-r from-rose-500 to-pink-400 transform scale-x-0 
                                              group-hover:scale-x-100 transition-transform duration-300'></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {isExpenseModalOpen && <ExpenseAdd setIsExpenseModalOpen={setIsExpenseModalOpen} />}
            
            {/* Bottom Navigation */}
            <BottomNav />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                expenseName={selectedExpense?.expenseName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeExpense(selectedExpense._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, expenseName }) => {
    if (!open) return null;
    
    return (
        <div 
            dir='rtl'
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 p-5 border-b border-red-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-full">
                            <IoWarning className="text-red-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-red-800 text-lg font-bold">تأكيد الحذف</h2>
                            <p className="text-red-600 text-sm">عملية حذف نهائي</p>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-gray-700 mb-2 text-right">
                        هل أنت متأكد من رغبتك في حذف حساب المصروف:
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-2">
                            <IoReceipt className="text-red-500" />
                            <span className="text-red-700 font-bold text-lg">{expenseName}</span>
                        </div>
                    </div>
                    <p className="text-red-600 text-sm text-center mb-6">
                        ⚠️ تحذير: لا يمكن التراجع عن هذه العملية بعد التنفيذ
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 
                                     text-gray-700 font-bold transition-all duration-200"
                            onClick={onClose}
                        >
                            إلغاء
                        </button>
                        <button
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 
                                     text-white font-bold hover:from-red-600 hover:to-red-700
                                     transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={onConfirm}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <MdDelete size={18} />
                                تأكيد الحذف
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expense;

// import React, { useState } from 'react'

// import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
// import BackButton from '../components/shared/BackButton';
// import { FiEdit3 } from "react-icons/fi";

// import { getBgColor } from '../utils';

// import { keepPreviousData, useQuery } from '@tanstack/react-query'
// import { api, getExpenses } from '../https';

// import { toast } from 'react-toastify'
// import ExpenseAdd from '../components/transactions/ExpenseAdd';
// import BottomNav from '../components/shared/BottomNav';


// const Expense = () => {
//     const Button = [
//         { label: 'اضافه حساب', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action: 'expense' }
//     ];

//     const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

//     const handleOpenModal = (action) => {
//         if (action === 'expense') setIsExpenseModalOpen(true);
//     };
    
//     // fetch expenses
//     const { data: responseData, IsError } = useQuery({
//         queryKey: ['expenses'],

//         queryFn: async () => {
//             return await getExpenses();
//         },

//         placeholderData: keepPreviousData,
//     });


//     if (IsError) {
//         enqueueSnackbar('Something went wrong!', { variant: 'error' });
//     }

//     console.log(responseData);

//     // remove Expense
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);    
//     const [selectedExpenses, setSelectedExpenses] = useState(null);   
//     const removeExpense = async (id) => {

//         try {
//             const response = await api.post('/api/expenses/remove', { id },)

//             if (response.data.success) {

//                 //Update the LIST after Remove
//                 toast.success('تم مسح الحساب بنجاح')
//                 window.location.reload();


//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };


//     return (
//         <section dir ='rtl' className ='h-[100vh] overfllow-y-scroll scrollbar-hidden'>
//             <div className='flex items-center justify-between px-8 py-2 shadow-xl  mb-2'>

//                 <div className='flex items-center'>
//                     <BackButton />
//                     <h1 className='text-sm font-semibold text-black'>اداره حسابات المصروفات</h1>
//                 </div>
//                 <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {Button.map(({ label, icon, action }) => {
//                         return (
//                             <button
//                                 className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'

//                                 onClick={() => handleOpenModal(action)}
//                             >
//                                 {label} {icon}
//                             </button>
//                         )
//                     })}


//                 </div>
//                 {isExpenseModalOpen && <ExpenseAdd setIsExpenseModalOpen={setIsExpenseModalOpen} />}

//             </div>


//             <div className='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] rounded-sm'>
//                 {responseData?.data.data.length === 0
//                     ? (<p className='w-full text-sm text-[#be3e3f] flex justify-center'>قائمه حسابات المصروفات فارغه حاليا .</p>)
//                     : responseData?.data.data.map(expense => (

//                         <div key={expense.expenseName} 
//                         className='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[70px] cursor-pointer
//                     shadow-lg/10 bg-[#F1E8D9]'
                           
//                         >

//                             <div className='flex justify-between w-full shadow-lg/30'>
//                                 <div className='items-start px-3'>
//                                     <h1 className='text-xs font-semibold text-[#1a1a1a]'>{expense.expenseName}</h1>
//                                 </div>

//                                 <div className='items-end flex gap-1 px-3'>
//                                     {/* <FiEdit3 size={20} className='w-5 h-5 text-sky-500 rounded-full' /> */}
//                                     <MdDelete onClick={() => { setSelectedExpenses(expense); setDeleteModalOpen(true); }}
//                                     size={20} 
//                                     className='w-6 h-6 text-[#be3e3f] rounded-full' 
//                                     />
//                                 </div>

//                             </div>
//                         </div>
//                     ))}
//             </div>


//             <BottomNav />

//             <ConfirmModal
//                 open={deleteModalOpen}
//                 ExpenseName={selectedExpenses?.expenseName}
       
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeExpense(selectedExpenses._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />
//         </section>
//     )
// };


// const ConfirmModal = ({ open, onClose, onConfirm, ExpenseName}) => {
//     if (!open) return null;
//     return (
//         <div
//             className="fixed inset-0 flex items-center justify-center z-50"
//             style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//         >

//             <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px] text-sm font-normal">
//                 {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//                 <p className="mb-6">هل انت متأكد من حذف حساب   
//                     <span className="font-semibold text-[#0ea5e9]"> {ExpenseName}</span> ؟</p>
//                 <div className="flex justify-end gap-3">
//                     <button
//                         className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
//                         onClick={onClose}
//                     >
//                         الغاء
//                     </button>
//                     <button
//                         className="px-4 py-2 rounded  text-white bg-[#be3e3f] cursor-pointer"
//                         onClick={onConfirm}
//                     >
//                         مسح
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default Expense ;