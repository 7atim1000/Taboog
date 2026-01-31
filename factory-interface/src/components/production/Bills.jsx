import React ,{ useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getTotalPrice } from '../../redux/slices/produceSlice';
import { removeAllProduce } from '../../redux/slices/produceSlice';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify'
import { addInvoice, api } from '../../https';
import ProduceInvoice from '../products/ProduceInvoice';
import { FaCheckCircle, FaTimesCircle, FaPrint, FaIndustry, FaBoxes, FaBalanceScale } from 'react-icons/fa';

const Bills = ({fetchProducts}) => {
    // total Accounting
    const dispatch = useDispatch();
    
    // to get from slices
    const produceData = useSelector(state => state.produce);
    const userData = useSelector((state) => state.user);

    const total = useSelector(getTotalPrice);
    const taxRate = 0;
    
    const calculations = useMemo(() => {
        const tax = (total * taxRate) / 100;
        const totalPriceWithTax = total + tax;
        return { tax, totalPriceWithTax };
    }, [total]);

    const [showInvoice, setShowInvoice] = useState(false);
    const [produceInfo, setProduceInfo] = useState(false);
    const [printing, setPrinting] = useState(false);

    const handlePlaceOrder = async () => {
        if (produceData.length === 0) {
            enqueueSnackbar('الرجاء اختيار المنتجات المنتجه', { variant: "warning" });
            return;
        }

        const updatedItems = produceData.map(item => ({
            id: item.id,
            quantity: item.quantity
        }));

        try {
            await api.post('/api/product/update-producequantities', { product: updatedItems });
            
            const produceOrderData = {
                type: 'production',
                invoiceNumber: `PROD-${Date.now().toString().slice(-6)}`,
                customer: null,
                customerName: null,
                supplier: null,
                supplierName: null,
                invoiceStatus: "Completed",
                invoiceType: "Production invoice",
                productionBills: {
                    total: total.toFixed(2),
                    tax: (calculations.tax).toFixed(2),
                    totalWithTax: (calculations.totalPriceWithTax).toFixed(2),
                    payed: 0,
                    balance: 0,
                },
                bills: {
                    total: total.toFixed(2),
                    tax: (calculations.tax).toFixed(2),
                    totalWithTax: (calculations.totalPriceWithTax).toFixed(2),
                    payed: 0,
                    balance: 0,
                },
                items: produceData,
                paymentMethod: null,
                user: userData._id,
            };
            
            produceMutation.mutate(produceOrderData);
        } catch (error) {
            toast.error('حدث خطأ أثناء تحديث الكميات');
        }
    }

    const handlePrint = () => {
        if (produceData.length === 0) {
            toast.warning('لا توجد منتجات للطباعة');
            return;
        }
        
        // Create a temporary invoice for printing
        const tempInvoice = {
            invoiceNumber: `TEMP-PROD-${Date.now().toString().slice(-6)}`,
            date: new Date(),
            items: produceData,
            bills: {
                totalWithTax: calculations.totalPriceWithTax.toFixed(2),
                total: total.toFixed(2)
            }
        };
        
        setProduceInfo(tempInvoice);
        setPrinting(true);
        setShowInvoice(true);
    }

    const produceMutation = useMutation({ 
        mutationFn: (reqData) => addInvoice(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            setProduceInfo(data);
            toast.success('تم حفظ وتأكيد الإنتاج بنجاح');
            setShowInvoice(true);
            dispatch(removeAllProduce());
            fetchProducts({ page: 1 });
        },
        onError: (error) => {
            console.log(error);
            toast.error('حدث خطأ أثناء حفظ الإنتاج');
        }
    });
    
    const cancelOrder = () => {
        if (produceData.length === 0) {
            toast.info('لا توجد منتجات للإلغاء');
            return;
        }
        
        if (window.confirm('هل أنت متأكد من إلغاء جميع المنتجات المنتجة؟')) {
            dispatch(removeAllProduce());
            fetchProducts({ page: 1 });
            toast.success('تم إلغاء الإنتاج');
        }
    }
    
    return (
        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 h-full'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-3 mb-4'>
                <div className='flex items-center gap-3'>
                    <div className='bg-white/20 p-2 rounded-lg'>
                        <FaIndustry className='text-white w-5 h-5' />
                    </div>
                    <div>
                        <h3 className='text-white font-bold text-lg'>فاتورة الإنتاج</h3>
                        <p className='text-blue-100 text-sm'>تأكيد المنتجات المنتجة</p>
                    </div>
                </div>
            </div>

            {/* Production Summary Stats */}
            <div className='grid grid-cols-2 gap-3 mb-4'>
                <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                    <div className='flex items-center gap-2 mb-1'>
                        <FaBoxes className='text-blue-600 w-4 h-4' />
                        <p className='text-xs text-blue-600 font-medium'>الأصناف</p>
                    </div>
                    <p className='text-xl font-bold text-blue-800'>{produceData.length}</p>
                    <p className='text-xs text-gray-500'>منتج منتج</p>
                </div>
                
                <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                    <div className='flex items-center gap-2 mb-1'>
                        <FaBalanceScale className='text-blue-600 w-4 h-4' />
                        <p className='text-xs text-blue-600 font-medium'>القيمة</p>
                    </div>
                    <p className='text-xl font-bold text-blue-800'>{total.toFixed(2)}</p>
                    <p className='text-xs text-gray-500'>ر.ع</p>
                </div>
            </div>

            {/* Production Details */}
            <div className='space-y-3 mb-6'>
                <div className='bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg p-4 border border-blue-100'>
                    <h4 className='text-sm font-semibold text-blue-800 mb-3'>تفاصيل الإنتاج</h4>
                    
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                            <span className='text-sm text-gray-600'>عدد الأصناف:</span>
                            <span className='font-medium text-gray-800'>{produceData.length} منتج</span>
                        </div>
                        
                        <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                            <span className='text-sm text-gray-600'>إجمالي القيمة:</span>
                            <span className='font-medium text-gray-800'>{total.toFixed(2)} ر.ع</span>
                        </div>
                        
                        <div className='flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3 mt-2'>
                            <span className='text-sm font-semibold text-blue-800'>إجمالي الإنتاج:</span>
                            <span className='text-lg font-bold text-blue-800'>
                                {calculations.totalPriceWithTax.toFixed(2)} ر.ع
                            </span>
                        </div>
                    </div>
                </div>

                {/* Production Items Preview */}
                {produceData.length > 0 && (
                    <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
                        <h4 className='text-sm font-semibold text-blue-800 mb-2'>الأصناف المنتجة</h4>
                        <div className='space-y-2 max-h-40 overflow-y-auto pr-2'>
                            {produceData.map((item, index) => (
                                <div key={index} className='flex justify-between items-center bg-white p-2 rounded'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-6 h-6 bg-blue-100 rounded flex items-center justify-center'>
                                            <span className='text-blue-700 text-xs font-bold'>{index + 1}</span>
                                        </div>
                                        <span className='text-sm text-gray-700 truncate max-w-[120px]'>
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className='text-right'>
                                        <span className='text-sm font-medium text-blue-800'>
                                            {item.quantity} × {item.pricePerQuantity?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
                <button
                    onClick={handlePlaceOrder}
                    disabled={produceData.length === 0}
                    className={`w-full py-3 rounded-lg font-semibold text-sm transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        produceData.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md'
                    }`}
                >
                    <FaCheckCircle className='w-5 h-5' />
                    تأكيد الإنتاج
                </button>
                
                <div className='grid grid-cols-2 gap-3'>
                    <button
                        onClick={handlePrint}
                        disabled={produceData.length === 0}
                        className={`py-3 rounded-lg font-medium text-sm transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                            produceData.length === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700'
                        }`}
                    >
                        <FaPrint className='w-4 h-4' />
                        معاينة وطباعة
                    </button>
                    
                    <button
                        onClick={cancelOrder}
                        disabled={produceData.length === 0}
                        className={`py-3 rounded-lg font-medium text-sm transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                            produceData.length === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        }`}
                    >
                        <FaTimesCircle className='w-4 h-4' />
                        إلغاء
                    </button>
                </div>
            </div>

            {/* Status Message */}
            <div className='mt-4 pt-3 border-t border-blue-100'>
                <div className='flex items-center gap-2'>
                    <div className={`w-2 h-2 rounded-full ${
                        produceData.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                    }`}></div>
                    <span className='text-xs text-gray-600'>
                        {produceData.length > 0 
                            ? `جاهز للإنتاج - ${produceData.length} منتج` 
                            : 'لا توجد منتجات للإنتاج'}
                    </span>
                </div>
            </div>

            {/* Invoice Modal */}
            {showInvoice && produceInfo && (
                <ProduceInvoice 
                    produceInfo={produceInfo} 
                    setShowInvoice={setShowInvoice} 
                    isTemporary={printing}
                />
            )}
        </div>
    );
}

export default Bills;

// import React ,{ useState, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux';

// import { getTotalPrice } from '../../redux/slices/produceSlice';
// import { removeAllProduce } from '../../redux/slices/produceSlice';

// import { useMutation } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { toast } from 'react-toastify'
// import { addInvoice,  api } from '../../https';

// import ProduceInvoice from '../products/ProduceInvoice';



// const Bills = ({fetchProducts}) => {

//     // total Accounting
//     const dispatch = useDispatch();
    
//     // to get from slices

//     const produceData = useSelector(state => state.produce);
//     const userData = useSelector((state) => state.user);

//     const total = useSelector(getTotalPrice);

//     const taxRate = 0;
//     const calculations = useMemo(() => {
//         const tax = (total * taxRate) / 100;
//         const totalPriceWithTax = total + tax;
//         return { tax, totalPriceWithTax };
//     }, [total]);


//     const [showInvoice, setShowInvoice] = useState(false);
//     const [produceInfo, setProduceInfo] = useState();



//     const handlePlaceOrder = async () => {
            

//         if (produceData.length === 0) {
//             enqueueSnackbar('الرجاء اختيار المنتجات المنتجه', { variant: "warning" });
//             return;
//         }


//             const updatedItems = produceData.map(item => ({
//                 id: item.id, // or item._id, depending on your schema
//                 quantity: item.quantity // the quantity to subtract from stock
//             }));

//             await api.post('/api/product/update-producequantities', { product: updatedItems });
            
//             ////////////////////End Update quantity.....
        
//         const produceOrderData = {
//             type :'production',
           
//             invoiceNumber : `${Date.now()}`,
//             customer : null,  customerName :null,
//             supplier : null, supplierName : null,
        
//             // to save Status
//             invoiceStatus: "Completed",
//             invoiceType : "Production invoice",

//             // to save TOTALS   || NEEDED            
//             productionBills: {
//                 total: total.toFixed(2),
//                 tax: (calculations.tax).toFixed(2),
//                 totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

//                 payed: 0,
//                 balance: 0,
//             },
//             bills: {
//                 total: total.toFixed(2),
//                 tax: (calculations.tax).toFixed(2),
//                 totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

//                 payed: 0,
//                 balance: 0,
//             },
        
//             // to save New Items || NEEDED
//             items: produceData,
//             paymentMethod: null,
    
//             user: userData._id,
    
//         };
        
//         setTimeout(() => {
//             produceMutation.mutate(produceOrderData);
//         }, 1500);
    
//     }

//     const produceMutation = useMutation ({ 
//     mutationFn: (reqData) => addInvoice(reqData),
                      
//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             console.log(data);
                           
//             setProduceInfo(data)  // to show details in report            
               
//             //enqueueSnackbar('Order Placed!', {variant: "success"});
//             toast.success('تم حفظ وتأكيدالانتاج بنجاح  .') ;

       
 
        
                    
//             setShowInvoice(true); // to open report 
       
//             dispatch(removeAllProduce());
//             fetchProducts({  page: 1}) // to refresh services quantity
            
//         },
                           

//             onError: (error) => {
//                 console.log(error);
//             }
//         });
    
    

//     const cancelOrder = () => {
         
      
//         dispatch(removeAllProduce());
//         fetchProducts({ page: 1}) // to refresh services quantity
       
//     }
    
    
//     return (
//         <>
//         <div className ='flex bg-[#f5f5f5] items-center justify-between shadow-lg/30 p-2'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>الاصناف : {produceData.length}</p>
//             <p className ='text-[#1a1a1a]'>
//                 <span className ='text-xs font-normal'>انتاج بقيمه : </span>
//                 <span className ='text-sm font-normal'>{total.toFixed(2)}</span>
//                 <span className ='text-xs font-normal text-yellow-700'> ر.ع</span>
//             </p>
//         </div>

//         {/* <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>ضريبه (5.25%)</p>
//             <p className ='text-[#1a1a1a]'><span className ='text-sm font-normal'>
//                 {calculations.tax.toFixed(2)}</span>
//             <span className ='text-xs font-normal text-yellow-700'> ج.س</span></p>
//         </div> */}

//         <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>اجمالي الانتاج :</p>
//             <p className ='text-yellow-700'><span className ='text-md font-semibold'>
//                 {calculations.totalPriceWithTax.toFixed(2)}</span>
//                 <span className ='text-xs font-normal text-[#1a1a1a]'> ر.ع</span>
//             </p>
//         </div>

       


//             <div className='flex items-center justify-between mt-15 bg-white p-5 shadow-lg/30'>

//                <div className='flex flex-col items-center gap-3 px-5 py-2 w-full '>
//                      <button className='bg-[#0ea5e9] px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold 
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


//             </div>

//             {showInvoice && (
//                 <ProduceInvoice produceInfo={produceInfo} setShowInvoice={setShowInvoice} />
//             )}
        
//         </>
//     );
// }


// export default Bills ;