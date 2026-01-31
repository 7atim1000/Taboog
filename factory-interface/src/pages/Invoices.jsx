import React, { useState, useEffect, useRef, useCallback } from 'react'
import BackButton from '../components/shared/BackButton';
import { LuPrinterCheck } from "react-icons/lu";
import { FaSearch, FaFilter, FaChartPie, FaMoneyBillWave, FaReceipt } from "react-icons/fa";
import { api } from '../https';
import { toast } from 'react-toastify'
import InvoiceDetails from '../components/invoice/InvoiceDetails';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Invoices = () => {
    const [allInvoices, setAllInvoices] = useState([]);
    const [frequency, setFrequency] = useState('365');
    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('all');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
  
    // fetch Invoices
    const fetchInvoices = useCallback(async () => {
        setLoading(true)
        try {
            const response = await api.post('/api/invoice/fetch', {
                type,
                frequency,
                invoiceType,
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
                setAllInvoices(response.data.data || []);
            } else {
                toast.error(response.data.message || 'Invoices not found')
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
    }, [type, frequency, invoiceType, invoiceStatus, customer, supplier, shift, search, sort]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    // Statistics Calculations
    const totalInvoices = allInvoices.length;  
    const totalSaleInvoices = allInvoices.filter(
        (invoice) => invoice.invoiceType === "Sale invoice"
    );
    const totalBuyInvoices = allInvoices.filter(
        (invoice) => invoice.invoiceType  === "Purchase invoice"
    );
    
    const totalSalePercent = (totalSaleInvoices.length / totalInvoices) * 100;
    const totalBuyPercent = (totalBuyInvoices.length / totalInvoices) * 100;
    
    // Total amounts
    const totalTurnover = allInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice')
        .reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice')
        .reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalSaleTaxTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice')
        .reduce((acc, invoice) => acc + invoice.bills.tax, 0);
    const totalWithTaxBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice')
        .reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);
    const totalWithTaxSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice')
        .reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);
    
    const totalSaleTurnoverPercent = totalTurnover > 0 ? (totalSaleTurnover / totalTurnover) * 100 : 0;
    const totalBuyTurnoverPercent = totalTurnover > 0 ? (totalBuyTurnover / totalTurnover) * 100 : 0;
    
    const netProfit = totalWithTaxSaleTurnover - totalWithTaxBuyTurnover;

    const data = [
        { name: 'مبيعات', value: totalSaleTurnover, color: '#10b981' },
        { name: 'مشتروات', value: totalBuyTurnover, color: '#0ea5e9' }
    ];

    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>إدارة المبيعات والمشتروات</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Arial, sans-serif; 
                            padding: 20px; 
                            direction: rtl;
                        }
                        .receipt-container { width: 100%; }
                        h2 { 
                            text-align: center; 
                            color: #1e40af;
                            margin-bottom: 20px;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                        }
                        th, td { 
                            border: 1px solid #d1d5db; 
                            padding: 10px; 
                            text-align: right;
                            font-size: 12px;
                        }
                        th { 
                            background-color: #f3f4f6; 
                            color: #374151;
                            font-weight: 600;
                        }
                        .no-print { display: none !important; }
                        .stats-container {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 15px;
                            margin-bottom: 20px;
                        }
                        .stat-card {
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 8px;
                            padding: 15px;
                            text-align: center;
                        }
                        .stat-title {
                            color: #64748b;
                            font-size: 12px;
                            margin-bottom: 5px;
                        }
                        .stat-value {
                            color: #1e293b;
                            font-size: 18px;
                            font-weight: 600;
                        }
                    </style>
                </head>
                <body>
                    <h2>تقرير الفواتير - إدارة المبيعات والمشتروات</h2>
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
        <section dir='rtl' className='min-h-screen bg-gradient-to-br from-blue-50 to-white p-3 md:p-4 lg:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <FaReceipt className='text-white w-5 h-5' />
                                </div>
                                <div>
                                    <h1 className='text-lg md:text-xl font-bold'>إدارة المبيعات والمشتروات</h1>
                                    <p className='text-blue-100 text-sm'>عرض وتتبع جميع الفواتير</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <button
                                onClick={handlePrint}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition duration-200 cursor-pointer"
                            >
                                <LuPrinterCheck className="w-4 h-4" />
                                طباعة التقرير
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                    {/* Left Column - Invoices List */}
                    <div className='lg:col-span-3'>
                        {/* Search and Filters */}
                        <div ref={invoiceRef} className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 mb-6'>
                            <div className='flex flex-col md:flex-row gap-4 mb-4'>
                                <div className='relative flex-1'>
                                    <div className='absolute right-3 top-3 text-blue-400'>
                                        <FaSearch className='w-5 h-5' />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="بحث في الفواتير..."
                                        className="w-full border border-blue-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                
                                <div className='flex gap-3'>
                                    <select
                                        className='border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[150px]'
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                    >
                                        <option value='-createdAt'>الأحدث أولاً</option>
                                        <option value='createdAt'>الأقدم أولاً</option>
                                        <option value='bills.total'>حسب المبلغ (صغير-كبير)</option>
                                        <option value='-bills.total'>حسب المبلغ (كبير-صغير)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
                                <div>
                                    <label className='block text-xs text-gray-600 mb-1'>الفترة</label>
                                    <select 
                                        value={frequency} 
                                        onChange={(e) => setFrequency(e.target.value)}
                                        className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                    >
                                        <option value='90'>90 يوم</option>
                                        <option value='60'>60 يوم</option>
                                        <option value='30'>30 يوم</option>
                                        <option value='7'>7 أيام</option>
                                        <option value='1'>يوم واحد</option>
                                        <option value='365'>جميع الأيام</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className='block text-xs text-gray-600 mb-1'>الحالة</label>
                                    <select 
                                        value={invoiceStatus} 
                                        onChange={(e) => setInvoiceStatus(e.target.value)}
                                        className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                    >
                                        <option value='all'>جميع الحالات</option>
                                        <option value='In Progress'>قيد التنفيذ</option>
                                        <option value='Completed'>مكتمل</option>
                                        <option value='Cancelled'>ملغى</option>
                                        <option value='Pending'>معلق</option>
                                    </select>
                                </div>
                                
                                <div>
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
                                
                                <div>
                                    <label className='block text-xs text-gray-600 mb-1'>النوع</label>
                                    <select 
                                        value={invoiceType} 
                                        onChange={(e) => setInvoiceType(e.target.value)}
                                        className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                    >
                                        <option value='all'>جميع الفواتير</option>
                                        <option value='Sale invoice'>فواتير المبيعات</option>
                                        <option value='Purchase invoice'>فواتير المشتريات</option>
                                        <option value='Production invoice'>فواتير الإنتاج</option>
                                    </select>
                                </div>
                            </div>

                            {/* Loading Indicator */}
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <span className="mr-2 text-blue-600">جاري تحميل الفواتير...</span>
                                </div>
                            ) : (
                                /* Invoices Table */
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-blue-50'>
                                            <tr className='text-right'>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>التاريخ</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>النوع</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الوردية</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الأصناف</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>العميل/المورد</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الإجمالي</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الضريبة</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الإجمالي الكلي</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>المدفوع</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الرصيد</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الحالة</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody className='divide-y divide-gray-100'>
                                            {allInvoices.length === 0 ? (
                                                <tr>
                                                    <td colSpan="11" className="py-12 text-center">
                                                        <div className="text-gray-400">
                                                            <FaReceipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                            <p className="text-gray-500 text-lg mb-2">لا توجد فواتير</p>
                                                            <p className="text-gray-400 text-sm">
                                                                {search 
                                                                    ? `لا توجد فواتير تطابق "${search}"`
                                                                    : 'لم يتم العثور على فواتير'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                allInvoices.map((invoice) => (
                                                    <InvoiceDetails  
                                                        key={invoice._id}
                                                        fetchInvoices={fetchInvoices}
                                                        id={invoice._id}
                                                        date={invoice.date}
                                                        type={invoice.invoiceType}
                                                        shift={invoice.shift}
                                                        length={invoice.items?.length || 0}
                                                        customer={invoice.customerName || 'N/A'}
                                                        supplier={invoice.supplierName || 'N/A'}
                                                        payment={invoice.paymentMethod}
                                                        total={invoice.bills.total}
                                                        tax={invoice.bills.tax}
                                                        totalWithTax={invoice.bills.totalWithTax}
                                                        payed={invoice.bills.payed}
                                                        balance={invoice.bills.balance}
                                                        status={invoice.invoiceStatus}
                                                        items={invoice.items}
                                                    />
                                                ))
                                            )}
                                        </tbody>
                                        
                                        {allInvoices.length > 0 && (
                                            <tfoot className='bg-blue-50 border-t border-blue-100'>
                                                <tr>
                                                    <td colSpan="5" className="py-3 px-4 text-sm font-semibold text-blue-800">
                                                        إجمالي {allInvoices.length} فاتورة
                                                    </td>
                                                    <td colSpan="6" className="py-3 px-4">
                                                        <div className='flex justify-between items-center'>
                                                            <div className='text-sm'>
                                                                <span className='text-green-600 font-medium'>
                                                                    المبيعات: {totalWithTaxSaleTurnover.toFixed(2)} ر.ع
                                                                </span>
                                                                <span className='mx-2'>|</span>
                                                                <span className='text-blue-600 font-medium'>
                                                                    المشتريات: {totalWithTaxBuyTurnover.toFixed(2)} ر.ع
                                                                </span>
                                                            </div>
                                                            <div className={`text-sm font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                الربح المتوقع: {netProfit.toFixed(2)} ر.ع
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Statistics */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Summary Cards */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <FaChartPie className='text-blue-600 w-5 h-5' />
                                <h3 className='text-sm font-semibold text-blue-800'>ملخص الفواتير</h3>
                            </div>
                            
                            <div className='grid grid-cols-2 gap-3 mb-4'>
                                <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                                    <p className='text-xs text-blue-600 mb-1'>فواتير المبيعات</p>
                                    <p className='text-xl font-bold text-green-600'>{totalSaleInvoices.length}</p>
                                    <p className='text-xs text-gray-500'>{totalSalePercent.toFixed(1)}%</p>
                                </div>
                                
                                <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                                    <p className='text-xs text-blue-600 mb-1'>فواتير المشتريات</p>
                                    <p className='text-xl font-bold text-blue-600'>{totalBuyInvoices.length}</p>
                                    <p className='text-xs text-gray-500'>{totalBuyPercent.toFixed(1)}%</p>
                                </div>
                            </div>
                            
                            <div className='bg-blue-50 rounded-lg p-3 border border-blue-100 mb-3'>
                                <p className='text-xs text-blue-600 mb-1'>إجمالي الفواتير</p>
                                <p className='text-2xl font-bold text-blue-800'>{totalInvoices}</p>
                                <p className='text-xs text-gray-500'>فاتورة</p>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <FaMoneyBillWave className='text-blue-600 w-5 h-5' />
                                <h3 className='text-sm font-semibold text-blue-800'>ملاحي مالي</h3>
                            </div>
                            
                            <div className='space-y-3'>
                                <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                                    <span className='text-sm text-gray-600'>ضريبة المبيعات</span>
                                    <span className='text-sm font-medium text-red-600'>{totalSaleTaxTurnover.toFixed(2)} ر.ع</span>
                                </div>
                                
                                <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                                    <span className='text-sm text-gray-600'>إجمالي المبيعات</span>
                                    <span className='text-sm font-medium text-green-600'>{totalSaleTurnover.toFixed(2)} ر.ع</span>
                                </div>
                                
                                <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                                    <span className='text-sm text-gray-600'>إجمالي المشتريات</span>
                                    <span className='text-sm font-medium text-blue-600'>{totalBuyTurnover.toFixed(2)} ر.ع</span>
                                </div>
                                
                                <div className='pt-2'>
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className='text-sm font-semibold text-gray-700'>الربح المتوقع</span>
                                        <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {netProfit.toFixed(2)} ر.ع
                                        </span>
                                    </div>
                                    <p className='text-xs text-gray-500 text-left'>
                                        {netProfit >= 0 ? 'أرباح' : 'خسائر'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <FaChartPie className='text-blue-600 w-5 h-5' />
                                <h3 className='text-sm font-semibold text-blue-800'>التوزيع النسبي</h3>
                            </div>
                            
                            <div className='h-48'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
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
                            
                            <div className='grid grid-cols-2 gap-2 mt-4'>
                                <div className='text-center'>
                                    <div className='w-3 h-3 bg-green-500 rounded-full mx-auto mb-1'></div>
                                    <div className='text-xs text-gray-600'>مبيعات</div>
                                    <div className='text-sm font-semibold text-green-600'>{totalSaleTurnoverPercent.toFixed(1)}%</div>
                                </div>
                                <div className='text-center'>
                                    <div className='w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1'></div>
                                    <div className='text-xs text-gray-600'>مشتريات</div>
                                    <div className='text-sm font-semibold text-blue-600'>{totalBuyTurnoverPercent.toFixed(1)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Invoices;

// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import BackButton from '../components/shared/BackButton';

// import { LuPrinterCheck } from "react-icons/lu";

// import { api } from '../https';
// import { toast } from 'react-toastify'

// import InvoiceDetails from '../components/invoice/InvoiceDetails';
   
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// const Invoices = () => {

//     const [allInvoices, setAllInvoices] = useState([]);

//     const [frequency, setFrequency] = useState('365');
//     const [type, setType] = useState('bills');
//     const [invoiceType, setInvoiceType] = useState('all');
//     const [invoiceStatus, setInvoiceStatus] = useState('all');
//     const [customer, setCustomer] = useState('all');
//     const [supplier, setSupplier] = useState('all');
//     const [shift, setShift] = useState('all');

//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');
//     const [loading, setLoading] = useState(false);
  
//     // fetch Invoices
//     const fetchInvoices = useCallback(async () => {
//         setLoading(true)
//             try {
//             const response = await api.post('/api/invoice/fetch' , 
//             {
//                     type,
//                     frequency,
//                     invoiceType,
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
                
//                 // setAllInvoices(response.data)
//                 // console.log(response.data)

//             if (response.data.success) {
//                 setAllInvoices(response.data.data || []);
              
//             } else {
//                 toast.error(response.data.message || 'invoices not found')
//             }
    
//         } catch (error) {
//             // Show backend error message if present in error.response
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message)
//             }
//             console.log(error)
//         } finally {
//             setLoading(false);
//          }
//     });

//     const isInitialMount = useRef(true);
//     useEffect(() => {
//        //if (isInitialMount.current) {
//         //    isInitialMount.current = false;
//         //} else {
//             fetchInvoices();
//         //}
//     }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]);

//     // Percentage and count
//     const totalInvoices = allInvoices.length;  

//     const totalSaleInvoices = allInvoices.filter(
//         (invoice) => invoice.invoiceType === "Sale invoice"
//     );
//     const totalBuyInvoices = allInvoices.filter(
//         (invoice) => invoice.invoiceType  === "Purchase invoice" //&& invoice.invoiceStatus === "Completed" 
//     );
//     const totalIncomePercent = (totalSaleInvoices.length / totalInvoices) * 100 ;
//     const totalExpensePercent = (totalBuyInvoices.length / totalInvoices) * 100 ;
//     // Total amount 
//     const totalTurnover = allInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0) ;
//     const totalSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.total, 0);
    
//     const totalBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice').reduce((acc, invoice) => acc + invoice.bills.total, 0);
//     const totalSaleTaxTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.tax, 0);
    
//     const totalWithTaxBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);
//     const totalWithTaxSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);

//     // Percentage
//     const totalSaleTurnoverPercent = (totalSaleTurnover / totalTurnover) * 100 ;
//     const totalBuyTurnoverPercent = (totalBuyTurnover / totalTurnover) * 100 ;

//     const data = [
//         { name: 'مبيعات', value: totalSaleTurnover, color: '#10b981' },
//         { name: 'مشتروات', value: totalBuyTurnover, color: '#0ea5e9' }
//     ];

//     // Printing
//     const invoiceRef = useRef(null)
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML
//         const WinPrint = window.open("", "", "width=900, height=650")

//         WinPrint.document.write(` 
//                 <html>
//                     <head>
//                         <title>اداره المبيعات والمشتروات</title>
//                         <style>
//                             body { font-family: Arial, sans-serif; padding: 20px; }
//                             .receipt-container { width: 100%; }
//                             h2 { text-align: center; }
//                             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                             th { background-color: #f2f2f2; }
//                             .IdTd {display: none ;}
//                             .updateTd {display: none ;}
//                             .statusTr {display: none ;}
//                             .controls { display: none; }
//                             .button { display: none; }
//                             .backButton {display: none; }
//                             .search {display : none; } 
//                             .tdFooter {display : none; } 
//                         </style>
//                     </head>
//                     <body>
//                         ${printContent}
//                     </body>
//                 </html>
//             `)

//         WinPrint.document.close()
//         WinPrint.focus()
//         setTimeout(() => {
//             WinPrint.print()
//             WinPrint.close()
//         }, 1000)
//     };

//     return (
//         <section dir ='rtl' className ='flex gap-3 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-[#f5f5f5]'>
            
//             <div className ='flex-[3] bg-white h-[100vh] overflow-y-scroll scrollbar-hidden'>
//                 <div ref={invoiceRef} className=''>
                
              
//                 <div className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                     <div className='backButton flex items-center gap-2'>
//                         <BackButton />
//                         <h1 className='text-xs font-semibold text-[#1a1a1a]'>اداره المبيعات والمشتروات</h1>
//                     </div>
//                     <div className='flex justify-end button  items-center cursor-pointer gap-3'>
//                             <button
//                                 onClick={handlePrint}
//                                 className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                             >
//                                 <LuPrinterCheck className="w-4 h-4" />
//                                 طباعه
//                             </button>
//                     </div>
//                 </div>

          
//                 {/* Search and sorting and Loading */}
//                 <div className="search flex items-center px-15 py-2 shadow-xl gap-3 ">
//                     <input
//                         type="text"
//                         placeholder="بحث ..."
//                         className="border border-yellow-700 p-1 rounded-lg w-full text-xs font-semibold"
//                         // max-w-md
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                     {/* Optional: Sort dropdown */}
//                     <select
//                         className="ml-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
//                         value={sort}

//                         onChange={(e) => {
//                             setSort(e.target.value);
//                             setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                         }}
//                     >
//                         <option value="-createdAt">Newest First</option>
//                         <option value="createdAt">Oldest First</option>
//                     </select>
//                 </div>

//                 {/* Loading Indicator */}
//                 {loading && (
//                     <div className="mt-4 flex justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                         <span className="ml-2">تحميل ...</span>
//                     </div>
//                 )}


//                 <div className ='mt-5 bg-white py-1 px-10'>

//                     <div className='overflow-x-auto'>
//                         <table className='text-left w-full'>
//                             <thead className=''>
//                                 <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                     <th className='p-1'></th>
//                                     <th className='p-1 hide-print'></th>
//                                     <th className='p-1 ml-0'></th>
//                                     <th className='p-1'>الاصناف</th>
                                    
//                                     <th className='p-1'>العميل</th>
//                                     <th className='p-1'>المورد</th>
                                  
//                                     <th className='p-1'>الاجمالي</th>
//                                     <th className='p-1'>الضريبه</th>
//                                     <th className='p-1'>الاجمالي الكلي</th>
//                                     <th className='p-1'>المدفوع</th>
//                                     <th className='p-1'>الرصيد</th>
//                                     <th className='p-1 statusTr'>الحاله</th>
                                
//                                 </tr>
//                             </thead>

                                 
//                                 <tbody>
//                                     { 
//                                     allInvoices.map((invoice) =>{  
                                    
//                                     return (   
//                                     <InvoiceDetails  
//                                     fetchInvoices ={fetchInvoices}

//                                     id ={invoice._id} date ={invoice.date} type ={invoice.invoiceType} shift ={invoice.shift} 
//                                     length ={invoice.items === null? 'N/A' : invoice.items.length} customer ={invoice.customer === null? 'N/A' : invoice.customerName}
//                                     supplier ={invoice.supplier === null? 'N/A' : invoice.supplierName} payment ={invoice.paymentMethod}total ={invoice.bills.total} tax={invoice.bills.tax}
//                                     totalWithTax={invoice.bills.totalWithTax} payed={invoice.bills.payed} balance ={invoice.bills.balance} status={invoice.invoiceStatus} items={invoice.items}
                                    
//                                     />
//                                         )
//                                       })
//                                     }
//                                 </tbody> 
                           

//                                  {/* Footer Section */}
//                                 {allInvoices.length > 0 && (

                            
//                                     <tfoot className='bg-[#F1E8D9] border-t-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                         <tr>
//                                             <td className='p-2' colSpan={1}>{allInvoices.length} فاتوره</td>
                                            
                                          
//                                             <td className='p-2' colSpan={3}>
//                                                مشتروات بقيمه : {allInvoices.filter(t => t.invoiceType === 'Purchase invoice')
//                                                .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)} 
//                                             </td>

                                            
//                                            <td className='p-2' colSpan={3}>
//                                                مبيعات بقيمه : {allInvoices.filter(t => t.invoiceType === 'Sale invoice')
//                                                .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)} 
//                                             </td>


                                           
                                       
//                                             <td className='p-2' colSpan={3}>
//                                                 صافي الربح المتوقع : {(
//                                                     allInvoices.filter(t => t.invoiceType === 'Sale invoice').reduce((sum, t) => sum + t.bills.totalWithTax, 0) -
//                                                     allInvoices.filter(t => t.invoiceType === 'Purchase invoice').reduce((sum, t) => sum + t.bills.totalWithTax, 0)
//                                                 ).toFixed(2)} ر.ع
//                                             </td>
//                                             <td></td><td className ='tdFooter'></td>

//                                         </tr>
                                     
//                                     </tfoot>
//                             )}


//                         </table>
//                         {!loading && allInvoices.length === 0 && (
//                             <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
//                                 {search
//                                     ? `عفوا لاتوجد فاتوره باسم  "${search}"`
//                                     : `قائمه الفواتير فارغه حاليا !`}
//                             </p>
//                         )}
                                    
//                     </div>
            
//                 </div>

//                 </div>
                    
//             </div>            

//             <div className ='flex-[1] bg-white px-2 py-3'>
                
//                 <div className="flex gap-2 items-center px-15 py-2 shadow-xl bg-white">
//                     <select id='frequency' value={frequency} onChange={(e) => setFrequency(e.target.value)}
//                         className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
//                         <option value='90'> 90 Days</option>
//                         <option value='60'> 60 Days</option>
//                         <option value='30'> 30 Days</option>
//                         <option value='7'> 7 Days</option>
//                         <option value='1'>1 Day</option>

//                     </select>


//                     <select id='orderStatus' value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)}
//                         className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
//                         <option value='all'>All</option>
//                         <option value='In Progress'>In Progess</option>
//                         <option value='Completed'>Completed</option>
//                         <option value='Cancelled'>Cancelled</option>
//                         <option value='Pending'>Pending</option>

//                     </select>


//                     <select id='shift' value={shift} onChange={(e) => setShift(e.target.value)}
//                         className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
//                         <option value='all'>All</option>
//                         <option value='Morning'>Morning</option>
//                         <option value='Evening'>Evening</option>
//                     </select>
//                 </div>

//                 <div className ='flex flex-col items-start mt-2 bg-white'>
//                     <p className='text-xs text-[#1a1a1a] font-semibold ml-2 mb-2 mt-2'>عدد الفواتير :-</p>
                    
//                     <div className='flex items-center justify-between w-full p-3 rounded-sm'>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <p className ='text-xs font-normal text-[#1a1a1a] '>
//                                 <span className ='text-xs font-medium text-[#0ea5e9]'>فواتير المبيعات : </span>
//                                 {totalSaleInvoices.length}
//                             <span className = 'text-xs font-normal text-[#0ea5e9]'> فاتوره</span>
//                             </p>
//                         </div>
//                         <div className ='flex  items-center justify-center gap-3'>
//                             <p className ='text-xs font-normal text-[#1a1a1a] '>
//                                 <span className ='text-xs font-medium text-[#0ea5e9]'>فواتير المشتروات : </span>
//                                 {totalBuyInvoices.length}
//                             <span className = 'text-xs font-normal text-[#0ea5e9]'> فاتوره</span>
//                             </p>
//                         </div>
//                     </div>

//                 </div>
              

//                <p className ='text-xs text-[#1a1a1a] font-semibold ml-2 mb-2 mt-2'>الاجماليات :-</p>
//                 <div className ='flex flex-col items-start  bg-white rounded-sm'>
//                     <div className ='flex items-center justify-between w-full px-1'>
                        
//                         <div className ='flex items-center justify-betwee p-2'>
//                             <p className ='font-semibold text-xs text-[#be3e3f]'>
//                                 <span className ='text-xs font-normal text-[#1a1a1a]'>ضريبه مبيعات : </span>
//                                 {totalSaleTaxTurnover.toFixed(2)}
//                                 <span className ='font-normal text-xs text-[#1a1a1a]'> ج.س</span>
//                             </p>
//                         </div>
                    
//                         <div className='flex items-start justify-start p-2'>
//                             <p className='font-semibold text-xs text-[#0ea5e9]'>
//                                 <span className='text-xs font-normal text-[#1a1a1a]'>اجمالي المبيعات : </span>
//                                 {totalSaleTurnover.toFixed(2)}<span className='font-normal text-xs text-black'> ج.س</span>
//                             </p>
//                         </div>
//                     </div>

//                     <div className ='flex items-center justify-between w-full px-1'>
                    
//                         <div className='flex items-start justify-start p-2'>
//                             <p className='font-semibold text-xs text-emerald-600'>
//                                 <span className='text-xs font-normal text-[#1a1a1a]'>الاجمالي الكلي للمبيعات </span>
//                                 {totalWithTaxSaleTurnover.toFixed(2)}
//                                 <span className='font-normal text-xs text-[#1a1a1a]'> ج.س</span>
//                             </p>
//                         </div>

//                         <div className='flex items-end justify-end  p-2'>
//                             <p className='font-semibold text-xs text-[#0ea5e9]'>
//                                 <span className='text-xs font-normal text-[#1a1a1a]'>اجمالي المشتروات </span>
//                                 {totalBuyTurnover.toFixed(2)}
//                                 <span className='font-normal text-xs text-[#1a1a1a]'> ج.س</span>
//                             </p>
//                         </div>

//                     </div>

//                     <div className ='flex items-center justify-between w-full px-1'>
                      
//                         <div className ='flex items-end justify-end  p-2'>
//                             <p className ='font-semibold text-xs text-emerald-600'>
//                                 <span className ='text-xs font-normal text-[#1a1a1a]'>الاجمالي الكلي للمشتروات </span>
//                                 {totalWithTaxBuyTurnover.toFixed(2)}
//                                 <span className ='font-normal text-xs text-black'> ج.س</span>
//                             </p>
//                         </div>

//                         <div className='flex items-end justify-end  p-2'>
//                             <p className={`${totalSaleTurnover - totalBuyTurnover <= 0 ? 'text-[#0ea5e9]' : 'text-green-600'} text-center font-semibold text-xs`}>
//                                 <span className='text-xs font-normal text-[#1a1a1a] '>الربح المتوقع </span>
//                                 {(totalWithTaxSaleTurnover - totalWithTaxBuyTurnover).toFixed(2)}
//                                 <span className='font-normal text-xs text-black'> ج.س</span></p>

//                         </div>
//                     </div>


//                 </div>

              

//                 <div className='flex flex-col items-start mt-10'>
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>توضيح بياني :-</p>

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

//                     <div className='flex justify-between w-full mt-2 text-xs'>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-green-500 rounded-full mx-auto mb-1'></div>
//                             <div>بيع :  <span className ='text-green-600'>{totalWithTaxSaleTurnover.toFixed(2)}</span> ج.س</div>
//                             <div className='text-green-600 font-semibold'>{totalSaleTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-[#0ea5e9] rounded-full mx-auto mb-1'></div>
//                             <div>شراء :  <span className ='text-[#0ea5e9]'>{totalWithTaxBuyTurnover.toFixed(2)}</span> ج.س</div>
//                             <div className='text-[#0ea5e9] font-semibold'>{totalBuyTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                     </div>
//                 </div>   
//             </div>
//         </section>
//     );
// };

// export default Invoices ;