import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const PaymentInvoice = ({paymentInfo ,setPaymentInvoice, fetchCustomers}) => {
    const invoiceRef = useRef(null);

    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
                <html>
                    <head>
                        <title>Payment Receipt</title>
                        <style>
                            body { fonst-family: Arial, sans-serif; padding: 20px; }
                            .receip-container { width: 300px; border: 1px solid #ddd; padding: 10px;}
    
                            h2 {text-align: center;}
                        </style>
                    </head>
                    <body>
                    ${printContent}
                    </body>
                </html>
                `);
        WinPrint.document.close();
        WinPrint.focus();
        setTimeout(() => {
            WinPrint.print();
            WinPrint.close();
            fetchCustomers();
        }, 1000);
    };

    const handleClose = () => {
        setPaymentInvoice(false)
        fetchCustomers();
    }


    return (

        <div dir ='rtl' className='fixed inset-0 bg-opacity-50 flex justify-center items-center' 
        style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}}>
            <div className='bg-white h-[calc(100vh-5rem)] p-4 rounded-lg  w-[400px]'>
                {/* Receipt content for printing */}
                <div ref={invoiceRef} className='p-4'>

                    {/*Receipt Header*/}
                    <div className='flex justify-center nb-4'>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.0, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                            className='mt-0 w-12 h-12 border-8 border-blue-500 rounded-full flex items-center'
                        >
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className='text-2xl'
                            >

                            </motion.span>
                        </motion.div>

                    </div>

                    <h2 className='text-xl font-bold text-center mb-2'>ايصال دفع</h2>
                    <p className={`text-center text-gray-600`}>Thank you for your payment</p>

                    {/*Order Details*/}
                    <div className='mt-4 border-t pt-4  text-sm text-gray-700'>
                        <p className ='mb-2'>
                            <strong>رقم الايصال : </strong>
                            {paymentInfo.invoiceNumber}
                        </p>
                        <p>
                            <strong>العميل / السيد : </strong> {paymentInfo.customerName}
                        </p>
                   
                    </div>

                


                    {/*Bills Summery */}
                    <div className={`mt-4 border-t pt-4 text-sm`}>
                        <p className='flex mt-1'>
                            <span className='text-sm font-semibold'>المبلغ : </span><span className='text-xs mx-1'> ر.ع</span><span className='text-xs font-semibold'>{paymentInfo.bills.payed.toFixed(2)}</span>
                        </p>
                        <p className ='mt-5'>
                            <span className='text-sm font-semibold'>التوقيع : </span><span className='text-xs font-semibold'>-----------------------------</span>
                        </p>
                        <p className='mt-5'>
                            <strong className='text-xs'>التوقيع : </strong><span className='text-xs font-semibold'>--------------------</span>
                        </p>
                    </div>

                    {/**payment Details */}
                    <div className={`mb-2 mt-2 border-t pt-4 text-xs`}>
                        {paymentInfo.paymentMethod === 'Cash' || 'Online' ? (
                            <p>
                                <strong>طريقه الدفع : </strong>{" "}
                                {paymentInfo.paymentMethod}
                            </p>
                        ) : (
                            <>
                                {/*Online payment */}
                            </>
                        )}

                    </div>


                </div>

                {/** Buttons */}
                <div className='flex justify-between mt-4 border border-gray-300 rounded-sm'>
                    <button
                        onClick={handlePrint}
                        className='text-[#0ea5e9] font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        طباعه
                    </button>
                    <button
                        onClick={handleClose}
                        className='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        اغلاق
                    </button>

                </div>
            </div>
        </div>

    );
}



export default PaymentInvoice ;