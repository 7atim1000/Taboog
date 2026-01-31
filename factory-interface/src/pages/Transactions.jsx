import React, {useState, useEffect, useRef, useCallback} from 'react' 
import { api } from '../https';
import { toast } from 'react-toastify'
import { MdDeleteForever } from 'react-icons/md';
import { IoIosAddCircle } from 'react-icons/io'; 
import { BiSolidEditAlt } from 'react-icons/bi';
import BackButton from '../components/shared/BackButton';
import TransactionAdd from '../components/transactions/TransactionAdd';
import { LuPrinterCheck } from "react-icons/lu";
import TransactionUpdate from '../components/transactions/TransactionUpdate';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Transactions = () => {
    
    const Button = [
        { label: 'إضافة', icon: <IoIosAddCircle className='text-white w-5 h-5'/>, action: 'transaction' }
    ];

    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
    const handleOpenModal = (action) => {
        if (action === 'transaction') setIsAddTransactionModalOpen(true);
    };

    // State variables
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(''); 
    const [sort, setSort] = useState('-createdAt');
    const [paymentMethod, setPaymentMethod] = useState('all');
    const [frequency, setFrequency] = useState(366);
    const [type, setType] = useState('all');
    const [shift, setShift] = useState('all');

    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    const [isEditTransactionModal, setIsEditTransactionModal] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/transactions/get-transactions', {
                paymentMethod,
                frequency,
                type,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setList(response.data.data || response.data.transactions || []);
            } else {
                toast.error(response.data.message || 'Transactions is not found')
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message)
            }
        } finally {
            setLoading(false);
        }
    }, [paymentMethod, frequency, shift, type, search, sort]);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchTransactions();
        }
    }, [fetchTransactions]);

    // Handle edit
    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        setIsEditTransactionModal(true);
    };

    // Remove transaction
    const removeTransaction = async (id) => {
        try {
            const response = await api.post('/api/transactions/remove', { id });
            if (response.data.success) {
                toast.success('تم حذف الإجراء بنجاح');
                await fetchTransactions();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, sort]);

    // Statistics calculations
    const totalTransaction = list.length;
    const totalIncomeTransactions = list.filter(t => t.type === "Income");
    const totalExpenseTransactions = list.filter(t => t.type === "Expense");
    
    const totalTurnover = list.reduce((acc, t) => acc + t.amount, 0);
    const totalIncomeTurnover = list.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenseTurnover = list.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
    const netTurnover = totalIncomeTurnover - totalExpenseTurnover;

    const data = [
        { name: 'الإيرادات', value: totalIncomeTurnover, color: '#10b981' },
        { name: 'المصروفات', value: totalExpenseTurnover, color: '#ef4444' }
    ];

    // Printing
    const invoiceRef = useRef(null);
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Transactions Management</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: white; }
                        .receipt-container { width: 100%; }
                        h2 { text-align: center; color: #1e40af; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #d1d5db; padding: 10px; text-align: right; }
                        th { background-color: #f3f4f6; color: #374151; font-weight: 600; }
                        .IdTd, .buttonTd, .buttonTr, .userTr, .userTd, .footTd { display: none !important; }
                        .controls, .button, .backButton, .search { display: none !important; }
                        .stats-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
                        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
                        .stat-title { color: #64748b; font-size: 12px; }
                        .stat-value { color: #1e293b; font-size: 18px; font-weight: 600; }
                    </style>
                </head>
                <body>
                    <h2>تقرير الإجراءات المالية</h2>
                    ${printContent}
                </body>
            </html>
        `);

        WinPrint.document.close();
        WinPrint.focus();
        setTimeout(() => {
            WinPrint.print();
            WinPrint.close();
        }, 1000);
    };

    return (
        <section className='min-h-screen bg-gray-50 p-3 md:p-4 lg:p-6'>
            <div className='max-w-7xl mx-auto'>
                <div ref={invoiceRef}>
                    {/* Header Section */}
                    <div className='bg-white rounded-xl shadow-md p-4 mb-6'>
                        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                            <div className='flex items-center gap-3'>
                                <BackButton />
                                <h1 className='text-lg md:text-xl font-bold text-blue-800'>الإدارة المالية</h1>
                            </div>
                            
                            <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={handlePrint}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition duration-200"
                                    >
                                        <LuPrinterCheck className="w-4 h-4" />
                                        طباعة
                                    </button>
                                    
                                    {Button.map(({ label, icon, action }) => (
                                        <button
                                            key={action}
                                            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition duration-200'
                                            onClick={() => handleOpenModal(action)}
                                        >
                                            {icon}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Left Column - Statistics & Charts */}
                        <div className='lg:col-span-1 space-y-6'>
                            {/* Filters Card */}
                            <div className='bg-white rounded-xl shadow-md p-5'>
                                <h3 className='text-blue-800 font-semibold mb-4 text-sm'>التصفية والتحكم</h3>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='col-span-2 sm:col-span-1'>
                                        <label className='block text-xs text-gray-600 mb-1'>الفترة</label>
                                        <select 
                                            value={frequency} 
                                            onChange={(e) => setFrequency(e.target.value)}
                                            className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                        >
                                            <option value='1'>1 يوم</option>
                                            <option value='7'>7 أيام</option>
                                            <option value='30'>30 يوم</option>
                                            <option value='90'>90 يوم</option>
                                            <option value='366'>جميع الأيام</option>
                                        </select>
                                    </div>
                                    
                                    <div className='col-span-2 sm:col-span-1'>
                                        <label className='block text-xs text-gray-600 mb-1'>النوع</label>
                                        <select 
                                            value={type} 
                                            onChange={(e) => setType(e.target.value)}
                                            className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                        >
                                            <option value='all'>الكل</option>
                                            <option value='Income'>إيرادات</option>
                                            <option value='Expense'>مصروفات</option>
                                        </select>
                                    </div>
                                    
                                    <div className='col-span-2 sm:col-span-1'>
                                        <label className='block text-xs text-gray-600 mb-1'>الوردية</label>
                                        <select 
                                            value={shift} 
                                            onChange={(e) => setShift(e.target.value)}
                                            className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                        >
                                            <option value='all'>الكل</option>
                                            <option value='Morning'>صباحية</option>
                                            <option value='Evening'>مسائية</option>
                                        </select>
                                    </div>
                                    
                                    <div className='col-span-2 sm:col-span-1'>
                                        <label className='block text-xs text-gray-600 mb-1'>طريقة الدفع</label>
                                        <select 
                                            value={paymentMethod} 
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                        >
                                            <option value='all'>الكل</option>
                                            <option value='Cash'>نقدي</option>
                                            <option value='Online'>الكتروني</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Cards */}
                            <div className='bg-white rounded-xl shadow-md p-5'>
                                <h3 className='text-blue-800 font-semibold mb-4 text-sm'>إحصائيات الإجراءات</h3>
                                <div className='grid grid-cols-2 gap-3 mb-4'>
                                    <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                                        <p className='text-xs text-blue-600 mb-1'>عدد الإجراءات</p>
                                        <p className='text-xl font-bold text-blue-800'>{totalTransaction}</p>
                                        <p className='text-xs text-gray-500'>إجراء</p>
                                    </div>
                                    
                                    <div className='bg-green-50 rounded-lg p-3 border border-green-100'>
                                        <p className='text-xs text-green-600 mb-1'>الإيرادات</p>
                                        <p className='text-xl font-bold text-green-700'>{totalIncomeTransactions.length}</p>
                                        <p className='text-xs text-gray-500'>إجراء</p>
                                    </div>
                                    
                                    <div className='bg-red-50 rounded-lg p-3 border border-red-100'>
                                        <p className='text-xs text-red-600 mb-1'>المصروفات</p>
                                        <p className='text-xl font-bold text-red-700'>{totalExpenseTransactions.length}</p>
                                        <p className='text-xs text-gray-500'>إجراء</p>
                                    </div>
                                    
                                    <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                                        <p className='text-xs text-blue-600 mb-1'>الإجمالي</p>
                                        <p className='text-xl font-bold text-blue-800'>{totalTurnover.toFixed(2)}</p>
                                        <p className='text-xs text-gray-500'>ر.ع</p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className='bg-white rounded-xl shadow-md p-5'>
                                <h3 className='text-blue-800 font-semibold mb-4 text-sm'>ملخص مالي</h3>
                                <div className='space-y-3'>
                                    <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                                        <span className='text-sm text-gray-600'>إجمالي الإيرادات:</span>
                                        <span className='font-semibold text-green-600'>{totalIncomeTurnover.toFixed(2)} ر.ع</span>
                                    </div>
                                    <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                                        <span className='text-sm text-gray-600'>إجمالي المصروفات:</span>
                                        <span className='font-semibold text-red-600'>{totalExpenseTurnover.toFixed(2)} ر.ع</span>
                                    </div>
                                    <div className='flex justify-between items-center pt-2'>
                                        <span className='text-sm font-semibold text-blue-600'>الصافي:</span>
                                        <span className={`font-bold text-lg ${netTurnover >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {netTurnover.toFixed(2)} ر.ع
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className='bg-white rounded-xl shadow-md p-5'>
                                <h3 className='text-blue-800 font-semibold mb-4 text-sm'>تحليل بياني</h3>
                                <div className='h-64'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                                label={(entry) => `${entry.name}: ${entry.value.toFixed(2)}`}
                                            >
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [`${value.toFixed(2)} ر.ع`, 'المبلغ']}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Transactions List */}
                        <div className='lg:col-span-2'>
                            {/* Search and Sort Bar */}
                            <div className='bg-white rounded-xl shadow-md p-4 mb-6'>
                                <div className='flex flex-col sm:flex-row gap-3'>
                                    <div className='flex-1'>
                                        <div className='relative'>
                                            <input
                                                type="text"
                                                placeholder="بحث في الإجراءات..."
                                                className="w-full border border-blue-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            <div className="absolute left-3 top-2.5 text-gray-400">
                                                🔍
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <select
                                        className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[150px]"
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                    >
                                        <option value="-createdAt">الأحدث أولاً</option>
                                        <option value="createdAt">الأقدم أولاً</option>
                                        <option value="type">حسب النوع (أ-ي)</option>
                                        <option value="-type">حسب النوع (ي-أ)</option>
                                        <option value="amount">حسب المبلغ (صغير-كبير)</option>
                                        <option value="-amount">حسب المبلغ (كبير-صغير)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="mr-2 text-blue-600">جاري التحميل...</span>
                                </div>
                            )}

                            {/* Transactions Table */}
                            <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                                <div className='overflow-x-auto'>
                                    <table className='min-w-full'>
                                        <thead className='bg-blue-50'>
                                            <tr className='text-right'>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>التاريخ</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>طريقة الدفع</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>النوع</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الوردية</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>المبلغ</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الفئة</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>المرجع</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الحالة</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody className='divide-y divide-gray-100'>
                                            {list.length === 0 ? (
                                                <tr>
                                                    <td colSpan="9" className="py-8 text-center">
                                                        <div className="text-gray-400">
                                                            <div className="text-4xl mb-2">📊</div>
                                                            <p className="text-gray-500">لا توجد إجراءات مالية حالياً</p>
                                                            <p className="text-sm text-gray-400 mt-1">قم بإضافة إجراء مالي جديد</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                list.map((transaction) => (
                                                    <tr 
                                                        key={transaction._id} 
                                                        className='hover:bg-blue-50 transition duration-150'
                                                    >
                                                        <td className='py-3 px-4 text-sm text-gray-700'>
                                                            {transaction.date ? new Date(transaction.date).toLocaleDateString('ar-SA') : '-'}
                                                        </td>
                                                        <td className='py-3 px-4 text-sm text-gray-700'>{transaction.paymentMethod}</td>
                                                        <td className='py-3 px-4'>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.type === 'Income' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {transaction.type === 'Income' ? 'إيرادات' : 'مصروفات'}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.shift === 'Morning' 
                                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {transaction.shift === 'Morning' ? 'صباحية' : 'مسائية'}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4 text-sm font-medium text-gray-900'>
                                                            {transaction.amount.toFixed(2)} ر.ع
                                                        </td>
                                                        <td className='py-3 px-4 text-sm text-gray-700'>{transaction.category}</td>
                                                        <td className='py-3 px-4 text-sm text-gray-700'>{transaction.refrence || '-'}</td>
                                                        <td className='py-3 px-4'>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.status === 'updated' 
                                                                    ? 'bg-emerald-100 text-emerald-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {transaction.status || 'جديد'}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <div className='flex gap-2'>
                                                                <button
                                                                    onClick={() => handleEdit(transaction)}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-150"
                                                                    title="تعديل"
                                                                >
                                                                    <BiSolidEditAlt className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => { 
                                                                        setSelectedTransaction(transaction); 
                                                                        setDeleteModalOpen(true); 
                                                                    }}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition duration-150"
                                                                    title="حذف"
                                                                >
                                                                    <MdDeleteForever className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                        
                                        {list.length > 0 && (
                                            <tfoot className='bg-blue-50 border-t border-blue-100'>
                                                <tr>
                                                    <td colSpan="4" className="py-3 px-4 text-sm font-semibold text-blue-800">
                                                        إجمالي {list.length} إجراء
                                                    </td>
                                                    <td colSpan="5" className="py-3 px-4">
                                                        <div className='flex justify-between items-center'>
                                                            <div className='text-sm'>
                                                                <span className='text-green-600 font-medium'>
                                                                    الإيرادات: {totalIncomeTurnover.toFixed(2)} ر.ع
                                                                </span>
                                                                <span className='mx-2'>|</span>
                                                                <span className='text-red-600 font-medium'>
                                                                    المصروفات: {totalExpenseTurnover.toFixed(2)} ر.ع
                                                                </span>
                                                            </div>
                                                            <div className='text-sm font-bold text-blue-800'>
                                                                الصافي: {netTurnover.toFixed(2)} ر.ع
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {isAddTransactionModalOpen && (
                    <TransactionAdd 
                        setIsAddTransactionModalOpen={setIsAddTransactionModalOpen} 
                        fetchTransactions={fetchTransactions}
                    />
                )}

                {isEditTransactionModal && currentTransaction && (
                    <TransactionUpdate
                        transaction={currentTransaction}
                        setIsEditTransactionModal={setIsEditTransactionModal}
                        fetchTransactions={fetchTransactions}
                    />
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                Type={selectedTransaction?.type === 'Income' ? 'إيراد' : 'مصروف'}
                Amount={selectedTransaction?.amount}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeTransaction(selectedTransaction._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

// Confirm Modal Component
const ConfirmModal = ({ open, onClose, onConfirm, Type, Amount }) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdDeleteForever className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">تأكيد الحذف</h3>
                    <p className="text-gray-600 text-sm">
                        هل أنت متأكد من حذف هذا الإجراء؟
                    </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">النوع:</span>
                        <span className={`font-medium ${Type === 'إيراد' ? 'text-green-600' : 'text-red-600'}`}>
                            {Type}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">المبلغ:</span>
                        <span className="font-bold text-gray-900">
                            {Amount?.toFixed(2) || '0.00'} ر.ع
                        </span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm font-medium"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
                    >
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Transactions;


// import React, {useState, useEffect, useRef, useCallback} from 'react' 
// import { api } from '../https';
// import { toast } from 'react-toastify'
// import { MdDeleteForever } from 'react-icons/md';
// import { IoIosAddCircle } from 'react-icons/io'; 
// import { BiSolidEditAlt } from 'react-icons/bi';
// import BackButton from '../components/shared/BackButton';
// import TransactionAdd from '../components/transactions/TransactionAdd';

// import { LuPrinterCheck } from "react-icons/lu";
// // import TransactionUpdate from '../components/transactions/TransactionUpdate';

// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// import TransactionUpdate from '../components/transactions/TransactionUpdate';

// const Transactions = () => {
    
//     const Button = [
//         { label: 'اضافه', icon: <IoIosAddCircle className='text-yellow-700 w-6 h-6'/>, action: 'transaction' }
//     ];

//     const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

//     const handleOpenModal = (action) => {
//         if (action === 'transaction') setIsAddTransactionModalOpen(true);
//     };

//     // fetch
//     const [list, setList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [search, setSearch] = useState(''); 
//     const [sort, setSort] = useState('-createdAt');
//     const [paymentMethod, setPaymentMethod] = useState('all');
//     const [frequency, setFrequency] = useState(366);
//     const [type, setType] = useState('all');
//     const [shift, setShift] = useState('all');

//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         itemsPerPage: 10,
//         totalItems: 0,
//         totalPages: 1
//     });

//     const [isEditTransactionModal, setIsEditTransactionModal] = useState(false);
//     const [currentTransaction, setCurrentTransaction] = useState(null);


//     const fetchTransactions = useCallback(async () => {
//         setLoading(true);
//         try {

//             const response = await api.post('/api/transactions/get-transactions',
//                 // { sort }, { params: {search} }
//                 {
//                     paymentMethod,
//                     frequency,
//                     type,
//                     shift,
//                     search,
//                     sort,
//                     page: 1,
//                     limit: 1000
//                 }
//             );

//             if (response.data.success) {
//                 //setList(response.data.employees)
//                 setList(response.data.data || response.data.transactions || []);
//                 console.log(response.data.data)
              


//             } else {
//                 toast.error(response.data.message || 'Transactions is not found')
//             }

//         } catch (error) {
//             // Show backend error message if present in error.response
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message)
//             }
//             console.log(error)
//         } finally{
//             setLoading(false);
//         }

//     });

 
//     const isInitialMount = useRef(true);

//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//         } else {
//             fetchTransactions();
//         }
//     }, [paymentMethod, frequency, shift, type, search, sort]);

//      // Handle edit
//     const handleEdit = (transaction) => {
//         setCurrentTransaction(transaction);
//         setIsEditTransactionModal(true);
//     };


//     // Removing
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);    // for remove
//     const [selectedTransaction, setSelectedTransaction] = useState(null);   // for remove

//     const removeTransaction = async (id) => {

//         try {
//             const response = await api.post('/api/transactions/remove', { id },)
//             if (response.data.success) {
//                 toast.success('تم مسح الاجراء بنجاح')

//                 //Update the LIST after Remove
//                 await fetchTransactions();

//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };


//     // search - sorting - Debounce search to avoid too many API calls
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             fetchTransactions(search);
//         }, 500); // 500ms delay

//         return () => clearTimeout(timer);
//     }, [search, sort]);

    

//     // Percentage and count
//     const totalTransaction = list.length;

//     const totalIncomeTransactions = list.filter(
//         (transaction) => transaction.type === "Income"
//     );
//     const totalExpenseTransactions = list.filter(
//         (transaction) => transaction.type === "Expense"
//     );
//     const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
//     const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

//     // Total amount 
//     const totalTurnover = list.reduce((acc, transaction) => acc + transaction.amount, 0);
//     const totalIncomeTurnover = list.filter(transaction => transaction.type === 'Income').reduce((acc, transaction) => acc + transaction.amount, 0);
//     const totalExpenseTurnover = list.filter(transaction => transaction.type === 'Expense').reduce((acc, transaction) => acc + transaction.amount, 0);

//     const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
//     const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

//     const data = [
//         { name: 'ايرادات', value: totalIncomeTurnover, color: '#10b981' },
//         { name: 'مصروفات', value: totalExpenseTurnover, color: '#ef4444' }
//     ];



//     // Printing
//     const invoiceRef = useRef(null)
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML
//         const WinPrint = window.open("", "", "width=900, height=650")

//         WinPrint.document.write(` 
//                     <html>
//                         <head>
//                             <title>Transactions Management</title>
//                             <style>
//                                 body { font-family: Arial, sans-serif; padding: 20px; }
//                                 .receipt-container { width: 100%; }
//                                 h2 { text-align: center; }
//                                 table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                                 th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                
//                                 th { background-color: #f2f2f2; }
//                                 .IdTd {display: none ;}
//                                 .buttonTd {display: none ;}
//                                 .buttonTr {display: none ;}
//                                 .userTr {display: none ;}
//                                 .userTd {display: none ;}
//                                 .footTd {display: none ;}
//                                 .controls { display: none; }
//                                 .button { display: none; }
//                                 .backButton {display: none; }
//                                 .search {display : none; } 
                                
//                             </style>
//                         </head>
//                         <body>
//                             ${printContent}
//                         </body>
//                     </html>
//                 `)

//         WinPrint.document.close()
//         WinPrint.focus()
//         setTimeout(() => {
//             WinPrint.print()
//             WinPrint.close()
//         }, 1000)
//     };

//     return(
//         <section className ='flex gap-3 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-[#f5f5f5]'>
            
//             <div dir="rtl" className='flex-[1] bg-white px-2 py-3'>
//                 <div className="flex gap-2 items-center px-15 py-2 shadow-xl text-white">
//                     <select id='frequency' value={frequency} onChange={(e) => setFrequency(e.target.value)}
//                         className='border border-yellow-700 rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='1'>1 Day</option>
//                         <option value='7'> 7 Days</option>
//                         <option value='30'> 30 Days</option>
//                         <option value='90'> 90 Days</option>

//                     </select>
//                     <select id='type' value={type} onChange={(e) => setType(e.target.value)}
//                         className='border border-yellow-700 rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='all'>All</option>
//                         <option value='Income'>Income</option>
//                         <option value='Expense'>Expense</option>

//                     </select>
//                     <select id='shift' value={shift} onChange={(e) => setShift(e.target.value)}
//                         className='border border-yellow-700  rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='all'>All</option>
//                         <option value='Morning'>Morning</option>
//                         <option value='Evening'>Evening</option>
//                     </select>
//                     <select id='paymentMmethod' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
//                         className='border border-yellow-700  rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='all'>All</option>
//                         <option value='Cash'>Cash</option>
//                         <option value='Online'>Online</option>
//                         {/* <option value='Debit Card'>Debit Card</option>
//                         <option value='Bank Transfer'>Bank Transfer</option>
//                         <option value='Digital Wallet'>Digital Wallet</option>
//                         <option value='Check'>Check</option> */}
//                     </select>
//                 </div>

//                 <div className='flex flex-col items-start mt-2 shadow-xl'>

//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>عدد الاجراءات :</p>
//                     <div className='flex items-center justify-between w-full px-5'>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>ايرادات : </span>
//                             <p className='font-semibold text-md text-green-600 p-1'>
//                                 {totalIncomeTransactions.length}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> اجراء</span>
//                             </p>
//                         </div>
//                         {/* {totalExpenseTransactions.length} */}
//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>مصروفات : </span>
//                             <p className='font-semibold text-md text-[#be3e3f] p-1'>
//                                 {totalExpenseTransactions.length}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> اجراء</span>
//                             </p>
//                         </div>

//                     </div>
//                 </div>

//                 <div className='flex flex-col items-start mt-2 shadow-xl '>

//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>الاجماليات :-</p>
//                     <div className='flex flex-col gap-3 justify-between w-full px-5'>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>ايرادات : </span>
//                             <p className='font-semibold text-md text-green-600 p-1'>
//                                 {totalIncomeTurnover.toFixed(2)}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> ر.ع</span>
//                             </p>
//                         </div>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>مصروفات : </span>
//                             <p className='font-semibold text-md text-[#be3e3f] p-1'>
//                                 {totalExpenseTurnover.toFixed(2)}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> ر.ع</span>
//                             </p>
//                         </div>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>الصافي : </span>
//                             <p className='font-semibold text-md text-[#0ea5e9] p-1'>
//                                 {(totalIncomeTurnover-totalExpenseTurnover).toFixed(2)}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> ر.ع</span>
//                             </p>
//                         </div>

//                     </div>
//                 </div>





//                 <div className='flex flex-col items-start mt-5'>
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>تحليل بياني :-</p>

//                     <div className='w-full h-50'>
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={data}
//                                     cx="50%"
//                                     cy="50%"
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={5}
//                                     dataKey="value"
//                                 >
//                                     {data.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip
//                                     formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
//                                 />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>

//                     <div className='flex justify-between w-full mt-4 text-xs'>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-green-500 rounded-full mx-auto mb-1'></div>
//                             <div className ='font-normal text-xs'>ايرادات: ج.س {totalIncomeTurnover.toFixed(2)}</div>
//                             <div className='text-green-600 font-normal text-xs'>{totalIncomeTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-red-500 rounded-full mx-auto mb-1'></div>
//                             <div className ='font-normal text-xs'>مصروفات: ج.س {totalExpenseTurnover.toFixed(2)}</div>
//                             <div className='text-red-600 font-normal'>{totalExpenseTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                     </div>

//                 </div>

//             </div>



//             <div dir="rtl"  className ='flex-[3] bg-white h-[100vh] overflow-y-scroll scrollbar-hidden '>
//                 <div ref={invoiceRef} className=''>
                
//                 <div className='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                     <div className='flex items-center'>
//                             <div className='backButton flex items-center gap-2'>
//                                 <BackButton />
//                                 <h1 className='text-sm font-semibold text-[#1a1a1a] font-arabic'>الاداره الماليه</h1>
//                             </div>
                            
//                     </div>

//                         <div className='Button gap-2 flex items-center justify-between'>
//                             <div className='flex justify-end button  items-center cursor-pointer gap-3'>
//                                 <button
//                                     onClick={handlePrint}
//                                     className="bg-blue-500 cursor-pointer text-white px-3 py-2 rounded text-xs flex items-center gap-1"
//                                 >
//                                     <LuPrinterCheck className="w-4 h-4" />
//                                     طباعه
//                                 </button>
//                             </div>


//                             <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                                 {Button.map(({ label, icon, action }) => {
//                                     return (
//                                         <button
//                                             className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'

//                                             onClick={() => handleOpenModal(action)}
//                                         >
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}


//                             </div>
//                         </div>

//                     {isAddTransactionModalOpen && 
//                     <TransactionAdd 
//                     setIsAddTransactionModalOpen={setIsAddTransactionModalOpen} 
//                     fetchTransactions ={fetchTransactions}
                    
//                     />} 

//                 </div>
//                 {/* Search and sorting */}
//                 <div className="search flex gap-2 items-center px-15 py-2 shadow-xl bg-white text-[#1a1a1a]">
//                     <input
//                         type="text"
//                         placeholder="بحث ..."
//                         className="text-[#1a1a1a] border border-yellow-700 p-1 rounded-sm w-full text-xs font-semibold"
//                         // max-w-md
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />

//                     {/* Optional: Sort dropdown */}
//                     <select
//                         className="border  border-yellow-700 p-1 rounded-sm text-[#1a1a1a] text-xs font-normal cursor-pointer"
//                         value={sort}

//                         onChange={(e) => {
//                             setSort(e.target.value);
//                             setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                         }}
//                     >
//                         <option value="-createdAt">Newest First</option>
//                         <option value="createdAt">Oldest First</option>
//                         <option value="type">By type (A-Z)</option>
//                         <option value="-type">By type (Z-A)</option>
//                     </select>
//                 </div>

//                 {loading && (
//                     //animate-spin
//                         <div className="mt-4 flex gap-2 justify-center">
//                             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
//                             <span className="ml-2">تحميل...</span>
//                         </div>
//                 )}

//                 <div className='mt-5 bg-white py-1 px-10' >
//                     <div className='overflow-x-auto'>
//                         <table className='text-left w-full' >
//                             <thead>
//                                 <tr className ='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'> {/**bg-[#D2B48C] */}
//                                     <th className='p-1'></th>
//                                     <th className='p-1'></th>
//                                     <th className='p-1'></th>
//                                     <th className='p-1'></th>
                                    
//                                     <th className='p-1'>المبلغ</th>
//                                     <th className='p-1'>الحساب</th>
//                                     <th className='p-1'>المرجع</th>
//                                     <th className='p-1'></th>
//                                     <th className='p-1 userTr'>بواسطه</th>
                                
//                                     <th className='buttonTr p-1' style={{ marginRight: '0px' }}></th>
//                                 </tr>
//                             </thead>

//                             <tbody>

//                                 {list.length === 0
//                                     ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'> قائمه الاجراءات الماليه فارغه حاليا .</p>)
//                                     : list.map((transaction, index) => (

//                                         <tr
//                                              key ={index}
//                                             className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                             hover:bg-[#F1E8D9] cursor-pointer'
//                                         >
//                                             <td className='IdTd p-1' hidden>{transaction._id}</td>
//                                             <td className='p-1'>{transaction.date ? new Date(transaction.date).toLocaleDateString('en-GB') : ''}</td>
//                                             <td className='p-1'>{transaction.paymentMethod}</td>
//                                             <td className= {`${transaction.type === 'Expense' ? "bg-[#be3e3f]/50 text-white" 
//                                                 : "bg-green-600/80 text-white"}`}>
//                                                 {transaction.type}
//                                             </td>
                                           
//                                            <td className={`${transaction.shift === 'Morning' ? 'text-[#e6b100]' : 
//                                                 'text-[#0ea5e9]'
//                                             } p-1`}>{transaction.shift}<span className ='text-[#1a1a1a]'> shift</span></td>

//                                             <td className='p-1'>{transaction.amount.toFixed(2)}</td>
//                                             <td className='p-1'>{transaction.category}</td>
//                                             <td className='p-1'>{transaction.refrence}</td>
//                                             <td className={`${transaction.status === 'updated' ? 'text-emerald-600' : 'text-white'}`}>
//                                                 {transaction.status}</td>
//                                             {/* <td className='userTd p-1'>{transaction.user.name} / 
//                                                 <span className ='text-[#0ea5e9]'>  {transaction.user.role}</span>
//                                             </td> */}
                                        

//                                             <td className='buttonTd p-1  flex flex-wrap gap-2  justify-center' 
//                                                 style={{ marginRight: '0px' }}>
//                                                 <button className={`cursor-pointer text-sm font-semibold `}>
//                                                     <BiSolidEditAlt
//                                                         onClick={() => handleEdit(transaction)}
//                                                         className ='w-5 h-5 text-[#0ea5e9] 
//                                                         hover:bg-[#0ea5e9]/30 hover:rounded-full    
//                                                         ' />
//                                                 </button>

//                                                 <button className={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
//                                                     <MdDeleteForever
//                                                         onClick={() => { setSelectedTransaction(transaction); setDeleteModalOpen(true); }}
//                                                         className ='w-5 h-5 text-[#be3e3f] border-b border-[#be3e3f]
//                                                         hover:bg-[#be3e3f]/30 hover:rounded-full
//                                                         ' />
//                                                 </button>
//                                             </td>

//                                         </tr>
//                                     ))}
//                             </tbody>

//                             {/* Footer Section */}
//                             {list.length > 0 && (

                            
//                                     <tfoot className='bg-[#F1E8D9] border-t-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                         <tr>
//                                             <td className='p-2' colSpan={1}>{list.length} Process</td>
                                            
                                          
//                                             <td className='p-2' colSpan={3}>
//                                                مصروفات : {list.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)} 
//                                             </td>

                                            
//                                             <td className='p-2' colSpan={3}>
//                                                 ايرادات : {list.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)} 
//                                             </td>

                                           
                                          
//                                             {/* <td className='p-2' >Net Result :</td> */}
//                                             <td className='p-2' colSpan={3}>
//                                                 صافي : {(
//                                                     list.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0) -
//                                                     list.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0)
//                                                 ).toFixed(2)} ر.ع
//                                             </td>

//                                         </tr>
                                     
//                                     </tfoot>
//                             )}

//                         </table>

//                     </div>

                
//                     {/* Edit Employee Modal */}
//                     {isEditTransactionModal && currentTransaction && (
//                         <TransactionUpdate
//                             transaction ={currentTransaction}
//                             setIsEditTransactionModal ={setIsEditTransactionModal}
//                             fetchTransactions ={fetchTransactions}
//                         />
//                     )}


//                 </div>
//                 </div>
 
//             </div>
          
//             <ConfirmModal
//                 open={deleteModalOpen}
//                 Type={selectedTransaction?.type}
//                 Amount={selectedTransaction?.amount}

//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeTransaction(selectedTransaction._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />

//         </section>
//     );
// };



// // You can put this at the bottom of your Services.jsx file or in a separate file
// const ConfirmModal = ({ open, onClose, onConfirm, Type, Amount }) => {
//     if (!open) return null;
//     return (
//         <div
//             className="fixed inset-0 flex items-center justify-center z-50"
//             style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//         >

//             <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//                 {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//                 <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-[#0ea5e9]">{Type}</span>
//                 , Amount <span className ='text-md font-semibold text-[#be3e3f]'>{Amount.toFixed(2)} </span>
//                  <span className ='text-xs font-normal'>AED</span>?</p>
//                 <div className="flex justify-end gap-3">
//                     <button
//                         className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         className="px-4 py-2 rounded bg-[#be3e3f] text-white  cursor-pointer"
//                         onClick={onConfirm}
//                     >
//                         Delete
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// };


// export default Transactions
