import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { FaCheck, FaPrint, FaTimes, FaReceipt, FaCalendarAlt, FaBox, FaIndustry } from 'react-icons/fa'

const ProduceInvoice = ({produceInfo, setShowInvoice}) => {
    const invoiceRef = useRef(null);
    
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");
        
        WinPrint.document.write(` 
            <html dir="rtl">
                <head>
                    <title>فاتورة الإنتاج</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', 'Arial', sans-serif; 
                            padding: 20px; 
                            direction: rtl;
                            background: white;
                        }
                        .invoice-container { 
                            width: 100%; 
                            max-width: 400px; 
                            margin: 0 auto;
                            border: 2px solid #1e40af;
                            border-radius: 12px;
                            padding: 20px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .print-header {
                            background: #1e40af;
                            color: white;
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        h2 {
                            text-align: center; 
                            color: #1e40af;
                            border-bottom: 2px solid #1e40af;
                            padding-bottom: 10px;
                            margin-bottom: 20px;
                        }
                        .company-info {
                            text-align: center;
                            margin-bottom: 25px;
                            color: #4b5563;
                        }
                        .company-info h1 {
                            color: #1e40af;
                            font-size: 24px;
                            margin-bottom: 5px;
                        }
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                            direction: rtl;
                        }
                        .items-table th, .items-table td {
                            border: 1px solid #d1d5db;
                            padding: 10px;
                            text-align: right;
                            font-size: 14px;
                        }
                        .items-table th {
                            background-color: #f3f4f6;
                            color: #374151;
                            font-weight: 600;
                        }
                        .summary-section {
                            background: #f0f9ff;
                            padding: 20px;
                            border-radius: 10px;
                            margin-top: 20px;
                            border: 2px solid #dbeafe;
                        }
                        .summary-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 8px 0;
                            border-bottom: 1px solid #e5e7eb;
                        }
                        .summary-row:last-child {
                            border-bottom: none;
                            font-weight: bold;
                            font-size: 16px;
                            color: #1e40af;
                        }
                        .invoice-footer {
                            text-align: center;
                            margin-top: 25px;
                            padding-top: 15px;
                            border-top: 2px dashed #e5e7eb;
                            color: #6b7280;
                            font-size: 12px;
                        }
                        .no-print { 
                            display: none !important; 
                        }
                        .payment-details {
                            background: #fef3c7;
                            padding: 15px;
                            border-radius: 8px;
                            margin: 15px 0;
                            text-align: center;
                            border: 1px solid #fbbf24;
                        }
                        .total-amount {
                            font-size: 20px;
                            font-weight: bold;
                            color: #059669;
                            text-align: center;
                            margin: 15px 0;
                        }
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .no-print { display: none !important; }
                            .invoice-container { 
                                border: none; 
                                box-shadow: none;
                                max-width: 100%;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-container">
                        <div class="company-info">
                            <h1>فاتورة الإنتاج</h1>
                            <p>نظام إدارة الإنتاج والتصنيع</p>
                        </div>
                        ${printContent}
                        <div class="invoice-footer">
                            <p>شكراً لاستخدام نظام الإنتاج</p>
                            <p>يرجى الاحتفاظ بنسخة من هذه الفاتورة كسجل للإنتاج</p>
                            <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
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
    }

    const handleClose = () => {
        setShowInvoice(false);
    };
    
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50'>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='bg-white rounded-xl shadow-2xl w-full max-w-md'
            >
                {/* Header with gradient */}
                <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-t-xl'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-white/20 p-2 rounded-lg'>
                                <FaIndustry className='text-white w-5 h-5' />
                            </div>
                            <div>
                                <h2 className='text-white font-bold text-lg'>فاتورة الإنتاج</h2>
                                <p className='text-blue-100 text-sm'>تم تأكيد عملية الإنتاج</p>
                            </div>
                        </div>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className='w-10 h-10 border-4 border-white/30 rounded-full flex items-center justify-center bg-white/20'
                        >
                            <FaCheck className='text-white w-5 h-5' />
                        </motion.div>
                    </div>
                </div>

                {/* Invoice Content */}
                <div ref={invoiceRef} className='p-4'>
                    {/* Print Header */}
                    <div className='print-header no-print'>
                        <h2 className='text-white text-center text-xl font-bold'>فاتورة الإنتاج</h2>
                        <p className='text-center text-blue-100'>مصنع الإنتاج</p>
                    </div>

                    {/* Invoice Details */}
                    <div className='space-y-4 mb-4'>
                        <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                            <div className='flex items-center gap-2 mb-2'>
                                <FaReceipt className='text-blue-600 w-4 h-4' />
                                <h3 className='text-sm font-semibold text-blue-800'>تفاصيل الفاتورة</h3>
                            </div>
                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>رقم الفاتورة:</span>
                                    <span className='font-bold text-blue-700'>{produceInfo.invoiceNumber}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>تاريخ الإنتاج:</span>
                                    <span className='font-medium text-gray-800'>
                                        {new Date(produceInfo.date).toLocaleDateString('ar-SA')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className='mb-4'>
                        <h3 className='text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2'>
                            <FaBox className='w-4 h-4' />
                            <span>أصناف الإنتاج</span>
                            <span className='bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full'>
                                {produceInfo.items?.length || 0}
                            </span>
                        </h3>
                        <div className='border rounded-lg overflow-hidden'>
                            <table className='w-full text-sm'>
                                <thead className='bg-blue-50'>
                                    <tr>
                                        <th className='py-2 px-3 text-right text-xs font-semibold text-blue-700'>الصنف</th>
                                        <th className='py-2 px-3 text-center text-xs font-semibold text-blue-700'>الكمية</th>
                                        <th className='py-2 px-3 text-left text-xs font-semibold text-blue-700'>القيمة</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {produceInfo.items?.map((item, index) => (
                                        <tr key={index} className='hover:bg-gray-50'>
                                            <td className='py-2 px-3 text-right text-sm text-gray-700'>
                                                {item.name}
                                            </td>
                                            <td className='py-2 px-3 text-center text-sm text-gray-700'>
                                                <span className='bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs'>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className='py-2 px-3 text-left text-sm font-medium text-gray-900'>
                                                {item.price?.toFixed(2)} ج.س
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Production Summary */}
                    <div className='bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100'>
                        <h3 className='text-sm font-semibold text-emerald-800 mb-3'>ملخص الإنتاج</h3>
                        <div className='space-y-2'>
                            <div className='flex justify-between items-center py-3'>
                                <div>
                                    <p className='text-sm font-medium text-emerald-600'>إجمالي قيمة الإنتاج</p>
                                    <p className='text-xs text-gray-500'>قيمة جميع الأصناف المنتجة</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-2xl font-bold text-emerald-700'>
                                        {produceInfo.bills?.totalWithTax?.toFixed(2)}
                                    </p>
                                    <p className='text-xs text-gray-500'>ج.س</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Message for Print */}
                    <div className='mt-4 pt-4 border-t border-gray-100 text-center no-print'>
                        <p className='text-xs text-gray-500'>تم تأكيد عملية الإنتاج بنجاح</p>
                        <p className='text-xs text-gray-400 mt-1'>يرجى الاحتفاظ بنسخة من الفاتورة للسجلات</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='p-4 border-t border-gray-100 flex justify-between gap-3'>
                    <button
                        onClick={handlePrint}
                        className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-md'
                    >
                        <FaPrint className='w-4 h-4' />
                        طباعة الفاتورة
                    </button>
                    <button
                        onClick={handleClose}
                        className='flex-1 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer'
                    >
                        <FaTimes className='w-4 h-4' />
                        إغلاق
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProduceInvoice;

// import React, { useRef } from 'react'
// import { motion } from 'framer-motion'

// const ProduceInvoice = ({produceInfo, setShowInvoice}) => {

//     const invoiceRef = useRef(null);
    
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML;
//         const WinPrint = window.open("", "", "width=900, height=650");
        
//         WinPrint.document.write(` 
//             <html dir="rtl">
//                 <head>
//                     <title>فاتوره انتاج</title>
//                     <style>
//                         body { 
//                             font-family: Arial, sans-serif; 
//                             padding: 5px;
//                             direction: rtl;
//                             text-align: right;
//                         }
//                         .receipt-container { 
//                             width: 100%; 
//                         }
//                         h2 { 
//                             text-align: center; 
//                             margin-bottom: 15px;
//                             font-size: 24px;
//                         }
//                         p { 
//                             margin: 8px 0; 
//                             font-size: 16px; 
//                         }
//                         ul { 
//                             list-style: none; 
//                             padding: 0; 
//                             margin: 0;
//                         }
//                         ul li {
//                             display: flex;
//                             justify-content: space-between;
//                             padding: 8px 0;
//                             border-bottom: 1px solid #f1f5f9;
//                             direction: rtl;
//                         }
//                         .flex {
//                             display: flex;
//                         }
//                         .justify-between {
//                             justify-content: space-between;
//                         }
//                         .items-center {
//                             align-items: center;
//                         }
//                         .text-xs {
//                             font-size: 14px;
//                         }
//                         .text-sm {
//                             font-size: 16px;
//                         }
//                         .mt-4 {
//                             margin-top: 16px;
//                         }
//                         .border-t {
//                             border-top: 1px solid #e2e8f0;
//                         }
//                         .pt-4 {
//                             padding-top: 16px;
//                         }
//                         .mb-2 {
//                             margin-bottom: 8px;
//                         }
//                         .nb-4 {
//                             margin-bottom: 16px;
//                         }
//                         .p-4 {
//                             padding: 16px;
//                         }
//                         .rounded-full {
//                             border-radius: 50%;
//                         }
//                         .w-12 {
//                             width: 48px;
//                         }
//                         .h-12 {
//                             height: 48px;
//                         }
//                         .border-8 {
//                             border-width: 8px;
//                         }
//                         .border-\\[\\#0ea5e9\\] {
//                             border-color: #0ea5e9;
//                         }
//                         .text-2xl {
//                             font-size: 24px;
//                         }
//                         .text-xl {
//                             font-size: 20px;
//                         }
//                         .font-bold {
//                             font-weight: bold;
//                         }
//                         .text-center {
//                             text-align: center;
//                         }
//                         .text-gray-700 {
//                             color: #374151;
//                         }
//                         .font-semibold {
//                             font-weight: 600;
//                         }
//                     </style>
//                 </head>
//                 <body>
//                 ${printContent}
//                 </body>
//             </html>
//         `);
//         WinPrint.document.close();
//         WinPrint.focus();
//         setTimeout(() => {
//             WinPrint.print();
//             WinPrint.close();
//         }, 1000);
//     }

//     const handleClose = () => {
//         setShowInvoice(false)
//     };
    
//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex justify-center items-center' 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }} >
//             <div className='bg-white p-4 rounded-lg shadow-lg w-[400px]'>
//                 {/* Receipt content for printing */}
//                 <div ref={invoiceRef} className='p-4'>
//                     {/*Receipt Header*/}
//                     <div className='flex justify-center nb-4'>
//                         <motion.div
//                            initial={{ scale: 0, opacity: 0 }}
//                            animate={{ scale: 1.0, opacity: 1 }}
//                            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
//                            className='mt-0 w-12 h-12 border-8 border-[#0ea5e9] rounded-full flex items-center'
//                         >
//                         <motion.span
//                             initial={{ scale: 0, opacity: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: 0.3, duration: 0.3 }}
//                             className='text-2xl'    
//                         >
//                         </motion.span>
//                         </motion.div>
//                     </div>

//                     <h2 className='text-xl font-bold text-center mb-2'>فاتوره انتاج</h2>
                    
//                     {/*Order Details*/}
//                     <div className='mt-4 border-t pt-4 text-sm text-gray-700'>
//                         <p>
//                             <strong>رقم الفاتوره : </strong>
//                             {produceInfo.invoiceNumber} 
//                         </p>
//                         <p>
//                             <strong>تاريخ الانتاج : </strong>
//                             {new Date(produceInfo.date).toLocaleDateString('en-GB')}
//                         </p>
//                     </div>

//                     {/*Items Summary*/}
//                     <div className='mt-4 border-t pt-4'>
//                         <h3 className='text-sm font-semibold'>الاصناف </h3>
//                             <ul className='text-sm text-gray-700'>
//                                 {produceInfo.items.map((item, index) => (
//                                     <li 
//                                         key={index}
//                                         className='flex justify-between items-center text-xs'
//                                     >
//                                         <span>
//                                             {item.name} - {item.quantity}
//                                         </span>
//                                         <span>ج.س {item.price.toFixed(2)}</span>
//                                     </li>
//                                 ))}  
//                             </ul>
//                     </div>

//                     {/*Bills Summary */}
//                     <div className='mt-4 border-t pt-4 text-sm'>
//                         <p className='mt-2'>
//                             <strong className='text-xs'>انتاج بقيمه : </strong> <span className='text-xs'>ج.س </span>
//                             <span className='text-xs font-semibold'>{produceInfo.bills.totalWithTax.toFixed(2)}</span>
//                         </p>
//                     </div>
//                 </div>
                
//                 {/** Buttons */}
//                 <div className='flex justify-between mt-4 border border-gray-300 rounded-sm'>
//                     <button
//                         onClick={handlePrint}
//                         className='text-[#0ea5e9] font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >  
//                         طباعه
//                     </button>
//                     <button
//                         onClick={handleClose}
//                         className='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >
//                         اغلاق
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProduceInvoice;