import React, { useState, useEffect, useRef, useCallback } from 'react'
import BackButton from '../components/shared/BackButton';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { LuPrinterCheck } from "react-icons/lu";
import { FaSearch, FaFilter, FaIndustry, FaChartBar, FaCalendarAlt, FaBoxes } from "react-icons/fa";
import { api } from '../https';
import { toast } from 'react-toastify'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ProInvoices = () => {
    const [allInvoices, setAllInvoices] = useState([]);
    const [frequency, setFrequency] = useState('365');
    const [type, setType] = useState('production');
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
                toast.error(response.data.message || 'Production invoices not found');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [type, frequency, invoiceType, invoiceStatus, customer, supplier, shift, search, sort]);

    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchInvoices();
        }
    }, [fetchInvoices]);

    // Calculate production statistics
    const totalInvoices = allInvoices.length;
    const totalProductionValue = allInvoices.reduce((sum, invoice) => sum + invoice.bills.totalWithTax, 0);
    const totalItems = allInvoices.reduce((sum, invoice) => sum + (invoice.items?.length || 0), 0);
    const completedInvoices = allInvoices.filter(invoice => invoice.invoiceStatus === 'Completed').length;
    const inProgressInvoices = allInvoices.filter(invoice => invoice.invoiceStatus === 'In Progress').length;
    
    // Prepare data for chart
    const statusData = [
        { name: 'مكتمل', value: completedInvoices, color: '#10b981' },
        { name: 'قيد التنفيذ', value: inProgressInvoices, color: '#f59e0b' },
        { name: 'أخرى', value: totalInvoices - completedInvoices - inProgressInvoices, color: '#6b7280' }
    ];

    const shiftData = [
        { name: 'صباحية', value: allInvoices.filter(inv => inv.shift === 'Morning').length, color: '#fbbf24' },
        { name: 'مسائية', value: allInvoices.filter(inv => inv.shift === 'Evening').length, color: '#0ea5e9' },
        { name: 'غير محدد', value: allInvoices.filter(inv => !inv.shift || inv.shift === 'all').length, color: '#9ca3af' }
    ];
    
    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
            <html dir="rtl">
                <head>
                    <title>إدارة الإنتاج</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Arial, sans-serif; 
                            padding: 20px; 
                            direction: rtl;
                            background: white;
                        }
                        .report-container { 
                            width: 100%; 
                            max-width: 1000px; 
                            margin: 0 auto;
                        }
                        h2 { 
                            text-align: center; 
                            color: #1e40af;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #1e40af;
                            padding-bottom: 10px;
                        }
                        .company-info {
                            text-align: center;
                            margin-bottom: 30px;
                            color: #4b5563;
                        }
                        .company-info h1 {
                            color: #1e40af;
                            font-size: 28px;
                            margin-bottom: 10px;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                        }
                        th, td { 
                            border: 1px solid #d1d5db; 
                            padding: 12px; 
                            text-align: right;
                            font-size: 14px;
                        }
                        th { 
                            background-color: #f3f4f6; 
                            color: #374151;
                            font-weight: 600;
                        }
                        .summary-section {
                            background: #f0f9ff;
                            padding: 20px;
                            border-radius: 10px;
                            margin-top: 30px;
                            border: 2px solid #dbeafe;
                        }
                        .summary-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px 0;
                            border-bottom: 1px solid #e5e7eb;
                        }
                        .summary-row:last-child {
                            border-bottom: none;
                            font-weight: bold;
                            font-size: 18px;
                            color: #059669;
                        }
                        .no-print { display: none !important; }
                        .invoice-footer {
                            text-align: center;
                            margin-top: 40px;
                            padding-top: 20px;
                            border-top: 2px dashed #e5e7eb;
                            color: #6b7280;
                            font-size: 14px;
                        }
                        @media print {
                            body { margin: 0; padding: 15px; }
                            .no-print { display: none !important; }
                            .report-container { border: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="report-container">
                        <div class="company-info">
                            <h1>تقرير الإنتاج</h1>
                            <p>نظام إدارة وتتبع عمليات الإنتاج</p>
                            <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
                        </div>
                        ${printContent}
                        <div class="invoice-footer">
                            <p>تم إنشاء هذا التقرير بواسطة نظام إدارة الإنتاج</p>
                            <p>يرجى الاحتفاظ بنسخة من التقرير للسجلات</p>
                        </div>
                    </div>
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
                                    <FaIndustry className='text-white w-5 h-5' />
                                </div>
                                <div>
                                    <h1 className='text-lg md:text-xl font-bold'>إدارة الإنتاج</h1>
                                    <p className='text-blue-100 text-sm'>عرض وتتبع جميع فواتير الإنتاج</p>
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
                        <div ref={invoiceRef} className='bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                            {/* Search and Filters */}
                            <div className='flex flex-col md:flex-row gap-4 mb-6'>
                                <div className='relative flex-1'>
                                    <div className='absolute right-3 top-3 text-blue-400'>
                                        <FaSearch className='w-5 h-5' />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="بحث في فواتير الإنتاج..."
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
                                        <option value='bills.totalWithTax'>حسب القيمة (صغير-كبير)</option>
                                        <option value='-bills.totalWithTax'>حسب القيمة (كبير-صغير)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Production Filters */}
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                                <div>
                                    <label className='block text-xs text-gray-600 mb-1 flex items-center gap-2'>
                                        <FaCalendarAlt className='w-3 h-3' />
                                        الفترة
                                    </label>
                                    <select 
                                        value={frequency} 
                                        onChange={(e) => setFrequency(e.target.value)}
                                        className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                    >
                                        <option value='365'>جميع الأيام</option>
                                        <option value='90'>90 يوم</option>
                                        <option value='60'>60 يوم</option>
                                        <option value='30'>30 يوم</option>
                                        <option value='7'>7 أيام</option>
                                        <option value='1'>يوم واحد</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className='block text-xs text-gray-600 mb-1'>حالة الفاتورة</label>
                                    <select 
                                        value={invoiceStatus} 
                                        onChange={(e) => setInvoiceStatus(e.target.value)}
                                        className='w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                                    >
                                        <option value='all'>جميع الحالات</option>
                                        <option value='Completed'>مكتمل</option>
                                        <option value='In Progress'>قيد التنفيذ</option>
                                        <option value='Pending'>معلق</option>
                                        <option value='Cancelled'>ملغى</option>
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
                                        <option value='Production invoice'>فواتير الإنتاج</option>
                                    </select>
                                </div>
                            </div>

                            {/* Loading Indicator */}
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <span className="mr-2 text-blue-600">جاري تحميل فواتير الإنتاج...</span>
                                </div>
                            ) : (
                                /* Production Invoices Table */
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-blue-50'>
                                            <tr className='text-right'>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>التاريخ</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الوردية</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>عدد الأصناف</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>قيمة الإنتاج</th>
                                                <th className='py-3 px-4 text-xs font-semibold text-blue-800 uppercase tracking-wider'>الحالة</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody className='divide-y divide-gray-100'>
                                            {allInvoices.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="py-12 text-center">
                                                        <div className="text-gray-400">
                                                            <FaIndustry className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                            <p className="text-gray-500 text-lg mb-2">لا توجد فواتير إنتاج</p>
                                                            <p className="text-gray-400 text-sm">
                                                                {search 
                                                                    ? `لا توجد فواتير إنتاج تطابق "${search}"`
                                                                    : 'لم يتم العثور على فواتير إنتاج'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                allInvoices.map((production, index) => (
                                                    <tr
                                                        key={index}
                                                        className='hover:bg-blue-50 transition duration-150 cursor-pointer'
                                                    >
                                                        <td className='py-3 px-4 text-sm text-gray-700'>
                                                            {production.date ? new Date(production.date).toLocaleDateString('ar-SA') : '-'}
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                production.shift === 'Morning' 
                                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                                    : production.shift === 'Evening'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {production.shift || 'غير محدد'}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4 text-sm text-gray-700'>
                                                            <div className='flex items-center gap-2'>
                                                                <FaBoxes className='text-blue-500 w-4 h-4' />
                                                                {production.items?.length || 0}
                                                            </div>
                                                        </td>
                                                        <td className='py-3 px-4 text-sm font-semibold text-emerald-700'>
                                                            {production.bills.totalWithTax?.toFixed(2) || '0.00'} ر.ع
                                                        </td>
                                                        <td className='py-3 px-4'>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                production.invoiceStatus === 'Completed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : production.invoiceStatus === 'In Progress'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : production.invoiceStatus === 'Cancelled'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {production.invoiceStatus || 'غير محدد'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                        
                                        {allInvoices.length > 0 && (
                                            <tfoot className='bg-blue-50 border-t border-blue-100'>
                                                <tr>
                                                    <td colSpan="3" className="py-3 px-4 text-sm font-semibold text-blue-800">
                                                        إجمالي {totalInvoices} فاتورة إنتاج
                                                    </td>
                                                    <td colSpan="2" className="py-3 px-4">
                                                        <div className='flex justify-between items-center'>
                                                            <div className='text-sm'>
                                                                <span className='text-gray-600'>عدد الأصناف: </span>
                                                                <span className='font-medium text-blue-700'>{totalItems}</span>
                                                            </div>
                                                            <div className='text-lg font-bold text-emerald-700'>
                                                                إجمالي الإنتاج: {totalProductionValue.toFixed(2)} ر.ع
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
                        {/* Production Summary */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <FaChartBar className='text-blue-600 w-5 h-5' />
                                <h3 className='text-sm font-semibold text-blue-800'>ملخص الإنتاج</h3>
                            </div>
                            
                            <div className='space-y-3'>
                                <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                                    <p className='text-xs text-blue-600 mb-1'>فواتير الإنتاج</p>
                                    <p className='text-2xl font-bold text-blue-800'>{totalInvoices}</p>
                                    <p className='text-xs text-gray-500'>فاتورة</p>
                                </div>
                                
                                <div className='bg-green-50 rounded-lg p-3 border border-green-100'>
                                    <p className='text-xs text-green-600 mb-1'>قيمة الإنتاج</p>
                                    <p className='text-2xl font-bold text-emerald-700'>{totalProductionValue.toFixed(2)}</p>
                                    <p className='text-xs text-gray-500'>ر.ع</p>
                                </div>
                                
                                <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                                    <p className='text-xs text-blue-600 mb-1'>الأصناف المنتجة</p>
                                    <p className='text-2xl font-bold text-blue-800'>{totalItems}</p>
                                    <p className='text-xs text-gray-500'>صنف</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Distribution */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                            <h3 className='text-sm font-semibold text-blue-800 mb-4'>توزيع الحالات</h3>
                            
                            <div className='h-40 mb-4'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className='space-y-2'>
                                {statusData.map((status, index) => (
                                    <div key={index} className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: status.color }}></div>
                                            <span className='text-xs text-gray-600'>{status.name}</span>
                                        </div>
                                        <span className='text-xs font-semibold'>{status.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shift Distribution */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                            <h3 className='text-sm font-semibold text-blue-800 mb-4'>توزيع الورديات</h3>
                            
                            <div className='space-y-3'>
                                {shiftData.map((shift, index) => (
                                    <div key={index} className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: shift.color }}></div>
                                            <span className='text-xs text-gray-600'>{shift.name}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-xs font-semibold'>{shift.value}</span>
                                            <span className='text-xs text-gray-400'>
                                                ({totalInvoices > 0 ? ((shift.value / totalInvoices) * 100).toFixed(1) : 0}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProInvoices;

// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import BackButton from '../components/shared/BackButton';
// import { useQuery, keepPreviousData } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { LuPrinterCheck } from "react-icons/lu";

// import { api } from '../https';
// import { toast } from 'react-toastify'

// import InvoiceDetails from '../components/invoice/InvoiceDetails';
   
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// const ProInvocies = () => {

//     const [allInvoices, setAllInvoices] = useState([]);

//     const [frequency, setFrequency] = useState('365');
//     const [type, setType] = useState('production');
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
//         try {
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
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//         } else {
//             fetchInvoices();
//         }
//     }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]);

    
//     // Printing
//     const invoiceRef = useRef(null)
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML
//         const WinPrint = window.open("", "", "width=900, height=650")

//         WinPrint.document.write(` 
//                 <html>
//                     <head>
//                         <title>اداره الانتاج</title>
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
//                             .tdFooter { display: none ;}
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
//         <section dir ='rtl' className ='gap-3 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-[#f5f5f5]'>
            
//             <div className ='bg-white h-[100vh] overflow-y-scroll scrollbar-hidden'>
//                 <div ref={invoiceRef} className=''>
                
              
//                 <div className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                     <div className='backButton flex items-center gap-2'>
//                         <BackButton />
//                         <h1 className='text-sm font-semibold text-[#1a1a1a]'>اداره الانتاج</h1>
//                     </div>
//                     <div className='flex justify-end button  items-center cursor-pointer gap-3'>
//                             <button
//                                 onClick={handlePrint}
//                                 className="bg-blue-500 shadow-lg/30 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                             >
//                                 <LuPrinterCheck className="w-4 h-4" />
//                                 طباعه
//                             </button>
//                     </div>
//                 </div>

          
//                 {/* Search and sorting and Loading */}
//                 <div className="search flex items-center px-15 py-2 gap-2 bg-white shadow-xl">
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

//                     <div className="flex gap-2 items-center px-5 py-2 shadow-xl bg-white">
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
//                                     <th className='p-1 ml-0'></th>
//                                     <th className='p-1'>الاصناف</th>
                                
//                                     <th className='p-1'>انتاج بقيمه</th>
//                                     <th className='p-1 statusTr'>الحاله</th>
                                
//                                 </tr>
//                             </thead>

                                 
                            


//                                 <tbody>

//                                     {allInvoices.length === 0
//                                         ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>قائمه فواتير الانتاج فارغه حاليا .</p>)
//                                         : allInvoices.map((production, index) => (

//                                             <tr
//                                                 key={index}
//                                                 className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                                                             hover:bg-[#F1E8D9] cursor-pointer'
//                                             >
//                                                 <td className='IdTd p-1' hidden>{production._id}</td>
//                                                 <td className='p-1'>{production.date ? new Date(production.date).toLocaleDateString('en-GB') : ''}</td>
//                                                 <td className={`${production.shift === 'Morning' ? 'text-[#e6b100]' :
//                                                     'text-[#0ea5e9]'
//                                                     } p-1`}>{production.shift}
//                                                 </td>
//                                                 <td className='p-1'>{production.items.length}</td>

                                            

//                                                 <td className='p-1'>{production.bills.totalWithTax.toFixed(2)}</td>
                                             
//                                                 <td className='p-1'> {production.invoiceStatus}</td>
//                                             </tr>
//                                         ))}
//                                 </tbody>


//                                 {/* Footer Section */}
//                                 {allInvoices.length > 0 && (


//                                     <tfoot className='bg-[#F1E8D9] border-t-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                         <tr>
//                                             <td className='p-2' colSpan={1}>{allInvoices.length} فاتوره</td>

//                                             <td  className='p-2' colSpan={3}>
//                                                 انتاج بقيمه : {allInvoices.filter(t => t.type === 'production')
//                                                 .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)} ر.ع
//                                             </td>
                                           

//                                             <td></td>
//                                             <td className='tdFooter'></td>

//                                         </tr>

//                                     </tfoot>
//                                 )}

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

//         </section>
//     );
// };

// export default ProInvocies ;