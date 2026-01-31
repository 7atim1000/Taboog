import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { FaCheck, FaPrint, FaTimes, FaReceipt, FaCalendarAlt, FaUser, FaShoppingCart, FaCreditCard } from 'react-icons/fa'

const BuyInvoice = ({buyInfo, setShowInvoice}) => {
    const invoiceRef = useRef(null);
    
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");
        
        WinPrint.document.write(` 
            <html>
                <head>
                    <title>فاتورة الشراء</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Arial, sans-serif; 
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
                        }
                        h2 {
                            text-align: center; 
                            color: #1e40af;
                            border-bottom: 2px solid #1e40af;
                            padding-bottom: 10px;
                        }
                        .print-header {
                            background: #1e40af;
                            color: white;
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 15px 0;
                        }
                        .items-table th, .items-table td {
                            border: 1px solid #d1d5db;
                            padding: 8px;
                            text-align: right;
                        }
                        .items-table th {
                            background-color: #f3f4f6;
                            color: #374151;
                            font-weight: 600;
                        }
                        .summary-section {
                            background: #f0f9ff;
                            padding: 15px;
                            border-radius: 8px;
                            margin-top: 15px;
                            border: 1px solid #dbeafe;
                        }
                        .payment-method {
                            background: #fef3c7;
                            padding: 10px;
                            border-radius: 6px;
                            margin: 10px 0;
                            text-align: center;
                        }
                        .no-print { display: none !important; }
                        .invoice-footer {
                            text-align: center;
                            margin-top: 20px;
                            padding-top: 10px;
                            border-top: 1px solid #e5e7eb;
                            color: #6b7280;
                            font-size: 12px;
                        }
                        .total-row {
                            font-weight: bold;
                            background: #dbeafe;
                        }
                        .company-info {
                            text-align: center;
                            margin-bottom: 20px;
                            color: #4b5563;
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-container">
                        <div class="company-info">
                            <h1>فاتورة الشراء</h1>
                            <p>نظام إدارة المشتريات</p>
                        </div>
                        ${printContent}
                        <div class="invoice-footer">
                            <p>شكراً لتعاملك معنا</p>
                            <p>يرجى الاحتفاظ بنسخة من هذه الفاتورة</p>
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
                                <FaReceipt className='text-white w-5 h-5' />
                            </div>
                            <div>
                                <h2 className='text-white font-bold text-lg'>فاتورة الشراء</h2>
                                <p className='text-blue-100 text-sm'>تم تأكيد عملية الشراء</p>
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
                        <h2 className='text-white text-center text-xl font-bold'>فاتورة الشراء</h2>
                        <p className='text-center text-blue-100'>مؤسسة المشتريات</p>
                    </div>

                    {/* Invoice Details */}
                    <div className='space-y-4 mb-4'>
                        <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                            <div className='flex items-center gap-2 mb-2'>
                                <FaCalendarAlt className='text-blue-600 w-4 h-4' />
                                <h3 className='text-sm font-semibold text-blue-800'>تفاصيل الفاتورة</h3>
                            </div>
                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>تاريخ الفاتورة:</span>
                                    <span className='font-medium text-gray-800'>
                                        {new Date(buyInfo.date).toLocaleDateString('ar-SA')}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>رقم الفاتورة:</span>
                                    <span className='font-bold text-blue-700'>{buyInfo.invoiceNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                            <div className='flex items-center gap-2 mb-2'>
                                <FaUser className='text-blue-600 w-4 h-4' />
                                <h3 className='text-sm font-semibold text-blue-800'>معلومات المورد</h3>
                            </div>
                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>اسم المورد:</span>
                                    <span className='font-bold text-gray-800'>
                                        {buyInfo.supplier?.supplierName || buyInfo.supplierName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className='mb-4'>
                        <h3 className='text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2'>
                            <FaShoppingCart className='w-4 h-4' />
                            <span>أصناف المشتريات</span>
                            <span className='bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full'>
                                {buyInfo.items?.length || 0}
                            </span>
                        </h3>
                        <div className='border rounded-lg overflow-hidden'>
                            <table className='w-full text-sm'>
                                <thead className='bg-blue-50'>
                                    <tr>
                                        <th className='py-2 px-3 text-right text-xs font-semibold text-blue-700'>الصنف</th>
                                        <th className='py-2 px-3 text-center text-xs font-semibold text-blue-700'>الكمية</th>
                                        <th className='py-2 px-3 text-left text-xs font-semibold text-blue-700'>المبلغ</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {buyInfo.items?.map((item, index) => (
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
                                                {item.price?.toFixed(2)} ر.ع
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bills Summary */}
                    <div className='bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg p-4 border border-blue-100'>
                        <h3 className='text-sm font-semibold text-blue-800 mb-3'>ملخص الفاتورة</h3>
                        <div className='space-y-2'>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>الإجمالي:</span>
                                <span className='text-sm font-medium text-gray-800'>
                                    {buyInfo.bills?.total?.toFixed(2)} ر.ع
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>الضريبة:</span>
                                <span className='text-sm font-medium text-gray-800'>
                                    {buyInfo.bills?.tax?.toFixed(2)} ر.ع
                                </span>
                            </div>
                            <div className='pt-2 border-t border-gray-200 mt-2'>
                                <div className='flex justify-between'>
                                    <span className='text-base font-bold text-blue-800'>الإجمالي الكلي:</span>
                                    <span className='text-lg font-bold text-blue-800'>
                                        {buyInfo.bills?.totalWithTax?.toFixed(2)} ر.ع
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className='mt-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <FaCreditCard className='text-blue-600 w-4 h-4' />
                            <h3 className='text-sm font-semibold text-blue-800'>طريقة الدفع</h3>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${
                            buyInfo.paymentMethod === 'Cash' 
                                ? 'bg-green-50 border border-green-100 text-green-700'
                                : 'bg-blue-50 border border-blue-100 text-blue-700'
                        }`}>
                            <div className='flex items-center justify-between'>
                                <span className='font-medium'>{buyInfo.paymentMethod === 'Cash' ? 'نقدي' : 'الكتروني'}</span>
                                <span className='text-xs px-2 py-1 rounded-full bg-white/50'>
                                    {buyInfo.paymentMethod}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Message for Print */}
                    <div className='mt-4 pt-4 border-t border-gray-100 text-center no-print'>
                        <p className='text-xs text-gray-500'>شكراً لتعاملك معنا</p>
                        <p className='text-xs text-gray-400 mt-1'>يرجى الاحتفاظ بنسخة من الفاتورة</p>
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

export default BuyInvoice;

// import React, { useRef } from 'react'
// import { motion } from 'framer-motion'
// //import { faCheck } from 'react-icons/fa6'

// const BuyInvoice = ({buyInfo, setShowInvoice}) => {

//     const invoiceRef = useRef(null);
    
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML;
//         const WinPrint = window.open("", "", "width=900, height=650");
        
//         WinPrint.document.write(` 
//             <html>
//                 <head>
//                     <title>Order Receipt</title>
//                     <style>
//                         body { fonst-family: Arial, sans-serif; padding: 20px; }
//                         .receip-container { width: 300px; border: 1px solid #ddd; padding: 10px;}

//                         h2 {text-align: center;}
//                     </style>
//                 </head>
//                 <body>
//                 ${printContent}
//                 </body>
//             </html>
//             `);
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

//         <div className ='fixed inset-0 bg-opacity-50 flex justify-center items-center'>
//             <div className = 'bg-white p-4 rounded-lg shadow-lg  w-[400px]'>
//                 {/* Receipt content for printing */}
//                 <div ref ={invoiceRef} className ='p-4'>
                    
//                     {/*Receipt Header*/}
//                     <div className ='flex justify-center nb-4'>
//                         <motion.div
//                            initial ={{ scale: 0, opacity: 0 }}
//                            animate ={{ scale: 1.0, opacity: 1 }}
//                            transition ={{ duration: 0.5, type: "spring", stiffness: 150 }}
//                            className ='mt-0 w-12 h-12 border-8 border-[#0ea5e9] rounded-full flex items-center'
//                         >
//                         <motion.span
//                             initial ={{ scale: 0, opacity: 0 }}
//                             animate ={{ scale: 1 }}
//                             transition ={{ delay: 0.3, duration: 0.3 }}
//                             className ='text-2xl'    
//                         >

//                         </motion.span>
//                         </motion.div>

//                     </div>

//                     <h2 className ='text-xl font-bold text-center mb-2'>فاتوره شراء</h2>
                    
//                     {/*Order Details*/}
//                     <div className ='mt-4 border-t pt-4  text-sm text-gray-700'>
//                          <p>
//                             <strong>تاريخ الفاتوره : </strong>
//                             {new Date(buyInfo.date).toLocaleDateString('en-GB')}
//                         </p>
//                         <p>
//                             <strong>رقم الفاتوره : </strong>
//                             {buyInfo.invoiceNumber} 
//                         </p>
//                         <p>
//                             <strong>المورد / السيد : </strong> 
//                             {buyInfo.supplier.supplierName} 
//                         </p>
                      
//                     </div>

//                     {/*Items Summary*/}
//                     <div className ='mt-4 border-t pt-4'>
//                         <h3 className ='text-sm font-semibold'>اصناف المشتروات</h3>
//                             <ul className ='text-sm text-gray-700'>
//                                 {buyInfo.items.map((item, index) => (
//                                     <li 
//                                         key= {index}
//                                         className ='flex justify-between items-center text-xs'
//                                     >
                                        
//                                         <span>
//                                             {item.name} - {item.quantity}
//                                         </span>
//                                         <span>ر.ع {item.price.toFixed(2)}</span>
//                                     </li>
//                                 ))}  
//                             </ul>
//                     </div>
 

//                     {/*Bills Summery */}
//                     <div className ={`mt-4 border-t pt-4 text-sm`}>
//                         <p className ='flex gap-1'>
//                             <span className ='text-sm font-semibold'>الاجمالي : </span>
//                             <span className ='text-xs'>ر.ع </span>
//                             <span className ='text-sm font-semibold'>{buyInfo.bills.total.toFixed(2)}</span>  
//                         </p>
//                         <p>
//                              <span className ='text-sm font-semibold'>ضريبه : </span>
//                              <span className ='text-xs'>ر.ع </span>
//                              <span className ='text-sm font-semibold'>{buyInfo.bills.tax.toFixed(2)}</span>
//                         </p>
//                         <p className ='mt-2'>
//                             <strong className ='text-xs'>الاجمالي الكلي : </strong> 
//                             <span className ='text-xs'>ر.ع </span>
//                             <span className ='text-sm font-semibold'>{buyInfo.bills.totalWithTax.toFixed(2)}</span>
//                         </p>
//                     </div>

//                     {/**payment Details */}
//                     <div className ={`mb-2 mt-2 border-t pt-4 text-xs`}>
//                         {buyInfo.paymentMethod === 'Cash' || 'Online' ? (
//                             <p>
//                                <strong>طريقه الدفع: </strong>{" "}
//                                {buyInfo.paymentMethod}  
//                             </p>
//                         ): (
//                             <>
//                             {/*Online payment */}
//                             </>
//                         )}
                      
//                     </div>

                    
//                 </div>
                
//                 {/** Buttons */}
//                 <div className ='flex justify-between mt-4 border border-gray-300 rounded-sm'>
//                     <button
//                         onClick={handlePrint}
//                         className ='text-[#0ea5e9] font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >  
//                         طباعه
//                     </button>
//                     <button
//                         onClick={handleClose}
//                         className ='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >
//                         اغلاق
//                     </button>

//                 </div>
//             </div>
//         </div>
//     );
// };
// export default BuyInvoice;