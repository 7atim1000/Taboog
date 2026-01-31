import React, { useState } from 'react'
import { enqueueSnackbar } from 'notistack';
import { motion } from 'framer-motion'
import { IoCloseCircle } from "react-icons/io5";
import { FaMoneyBillWave, FaCreditCard, FaCalendarAlt, FaFileInvoiceDollar, FaUser, FaInfoCircle } from 'react-icons/fa';
import { FiDollarSign, FiFileText, FiCheck, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { addInvoice, addTransaction, updateSupplier } from '../../https';
import { toast } from 'react-toastify'
import PaymentInvoice from './PaymentInvoice';


const SupplierPayment = ({ setIsPaymentModal, fetchSuppliers }) => {

    const supplierData = useSelector((state) => state.supplier);
    const userData = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        payed: 0,
        description: '',
        date: new Date().toISOString().slice(0, 10)
    });

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentInvoice, setPaymentInvoice] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsPaymentModal(false)
    };

    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            enqueueSnackbar('الرجاء اختيار طريقة الدفع!', { variant: "warning" })
            return;
        }
        if (formData.payed <= 0) {
            enqueueSnackbar('الرجاء تحديد مبلغ الدفع', { variant: "warning" });
            return;
        }

        // if (formData.payed > supplierData.balance) {
        //     enqueueSnackbar('المبلغ المدفوع أكبر من الرصيد الحالي!', { variant: "error" });
        //     return;
        // }

        setIsLoading(true);

        if (paymentMethod === "Cash" || paymentMethod === 'Online') {

            const paymentOrderData = {
                type: 'suppliersPayment',
                invoiceNumber: `${Date.now()}`,
                invoiceStatus: "Completed",
                invoiceType: "suppliersPayment",

                supplier: supplierData.supplierId,
                supplierName: supplierData.supplierName,

                customer: null,
                customerName: null,
                beneficiary: supplierData.supplierId,

                saleBills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed: 0,
                    balance: 0,
                },

                buyBills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed: parseFloat(formData.payed),
                    balance: (supplierData.balance - parseFloat(formData.payed))
                },
                bills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed: parseFloat(formData.payed),
                    balance: (supplierData.balance - parseFloat(formData.payed))
                },

                items: null,
                paymentMethod: paymentMethod,

                date: formData.date,
                user: userData._id,

            };

            setTimeout(() => {
                paymentMutation.mutate(paymentOrderData);
            }, 500);
        }
    }

    const paymentMutation = useMutation({
        mutationFn: (reqData) => addInvoice(reqData),

        onSuccess: (resData) => {
            const { data } = resData.data;
            console.log(data);

            setPaymentInfo(data)

            toast.success('تم تأكيد عملية الدفع للمورد.');

            // Transfer to financial
            const transactionData = {
                transactionNumber: `${Date.now()}`,
                amount: formData.payed,
                paymentMethod: paymentMethod,
                type: 'Expense',
                category: 'supplierPayment',
                refrence: '-',
                description: '-',
                date: formData.date
            }

            setTimeout(() => {
                transactionMutation.mutate(transactionData)
            }, 500)

            // Update supplier Balance
            const balanceData = {
                balance: supplierData.balance - formData.payed,
                supplierId: supplierData.supplierId
            }

            setTimeout(() => {
                supplierUpdateMutation.mutate(balanceData)
            }, 500)

            setPaymentInvoice(true);
            setPaymentMethod(null);
            setIsLoading(false);
        },

        onError: (error) => {
            console.log(error);
            toast.error('حدث خطأ أثناء عملية الدفع');
            setIsLoading(false);
        }
    });

    const supplierUpdateMutation = useMutation({
        mutationFn: (reqData) => updateSupplier(reqData),
        onSuccess: (resData) => {
            //console.log(resData);
        },
        onError: (error) => {
            console.log(error);
            toast.error('حدث خطأ أثناء تحديث رصيد المورد');
        }
    });

    const transactionMutation = useMutation({
        mutationFn: (reqData) => addTransaction(reqData),

        onSuccess: (resData) => {
            const { data } = resData.data;
            toast.success('تم ترحيل المبلغ إلى المالية.');
        },
        onError: (error) => {
            console.log(error);
            toast.error('حدث خطأ أثناء ترحيل المعاملة المالية');
        }
    });

    const cancelPayment = () => {
        setPaymentMethod(null);
        setFormData({
            payed: 0,
            description: '',
            date: new Date().toISOString().slice(0, 10)
        })
    };

    const paymentMethods = [
        {
            id: 'cash',
            name: 'Cash',
            label: 'نقدي',
            icon: <FaMoneyBillWave className="text-xl" />,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800'
        },
        {
            id: 'online',
            name: 'Online',
            label: 'إلكتروني',
            icon: <FaCreditCard className="text-xl" />,
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800'
        }
    ];

    const getPaymentMethodColor = (method) => {
        if (method === 'Cash') return 'from-green-500 to-emerald-600';
        if (method === 'Online') return 'from-blue-500 to-indigo-600';
        return 'from-gray-500 to-gray-600';
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden 
                border border-blue-100'
                onClick={(e) => e.stopPropagation()}
            >

                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FaFileInvoiceDollar className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className='text-white text-lg font-bold'>دفعيات الموردين</h2>
                                <p className='text-blue-100 text-sm'>إجراء دفع جديد للمورد</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 rounded-full hover:bg-white/20 transition-colors text-white'
                            disabled={isLoading}
                        >
                            <IoCloseCircle size={24} />
                        </button>
                    </div>
                </div>

                {/* Supplier Info */}
                <div className="px-4 sm:px-6 py-4 bg-blue-50 border-b border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                            <FaUser className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-blue-900 font-bold text-sm">المورد:</h3>
                                    <p className="text-blue-700 font-semibold">{supplierData.supplierName}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-blue-900 font-bold text-sm">الرصيد الحالي:</div>
                                    <div className={`text-lg font-bold ${supplierData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {supplierData.balance?.toFixed(2)}
                                        <span className="text-blue-700 text-sm mr-1">ر.ع</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-6">

                        {/* Date Field */}
                        <div className='space-y-2'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FaCalendarAlt className="text-blue-600" />
                                تاريخ الدفع:
                            </label>
                            <div className='relative'>
                                <input
                                    type='date'
                                    name='date'
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className='w-full p-3 pr-10 bg-blue-50 border-2 border-blue-200 
                                    rounded-xl text-blue-900 text-sm focus:outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                    transition-all duration-200 disabled:opacity-50'
                                    required
                                    disabled={isLoading}
                                />
                                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                            </div>
                        </div>

                        {/* Amount Field */}
                        <div className='space-y-2'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FiDollarSign className="text-blue-600" />
                                المبلغ المدفوع:
                            </label>
                            <div className='relative'>
                                <input
                                    type='number'
                                    name='payed'
                                    value={formData.payed}
                                    onChange={handleInputChange}
                                    placeholder='أدخل المبلغ'
                                    min="0"
                                    step="0.01"
                                    className='w-full p-3 pr-10 pl-12 bg-blue-50 border-2 border-blue-200 
                                    rounded-xl text-blue-900 text-sm focus:outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                    transition-all duration-200 disabled:opacity-50'
                                    required
                                    disabled={isLoading}
                                />
                                <FiDollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm'>
                                    ر.ع
                                </div>
                            </div>
                            {formData.payed > supplierData.balance && (
                                <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
                                    <FaInfoCircle />
                                    المبلغ المدخل أكبر من الرصيد الحالي!
                                </div>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className='space-y-2'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FiFileText className="text-blue-600" />
                                الوصف (اختياري):
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder='وصف عملية الدفع...'
                                    className='w-full p-3 pr-10 bg-blue-50 border-2 border-blue-200 
                                    rounded-xl text-blue-900 text-sm focus:outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                    transition-all duration-200 disabled:opacity-50'
                                    disabled={isLoading}
                                />
                                <FiFileText className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className='space-y-3'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FaMoneyBillWave className="text-blue-600" />
                                طريقة الدفع:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        type='button'
                                        onClick={() => setPaymentMethod(method.name)}
                                        disabled={isLoading}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 
                                        flex flex-col items-center justify-center gap-2 
                                        ${paymentMethod === method.name
                                                ? `border-blue-500 bg-gradient-to-br ${method.color} text-white`
                                                : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {method.icon}
                                        <span className="font-semibold text-sm">{method.label}</span>
                                        {paymentMethod === method.name && (
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {!paymentMethod && (
                                <div className="flex items-center gap-2 text-yellow-600 text-xs">
                                    <FaInfoCircle />
                                    الرجاء اختيار طريقة الدفع
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-900 font-bold text-sm mb-3">ملخص العملية:</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-blue-700 text-sm">
                                    <span>الرصيد الحالي:</span>
                                    <span className="font-semibold">{supplierData.balance?.toFixed(2)} ج.س</span>
                                </div>
                                <div className="flex justify-between text-blue-700 text-sm">
                                    <span>المبلغ المدفوع:</span>
                                    <span className="font-semibold">{formData.payed || '0.00'} ر.ع</span>
                                </div>
                                <div className="border-t border-blue-200 pt-2 mt-2">
                                    <div className="flex justify-between text-blue-900 font-bold">
                                        <span>الرصيد الجديد:</span>
                                        <span className={`${(supplierData.balance - (formData.payed || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {(supplierData.balance - (formData.payed || 0)).toFixed(2)} ر.ع
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 px-4 sm:px-6 py-4 bg-white border-t border-blue-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type='button'
                            onClick={cancelPayment}
                            disabled={isLoading}
                            className='flex-1 px-4 py-3.5 bg-blue-50 text-blue-700 rounded-xl 
                            font-semibold hover:bg-blue-100 transition-all duration-200 
                            border-2 border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2'
                        >
                            <FiX />
                            إعادة تعيين
                        </button>
                        <button
                            type='button'
                            onClick={handlePlaceOrder}
                            // disabled={isLoading || !paymentMethod || formData.payed <= 0 || formData.payed > supplierData.balance}
                            disabled={isLoading || !paymentMethod || formData.payed <= 0 }
                            className='flex-1 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 
                            text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 
                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2'
                        >
                            {isLoading ? (
                                <>
                                    <div className='animate-spin rounded-full h-5 w-5 border-2 
                                    border-white border-t-transparent'></div>
                                    جاري المعالجة...
                                </>
                            ) : (
                                <>
                                    <FiCheck />
                                    تأكيد الدفع
                                </>
                            )}
                        </button>
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-blue-500 text-xs">
                            سيتم إنشاء إيصال دفع وعملية مالية تلقائياً
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Payment Invoice Modal */}
            {paymentInvoice && paymentInfo && (
                <PaymentInvoice
                    paymentInfo={paymentInfo}
                    setPaymentInvoice={setPaymentInvoice}
                    fetchSuppliers={fetchSuppliers}
                />
            )}
        </div>
    );
};

export default SupplierPayment;


// import React, { useState } from 'react'

// import { enqueueSnackbar } from 'notistack';

// import { motion } from 'framer-motion'
// import { IoCloseCircle } from "react-icons/io5";

// import { useSelector } from 'react-redux'
// import { useMutation } from '@tanstack/react-query'
// import { addInvoice, addTransaction, updateSupplier  } from '../../https';
// import { toast } from 'react-toastify'
// import PaymentInvoice from './PaymentInvoice';

// const SupplierPayment = ({setIsPaymentModal, fetchSuppliers}) => {

//     const supplierData = useSelector((state) => state.supplier);
//     const userData = useSelector((state) => state.user);

//     const [formData, setFormData] = useState({
//         payed : 0 ,  description :''  ,  
//         // date :new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
//         date: new Date().toISOString().slice(0, 10)
       
//     });

        
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({...prev, [name] : value}));
//     };
    
//     const handleClose = () => {
//         setIsPaymentModal(false)
//     };


//     ///////////////////////////

//     const [paymentMethod, setPaymentMethod] = useState();
      
//     //  Invoice print report
//     const [paymentInvoice, setPaymentInvoice] = useState(false);
//     // for show data in report
//     const [paymentInfo, setPaymentInfo] = useState();
   
//     /////////////////
//     const handlePlaceOrder = async () => {

//         if (!paymentMethod) {
//             enqueueSnackbar('Please select payment method !', { variant: "warning" })
//             return;
//         }
//         if (formData.payed === 0) {
//             enqueueSnackbar('please specify amount', { variant: "warning" });
//             return;
//         }

//         if (paymentMethod === "Cash" || paymentMethod === 'Online') {

//             const paymentOrderData = {

//                 type : 'suppliersPayment',
//                 invoiceNumber : `${Date.now()}`,
//                 invoiceStatus: "Completed",
//                 invoiceType: "suppliersPayment",

//                 supplier: supplierData.supplierId,
//                 supplierName : supplierData.supplierName ,

//                 customer : null, customerName : null,
//                 beneficiary: supplierData.supplierId,
              
//                 // to save TOTALS   || NEEDED            
//                 saleBills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : 0,
//                     balance: 0,
//                 },

//                 buyBills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : formData.payed,
//                     balance: (supplierData.balance - formData.payed)
//                 },
//                 bills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : formData.payed,
//                     balance: (supplierData.balance - formData.payed)
//                 },

//                 // to save New Items || NEEDED
//                 items: null,
//                 paymentMethod: paymentMethod,

//                 // date :  new Date(formData.date + 'T00:00:00Z').toISOString().slice(0, 10)
//                 date :formData.date, 
//                 user: userData._id,

//             };

//             setTimeout(() => {
//                 paymentMutation.mutate(paymentOrderData);
//             }, 1500);

//         }
//     }

//     const paymentMutation = useMutation({
//         mutationFn: (reqData) => addInvoice(reqData),

//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             console.log(data);

//             setPaymentInfo(data)  // to show details in report            

//             toast.success('تم تأكيد الدفعيه للمورد .');

//             // transfer to financial 
//              const transactionData = {         

//                 transactionNumber: `${Date.now()}`,
//                 amount :formData.payed,
//                 type :'Expense',
//                 category :'supplierPayment',
//                 refrence :'-',
//                 description : '-',
//                 date : formData.date
//             }
    
//             setTimeout(() => {
//                 transactionMutation.mutate(transactionData)
//             }, 1500)


           

//             // Update supplier Balance 
//             const balanceData = {
//                 balance: supplierData.balance - formData.payed,
//                 supplierId: supplierData.supplierId  
//             }

//             setTimeout(() => {
//                 supplierUpdateMutation.mutate(balanceData)
//             }, 1500)

//             setPaymentInvoice(true); // to open report 
//             setPaymentMethod('')
//         },


//         onError: (error) => {
//             console.log(error);
//         }
//     });

//     // update Supplier balance ...

//     const supplierUpdateMutation = useMutation({

//         mutationFn: (reqData) => updateSupplier(reqData),
//         onSuccess: (resData) => {
//         //console.log(resData);
//         },
//         onError: (error) => {
//             console.log(error)
//         }
//     });

//     // add transaction  ...
//     const transactionMutation = useMutation({
//         mutationFn: (reqData) => addTransaction(reqData),

//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             //console.log(data);       
//             toast.success('تم ترحيل الاجراء مبلغ الصرف للماليه .');
//         },
//         onError: (error) => {
//             console.log(error);
//         }
//     });

//     const cancelPayment = () => {
//         setPaymentMethod('');
//         setFormData({
//             payed : 0 , description : '' , date : new Date().toISOString().slice(0, 10)
//         })
//     };




//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center  z-50' 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)'}}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-sm shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <div className='flex flex-col gap-2'>
//                         <h2 className='text-[#1a1a1a] text-md font-semibold'>دفعيات الموردين</h2>
//                         <p className='text-sm text-[#1a1a1a] font-medium'>
//                             <span className='text-[#0ea5e9] font-normal text-sm'>اجراء الدفع للمورد  : </span>
//                             {supplierData.supplierName}
//                         </p>
//                         <p className='text-md  font-medium text-[#be3e3f]'>
//                             <span className='text-black font-normal text-sm'>رصيد الحالي : </span>
//                             {supplierData.balance.toFixed(2)}
//                             <span className='text-xs font-normal text-[#1a1a1a]'> ر.ع</span></p>
//                     </div>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                     border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>

//                 {/*Modal Body  onSubmit={handlePlaceOrder}*/}
//                 <form className='mt-5 space-y-6' >

//                     <div className ='flex items-center justify-between'>
//                         <label className='w-[20%] text-yellow-700 block text-sm font-normal'>التاريخ :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='date'
//                                 name='date'
//                                 value={formData.date}
//                                 onChange={handleInputChange}

//                                 placeholder='تاريخ الدفع'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className ='flex items-center justify-between'>
//                         <label className='w-[20%] text-yellow-700 block  text-sm font-normal'>المبلغ :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='payed'
//                                 value={formData.payed}
//                                 onChange={handleInputChange}

//                                 placeholder='المبلغ المدفوع'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


//                     <div className ='flex  items-center justify-between'>
//                         <label className='w-[20%] text-yellow-700  block mb-2 mt-3 text-sm font-normal'>الوصف :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='description'
//                                 value={formData.description}
//                                 onChange={handleInputChange}

//                                 placeholder='الوصف ان وجد'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

           
//                     <div className='flex items-center justify-between mt-15 mx-10 p-3 shadow-xl'>

//                         <div className='flex flex-col gap-3 p-2'>
                        
//                         <button className={`text-[#1a1a1a] p-3 w-15 h-15 rounded-full text-sm font-semibold  
//                         cursor-pointer shadow-lg/30
//                         ${paymentMethod === 'Cash' ? "bg-emerald-500 text-zinc-100" : "bg-zinc-100"}`}
//                                 //onClick ={() => setPaymentMethod('Cash')}
//                                 type='button'
//                                 onClick={() => setPaymentMethod('Cash')}
//                             >Cash
//                         </button>

//                         <button className={`text-[#1a1a1a] p-3 w-15 h-15 rounded-full text-sm font-semibold  
//                         cursor-pointer shadow-lg/30
//                             ${paymentMethod === 'Online' ? "bg-emerald-500 text-zinc-100" : "bg-zinc-100"}`}
//                                 onClick={() => setPaymentMethod('Online')}
//                                 type='button'
//                             >Online
//                         </button>
//                         </div>

//                         <div className='flex flex-col gap-3 p-2 '>
//                             {/*bg-[#F6B100] */}
//                             <button className='bg-[#0ea5e9] text-white p-3 w-full rounded-xs cursor-pointer
//                         text-sm font-medium shadow-lg/30'
//                                 type='button'
//                                 onClick={handlePlaceOrder}
//                             >تأكيد
//                             </button>

//                             <button className='bg-[#be3e3f]/70 text-white p-3 w-full rounded-xs cursor-pointer
//                         text-sm font-medium shadow-lg/30'
//                                 type='button'
//                                 onClick={cancelPayment}
//                             >الغاء
//                             </button>
//                         </div>


//                     </div>

//                     {paymentInvoice && (
//                         <PaymentInvoice 
//                         paymentInfo={paymentInfo} 
//                         setPaymentInvoice ={setPaymentInvoice} 
//                         fetchSuppliers ={fetchSuppliers}
//                         />
//                     )}

//                 </form>
//             </motion.div>
//         </div>

//     );
// };

// export default SupplierPayment ;
