import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api } from '../../https'
import { IoCloseCircle } from "react-icons/io5";
import { FaPrint, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiFilter, FiFileText } from "react-icons/fi";

const DetailsModal = ({ setIsDetailsModal }) => {
    const customerData = useSelector((state) => state.customer)
    const customer = customerData.customerId

    const [customerInvoices, setCustomerInvoices] = useState([])
    const [loading, setLoading] = useState(false)
    
    const [currentPage, setCurrentPage] = useState(1)
    const [invoicesPerPage, setInvoicesPerPage] = useState(10)
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [searchTerm, setSearchTerm] = useState('')
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    const fetchCustomerDetails = async () => {
        setLoading(true)
        try {
            const response = await api.post('/api/invoice/customerDetails', {
                customer,
                page: Number(currentPage),
                limit: Number(invoicesPerPage),
                sortBy: sortBy,
                sortOrder: sortOrder,
                search: searchTerm
            })

            if (response.data.success) {
                setCustomerInvoices(response.data.data)
                setTotalPages(response.data.pagination.totalPages)
                setTotalItems(response.data.pagination.totalItems)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log('Error details:', error.response?.data)
            toast.error(error.response?.data?.message || 'خطأ في جلب الفواتير')
        } finally {
            setLoading(false)
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handleInvoicesPerPageChange = (value) => {
        setInvoicesPerPage(value)
        setCurrentPage(1)
    }

    useEffect(() => {
        fetchCustomerDetails()
    }, [customer, currentPage, invoicesPerPage, sortBy, sortOrder, searchTerm])

    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML
        const WinPrint = window.open("", "", "width=900, height=700")

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>كشف حساب العميل - ${customerData.customerName}</title>
                    <style>
                        @media print {
                            @page { margin: 20px; }
                            body { margin: 0; font-family: 'Arial Arabic', Arial, sans-serif; direction: rtl; }
                        }
                        body { 
                            font-family: 'Arial Arabic', Arial, sans-serif; 
                            direction: rtl; 
                            padding: 30px; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        }
                        .receipt-container { 
                            width: 100%; 
                            max-width: 800px; 
                            margin: 0 auto; 
                            background: white; 
                            border-radius: 20px; 
                            padding: 30px; 
                            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                            border: 2px solid #1e40af;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 3px solid #1e40af; 
                            padding-bottom: 20px; 
                        }
                        h2 { 
                            color: #1e40af; 
                            margin: 0; 
                            font-size: 28px; 
                            font-weight: bold;
                        }
                        .customer-info {
                            display: flex;
                            justify-content: space-between;
                            margin: 20px 0;
                            padding: 15px;
                            background: #eff6ff;
                            border-radius: 10px;
                            border: 1px solid #dbeafe;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px; 
                            border: 1px solid #d1d5db;
                        }
                        th { 
                            background-color: #eff6ff; 
                            color: #1e40af; 
                            font-weight: bold; 
                            padding: 12px 8px; 
                            border: 1px solid #d1d5db; 
                            text-align: center; 
                        }
                        td { 
                            padding: 10px 8px; 
                            border: 1px solid #d1d5db; 
                            text-align: center; 
                        }
                        .total-row { 
                            background-color: #dbeafe; 
                            font-weight: bold; 
                        }
                        .controls { display: none !important; }
                        .pagination { display: none !important; }
                        .button { display: none !important; }
                        .footer { 
                            margin-top: 30px; 
                            text-align: center; 
                            color: #6b7280; 
                            font-size: 12px; 
                            border-top: 1px solid #d1d5db; 
                            padding-top: 10px; 
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">
                        ${printContent}
                        <div class="footer">
                            تم الإنشاء في: ${new Date().toLocaleDateString('ar-SA')} | 
                            الصفحة <span class="page-number"></span>
                        </div>
                    </div>
                </body>
            </html>
        `)

        WinPrint.document.close()
        WinPrint.focus()
        setTimeout(() => {
            WinPrint.print()
            WinPrint.close()
        }, 1000)
    }

    const handleClose = () => {
        setIsDetailsModal(false)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className='bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden 
                border border-blue-100'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FiFileText className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className='text-white text-lg sm:text-xl font-bold'>كشف حساب العملاء</h2>
                                <p className='text-blue-100 text-sm'>تحليل مفصل لجميع المعاملات</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-white 
                                transition-colors duration-200 flex items-center gap-2"
                                title="طباعة الكشف"
                            >
                                <FaPrint size={18} />
                                <span className="hidden sm:inline text-sm">طباعة</span>
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-white 
                                transition-colors duration-200"
                                title="إغلاق"
                            >
                                <IoCloseCircle size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="px-4 sm:px-6 py-4 bg-blue-50 border-b border-blue-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-blue-200">
                                <FiFilter className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-blue-900 font-bold text-sm">العميل:</h3>
                                <p className="text-blue-700 font-semibold text-lg">{customerData.customerName}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-blue-900 font-bold text-sm">الرصيد الحالي:</div>
                            <div className={`text-xl font-bold ${customerData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {customerData.balance?.toFixed(2)} <span className="text-blue-700 text-sm">ر.ع</span>
                            </div>
                            <div className="text-blue-500 text-xs mt-1">
                                {customerData.balance >= 0 ? 'رصيد دائن' : 'رصيد مدين'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="px-4 sm:px-6 py-3 bg-white border-b border-blue-100 controls">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ابحث بالمبلغ أو رقم الإجراء..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full p-3 pr-10 bg-blue-50 border-2 border-blue-200 
                                    rounded-xl text-blue-900 text-sm focus:outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-900 
                                text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="createdAt">تاريخ الإجراء</option>
                                <option value="invoiceNumber">رقم الإجراء</option>
                                <option value="invoiceType">نوع الإجراء</option>
                                <option value="bills.total">المبلغ الإجمالي</option>
                            </select>
                            <button
                                onClick={() => handleSortChange(sortBy)}
                                className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl 
                                text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                                {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                            </button>
                            <select
                                value={invoicesPerPage}
                                onChange={(e) => handleInvoicesPerPageChange(Number(e.target.value))}
                                className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-900 
                                text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                <option value={5}>5 لكل صفحة</option>
                                <option value={10}>10 لكل صفحة</option>
                                <option value={20}>20 لكل صفحة</option>
                                <option value={50}>50 لكل صفحة</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-2 sm:p-4" ref={invoiceRef}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 
                                border-t-blue-600 mx-auto mb-4"></div>
                                <p className="text-blue-700 font-medium">جاري تحميل بيانات كشف الحساب...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full">
                            <div className="overflow-x-auto rounded-xl border border-blue-200">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">التاريخ</th>
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">نوع الإجراء</th>
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">رقم الإجراء</th>
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">الإجمالي</th>
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">الضريبة</th>
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">الإجمالي الكلي</th>
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">المدفوع</th>
                                            <th className="p-4 text-right text-blue-900 font-bold text-sm">الرصيد</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="p-8 text-center">
                                                    <div className="text-blue-400 text-4xl mb-4">📊</div>
                                                    <p className="text-blue-700 font-medium text-lg">
                                                        قائمة كشف الحساب فارغة حالياً
                                                    </p>
                                                    <p className="text-blue-500 text-sm mt-2">
                                                        لا توجد معاملات مسجلة لهذا العميل
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            customerInvoices.map((invoice, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors"
                                                >
                                                    <td className="p-4 text-blue-700 font-medium">
                                                        {new Date(invoice.date).toLocaleDateString('ar-SA')}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                            ${invoice.invoiceType === 'بيع' ? 'bg-green-100 text-green-800' :
                                                                invoice.invoiceType === 'شراء' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                            {invoice.invoiceType}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-blue-900 font-semibold">
                                                        #{invoice.invoiceNumber}
                                                    </td>
                                                    <td className="p-4 text-blue-900 font-medium">
                                                        {invoice.bills.total?.toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-blue-700">
                                                        {invoice.bills.tax?.toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-blue-900 font-semibold">
                                                        {invoice.bills.totalWithTax?.toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-green-600 font-semibold">
                                                        {invoice.bills.payed?.toFixed(2)}
                                                    </td>
                                                    <td className={`p-4 font-bold ${invoice.bills.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {invoice.bills.balance?.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {customerInvoices.length > 0 && (
                                        <tfoot>
                                            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-300">
                                                <td className="p-4 text-blue-900 font-bold" colSpan={3}>
                                                    المجموع النهائي
                                                </td>
                                                <td className="p-4 text-blue-900 font-bold">
                                                    {customerInvoices.reduce((acc, invoice) => acc + (invoice.bills.total || 0), 0).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-blue-700 font-bold">
                                                    {customerInvoices.reduce((acc, invoice) => acc + (invoice.bills.tax || 0), 0).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-blue-900 font-bold">
                                                    {customerInvoices.reduce((acc, invoice) => acc + (invoice.bills.totalWithTax || 0), 0).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-green-700 font-bold">
                                                    {customerInvoices.reduce((acc, invoice) => acc + (invoice.bills.payed || 0), 0).toFixed(2)}
                                                </td>
                                                <td className={`p-4 font-bold ${customerInvoices.reduce((acc, invoice) => acc + (invoice.bills.balance || 0), 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                    {customerInvoices.reduce((acc, invoice) => acc + (invoice.bills.balance || 0), 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && customerInvoices.length > 0 && (
                        <div className="mt-4 pagination">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 
                            bg-blue-50 rounded-xl border border-blue-200">
                                <div className="text-blue-700 text-sm">
                                    عرض <span className="font-bold text-blue-900">{customerInvoices.length}</span> من أصل{' '}
                                    <span className="font-bold text-blue-900">{totalItems}</span> معاملة
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2.5 bg-white border-2 border-blue-200 rounded-lg 
                                        text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed 
                                        transition-colors"
                                    >
                                        <FiChevronRight />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-lg font-medium ${currentPage === pageNum
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2.5 bg-white border-2 border-blue-200 rounded-lg 
                                        text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed 
                                        transition-colors"
                                    >
                                        <FiChevronLeft />
                                    </button>
                                    <span className="text-blue-700 text-sm">
                                        صفحة <span className="font-bold">{currentPage}</span> من{' '}
                                        <span className="font-bold">{totalPages}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 bg-blue-50 border-t border-blue-200 text-center">
                    <div className="flex flex-wrap justify-center gap-4 text-blue-600 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>مدفوع</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>إجمالي</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>مستحق</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>ضريبة</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default DetailsModal

// import React, { useEffect, useState, useRef } from 'react'
// import { motion } from 'framer-motion'
// import { useSelector } from 'react-redux'
// import { toast } from 'react-toastify'
// import { api } from '../../https'
// import { IoCloseCircle } from "react-icons/io5";
// import { FaPrint } from "react-icons/fa";

// const DetailsModal = ({ setIsDetailsModal }) => {
//     const customerData = useSelector((state) => state.customer)
//     const customer = customerData.customerId

//     const [customerInvoices, setCustomerInvoices] = useState([])
//     const [loading, setLoading] = useState(false)
    
//     // State for pagination, sort and search
//     const [currentPage, setCurrentPage] = useState(1)
//     const [invoicesPerPage, setInvoicesPerPage] = useState(10)
//     const [sortBy, setSortBy] = useState('createdAt')
//     const [sortOrder, setSortOrder] = useState('desc')
//     const [searchTerm, setSearchTerm] = useState('')
//     const [totalPages, setTotalPages] = useState(1)
//     const [totalItems, setTotalItems] = useState(0)

//     // Fetch customer invoices with pagination, sort and search
//     const fetchCustomerDetails = async () => {
//         setLoading(true)
//         try {
//             const response = await api.post('/api/invoice/customerDetails', {
//                 customer,
//                 page: Number(currentPage),        // Convert to number
//                 limit: Number(invoicesPerPage),   // Convert to number
//                 sortBy: sortBy,
//                 sortOrder: sortOrder,
//                 search: searchTerm
//             })

//             if (response.data.success) {
//                 setCustomerInvoices(response.data.data)
//                 setTotalPages(response.data.pagination.totalPages)
//                 setTotalItems(response.data.pagination.totalItems)
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log('Error details:', error.response?.data)
//             toast.error(error.response?.data?.message || 'Error fetching invoices')
//         } finally {
//             setLoading(false)
//         }
//     };




//     // Helper functions for pagination and sorting
//     const handlePageChange = (newPage) => {
//         setCurrentPage(newPage)
//     }

//     const handleSortChange = (field) => {
//         if (sortBy === field) {
//             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
//         } else {
//             setSortBy(field)
//             setSortOrder('desc')
//         }
//     }

//     const handleSearch = (term) => {
//         setSearchTerm(term)
//         setCurrentPage(1) // Reset to first page when searching
//     }

//     const handleInvoicesPerPageChange = (value) => {
//         setInvoicesPerPage(value)
//         setCurrentPage(1) // Reset to first page when changing items per page
//     }

//     useEffect(() => {
//         fetchCustomerDetails()
//     }, [customer, currentPage, invoicesPerPage, sortBy, sortOrder, searchTerm])

//     // Printing
//     const invoiceRef = useRef(null)
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML
//         const WinPrint = window.open("", "", "width=900, height=650")

//         WinPrint.document.write(` 
//             <html>
//                 <head>
//                     <title>Customer Statement</title>
//                     <style>
//                         body { font-family: Arial, sans-serif; padding: 20px; }
//                         .receipt-container { width: 100%; }
//                         h2 { text-align: center; }
//                         table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                         th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                         th { background-color: #f2f2f2; }
//                         .controls { display: none; }
//                         .pagination { display: none; }
//                         .button { display: none; }
//                     </style>
//                 </head>
//                 <body>
//                     ${printContent}
//                 </body>
//             </html>
//         `)

//         WinPrint.document.close()
//         WinPrint.focus()
//         setTimeout(() => {
//             WinPrint.print()
//             WinPrint.close()
//         }, 1000)
//     }

//     return (
//         <div dir='rtl' className="fixed inset-0 flex items-center justify-center z-50" 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>

//             <div className='bg-white p-2 rounded-sm shadow-lg/30 w-[50vw] max-w-6xl md:mt-1 mt-1 h-[calc(100vh)] 
//             overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hidden'>
//                 {/* Receipt content for printing */}
//                 <div ref={invoiceRef} className=''>

                  

//                     <div className ='flex flex-col shadow-xl bg-white'>
                       
//                         <div className='flex justify-between items-center p-2'>
//                             <h2 className='text-sm font-bold text-center mb-2 text-[#1a1a1a]'>كشف حساب العملاء</h2>

//                             <div className='button flex justify-end items-center cursor-pointer gap-3'>
//                                 <button onClick={handlePrint} className='rounded-full text-[#0ea5e9] hover:bg-[#0ea5e9]/30 
//                                 cursor-pointer rounded-xs'>
//                                     <FaPrint size={22} />
//                                 </button>
//                                 <button onClick={() => setIsDetailsModal(false)} className='rounded-full text-[#be3e3f] hover:bg-[#be3e3f]/30 
//                                 cursor-pointer rounded-xs border-b border-[#be3e3f]'>
//                                     <IoCloseCircle size={22} />
//                                 </button>

//                             </div>

//                         </div>
                        
//                         <div className ='flex items-center justify-between p-1'>
//                             <p className={`text-center text-xs font-normal text-[#0ea5e9]`}>
//                                 العميل : <span className='text-xs text-[#1a1a1a] font-semibold'>
//                                     {customerData.customerName}</span>
//                             </p>
//                             <p className ='text-xs font-normal text-[#0ea5e9]'>رصيده الحالي : 
//                                 <span className ='text-xs  text-[#1a1a1a] font-semibold'> {customerData.balance}</span>
//                                 <span className ='text-xs text-[#0ea5e9] font-normal'> ر.ع</span>
//                             </p>

//                         </div>
                        
//                     </div>

                 
//                     {/* Search and Controls - hidden in print */}
//                     <div className='flex justify-center flex-wrap gap-2 mb-4 mt-5 controls'>
//                         <div className="search-bar">
//                             <input
//                                 type="text"
//                                 placeholder="بحث ..."
//                                 value={searchTerm}
//                                 onChange={(e) => handleSearch(e.target.value)}
//                                 className="border border-[#d2b48c] p-1 rounded-sm text-xs"
//                             />
//                         </div>
                        
//                         <select
//                             value={sortBy}
//                             onChange={(e) => handleSortChange(e.target.value)}
//                             className="border p-1 border-[#d2b48c] rounded-sm text-xs"
//                         >
//                             <option value="createdAt">Date Created</option>
//                             <option value="invoiceNumber">Invoice Number</option>
//                             <option value="invoiceType">Invoice Type</option>
//                             <option value="bills.total">Total Amount</option>
//                         </select>
                        
//                         <select 
//                             value={invoicesPerPage} 
//                             onChange={(e) => handleInvoicesPerPageChange(Number(e.target.value))}
//                             className="border border-[#d2b48c] p-1 rounded text-xs"
//                         >
//                             <option value={5}>5 per page</option>
//                             <option value={10}>10 per page</option>
//                             <option value={20}>20 per page</option>
//                             <option value={50}>50 per page</option>
//                         </select>
//                     </div>

//                     <div className='mt-2 overflow-x-auto'>
//                         <div className='overflow-x-auto px-5'>
//                             <table className='w-full text-left text-[#1a1a1a] h-[calc(100vh-30rem)]'>
//                                 <thead className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                     <tr>
//                                         <th className='p-2'></th>
//                                         <th className='p-2'>نوع الاجراء</th>
//                                         <th className='p-2'>رقم الاجراء</th>
//                                         <th className='p-2'>اجمالي</th>
//                                         <th className='p-2'>ضريبه</th>
//                                         <th className='p-2'>اجمالي كلي</th>
//                                         <th className='p-2'>المدفوع</th>
//                                         <th className='p-2'>الرصيد</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {loading ? (
//                                         <tr>
//                                             <td colSpan="7" className='p-2 text-center'>
//                                                 تحميل ...
//                                             </td>
//                                         </tr>
//                                     ) : customerInvoices.length === 0 ? (
//                                         <tr>
//                                             <td colSpan="7" className='p-2 text-center text-xs text-[#be3e3f]'>
//                                                 قائمه كشف الحساب فارغه حاليا !
//                                             </td>
//                                         </tr>
//                                     ) : (
//                                         customerInvoices.map((invoice, index) => (
//                                             <tr
//                                                 key={index}
//                                                 className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                                     hover:bg-[#F1E8D9] cursor-pointer'
//                                             >
//                                                 <td className='p-2 font-semibold bg-zinc-100'>{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
//                                                 <td className='p-2 font-semibold bg-zinc-100'>{invoice.invoiceType}</td>
//                                                 <td className='p-2'>{invoice.invoiceNumber}</td>
//                                                 <td className='p-2'>{invoice.bills.total.toFixed(2)}</td>
//                                                 <td className='p-2'>{invoice.bills.tax.toFixed(2)}</td>
//                                                 <td className='p-2'>{invoice.bills.totalWithTax.toFixed(2)}</td>
//                                                 <td className='p-2 text-blue-600'>{invoice.bills.payed.toFixed(2)}</td>
//                                                 <td className='p-2'>{invoice.bills.balance.toFixed(2)}</td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>

//                                 <tfoot> 
//                                     <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-700 text-xs font-semibold">
//                                         <td className="p-2" colSpan={3}>اجماليات</td>
//                                         <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0).toFixed(2)}</td>
//                                         <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.tax, 0).toFixed(2)}</td>
//                                         <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0).toFixed(2)}</td>
//                                         <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.payed, 0).toFixed(2)}</td>
//                                         <td className="p-2">{customerInvoices.reduce((acc, invoice) => acc + invoice.bills.balance, 0).toFixed(2)}</td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Pagination - hidden in print */}
//                     <div className="pagination flex justify-between items-center mt-4 controls">
//                         <button
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             disabled={currentPage === 1 || loading}
//                             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
//                         >
//                             Previous
//                         </button>
                        
//                         <span className="text-sm">
//                             Page {currentPage} of {totalPages} | Total Invoices: {totalItems}
//                         </span>
                        
//                         <button
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             disabled={currentPage === totalPages || loading}
//                             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
         
//             </div>
//         </div>
//     )
// }

// export default DetailsModal