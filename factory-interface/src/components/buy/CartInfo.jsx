import React, {useRef, useEffect} from 'react'
import { MdDeleteForever } from 'react-icons/md';
import { FaShoppingBag, FaBox, FaBoxOpen } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
import { removeItem } from '../../redux/slices/buySlice'

const CartInfo = () => {
    // adding Item
    const buyData = useSelector(state => state.buy);

    const sortedBuyData = [...buyData].sort((a, b) => {
        if (a.timestamp && b.timestamp) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
        return b.id - a.id;
    });
    
    // Calculate totals
    const totalItems = sortedBuyData.length;
    const totalQuantity = sortedBuyData.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = sortedBuyData.reduce((sum, item) => sum + item.price, 0);
    
    // scrollbar
    const scrolLRef = useRef();
    useEffect(() => {
        if(scrolLRef.current) {
            scrolLRef.current.scrollTo({
                top: scrolLRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [buyData]);

    // to remove item
    const dispatch = useDispatch(); 
    const handleRemove = (itemId) => {
        dispatch(removeItem(itemId));
    }
    
    return (
        <div className='bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden h-full'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-white/20 p-2 rounded-lg'>
                            <FaShoppingBag className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h2 className='text-white font-bold text-lg'>سلة المشتريات</h2>
                            <p className='text-blue-100 text-xs mt-1'>تفاصيل فاتورة الشراء</p>
                        </div>
                    </div>
                    <div className='bg-white/20 px-3 py-1 rounded-full'>
                        <span className='text-white font-bold'>{totalItems}</span>
                        <span className='text-blue-100 text-xs mr-1'> منتج</span>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            {sortedBuyData.length > 0 && (
                <div className='grid grid-cols-3 gap-2 p-3 border-b border-blue-50'>
                    <div className='bg-blue-50 rounded-lg p-2 text-center'>
                        <p className='text-xs text-blue-600 font-medium'>الكمية</p>
                        <p className='text-lg font-bold text-blue-800'>{totalQuantity}</p>
                    </div>
                    <div className='bg-blue-50 rounded-lg p-2 text-center'>
                        <p className='text-xs text-blue-600 font-medium'>العناصر</p>
                        <p className='text-lg font-bold text-blue-800'>{totalItems}</p>
                    </div>
                    <div className='bg-blue-50 rounded-lg p-2 text-center'>
                        <p className='text-xs text-blue-600 font-medium'>الإجمالي</p>
                        <p className='text-lg font-bold text-blue-800'>{totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {/* Cart Items */}
            <div className='p-3'>
                {sortedBuyData.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                            <FaBoxOpen className="text-blue-500 w-8 h-8" />
                        </div>
                        <h3 className='text-gray-600 font-medium mb-2'>سلة المشتريات فارغة</h3>
                        <p className='text-gray-400 text-sm'>الرجاء اختيار منتج لإضافته إلى فاتورة الشراء</p>
                    </div>
                ) : (
                    <div 
                        className='overflow-y-auto scrollbar-hidden max-h-[400px] space-y-2 pr-1'
                        ref={scrolLRef}
                    >
                        {sortedBuyData.map((item, index) => (
                            <div 
                                key={`${item.id}-${index}`}
                                className='bg-gradient-to-r from-blue-50 to-white rounded-xl p-3 border border-blue-100 hover:border-blue-300 transition duration-200'
                            >
                                <div className='flex items-start justify-between mb-2'>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <div className='w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center'>
                                                <span className='text-white font-bold text-xs'>
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <h3 className='text-sm font-bold text-blue-900 truncate'>
                                                {item.name}
                                            </h3>
                                        </div>
                                        
                                        <div className='flex flex-wrap gap-3 mt-2'>
                                            <div className='flex items-center gap-1'>
                                                <span className='text-xs text-gray-500'>السعر:</span>
                                                <span className='text-sm font-semibold text-blue-700'>
                                                    {item.pricePerQuantity.toFixed(2)} ر.ع
                                                </span>
                                            </div>
                                            
                                            <div className='flex items-center gap-1'>
                                                <span className='text-xs text-gray-500'>الكمية:</span>
                                                <span className='text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded'>
                                                    {item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className='p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-150 cursor-pointer ml-2'
                                        title="حذف المنتج"
                                    >
                                        <MdDeleteForever className='w-5 h-5' />
                                    </button>
                                </div>
                                
                                <div className='flex items-center justify-between pt-2 border-t border-blue-100 mt-2'>
                                    <div className='text-xs text-gray-500'>
                                        المجموع
                                    </div>
                                    <div className='text-right'>
                                        <div className='text-lg font-bold text-blue-800'>
                                            {item.price.toFixed(2)} ر.ع
                                        </div>
                                        <div className='text-xs text-gray-500'>
                                            {item.pricePerQuantity.toFixed(2)} × {item.quantity}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Summary */}
                {sortedBuyData.length > 0 && (
                    <div className='mt-4 pt-3 border-t border-blue-100'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='text-sm text-gray-600'>إجمالي الفاتورة</p>
                                <p className='text-xs text-gray-400'>{totalItems} منتج</p>
                            </div>
                            <div className='text-right'>
                                <p className='text-xl font-bold text-blue-800'>{totalPrice.toFixed(2)} ر.ع</p>
                                <p className='text-xs text-green-600'>
                                    ✓ جاهزة للتأكيد
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Help Text */}
            {sortedBuyData.length > 0 && (
                <div className='bg-blue-50 border-t border-blue-100 p-3'>
                    <div className='flex items-start gap-2'>
                        <div className='text-blue-500 mt-0.5'>
                            <FaBox className="w-4 h-4" />
                        </div>
                        <p className='text-xs text-blue-600'>
                            يمكنك النقر على أيقونة الحذف لإزالة منتج من فاتورة الشراء
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartInfo;

// import React, {useRef, useEffect} from 'react'
// import { MdDeleteForever } from 'react-icons/md';
// import { useSelector, useDispatch } from 'react-redux'
// import { removeItem } from '../../redux/slices/buySlice'

// const CartInfo = () => {
//     // adding Item
//     const buyData = useSelector(state => state.buy);

//     const sortedBuyData = [...buyData].sort((a, b) => {
//         // Sort by timestamp if available, otherwise by ID or another unique identifier
//         if (a.timestamp && b.timestamp) {
//             return new Date(b.timestamp) - new Date(a.timestamp);
//         }
//         // Fallback: sort by ID in descending order
//         return b.id - a.id;
//     });
    
//     // scrollbar
//     const scrolLRef = useRef();
//         useEffect(() => {
//             if(scrolLRef.current) {
//                 scrolLRef.current.scrollTo({
//                 top :scrolLRef.current.scrollHeight,
//                 behavior :'smooth'
//                 })
//             }
//         }, [buyData]);

    
//     // to remove item
//     const dispatch = useDispatch(); 
    
//     const handleRemove = (itemId) => {
//         dispatch(removeItem(itemId))
//     }
    
    
    

//     return (
//          <div dir='rtl' className ='px-4 py-1 shadow-lg/30 bg-white'>
//             <h1 className ='text-xs text-[#0ea5e9] font-normal'>تفاصيل فاتوره الشراء : </h1>
                
//                 <div className ='mt-1 overflow-y-scroll scrollbar-hidden h-[469px]' ref ={scrolLRef}>
//                     {/* {buyData.length === 0  */}
//                     {sortedBuyData.length === 0
//                     ? (<p className ='text-xs text-[#be3e3f] flex justify-center'>قائمه منتجات الفاتوره فارغه . الرجاء اختيار منتج</p>) 
//                     : sortedBuyData.map((item) => {
                                    
//                         return (
//                             <div className ='bg-[#f5f5f5] border-t border-white rounded-sm px-2 py-1 mb-1 
//                             shadow-lg/30'>
                                    
//                                 <div className ='flex items-center justify-between'>
//                                     <h1 className ='text-xs font-semibold text-[#1a1a1a]'>{item.name}</h1>
//                                     <p >
//                                         <span className='text-xs font-semibold text-[#0ea5e9]'>
//                                             {item.pricePerQuantity}
//                                             x
//                                             {item.quantity}
//                                         </span>
//                                     </p>
//                                 </div>
                                
                              
                                        
//                                 <div className='flex items-center justify-between mt-1'>
//                                     <MdDeleteForever onClick={() => handleRemove(item.id)}
//                                         className='text-[#be3e3f] cursor-pointer border-b bordr-[#be3e3f] hover:bg-[#be3e3f]/30 rounded-sm' size={20} />

//                                     <p className='text-[#1a1a1a]'>
//                                         <span className='text-md text-yellow-700 font-semibold'> {item.price}</span>
//                                         <span className='text-xs'> ج.س</span>
//                                     </p>
//                                 </div>
            
//                             </div>
                                        
//                             )
//                         })}
             
//                 </div>
//         </div>
      

//     );
// }


// export default CartInfo ;