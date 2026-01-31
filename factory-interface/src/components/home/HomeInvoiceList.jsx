import React, { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaCalendarAlt, FaCheckCircle, FaClock, FaUser, FaBox, FaDollarSign, FaSortAmountDown } from "react-icons/fa";
import { GiSunflower } from "react-icons/gi";
import { MdOutlineNightlightRound, MdOutlineArrowDropDown } from "react-icons/md";
import { getAvatarName } from '../../utils';
import { api } from '../../https';
import { toast } from 'react-hot-toast';

const HomeInvoicesList = () => {
    // State management
    const [allInvoices, setAllInvoices] = useState([]);
    const [frequency, setFrequency] = useState('1');
    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('Sale invoice');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);

    // Get current shift
    function getCurrentShift() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }

    const getInvoices = async () => {
        setLoading(true);
        try {
            const res = await api.post('/api/invoice/fetch', {
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

            if (res.data.success) {
                setAllInvoices(res.data.data || []);
            } else {
                toast.error(res.data.message || 'لم يتم العثور على الفواتير');
            }
        } catch (error) {
            console.error(error);
            toast.error('مشكلة في جلب المعاملات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInvoices();
    }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]);

    // Get status configuration
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <FaCheckCircle className="h-3 w-3" />,
                    text: 'مكتمل'
                };
            case 'In Progress':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <FaClock className="h-3 w-3" />,
                    text: 'قيد التنفيذ'
                };
            case 'Pending':
                return {
                    color: 'bg-amber-100 text-amber-800 border-amber-200',
                    icon: <FaClock className="h-3 w-3" />,
                    text: 'معلق'
                };
            case 'Cancelled':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <FaClock className="h-3 w-3" />,
                    text: 'ملغى'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <FaClock className="h-3 w-3" />,
                    text: status
                };
        }
    };

    return (
        <div className="w-full h-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FaDollarSign className="h-4 w-4 text-blue-600" />
                                مبيعات اليوم
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">آخر عمليات البيع</p>
                        </div>
                        
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="ابحث في الفواتير..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 text-right"
                                dir="rtl"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-4 sm:px-6 py-3 bg-blue-50 border-b border-blue-100">
                    <div className="flex flex-wrap items-center gap-2 justify-end">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-blue-700">الفلاتر:</span>
                            <FaFilter className="h-3 w-3 text-blue-600" />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {/* Shift Filter */}
                            <div className="relative">
                                <select
                                    value={shift}
                                    onChange={(e) => setShift(e.target.value)}
                                    className="appearance-none pr-8 pl-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 bg-white text-right"
                                    dir="rtl"
                                >
                                    <option value="all">كل الورديات</option>
                                    <option value="Morning">صباح</option>
                                    <option value="Evening">مساء</option>
                                </select>
                                <MdOutlineArrowDropDown className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={invoiceStatus}
                                    onChange={(e) => setInvoiceStatus(e.target.value)}
                                    className="appearance-none pr-8 pl-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 bg-white text-right"
                                    dir="rtl"
                                >
                                    <option value="all">كل الحالات</option>
                                    <option value="In Progress">قيد التنفيذ</option>
                                    <option value="Completed">مكتمل</option>
                                    <option value="Cancelled">ملغى</option>
                                    <option value="Pending">معلق</option>
                                </select>
                                <MdOutlineArrowDropDown className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                            </div>

                            {/* Frequency Filter */}
                            <div className="relative">
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="appearance-none pr-8 pl-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 bg-white text-right"
                                    dir="rtl"
                                >
                                    <option value="1">اليوم</option>
                                    <option value="7">7 أيام</option>
                                    <option value="30">30 يوم</option>
                                    <option value="90">90 يوم</option>
                                </select>
                                <MdOutlineArrowDropDown className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-sm text-gray-600">جاري تحميل الفواتير...</p>
                            </div>
                        </div>
                    ) : allInvoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8">
                            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <FaBox className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد مبيعات</h3>
                            <p className="text-sm text-gray-500 text-center max-w-sm">
                                قائمة مبيعات اليوم فارغة حالياً!
                            </p>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <div className="px-4 sm:px-6 py-3">
                                {/* Column Headers - Desktop */}
                                <div className="hidden md:grid grid-cols-12 gap-4 mb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    <div className="col-span-2">الحالة</div>
                                    <div className="col-span-3">العميل</div>
                                    <div className="col-span-2">المنتجات</div>
                                    <div className="col-span-2">بواسطة</div>
                                    <div className="col-span-2">الوردية</div>
                                    <div className="col-span-1">التاريخ</div>
                                </div>

                                {/* Invoice List */}
                                <div className="space-y-3">
                                    {allInvoices.map((invoice, index) => {
                                        const statusConfig = getStatusConfig(invoice.invoiceStatus);
                                        const shiftIcon = invoice.shift === 'Morning' 
                                            ? <GiSunflower className="h-4 w-4 text-amber-500" />
                                            : <MdOutlineNightlightRound className="h-4 w-4 text-blue-500" />;
                                        
                                        return (
                                            <div 
                                                key={index}
                                                className="group bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl p-4 transition-all duration-200 text-right"
                                                dir="rtl"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                    {/* Status */}
                                                    <div className="md:col-span-2">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium" style={statusConfig}>
                                                            {statusConfig.icon}
                                                            <span>{statusConfig.text}</span>
                                                        </div>
                                                    </div>

                                                    {/* Customer */}
                                                    <div className="md:col-span-3">
                                                        <div className="flex items-center gap-3 justify-end">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                                                                    {invoice.customerName || 'غير محدد'}
                                                                </p>
                                                                <p className="text-xs text-gray-500">فاتورة #{invoice.invoiceNumber || 'غير محدد'}</p>
                                                            </div>
                                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                                {getAvatarName(invoice.customerName || 'N/A')}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Items */}
                                                    <div className="md:col-span-2">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <span className="text-sm text-gray-700">
                                                                {invoice.items?.length || 0} صنف
                                                            </span>
                                                            <FaBox className="h-3 w-3 text-gray-400" />
                                                        </div>
                                                        <p className="text-xs text-green-600 font-medium mt-1 text-left">
                                                            ج.س {invoice.bills?.total?.toFixed(2) || '0.00'}
                                                        </p>
                                                    </div>

                                                    {/* Processed By */}
                                                    <div className="md:col-span-2">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <span className="text-sm text-gray-700 truncate max-w-[100px]">
                                                                {invoice.user?.name || 'غير محدد'}
                                                            </span>
                                                            <FaUser className="h-3 w-3 text-gray-400" />
                                                        </div>
                                                    </div>

                                                    {/* Shift */}
                                                    <div className="md:col-span-2">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <span className={`text-sm font-medium ${invoice.shift === 'Morning' ? 'text-amber-600' : 'text-blue-600'}`}>
                                                                {invoice.shift === 'Morning' ? 'صباح' : 'مساء'}
                                                            </span>
                                                            {shiftIcon}
                                                        </div>
                                                    </div>

                                                    {/* Date */}
                                                    <div className="md:col-span-1">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {new Date(invoice.date).toLocaleDateString('ar-EG')}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(invoice.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-sm text-gray-600 text-right">
                            عرض <span className="font-semibold">{allInvoices.length}</span> فاتورة
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs text-gray-500">تحديث مباشر</span>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                عرض الكل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeInvoicesList;


// import React, { useState, useEffect } from 'react'
// import { FaSearch } from 'react-icons/fa'

// import { GrInProgress } from 'react-icons/gr';
// import { FaCheckCircle } from "react-icons/fa";

// import { GiSunflower } from "react-icons/gi";
// import { MdOutlineNightlightRound } from "react-icons/md";

// import { getAvatarName } from '../../utils';
// import { api } from '../../https';

// const  HomeInvoicesList = () => {

//     // fetch 
//     const [allInvoices, setAllInvoices] = useState([]);

//     const [frequency, setFrequency] = useState('1');
//     const [type, setType] = useState('bills');
//     const [invoiceType, setInvoiceType] = useState('Sale invoice');
//     const [invoiceStatus, setInvoiceStatus] = useState('all');
//     const [customer, setCustomer] = useState('all');
//     const [supplier, setSupplier] = useState('all');
//     const [shift, setShift] = useState('all');

//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');
            
//     // Add this function inside your component (before return)
//     function getCurrentShift() {
//         const hour = new Date().getHours();
//         // Example: Morning = 6:00-17:59, Evening = 18:00-5:59
//         return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
//     }

//     useEffect(() => {
      
//     const getInvoices = async () => {
//         try {
      
//             const res = await api.post('/api/invoice/fetch' , 
//                 {
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
//                 });
                  
//                 setAllInvoices(res.data)
//                 console.log(res.data)
//             if (res.data.success) {
//                 setAllInvoices(res.data.data || []);

//             } else {
//                 toast.error(res.data.message || 'invocies not found')
//             }
               
      
//               } catch (error) {
//                   console.log(error)
//                   message.error('Fetch Issue with transaction')
                  
//               }
//           };
      
//         getInvoices();
//       }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]); 

//     return (
       
//         <div className ='mt-1 px-0 '>
            
//             <div className ='h-[calc(100vh-7rem)] bg-white w-full rounded-xl shadow-lg mt-0 overflow-y-scroll scrollbar-hidden'>

//                 {/*Address [#025cca] */}
//                 {/* <div className ='flex justify-between items-center px-2 py-2 '> */}
//                 <div className="flex flex-col md:flex-col md:justify-between md:items-center px-2 py-2 gap-2">

//                    <h1 className ='text-[#1a1a1a] text-sm    font-semibold'>مبيعات اليوم</h1>
                    
                   
//                    <div className ='flex items-center justify-between px-5 py-2 shadow-xl'>
//                     <div className ='flex items-center gap-2 '>
//                         <label htmlFor ='frequency' className ='text-xs text-[#0ea5e9] font-normal'>التاريخ</label>
//                         <select id ='frequency' value ={frequency} onChange = {(e) => setFrequency(e.target.value)} 
//                             className ='px-2 py-1 text-sm shadow-lg/30'>
//                             <option value ='1'>Today</option>
//                             <option value ='7'>7 Days</option>
//                             <option value ='30'>30 Days</option>
//                             <option value ='90'>90 Day</option>
//                         </select>
                      
//                         <label htmlFor ='orderSatus' className ='text-xs text-[#0ea5e9] font-normal'>الحاله</label>
//                         <select id ='orderStatus' value ={invoiceStatus} onChange ={(e) => setInvoiceStatus(e.target.value)} 
//                             className ='px-2 py-1 text-sm shadow-lg/30'>
//                             <option value ='all'>All</option>
//                             <option value ='In Progress'>In Progess</option>
//                             <option value ='Completed'>Completed</option>
//                             <option value ='Cancelled'>Cancelled</option>
//                             <option value ='Pending'>Pending</option>

//                         </select>
                      
//                         <label htmlFor ='shift' className ='text-xs text-[#0ea5e9] font-normal'>الورديه</label>
//                         <select id ='shift' value ={shift} onChange ={(e) => setShift(e.target.value)}
//                             className ='px-2 py-1 text-sm shadow-lg/30'>
//                             <option value ='all'>All</option>
//                             <option value = 'Morning'>Morning</option>
//                             <option value = 'Evening'>Evening</option>
//                         </select>   
//                     </div>
//                 </div>
                   
//                 </div>

//                 {/*Sales list */}

//                 <div className ='mt-3 px-1 overflow-y-scroll  scrollbar-hide scrollbar-hidden bg-white shadow-xl'>
                
//                 {allInvoices.length === 0 
//                 ? (<p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>قائمه مبيعات اليوم فارغه حاليا !</p>) 
//                 :allInvoices.map((invoice, index) => (
                      
//                        <div className='flex px-1 items-center gap-5 mb-2 bg-white rounded-lg shadow-lg/30'>

//                         <div className='flex justify-between items-center w-[100%] '>
                            
//                             <div className ='flex justify-start gap-2'>
//                                 <p className ='text-black text-xs font-normal'>{new Date(invoice.date).toLocaleDateString('en-GB')}</p>
//                                 <p className ={`${invoice.shift === 'Evening' ? 'text-[#0ea5e9]' : 'text-[#f6b100]'}
//                                     text-xs font-medium`}>
//                                     {invoice.shift}</p>
//                             </div>
                     


//                             <div className='flex flex-col items-start gap-1 p-1'>
//                                 <h1 className='text-[#1a1a1a] text-xs font-semibold tracking-wide'>

//                                     {invoice.customer === null ? 'N/A' : invoice.customerName}
//                                 </h1>
//                                 <p className='text-green-600 text-xs'>{invoice.items.length} صنف</p>
//                                 <p className='text-[#0ea5e9] text-xs'><span className ='text-xs text-[#1a1a1a]'>بواسطه :</span> {invoice.user.name} Items</p>
//                             </div>
                           
//                             {/*right side */}
//                             <div className='flex flex-col items-start gap-1'>
//                                 <p  className={`px-1 text-xs font-normal p-2 rounded-lg shadow-lg/30 
//                                     ${invoice.invoiceStatus === 'Completed' ? 'text-white bg-sky-600' : 'bg-[#f6b100] text-white'}`}>
//                                     <FaCheckCircle hidden={invoice.invoiceStatus === "In Progress"} className='inline mr-2 text-white' size={17} /> 
//                                     <GrInProgress hidden={invoice.invoiceStatus === 'Completed'} className='inline mr-2 text-white' size={17} />
//                                     {invoice.invoiceStatus}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     ))}
                      
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default HomeInvoicesList ;



