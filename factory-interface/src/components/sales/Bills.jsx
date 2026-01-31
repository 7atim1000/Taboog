import React ,{ useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getTotalPrice } from '../../redux/slices/saleSlice';
import { removeAllItems } from '../../redux/slices/saleSlice';
import { removeCustomer } from '../../redux/slices/customerSlice';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify'
import { addInvoice, addTransaction, api, updateCustomer } from '../../https';
import SaleInvoice from '../sales/SaleInvoice';

const Bills = ({fetchProducts}) => {
    // total Accounting
    const dispatch = useDispatch();
    
    // to get from slices
    const customerData = useSelector((state) => state.customer);
    const saleData = useSelector(state => state.sale);
    const userData = useSelector((state) => state.user);

    const total = useSelector(getTotalPrice);
    const taxRate = 0.00;
    const calculations = useMemo(() => {
        const tax = (total * taxRate) / 100;
        const totalPriceWithTax = total + tax;
        return { tax, totalPriceWithTax };
    }, [total]);

    // START Account 
    const [payedAmount, setPayedAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    const [saleInfo, setSaleInfo] = useState();

    const balance = (calculations.totalPriceWithTax - Number(payedAmount)).toFixed(2);

    const showPayed = () => {
        setPayedAmount(calculations.totalPriceWithTax.toFixed(2));
    }
    
    const cashPaymethod = () => {
        setPaymentMethod('Cash');
        showPayed();
    }

    const onlinePaymethod = () => {
        setPaymentMethod('Online');
        showPayed();
    }

    const handlePayedAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            const numericValue = value === '' ? 0 : parseFloat(value);
            setPayedAmount(numericValue > calculations.totalPriceWithTax
                ? calculations.totalPriceWithTax
                : numericValue
            );
        }
    };
    // END Account


    const handlePlaceOrder = async () => {
        if (!paymentMethod){
            enqueueSnackbar('الرجاء تحديد طريقه الدفع', {variant: "warning"});
            return;
        }
        if (customerData.customerName === '') {
            enqueueSnackbar('الرجاء تحديد العميل', { variant: "warning" });
            return;
        }
        if (saleData.length === 0) {
            enqueueSnackbar('الرجاء اختيار المنتجات المباعه', { variant: "warning" });
            return;
        }

        if (paymentMethod === "Cash" || paymentMethod === 'Online') {
            ////////////////////Start Update quantity....
            const updatedItems = saleData.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

            await api.post('/api/product/update-salequantities', { product: updatedItems });
            ////////////////////End Update quantity.....
        
            const saleOrderData = {
                type: 'bills',
                invoiceNumber: customerData.saleId,
                customer: customerData.customerId, 
                customerName: customerData.customerName,
                supplier: null, 
                supplierName: null,
                invoiceStatus: "In Progress",
                invoiceType: "Sale invoice",
                saleBills: {
                    total: total.toFixed(2),
                    tax: (calculations.tax).toFixed(2),
                    totalWithTax: (calculations.totalPriceWithTax).toFixed(2),
                    payed: Number(payedAmount).toFixed(2),
                    balance: balance,
                },
                bills: {
                    total: total.toFixed(2),
                    tax: (calculations.tax).toFixed(2),
                    totalWithTax: (calculations.totalPriceWithTax).toFixed(2),
                    payed: Number(payedAmount).toFixed(2),
                    balance: balance,
                },
                items: saleData,
                paymentMethod: paymentMethod,
                user: userData._id,
            };
            
            setTimeout(() => {
                saleMutation.mutate(saleOrderData);
            }, 1500);
        }
    }

    const saleMutation = useMutation({ 
        mutationFn: (reqData) => addInvoice(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            console.log(data);
                           
            setSaleInfo(data);
            toast.success('تم حفظ وتأكيد الفاتوره بنجاح .');

            // add Transaction 
            const transactionData = {   
                transactionNumber: `${Date.now()}`,      
                amount: Number(payedAmount).toFixed(2),
                type: 'Income',
                category: 'Sale invoice',
                refrence: '-',
                description: '-',
                date: new Date().toISOString().slice(0, 10),
                paymentMethod: paymentMethod,
                user: userData._id,
            };
    
            setTimeout(() => {
                transactionMutation.mutate(transactionData)
            }, 1500);

            // Update Balance
            const previousBalance = Number(customerData.balance) || 0;
            const numericNewBalance = previousBalance + Number(balance);
            const formattedNewBalance = numericNewBalance.toFixed(2);

            const balanceData = {         
                balance: formattedNewBalance,
                customerId: data.customer     
            };
    
            setTimeout(() => {
                customerUpdateMutation.mutate(balanceData)
            }, 1500);
 
            setShowInvoice(true);
            setPaymentMethod('');
            dispatch(removeCustomer());
            dispatch(removeAllItems());
            fetchProducts({ category: 'all', page: 1});
            setPayedAmount(0);
        },
        onError: (error) => {
            console.log(error);
        }
    });
    
    // add transaction 
    const transactionMutation = useMutation({ 
        mutationFn: (reqData) => addTransaction(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            toast.success('تم ترحيل الايراد للاداره الماليه .');
        },         
        onError: (error) => {
            console.log(error);
        }
    });

    // update Customer
    const customerUpdateMutation = useMutation({
        mutationFn: (reqData) => updateCustomer(reqData),
        onSuccess: (resData) => {
            console.log(resData);
        }, 
        onError: (error) => {
            console.log(error)
        }
    });

    const cancelOrder = () => {
        dispatch(removeCustomer());
        dispatch(removeAllItems());
        fetchProducts({ page: 1});
        setPayedAmount(0);
    }
    
    return (
        <div className='bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4'>
                <h3 className='text-white font-bold text-lg text-center'>ملخص الفاتورة</h3>
            </div>

            <div className='p-4'>
                {/* Summary Cards */}
                <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                        <p className='text-xs text-blue-600 mb-1'>الأصناف</p>
                        <p className='text-xl font-bold text-blue-800'>{saleData.length}</p>
                        <p className='text-xs text-gray-500'>منتج</p>
                    </div>
                    
                    <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                        <p className='text-xs text-blue-600 mb-1'>المجموع</p>
                        <p className='text-xl font-bold text-blue-800'>{total.toFixed(2)}</p>
                        <p className='text-xs text-gray-500'>ر.ع</p>
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className='space-y-2 mb-6'>
                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                        <span className='text-sm text-gray-600'>الإجمالي:</span>
                        <span className='font-medium text-gray-800'>{total.toFixed(2)} ر.ع</span>
                    </div>
                    
                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-600'>الضريبة</span>
                            <span className='text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full'>{taxRate}%</span>
                        </div>
                        <span className='font-medium text-gray-800'>{calculations.tax.toFixed(2)} ر.ع</span>
                    </div>
                    
                    <div className='flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3'>
                        <span className='text-sm font-semibold text-blue-800'>الإجمالي الكلي:</span>
                        <span className='text-lg font-bold text-blue-800'>{calculations.totalPriceWithTax.toFixed(2)} ر.ع</span>
                    </div>
                </div>

                {/* Payment Section */}
                <div className='mb-6'>
                    <div className='flex justify-between items-center mb-3'>
                        <h4 className='text-sm font-semibold text-gray-700'>الدفع</h4>
                        <div className='flex gap-2'>
                            <button
                                onClick={cashPaymethod}
                                className={`px-3 py-1.5 text-sm rounded-lg transition duration-200 ${
                                    paymentMethod === 'Cash' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                نقدي
                            </button>
                            <button
                                onClick={onlinePaymethod}
                                className={`px-3 py-1.5 text-sm rounded-lg transition duration-200 ${
                                    paymentMethod === 'Online' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                الكتروني
                            </button>
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                            <label className='text-sm text-gray-600'>المبلغ المدفوع:</label>
                            <div className='relative flex-1 sm:max-w-[200px]'>
                                <input 
                                    className='w-full border border-blue-200 rounded-lg px-3 py-2 text-right text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    name='payedAmount'
                                    type='number'
                                    step='0.01'
                                    min='0'
                                    max={calculations.totalPriceWithTax}
                                    value={payedAmount}
                                    onChange={handlePayedAmountChange}
                                    placeholder='0.00'
                                />
                                <span className='absolute left-3 top-2.5 text-gray-400 text-sm'>ر.ع</span>
                            </div>
                        </div>
                        
                        <div className='flex justify-between items-center bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-200'>
                            <span className='text-sm font-semibold text-gray-700'>الرصيد:</span>
                            <span className={`text-lg font-bold ${Number(balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {Number(balance).toFixed(2)} ر.ع
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='grid grid-cols-2 gap-3'>
                    <button
                        onClick={handlePlaceOrder}
                        className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold text-sm transition duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        تأكيد الفاتورة
                    </button>
                    
                    <button
                        onClick={cancelOrder}
                        className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold text-sm transition duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        إلغاء
                    </button>
                </div>

                {/* Customer Info */}
                {customerData.customerName && (
                    <div className='mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                        <div className='flex items-center gap-2 mb-2'>
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                            <span className='text-xs font-medium text-blue-600'>العميل الحالي</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-700'>{customerData.customerName}</span>
                            <span className={`text-sm font-semibold ${Number(customerData.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Number(customerData.balance || 0).toFixed(2)} ر.ع
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {showInvoice && (
                <SaleInvoice saleInfo={saleInfo} setShowInvoice={setShowInvoice} />
            )}
        </div>
    );
}

export default Bills;

// import React ,{ useState, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux';

// import { getTotalPrice } from '../../redux/slices/saleSlice';
// import { removeAllItems } from '../../redux/slices/saleSlice';
// import { removeCustomer } from '../../redux/slices/customerSlice';

// import { useMutation } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { toast } from 'react-toastify'
// import { addInvoice, addTransaction, api, updateCustomer } from '../../https';

// import SaleInvoice from '../sales/SaleInvoice';

// //import { addSale, updateItem, updateService } from '../../https';
// //import Invoice from '../invoice/Invoice'

// const Bills = ({fetchProducts}) => {

//     // total Accounting
//     const dispatch = useDispatch();
    
//     // to get from slices
//     const customerData = useSelector((state) => state.customer);
//     const saleData = useSelector(state => state.sale);
//     const userData = useSelector((state) => state.user);

//     const total = useSelector(getTotalPrice);
//     const taxRate = 5.25;
//     const calculations = useMemo(() => {
//         const tax = (total * taxRate) / 100;
//         const totalPriceWithTax = total + tax;
//         return { tax, totalPriceWithTax };
//     }, [total]);

//     // START Account 
//     const [payedAmount, setPayedAmount] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [showInvoice, setShowInvoice] = useState(false);
//     const [saleInfo, setSaleInfo] = useState();

//     const balance = (calculations.totalPriceWithTax - Number(payedAmount)).toFixed(2);

//     const showPayed = () => {
//         setPayedAmount(calculations.totalPriceWithTax.toFixed(2));
//     }
    
//     const cashPaymethod = () => {
//         setPaymentMethod('Cash');
//         showPayed();
//     }

//     const onlinePaymethod = () => {
//         setPaymentMethod('Online');
//         showPayed();
//     }

//     const handlePayedAmountChange = (e) => {
//         const value = e.target.value;
//         if (/^\d*\.?\d*$/.test(value)) {
//             const numericValue = value === '' ? 0 : parseFloat(value);
//             setPayedAmount(numericValue > calculations.totalPriceWithTax
//                 ? calculations.totalPriceWithTax
//                 : numericValue
//             );
//         }
//     };
//     // END Account


//     const handlePlaceOrder = async () => {
            
//         if (!paymentMethod){
//             // toast.warning('Please select payment method !')
//             enqueueSnackbar('الرجاء تحديد طريقه الدفع', {variant: "warning"});
//             return;
//         }
//         if (customerData.customerName === '') {
//             enqueueSnackbar('الرجاء تحديد العميل', { variant: "warning" });
//             return;
//         }
//         if (saleData.length === 0) {
//             enqueueSnackbar('الرجاء اختيار المنتجات المباعه', { variant: "warning" });
//             return;
//         }

    

             
//         if (paymentMethod === "Cash" || paymentMethod === 'Online') {

//             ////////////////////Start Update quantity....
//             const updatedItems = saleData.map(item => ({
//                 id: item.id, // or item._id, depending on your schema
//                 quantity: item.quantity // the quantity to subtract from stock
//             }));

//             await api.post('/api/product/update-salequantities', { product: updatedItems });
            
//             ////////////////////End Update quantity.....
        
//         const saleOrderData = {
//             type :'bills',
           
//             invoiceNumber : customerData.saleId,
//             customer : customerData.customerId, 
//             customerName :customerData.customerName ,
//             supplier : null, supplierName : null,
        
//             // to save Status
//             invoiceStatus: "In Progress",
//             invoiceType : "Sale invoice",

//             // to save TOTALS   || NEEDED            
//             saleBills: {
//                 total: total.toFixed(2),
//                 tax: (calculations.tax).toFixed(2),
//                 totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

//                 payed: Number(payedAmount).toFixed(2),
//                 balance: balance,
//             },
//             bills: {
//                 total: total.toFixed(2),
//                 tax: (calculations.tax).toFixed(2),
//                 totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

//                 payed: Number(payedAmount).toFixed(2),
//                 balance: balance,
//             },
        
//             // to save New Items || NEEDED
//             items: saleData,
//             paymentMethod: paymentMethod,
    
//             user: userData._id,
    
//         };
        
//         setTimeout(() => {
//             saleMutation.mutate(saleOrderData);
//         }, 1500);
        
//         }
//     }

//     const saleMutation = useMutation ({ 
//     mutationFn: (reqData) => addInvoice(reqData),
                      
//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             console.log(data);
                           
//             setSaleInfo(data)  // to show details in report            
               
//             //enqueueSnackbar('Order Placed!', {variant: "success"});
//             toast.success('تم حفظ وتأكيد الفاتوره بنجاح .') ;


//            // add Transaction 
//             const transactionData = {   
//                 transactionNumber :`${Date.now()}`,      
               
//                 amount :Number(payedAmount).toFixed(2),
//                 type :'Income',
//                 category :'Sale invoice',
//                 refrence :'-',
//                 description : '-',
//                 date :new Date().toISOString().slice(0, 10),
                 
//                 paymentMethod: paymentMethod,
//                 user: userData._id,

//                 }
    
//                 setTimeout(() => {
//                     transactionMutation.mutate(transactionData)
//                 }, 1500)

           
//             // Update Balance
//             const previousBalance = Number(customerData.balance) || 0;
//             const numericNewBalance = previousBalance + Number(balance); // Do math with numbers
//             const formattedNewBalance = numericNewBalance.toFixed(2); // Then format to 2 decimal places

//             const balanceData = {         
//                 balance:  formattedNewBalance,
//                 //{(Number(customerData.balance) || 0).toFixed(2)}
//                 customerId: data.customer  // data from saving order or invoice above     
                    
//                 }
    
//                 setTimeout(() => {
//                     customerUpdateMutation.mutate(balanceData)
//                 }, 1500)
 
        
                    
//             setShowInvoice(true); // to open report 
//             setPaymentMethod('');
           
     
//             dispatch(removeCustomer());
//             dispatch(removeAllItems());
//             fetchProducts({ category: 'all', page: 1}) // to refresh services quantity
//             setPayedAmount(0);
//         },
                           

//             onError: (error) => {
//                 console.log(error);
//             }
//         });
    
    
//     // add transaction 
//     const transactionMutation = useMutation ({ 
//     mutationFn: (reqData) => addTransaction(reqData),
                      
//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             //console.log(data);       
//             toast.success('تم ترحيل الايراد للاداره الماليه .') ;
//         },         
//             onError: (error) => {
//                 console.log(error);
//             }
//         });
    


//     // update Customer
//     const customerUpdateMutation = useMutation({
        
//         mutationFn: (reqData) => updateCustomer(reqData),
//         onSuccess: (resData) => {
                    
//         console.log(resData);
        
//         }, 
//             onError : (error) => {
//             console.log(error)
//         }
//     });

//     const cancelOrder = () => {
         
//         dispatch(removeCustomer());
//         dispatch(removeAllItems());
//         fetchProducts({ page: 1}) // to refresh services quantity
//         setPayedAmount(0);
//     }
    
    
//     return (
//         <>
//         <div className ='flex bg-[#f5f5f5] items-center justify-between shadow-lg/30 p-2 mt-15'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>الاصناف : {saleData.length}</p>
//             <p className ='text-[#1a1a1a]'><span className ='text-sm font-normal'>{total.toFixed(2)}</span>
//                 <span className ='text-xs font-normal text-yellow-700'> ر.ع</span>
//             </p>
//         </div>

//         <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>ضريبه (5.25%)</p>
//             <p className ='text-[#1a1a1a]'><span className ='text-sm font-normal'>
//                 {calculations.tax.toFixed(2)}</span>
//             <span className ='text-xs font-normal text-yellow-700'> ر.ع</span></p>
//         </div>

//         <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>الاجمالي الكلي :</p>
//             <p className ='text-yellow-700'><span className ='text-md font-semibold'>
//                 {calculations.totalPriceWithTax.toFixed(2)}</span>
//                 <span className ='text-xs font-normal text-[#1a1a1a]'> ر.ع</span>
//             </p>
//         </div>

//         <div className ='flex bg-[#f5f5f5] items-center justify-between mt-1 shadow-lg/30 p-2'>

//             <div className ='flex gap-1 items-center justify-between'>
//                 <p className ='text-xs text-[#1f1f1f] font-medium mt-2'>المدفوع :</p>
               
//                 <input 
//                     className='w-20 bg-white rounded-sm p-1 text-[#1a1a1a] text-sm font-semibold'
//                     name='payedAmount'
//                     type='number'
//                     step='0.01'
//                     min='0'
//                     max={calculations.totalPriceWithTax}
//                     value={payedAmount}
//                     onChange={handlePayedAmountChange}
//                 />
            
//             </div>

//             <p className ='text-xs text-[#1f1f1f] font-medium mt-2'>الرصيد :</p>
//             <p className ='ml-0  text-[#be3e3f]'><span className ='text-sm font-semibold'>
//                 {Number(balance).toFixed(2)}</span>
//             </p>
//                 {/* {Number(balance).toFixed(2)} */}
//         </div>

       

//             <div className='flex items-center justify-between mt-15 bg-white p-5 shadow-lg/30'>

//                <div className='flex flex-col items-center gap-3 px-5 py-2 '>
//                      <button className='bg-[#0ea5e9] px-4 py-4 w-[100px] rounded-sm text-white cursor-pointer font-semibold 
//                     text-sm font-medium shadow-lg/30'
//                         onClick={handlePlaceOrder}
//                     >
//                         تأكيد
//                     </button>
//                     <button className='bg-emerald-600  py-4 w-full rounded-sm  cursor-pointer font-semibold text-white text-sm 
//                     font-medium shadow-lg/30'>
//                         طباعه
//                     </button>
//                     <button className='bg-[#be3e3f]/90 px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold 
//                     text-sm font-medium shadow-lg/30'
//                         onClick={cancelOrder}
//                     >
//                         الغاء
//                     </button>
//                 </div>

//                <div className='flex flex-col  items-center gap-3 px-5 py-2'>
//                     <button className={`bg-[#f5f5f5]  text-[#0ea5e9]  w-12 h-12 rounded-full  
//                     text-sm font-semibold cursor-pointer shadow-lg/30
//                     ${paymentMethod === 'Cash' ? "bg-zinc-500 text-white" : "bg-white"}`}
//                         //onClick ={() => setPaymentMethod('Cash')}
//                     onClick={cashPaymethod}

//                     >Cash</button>

//                     <button className={`bg-[#f5f5f5] w-12 h-12 rounded-full text-green-600 text-sm font-semibold 
//                     cursor-pointer shadow-lg/30
//                     ${paymentMethod === 'Online' ? "bg-zinc-500 text-white" : "bg-white "}`}
//                         // onClick ={() => setPaymentMethod('Online')}   onlinePaymethod
//                     onClick={onlinePaymethod}
//                     >Online</button>
//                 </div>

                

//             </div>

//             {showInvoice && (
//                 <SaleInvoice saleInfo={saleInfo} setShowInvoice={setShowInvoice} />
//             )}
        
//         </>
//     );
// }


// export default Bills ;