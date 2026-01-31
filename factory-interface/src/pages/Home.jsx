import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import BottomNav from '../components/shared/BottomNav';
import Greetings from '../components/home/Greetings';
import ErpMenu from '../components/home/ErpMenu';
import MiniCard from '../components/home/MiniCard';
import HomeInvoicesList from '../components/home/HomeInvoiceList';
import { api } from '../https';
import { 
  IoStatsChartSharp,
  IoCashOutline,
  IoReceiptOutline
} from "react-icons/io5";
import { 
  FaFileInvoice,
  FaChartLine,
  FaMoneyBillWave,
  FaIndustry,
  FaExchangeAlt
} from "react-icons/fa";
import { 
  BsCashCoin,
  BsGraphUp,
  BsArrowUpRight,
  BsArrowDownRight
} from 'react-icons/bs';

const Home = () => {
    // State management
    const [sale, setSale] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [production, setProduction] = useState([]);
    const [incomeList, setIncomeList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    
    // Common state
    const [frequency, setFrequency] = useState('1');
    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('all');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [paymentMethod, setPaymentMethod] = useState('all');
    const [incomeType, setIncomeType] = useState('Income');
    const [expenseType, setExpenseType] = useState('Expense');

    // Loading states
    const [loading, setLoading] = useState({
        sale: false,
        purchase: false,
        production: false,
        income: false,
        expense: false
    });

    // Fetch functions
    const fetchSale = async () => {
        setLoading(prev => ({ ...prev, sale: true }));
        try {
            const response = await api.post('/api/invoice/fetch', {
                type,
                frequency,
                invoiceType: 'Sale invoice',
                invoiceStatus,
                customer,
                supplier,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setSale(response.data.data || []);
            } else {
                toast.error(response.data.message || 'لم يتم العثور على فواتير المبيعات');
            }
        } catch (error) {
            console.error(error);
            toast.error('فشل في جلب بيانات المبيعات');
        } finally {
            setLoading(prev => ({ ...prev, sale: false }));
        }
    };

    const fetchPurchase = async () => {
        setLoading(prev => ({ ...prev, purchase: true }));
        try {
            const response = await api.post('/api/invoice/fetch', {
                type,
                frequency,
                invoiceType: 'Purchase invoice',
                invoiceStatus,
                customer,
                supplier,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setPurchase(response.data.data || []);
            } else {
                toast.error(response.data.message || 'لم يتم العثور على فواتير المشتريات');
            }
        } catch (error) {
            console.error(error);
            toast.error('فشل في جلب بيانات المشتريات');
        } finally {
            setLoading(prev => ({ ...prev, purchase: false }));
        }
    };

    const fetchProduction = async () => {
        setLoading(prev => ({ ...prev, production: true }));
        try {
            const response = await api.post('/api/invoice/fetch', {
                type: 'production',
                frequency,
                invoiceType: 'Production invoice',
                invoiceStatus,
                customer,
                supplier,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setProduction(response.data.data || []);
            } else {
                toast.error(response.data.message || 'لم يتم العثور على فواتير الإنتاج');
            }
        } catch (error) {
            console.error(error);
            toast.error('فشل في جلب بيانات الإنتاج');
        } finally {
            setLoading(prev => ({ ...prev, production: false }));
        }
    };

    const fetchIncome = async () => {
        setLoading(prev => ({ ...prev, income: true }));
        try {
            const response = await api.post('/api/transactions/get-transactions', {
                paymentMethod,
                frequency,
                type: incomeType,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setIncomeList(response.data.data || response.data.transactions || []);
            } else {
                toast.error(response.data.message || 'لم يتم العثور على الإيرادات');
            }
        } catch (error) {
            console.error(error);
            toast.error('فشل في جلب بيانات الإيرادات');
        } finally {
            setLoading(prev => ({ ...prev, income: false }));
        }
    };

    const fetchExpense = async () => {
        setLoading(prev => ({ ...prev, expense: true }));
        try {
            const response = await api.post('/api/transactions/get-transactions', {
                paymentMethod,
                frequency,
                type: expenseType,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setExpenseList(response.data.data || response.data.transactions || []);
            } else {
                toast.error(response.data.message || 'لم يتم العثور على المصروفات');
            }
        } catch (error) {
            console.error(error);
            toast.error('فشل في جلب بيانات المصروفات');
        } finally {
            setLoading(prev => ({ ...prev, expense: false }));
        }
    };

    // Calculate totals
    const saleTotal = sale.reduce((acc, invoice) => acc + (invoice.bills?.totalWithTax || 0), 0);
    const purchaseTotal = purchase.reduce((acc, invoice) => acc + (invoice.bills?.totalWithTax || 0), 0);
    const productionTotal = production.reduce((acc, invoice) => acc + (invoice.bills?.total || 0), 0);
    const incomeTotal = incomeList.reduce((acc, income) => acc + (income.amount || 0), 0);
    const expenseTotal = expenseList.reduce((acc, expense) => acc + (expense.amount || 0), 0);
    const netProfit = incomeTotal - expenseTotal;

    useEffect(() => {
        fetchSale();
        fetchPurchase();
        fetchProduction();
        fetchIncome();
        fetchExpense();
    }, [frequency, shift, invoiceType, invoiceStatus, search, sort, paymentMethod, incomeType, expenseType]);

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-800">
            {/* Main Content */}
            <div className="container mx-auto px-3 sm:px-4 md:px-2 lg:px-2 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    
                    {/* Left Column - Main Dashboard (3/5 on desktop) */}
                    <div className="lg:flex-3 flex flex-col gap-4 sm:gap-6">
                        
                        {/* Greetings Section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-blue-100"
                        >
                            <Greetings />
                        </motion.div>

                        {/* ERP Menu Section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaChartLine className="h-5 w-5 text-blue-600" />
                                    لوحة التحكم الرئيسية
                                </h2>
                            </div>
                            <ErpMenu />
                        </motion.div>

                        {/* Financial Overview Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100"
                        >
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <BsGraphUp className="h-5 w-5 text-blue-600" />
                                    النظرة العامة المالية
                                </h2>
                                <p className="text-sm text-gray-600">الإحصائيات المالية الحالية</p>
                            </div>

                            {/* Sales & Purchases Section */}
                            <div className="mb-8 w-full">
                                <div className='flex flex-col  gap-1 mt-2 px-2 bg-white mt-3'>

                                    <div className='flex items-center w-full gap-3 px-2 '>
                                        <MiniCard title='مبيعات' icon={<BsCashCoin className='w-4 h-4 text-white' />}
                                            number={sale.reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0).toFixed(2)} />

                                        <MiniCard title='مشتروات' icon={<FaFileInvoice className='w-4 h-4 text-white' />}
                                            number={purchase.reduce((acc, invo) => acc + invo.bills.totalWithTax, 0).toFixed(2)} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 mt-2 px-3 bg-white mt-3'>
                                    <div className='flex items-center w-full gap-3 px-2 '>
                                        <MiniCard title='ايرادات' icon={<IoStatsChartSharp className='w-4 h-4 text-white' />}
                                            number={incomeList.reduce((acc, income) => acc + income.amount, 0).toFixed(2)} />

                                        <MiniCard title='مصروفات' icon={<IoStatsChartSharp className='w-4 h-4 text-white' />}
                                            number={expenseList.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)} />
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1 mt-2 px-3 bg-white mt-3'>

                                    <div className='flex items-center w-full gap-3 px-2'>

                                        <MiniCard title='انتاج' icon={<FaFileInvoice className='w-6 h-6 text-white' />}
                                            number={production.reduce((acc, invo) => acc + invo.bills.total, 0).toFixed(2)} />
                                    </div>
                                </div>
                            </div>

                            {/* Production Section */}
                           
                            {/* Financial Summary */}
                            <div className="mt-8 pt-6 border-t border-blue-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">صافي الربح</p>
                                        <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ج.س {Math.abs(netProfit).toFixed(2)}
                                        </p>
                                        <div className="mt-2 flex items-center justify-center gap-1">
                                            {netProfit >= 0 ? (
                                                <BsArrowUpRight className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <BsArrowDownRight className="h-3 w-3 text-red-500" />
                                            )}
                                            <span className={`text-xs ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {netProfit >= 0 ? 'ربح' : 'خسارة'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">إجمالي المعاملات</p>
                                        <p className="text-lg font-bold text-blue-700">
                                            {sale.length + purchase.length + production.length}
                                        </p>
                                        <div className="mt-2 flex items-center justify-center gap-1">
                                            <IoCashOutline className="h-3 w-3 text-blue-500" />
                                            <span className="text-xs text-blue-600">معاملة</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Recent Sales Sidebar (2/5 on desktop) */}
                    <div className="lg:flex-2">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 h-full border border-blue-100"
                        >
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <BsCashCoin className="h-5 w-5 text-blue-600" />
                                    المبيعات الأخيرة
                                </h2>
                                <p className="text-sm text-gray-600">آخر عمليات البيع اليومية</p>
                            </div>
                            <div className="h-[calc(100%-5rem)]">
                                <HomeInvoicesList />
                            </div>
                            <div className="mt-6 pt-4 border-t border-blue-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">عرض المبيعات الحديثة</span>
                                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                        عرض الكل
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Home;


// import React, {useState, useEffect} from 'react'
// import BottomNav from '../components/shared/BottomNav';
// import Greetings from '../components/home/Greetings';
// import ErpMenu from '../components/home/ErpMenu';

// import { api } from '../https';

// import { IoStatsChartSharp } from "react-icons/io5";
// import MiniCard from '../components/home/MiniCard';
// import { FaFileInvoice } from "react-icons/fa";
// import { BsCashCoin } from 'react-icons/bs'
// import HomeInvoicesList from '../components/home/HomeInvoiceList';
// // stone-500  slate-500  [#D2B48C] bg-[#D2B48C]

// const Home = () => {
 
//     // stores and invoices frequency
//     const [frequency, setFrequency] = useState('1');

//     // invoices
//     const [sale, setSale] = useState([]);
//     const [purchase, setPurchase] = useState([]);
//     const [production, setProduction] = useState([]);

//     const [type, setType] = useState('bills');
//     const [invoiceType, setInvoiceType] = useState('all');
//     const [invoiceStatus, setInvoiceStatus] = useState('all');
//     const [customer, setCustomer] = useState('all');
//     const [supplier, setSupplier] = useState('all');
//     const [shift, setShift] = useState('all');

//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');


//     const [incomeList, setIncomeList] = useState([]);
//     const [expenseList, setExpenseList] = useState([]);
//     const [paymentMethod, setPaymentMethod] = useState('all');
//     const [incomeType, setIncomeType] = useState('Income');
//     const [expenseType, setExpenseType] = useState('Expense');
    

//     const fetchSale = async () => {
//         try {
//             const response = await api.post('/api/invoice/fetch' , 
//              {
//                     type,
//                     frequency,
//                     invoiceType:'Sale invoice',
//                     invoiceStatus,
//                     customer,
//                     supplier,
//                     shift,

//                     search,
//                     sort,
                    
//                     page: 1,
//                     limit: 1000
//                 },
//             );

//             setSale(response.data)
//             console.log(response.data)

//             if (response.data.success) {
//                 setSale(response.data.data || []);

//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }


//         } catch (error) {
//             console.log(error)
//         }
//     };

//     const fetchPurchase = async () => {
//         try {
//             const response = await api.post('/api/invoice/fetch',
//                 {
//                     type,
//                     frequency,
//                     invoiceType:'Purchase invoice',
//                     invoiceStatus,
//                     customer,
//                     supplier,
//                     shift,

//                     search,
//                     sort,

//                     page: 1,
//                     limit: 1000
//                 },
//             );

//             setPurchase(response.data)
//             console.log(response.data)

//             if (response.data.success) {
//                 setPurchase(response.data.data || []);

//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     };

//     const fetchProduction = async () => {
//         try {
//             const response = await api.post('/api/invoice/fetch',
//                 {
//                     type: 'production',
//                     frequency,
//                     invoiceType: 'Production invoice',
//                     invoiceStatus,
//                     customer,
//                     supplier,
//                     shift,

//                     search,
//                     sort,

//                     page: 1,
//                     limit: 1000
//                 },
//             );

//             setProduction(response.data)
//             console.log(response.data)

//             if (response.data.success) {
//                 setProduction(response.data.data || []);

//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     };

       
//     const fetchIncome = async () => {
//         try {
//             const response = await api.post('/api/transactions/get-transactions',
//                 {
//                     paymentMethod,
//                     frequency,
//                     type: incomeType,
//                     shift,
//                     search,
//                     sort,
//                     page: 1,
//                     limit: 1000
//                 },
//             );

//             setIncomeList(response.data.data || response.data.transactions || []);
//             // console.log(response.data.data)

//             if (response.data.success) {
//                 setIncomeList(response.data.data || response.data.transactions || []);

//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     };

//     const fetchExpense = async () => {
//         try {
//             const response = await api.post('/api/transactions/get-transactions',
//                 {
//                     paymentMethod,
//                     frequency,
//                     type: expenseType,
//                     shift,
//                     search,
//                     sort,
//                     page: 1,
//                     limit: 1000
//                 },
//             );

//             setExpenseList(response.data.data || response.data.transactions || []);
        

//             if (response.data.success) {
//                 setExpenseList(response.data.data || response.data.transactions || []);

//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     };


//     useEffect(() => {
//         fetchSale(), fetchPurchase(), fetchProduction(), fetchIncome(), fetchExpense()
//     }, [frequency,  shift, invoiceType,  invoiceStatus, shift, search, sort, paymentMethod, incomeType, expenseType]);

//     return (
//         <section dir='rtl' className='bg-[#f5f5f5] h-[calc(100vh-5rem)] overflow-hidden flex gap-3'>

//             <div className='flex-[3]  bg-white'>

//                 <div className='bg-white mt-0 bg-white'>
//                     <Greetings />
//                 </div>

//                 <div className='mt-1 px-5 py-2 flex justify-between flex-wrap shadow-xl bg-[#f5f5f5]'>
//                     <ErpMenu />
//                 </div>


//                 <div className ='flex flex-col gap-1 mt-2 px-10 bg-white mt-3'>
                  
//                     <div className='flex items-center w-full gap-3 px-8 '>
//                         <MiniCard title='مبيعات' icon ={<BsCashCoin className='w-4 h-4 text-white' />} 
//                         number ={sale.reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0).toFixed(2)} />
                      
//                         <MiniCard title='مشتروات' icon ={<FaFileInvoice className='w-4 h-4 text-white' />} 
//                         number ={purchase.reduce((acc, invo) => acc + invo.bills.totalWithTax, 0).toFixed(2)} />
//                     </div>
//                 </div>
//                 <div className='flex flex-col gap-1 mt-2 px-10 bg-white mt-3'>

//                     <div className='flex items-center w-full gap-3 px-8 '>
//                         <MiniCard title='ايرادات' icon={<IoStatsChartSharp className='w-4 h-4 text-white' />}
//                             number={incomeList.reduce((acc, income) => acc + income.amount, 0).toFixed(2)} />

//                         <MiniCard title='مصروفات' icon={<IoStatsChartSharp className='w-4 h-4 text-white' />}
//                             number={expenseList.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)} />
//                     </div>
//                 </div>

//                 <div className='flex flex-col gap-1 mt-2 px-10 bg-white mt-3'>
                 
//                     <div className='flex items-center w-full gap-3 px-8'>
                      
//                         <MiniCard title='انتاج' icon={<FaFileInvoice className='w-6 h-6 text-white' />} 
//                         number={production.reduce((acc, invo) => acc + invo.bills.total, 0).toFixed(2)} />
//                     </div>
//                 </div>

//             </div>

//             <div className='flex-[2] bg-white'>

//                 <div className='flex flex-col gap-5'>
//                     <HomeInvoicesList />
//                 </div> 


//             </div>

//             <BottomNav />

//         </section>
//     );
// };

// export default Home;