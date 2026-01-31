import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaPrint, FaTimes, FaCheckCircle, FaFileInvoiceDollar, FaUser, FaSignature, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa'
import { FiDownload, FiPrinter, FiX } from 'react-icons/fi'

const PaymentInvoice = ({ paymentInfo, setPaymentInvoice, fetchSuppliers }) => {
    const invoiceRef = useRef(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=700");

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>إيصال دفع - ${paymentInfo.supplierName}</title>
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
                            max-width: 500px; 
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
                        .success-icon { 
                            font-size: 60px; 
                            color: #059669; 
                            margin: 20px 0; 
                        }
                        .payment-details { 
                            margin: 25px 0; 
                        }
                        .detail-row { 
                            display: flex; 
                            justify-content: space-between; 
                            padding: 12px 0; 
                            border-bottom: 1px dashed #d1d5db; 
                        }
                        .amount-row { 
                            background: linear-gradient(to right, #dbeafe, #eff6ff); 
                            border-radius: 10px; 
                            padding: 20px; 
                            margin: 25px 0; 
                            border: 2px solid #3b82f6;
                        }
                        .signature-section { 
                            margin-top: 40px; 
                            text-align: center; 
                        }
                        .signature-line { 
                            width: 70%; 
                            height: 1px; 
                            background: #374151; 
                            margin: 40px auto 10px; 
                        }
                        .thank-you { 
                            color: #1e40af; 
                            text-align: center; 
                            font-size: 16px; 
                            margin-top: 25px; 
                            font-weight: 500;
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 30px; 
                            color: #6b7280; 
                            font-size: 12px; 
                            border-top: 1px solid #d1d5db; 
                            padding-top: 15px;
                        }
                        .controls { display: none !important; }
                        .button { display: none !important; }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">
                        ${printContent}
                    </div>
                </body>
            </html>
        `);

        WinPrint.document.close();
        WinPrint.focus();
        
        setTimeout(() => {
            WinPrint.print();
            WinPrint.close();
            setIsPrinting(false);
            fetchSuppliers();
        }, 1000);
    }

    const handleClose = () => {
        setPaymentInvoice(false);
        fetchSuppliers();
    }

    const formatDate = () => {
        const now = new Date();
        return now.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const getPaymentMethodIcon = (method) => {
        switch(method) {
            case 'Cash': return <FaMoneyBillWave className="text-green-600" />;
            case 'Online': return <FaCreditCard className="text-blue-600" />;
            default: return <FaMoneyBillWave className="text-gray-600" />;
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] border border-blue-100"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '90vh' }}
            >
                {/* Header - Fixed */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FaFileInvoiceDollar className="text-white text-xl" />
                            </div>
                            <h2 className="text-white text-lg font-bold">إيصال الدفع</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
                            disabled={isPrinting}
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6" ref={invoiceRef}>
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                            className="relative"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-white text-4xl" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                            >
                                <span className="text-white text-xs font-bold">✓</span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-center mb-2 text-blue-900">تم الدفع بنجاح</h2>
                    <p className="text-center text-blue-600 text-sm mb-6">شكراً لك على الدفع</p>

                    {/* Invoice Details */}
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaFileInvoiceDollar className="text-blue-600" />
                                </div>
                                <span className="text-blue-700 font-medium">رقم الإجراء:</span>
                            </div>
                            <span className="text-blue-900 font-bold">#{paymentInfo.invoiceNumber}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaUser className="text-blue-600" />
                                </div>
                                <span className="text-blue-700 font-medium">المورد:</span>
                            </div>
                            <span className="text-blue-900 font-bold">{paymentInfo.supplierName}</span>
                        </div>

                        {/* Payment Method */}
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    {getPaymentMethodIcon(paymentInfo.paymentMethod)}
                                </div>
                                <span className="text-blue-700 font-medium">طريقة الدفع:</span>
                            </div>
                            <span className="text-blue-900 font-bold">{paymentInfo.paymentMethod}</span>
                        </div>
                    </div>

                    {/* Amount Section */}
                    <div className="mb-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-300">
                            <div className="text-center mb-3">
                                <span className="text-blue-600 text-sm font-medium">المبلغ المدفوع</span>
                            </div>
                            <div className="flex justify-center items-baseline">
                                <span className="text-3xl font-bold text-blue-900">
                                    {paymentInfo.bills?.payed?.toFixed(2) || '0.00'}
                                </span>
                                <span className="text-blue-700 font-semibold mr-2">ر.ع</span>
                            </div>
                        </div>
                    </div>

                    {/* Date and Signature */}
                    <div className="space-y-5">
                        <div className="text-center">
                            <div className="text-blue-600 text-sm font-medium mb-1">تاريخ وتوقيت الدفع</div>
                            <div className="text-blue-900 font-semibold">{formatDate()}</div>
                        </div>

                        {/* Signature Section */}
                        <div className="border-t border-blue-200 pt-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <FaSignature className="text-blue-600" />
                                        <span className="text-blue-700 text-sm font-medium">توقيع المستلم</span>
                                    </div>
                                    <div className="h-px w-full bg-gray-300 my-2"></div>
                                    <div className="text-blue-900 text-xs">....................................</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <FaUser className="text-blue-600" />
                                        <span className="text-blue-700 text-sm font-medium">توقيع المورد</span>
                                    </div>
                                    <div className="h-px w-full bg-gray-300 my-2"></div>
                                    <div className="text-blue-900 text-xs">....................................</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <div className="mt-6 text-center">
                        <p className="text-blue-600 text-sm">
                            تم تسجيل الدفع بنجاح في سجلات النظام بتاريخ {new Date().toLocaleDateString('ar-SA')}
                        </p>
                    </div>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="px-4 sm:px-6 py-4 bg-blue-50 border-t border-blue-200 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleClose}
                            disabled={isPrinting}
                            className="flex-1 px-4 py-3 bg-white border-2 border-blue-300 text-blue-700 
                            rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 
                            flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            <FiX size={18} />
                            إغلاق
                        </button>
                        <button
                            onClick={handlePrint}
                            disabled={isPrinting}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                            text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 
                            transition-all duration-200 flex items-center justify-center gap-2 
                            disabled:opacity-50 cursor-pointer"
                        >
                            {isPrinting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 
                                    border-white border-t-transparent"></div>
                                    جاري الطباعة...
                                </>
                            ) : (
                                <>
                                    <FiPrinter size={18} />
                                    طباعة الإيصال
                                </>
                            )}
                        </button>
                    </div>
                    <div className="mt-3 text-center">
                        <button
                            onClick={handlePrint}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center 
                            justify-center gap-1 mx-auto cursor-pointer"
                        >
                            <FiDownload />
                            تحميل نسخة PDF
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 bg-blue-900/5 border-t border-blue-200 flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 text-blue-600 text-xs">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>إيصال رسمي - يحتفظ به للرجوع إليه عند الحاجة</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default PaymentInvoice;


// import React, { useRef } from 'react'
// import { motion } from 'framer-motion'

// const PaymentInvoice = ({paymentInfo ,setPaymentInvoice, fetchSuppliers}) => {
//     const invoiceRef = useRef(null);

//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML;
//         const WinPrint = window.open("", "", "width=900, height=650");

//         WinPrint.document.write(` 
//                 <html>
//                     <head>
//                         <title>Order Receipt</title>
//                         <style>
//                             body { fonst-family: Arial, sans-serif; padding: 20px; }
//                             .receip-container { width: 300px; border: 1px solid #ddd; padding: 10px;}
    
//                             h2 {text-align: center;}
//                         </style>
//                     </head>
//                     <body>
//                     ${printContent}
//                     </body>
//                 </html>
//                 `);
//         WinPrint.document.close();
//         WinPrint.focus();
//         setTimeout(() => {
//             WinPrint.print();
//             WinPrint.close();
//             fetchSuppliers();
//         }, 1000);
//     }


//     const handleClose = () => {
//         setPaymentInvoice(false)
//         fetchSuppliers()
//     }


//     return (

//         <div className='fixed inset-0 bg-opacity-50 flex justify-center items-center'>
//             <div className='bg-zinc-100 h-[calc(100vh-5rem)] p-4 rounded-lg shadow-lg  w-[400px]'>
//                 {/* Receipt content for printing */}
//                 <div ref={invoiceRef} className='p-4'>

//                     {/*Receipt Header*/}
//                     <div className='flex justify-center nb-4'>
//                         <motion.div
//                             initial={{ scale: 0, opacity: 0 }}
//                             animate={{ scale: 1.0, opacity: 1 }}
//                             transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
//                             className='mt-0 w-12 h-12 border-8 border-blue-500 rounded-full flex items-center'
//                         >
//                             <motion.span
//                                 initial={{ scale: 0, opacity: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ delay: 0.3, duration: 0.3 }}
//                                 className='text-2xl'
//                             >

//                             </motion.span>
//                         </motion.div>

//                     </div>

//                     <h2 className='text-xl font-bold text-center mb-2'>ايصال دفع</h2>
//                     <p className={`text-center text-gray-600`}>Thank you for your payment</p>

//                     {/*Order Details*/}
//                     <div className='mt-4 border-t pt-4  text-sm text-gray-700'>
//                         <p className ='mb-2'>
//                             <strong>رقم الاجراء : </strong>
//                             {paymentInfo.invoiceNumber}
//                         </p>
//                         <p>
//                             <strong>المورد / السيد : </strong> {paymentInfo.supplierName}
//                         </p>
                   
//                     </div>

            


//                     {/*Bills Summery */}
//                     <div className={`mt-4 border-t pt-4 text-sm`}>
//                         <p className='flex mt-1'>
//                             <span className='text-sm font-semibold'>المبلغ  : </span><span className='text-xs mx-1'>ر.ع</span><span className='text-xs font-semibold'>{paymentInfo.bills.payed.toFixed(2)}</span>
//                         </p>
//                         <p className ='mt-5'>
//                             <span className='text-sm font-semibold'>التوقيع : </span><span className='text-xs font-semibold'>-----------------------------</span>
//                         </p>
//                         <p className='mt-5'>
//                             <strong className='text-xs'>التوقيع : </strong><span className='text-xs font-semibold'>--------------------</span>
//                         </p>
//                     </div>

//                     {/**payment Details */}
//                     <div className={`mb-2 mt-2 border-t pt-4 text-xs`}>
//                         {paymentInfo.paymentMethod === 'Cash' || 'Online' ? (
//                             <p>
//                                 <strong>طريقه الدفع : </strong>{" "}
//                                 {paymentInfo.paymentMethod}
//                             </p>
//                         ) : (
//                             <>
                                
//                             </>
//                         )}

//                     </div>


//                 </div>

//                 {/** Buttons */}
//                 <div className='flex justify-between mt-4 rounded-sm border border-gray-300'>
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
// }


// export default PaymentInvoice ;