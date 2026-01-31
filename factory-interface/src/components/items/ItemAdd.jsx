import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { FiPackage, FiDollarSign, FiLayers, FiTag, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify'
import { api } from '../../https';

const ItemAdd = ({ setIsAddItemModal, fetchItems }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('');
    const [unitlist, setUnitList] = useState([]);

    const handleClose = () => {
        setIsAddItemModal(false);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Validation
        if (!itemName || !price || !qty || !unit) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            setIsLoading(false);
            return;
        }

        if (parseFloat(price) <= 0) {
            toast.error('السعر يجب أن يكون أكبر من صفر');
            setIsLoading(false);
            return;
        }

        if (parseFloat(qty) < 0) {
            toast.error('الكمية يجب أن تكون أكبر أو تساوي صفر');
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('itemName', itemName);
            formData.append('qty', qty);
            formData.append('price', price);
            formData.append('unit', unit);

            const { data } = await api.post('/api/item', formData);

            if (data.status) {
                toast.success('تم إضافة الصنف بنجاح');
                fetchItems();
                resetForm();
                handleClose();
            } else {
                toast.error(data.message || 'فشل في إضافة الصنف');
            }

        } catch (error) {
            console.error('Error adding item:', error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'حدث خطأ أثناء إضافة الصنف';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setItemName('');
        setQty('');
        setUnit('');
        setPrice('');
    };

    const fetchUnit = async () => {
        try {
            const response = await api.get('/api/unit/');
            if (response.data.success) {
                setUnitList(response.data.units || []);
                // Set default unit if units exist
                if (response.data.units.length > 0 && !unit) {
                    setUnit(response.data.units[0].unitName);
                }
            } else {
                toast.error(response.data.message || 'فشل في تحميل الوحدات');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحميل الوحدات');
        }
    };

    useEffect(() => {
        fetchUnit();
    }, []);

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
                                <FiPlus className="text-white text-xl" />
                            </div>
                            <h2 className='text-white text-lg font-bold'>إضافة صنف جديد</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-white cursor-pointer'
                            disabled={isLoading}
                        >
                            <IoCloseCircle size={24} />
                        </button>
                    </div>
                    <p className='text-blue-100 text-sm mt-2'>أدخل بيانات الصنف الأساسية</p>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <form className='space-y-5' onSubmit={onSubmitHandler}>
                        {/* Item Name */}
                        <div className='space-y-2'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FiTag className="text-blue-600" />
                                اسم الصنف:
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder='أدخل اسم الصنف'
                                    className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                    rounded-xl text-blue-900 text-sm focus:outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                    transition-all duration-200 disabled:opacity-50'
                                    required
                                    autoComplete='off'
                                    disabled={isLoading}
                                />
                                <FiTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className='space-y-2'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FiDollarSign className="text-blue-600" />
                                سعر الشراء:
                            </label>
                            <div className='relative'>
                                <input
                                    type='number'
                                    step='0.01'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder='0.00'
                                    min="0"
                                    className='w-full p-3 pr-12 pl-12 bg-blue-50 border-2 border-blue-200 
                                    rounded-xl text-blue-900 text-sm focus:outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                    transition-all duration-200 disabled:opacity-50'
                                    required
                                    autoComplete='off'
                                    disabled={isLoading}
                                />
                                <FiDollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm'>
                                    ر.ع
                                </div>
                            </div>
                        </div>

                        {/* Quantity and Unit */}
                        <div className='space-y-2'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FiLayers className="text-blue-600" />
                                الكمية والوحدة:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className='relative'>
                                    <input
                                        type='number'
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        placeholder='0'
                                        min="0"
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50'
                                        required
                                        autoComplete='off'
                                        disabled={isLoading}
                                    />
                                    <FiLayers className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                </div>
                                <div className='relative'>
                                    <select
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50 appearance-none'
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value=''>اختر الوحدة</option>
                                        {unitlist.map((unitItem, index) => (
                                            <option key={index} value={unitItem.unitName}>
                                                {unitItem.unitName}
                                            </option>
                                        ))}
                                    </select>
                                    <FiPackage className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Item Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-900 font-bold text-sm mb-3">ملخص الصنف:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="text-center">
                                    <div className="text-blue-600 font-medium mb-1">الاسم</div>
                                    <div className="text-blue-900 font-semibold truncate">{itemName || '---'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-600 font-medium mb-1">السعر</div>
                                    <div className="text-blue-900 font-semibold">{price ? `${price} ر.ع` : '---'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-600 font-medium mb-1">الكمية</div>
                                    <div className="text-blue-900 font-semibold">
                                        {qty && unit ? `${qty} ${unit}` : '---'}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <div className="text-blue-500 text-xs">
                                    {itemName && price && qty && unit ? 'جاهز للإضافة' : 'املأ جميع الحقول'}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-100'>
                            <button
                                type='button'
                                onClick={resetForm}
                                className='flex-1 px-4 py-3.5 bg-blue-50 text-blue-700 rounded-xl 
                                font-semibold hover:bg-blue-100 transition-all duration-200 
                                border-2 border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={isLoading}
                            >
                                مسح النموذج
                            </button>
                            <button
                                type='submit'
                                disabled={isLoading || !itemName || !price || !qty || !unit}
                                className='flex-1 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 
                                text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 
                                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2'
                            >
                                {isLoading ? (
                                    <>
                                        <div className='animate-spin rounded-full h-5 w-5 border-2 
                                        border-white border-t-transparent'></div>
                                        جاري الإضافة...
                                    </>
                                ) : (
                                    <>
                                        <FiPlus />
                                        إضافة الصنف
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className='px-4 sm:px-6 py-3 bg-blue-50 border-t border-blue-100'>
                    <div className='flex flex-wrap items-center gap-4 text-blue-600 text-xs'>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>جميع الحقول مطلوبة</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>يجب أن تكون الكمية أكبر أو تساوي صفر</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
};

export default ItemAdd;

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { IoCloseCircle } from 'react-icons/io5';
// import { toast } from 'react-toastify'
// import { api } from '../../https';

// const ItemAdd = ({setIsAddItemModal, fetchItems}) => {
//     const handleClose = () => {
//         setIsAddItemModal(false)
//     };

//     const [itemName, setItemName] = useState('')
//     const [price, setPrice] = useState('')
//     const [qty, setQty] = useState('')
//     const [unit, setUnit] = useState('') // Changed from 'Pc' to empty string

//       const onSubmitHandler = async (event) => {
//         event.preventDefault()

//         // Validation
//         if (!itemName || !price || !qty || !unit) {
//             toast.error('يرجى ملء جميع الحقول المطلوبة')
//             return
//         }

//         try {
//             const formData = new FormData()
          
//             formData.append('itemName', itemName)
//             formData.append('qty', qty)
//             formData.append('price', price)
//             formData.append('unit', unit)

//             const { data } = await api.post('/api/item', formData)

//             // DEBUG: Log the response to see what's being returned
//             console.log('API Response:', data);

//             // FIX: Changed from data.success to data.status
//             if (data.status) {
//                 toast.success('تم حفظ الصنف بنجاح')
//                 fetchItems();
//                 setIsAddItemModal(false)

//                 // Reset form
//                 setItemName('')
//                 setQty('')
//                 setUnit('')
//                 setPrice('')
//             } else {
//                 toast.error(data.message || 'فشل في إضافة الصنف')
//             }

//         } catch (error) {
//             console.error('Error adding item:', error)
//             // Improved error handling
//             const errorMessage = error.response?.data?.message || 
//                                error.message || 
//                                'حدث خطأ أثناء إضافة الصنف';
//             toast.error(errorMessage)
//         }
//     };



//     // Unit fetch
//     const [unitlist, setUnitList] = useState([])
//     const fetchUnit = async () => {
//         try {
//             const response = await api.get('/api/unit/')
//             if (response.data.success) {
//                 setUnitList(response.data.units);
//                 // Set default unit if units exist
//                 if (response.data.units.length > 0) {
//                     setUnit(response.data.units[0].unitName)
//                 }
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحميل الوحدات')
//         }
//     };

//     useEffect(() => {
//         fetchUnit()
//     }, []);

//     return(
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
//             >
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-bold'>اضافه صنف</h2>
//                     <button
//                         onClick={handleClose} 
//                         className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                 border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>

//                 {/* Modal Body */}
//                 <form className='space-y-4' onSubmit={onSubmitHandler}>
//                     {/* Item Name Field */}
//                     <div className='flex flex-col'>
//                         <label className='text-gray-700 text-xs font-normal mb-1'>اسم الصنف:</label>
//                         <input
//                             type='text'
//                             value={itemName}
//                             onChange={(e) => setItemName(e.target.value)}
//                             placeholder='أدخل اسم الصنف'
//                             className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-xs'
//                             required
//                             autoComplete='off'
//                         />
//                     </div>

//                     {/* Price Field */}
//                     <div className='flex flex-col'>
//                         <label className='text-gray-700 font-normal text-xs mb-1'>سعر الشراء:</label>
//                         <input
//                             type='number'
//                             step='0.01'
//                             value={price}
//                             onChange={(e) => setPrice(e.target.value)}
//                             placeholder='أدخل سعر الشراء'
//                             className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-xs'
//                             required
//                             autoComplete='off'
//                         />
//                     </div>

//                     {/* Quantity and Unit Fields */}
//                     <div className='grid grid-cols-2 gap-3'>
//                         <div className='flex flex-col'>
//                             <label className='text-gray-700 font-normal text-xs mb-1'>الكمية:</label>
//                             <input
//                                 type='number'
//                                 value={qty}
//                                 onChange={(e) => setQty(e.target.value)}
//                                 placeholder='الكمية'
//                                 className='p-2 border border-gray-300 rounded font-normal text-xs focus:outline-none focus:ring-2 focus:ring-blue-500'
//                                 required
//                                 autoComplete='off'
//                             />
//                         </div>

//                         <div className='flex flex-col'>
//                             <label className='text-gray-700 text-sm font-medium mb-1 font-normal text-xs'>الوحدة:</label>
//                             <select 
//                                 className='p-2 border border-gray-300 font-normal text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
//                                 value={unit}
//                                 onChange={(e) => setUnit(e.target.value)}
//                                 required
//                             >
//                                 <option value=''>اختر الوحدة</option>
//                                 {unitlist.map((unitItem, index) => (
//                                     <option key={index} value={unitItem.unitName}>
//                                         {unitItem.unitName}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type='submit'
//                         className='w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors mt-4'
//                     >
//                         حفظ
//                     </button>
//                 </form>
//             </motion.div>
//         </div>
//     )
// };

// export default ItemAdd;