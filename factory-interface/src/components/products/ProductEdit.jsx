import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { FiPackage, FiDollarSign, FiLayers, FiTag, FiImage, FiEdit, FiSave } from 'react-icons/fi';

const ProductEdit = ({ product, setIsEditProductModal, fetchProducts }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [unit, setUnit] = useState(product.unit?._id || product.unit || "");
    const [productName, setProductName] = useState(product.productName);
    const [price, setPrice] = useState(product.price);
    const [qty, setQty] = useState(product.qty);
    const [newImage, setNewImage] = useState(null);
    const [units, setUnits] = useState([]);

    const handleClose = () => {
        setIsEditProductModal(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('حجم الصورة يجب أن يكون أقل من 5MB');
                return;
            }
            setNewImage(file);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!productName || !price || !qty || !unit) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            if (newImage) formData.append('image', newImage);
            formData.append('productName', productName);
            formData.append('price', price);
            formData.append('qty', qty);
            formData.append('unit', unit);

            const { data } = await api.put(`/api/product/${product._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data.success) {
                toast.success('تم تعديل المنتج بنجاح');
                fetchProducts();
                handleClose();
            } else {
                toast.error(data.message || 'حدث خطأ أثناء التعديل');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const unitsResponse = await api.get('/api/unit/');
                if (unitsResponse.data.success) {
                    setUnits(unitsResponse.data.units || []);
                }
            } catch (error) {
                toast.error('حدث خطأ في جدد الوحدات');
            }
        };

        fetchData();
    }, []);

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden 
                border border-blue-100'
                onClick={(e) => e.stopPropagation()}
            >

                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FiEdit className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className='text-white text-lg font-bold'>تعديل منتج</h2>
                                <p className='text-blue-100 text-sm'>{product.productName}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-white cursor-pointer'
                            disabled={isLoading}
                        >
                            <IoCloseCircle size={24} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <form className='space-y-6' onSubmit={onSubmitHandler}>
                        {/* Image Upload */}
                        <div className='flex flex-col items-center gap-4 mb-6'>
                            <label htmlFor='edit-product-img' className='cursor-pointer relative'>
                                <div className='w-40 h-40 rounded-2xl border-4 border-blue-200 overflow-hidden 
                                bg-blue-50 flex items-center justify-center hover:border-blue-400 transition-all duration-200'>
                                    <img
                                        className='w-full h-full object-cover'
                                        src={newImage ? URL.createObjectURL(newImage) : product.image}
                                        alt="منتج"
                                    />
                                    <div className='absolute inset-0 bg-black/30 flex items-center justify-center 
                                    opacity-0 hover:opacity-100 transition-opacity duration-200'>
                                        <FiImage className='text-white text-2xl' />
                                    </div>
                                </div>
                                <div className='absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2.5'>
                                    <FiImage size={16} />
                                </div>
                            </label>
                            <input
                                onChange={handleImageChange}
                                type='file'
                                id='edit-product-img'
                                hidden
                                accept='image/*'
                                disabled={isLoading}
                            />
                            <div className='text-center'>
                                <p className='text-blue-600 text-sm font-medium mb-1'>صورة المنتج</p>
                                <p className='text-blue-500 text-xs'>
                                    {newImage ? 'تم تحديد صورة جديدة' : 'انقر لتغيير الصورة'}
                                    <span className='text-blue-400 mr-1'> (اختياري)</span>
                                </p>
                            </div>
                            {newImage && (
                                <button
                                    type='button'
                                    onClick={() => setNewImage(null)}
                                    className='px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium 
                                    hover:bg-red-100 transition-colors flex items-center gap-2'
                                >
                                    <IoCloseCircle size={16} />
                                    إزالة الصورة الجديدة
                                </button>
                            )}
                        </div>

                        {/* Current Product Info */}
                        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-800 font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                معلومات المنتج الحالية
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="text-blue-600">
                                    <span className="font-medium">الاسم الحالي:</span>
                                    <span className="text-blue-900 font-semibold mr-2"> {product.productName}</span>
                                </div>
                                <div className="text-blue-600">
                                    <span className="font-medium">السعر الحالي:</span>
                                    <span className="text-blue-900 font-semibold mr-2"> {product.price} ر.ع</span>
                                </div>
                                <div className="text-blue-600">
                                    <span className="font-medium">الكمية الحالية:</span>
                                    <span className="text-blue-900 font-semibold mr-2"> {product.qty} {product.unit?.unitName || product.unit}</span>
                                </div>
                                <div className="text-blue-600">
                                    <span className="font-medium">الوحدة الحالية:</span>
                                    <span className="text-blue-900 font-semibold mr-2"> {product.unit?.unitName || product.unit}</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Name */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiTag className="text-blue-600" />
                                    اسم المنتج الجديد:
                                </label>
                                <p className='text-blue-500 text-xs'>الاسم المعدل للمنتج</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative'>
                                    <input
                                        type='text'
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder='أدخل اسم المنتج الجديد'
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50'
                                        required
                                        disabled={isLoading}
                                    />
                                    <FiTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiDollarSign className="text-blue-600" />
                                    سعر البيع الجديد:
                                </label>
                                <p className='text-blue-500 text-xs'>سعر بيع المنتج المعدل</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative'>
                                    <input
                                        type='number'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder='0.00'
                                        min="0"
                                        step="0.01"
                                        className='w-full p-3 pr-12 pl-12 bg-blue-50 border-2 border-blue-200 
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
                            </div>
                        </div>

                        {/* Quantity and Unit */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiLayers className="text-blue-600" />
                                    الكمية والوحدة:
                                </label>
                                <p className='text-blue-500 text-xs'>الكمية المعدلة والوحدة</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
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
                                            disabled={isLoading}
                                        />
                                        <FiLayers className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                    </div>
                                    <div className='relative'>
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                            rounded-xl text-blue-900 text-sm focus:outline-none 
                                            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                            transition-all duration-200 disabled:opacity-50 appearance-none'
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="" disabled>اختر الوحدة</option>
                                            {units.map((unitItem, index) => (
                                                <option key={unitItem._id || index} value={unitItem.unitName || unitItem}>
                                                    {unitItem.unitName || unitItem}
                                                </option>
                                            ))}
                                        </select>
                                        <FiPackage className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Changes Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-900 font-bold text-sm mb-3">ملخص التعديلات:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="text-blue-700">
                                    <span className="font-medium">تغير الاسم:</span>
                                    <div className="mt-1">
                                        <div className="text-blue-900 line-through">{product.productName}</div>
                                        <div className="text-green-600 font-semibold">{productName}</div>
                                    </div>
                                </div>
                                <div className="text-blue-700">
                                    <span className="font-medium">تغير السعر:</span>
                                    <div className="mt-1">
                                        <div className="text-blue-900 line-through">{product.price} ر.ع</div>
                                        <div className="text-green-600 font-semibold">{price} ر.ع</div>
                                    </div>
                                </div>
                                <div className="text-blue-700">
                                    <span className="font-medium">تغير الكمية:</span>
                                    <div className="mt-1">
                                        <div className="text-blue-900 line-through">{product.qty} {product.unit?.unitName || product.unit}</div>
                                        <div className="text-green-600 font-semibold">{qty} {units.find(u => u.unitName === unit)?.unitName || unit}</div>
                                    </div>
                                </div>
                                <div className="text-blue-700">
                                    <span className="font-medium">تغير الصورة:</span>
                                    <div className="mt-1">
                                        <div className="text-blue-900">{newImage ? 'تم تحديد صورة جديدة' : 'بدون تغيير'}</div>
                                        {newImage && <div className="text-green-600 font-semibold">✓</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-100'>
                            <button
                                type='button'
                                onClick={handleClose}
                                className='flex-1 px-6 py-3.5 bg-blue-50 text-blue-700 rounded-xl 
                                font-semibold hover:bg-blue-100 transition-all duration-200 
                                border-2 border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={isLoading}
                            >
                                إلغاء
                            </button>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 
                                text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 
                                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2'
                            >
                                {isLoading ? (
                                    <>
                                        <div className='animate-spin rounded-full h-5 w-5 border-2 
                                        border-white border-t-transparent'></div>
                                        جاري التعديل...
                                    </>
                                ) : (
                                    <>
                                        <FiSave />
                                        حفظ التعديلات
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
                            <span>ID: {product?._id?.substring(0, 8)}...</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>سيتم تحديث المنتج فور الحفظ</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>الصورة اختيارية وليست إلزامية</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
};

export default ProductEdit;

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';

// const ProductEdit = ({ product, setIsEditProductModal, fetchProducts }) => {
//     const handleClose = () => {
//         setIsEditProductModal(false)
//     };

//     const [unit, setUnit] = useState(
//         product.unit?._id || product.unit || ""
//     );

//     const [productName, setProductName] = useState(product.productName);
//     const [price, setPrice] = useState(product.price);
//     const [qty, setQty] = useState(product.qty);
    
//     const [newImage, setNewImage] = useState(null);
//     // fetch categories and units
   
//     const [units, setUnits] = useState([]);

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             if (newImage) {
//                 formData.append('image', newImage);
//             }

        
//             formData.append('productName', productName);
//             formData.append('price', price);
//             formData.append('qty', qty);
//             formData.append('unit', unit);

//             const { data } = await api.put(`/api/product/${product._id}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });

//             if (data.success) {
//                 toast.success(data.message);
//                 fetchProducts();
//                 handleClose();
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };

   
//     // Fetch categories and units
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // // Fetch categories
//                 // const categoriesResponse = await api.get('/api/category/');
//                 // if (categoriesResponse.data.success) {
//                 //     setCategories(categoriesResponse.data.categories);
//                 // }
//                 // Fetch units
//                 const unitsResponse = await api.get('/api/unit/');
//                 if (unitsResponse.data.success) {
//                     setUnits(unitsResponse.data.units);
//                 }
//             } catch (error) {
//                 toast.error(error.message);
//             }
//         };

//         fetchData();
//     }, []);

   
  
//     return(
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل منتج</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                 border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
//                     <div className='flex items-center gap-4 mb-2'>
//                         <label htmlFor='edit-service-img'>
//                             <img
//                                 className='w-16 h-16 rounded-full cursor-pointer  p-1 border-b-3 border-sky-500 shadow-lg/30 object-cover'
//                                 src={newImage ? URL.createObjectURL(newImage) : product.image}
//                                 alt="product"
//                             />
//                         </label>
//                         <input
//                             onChange={(e) => setNewImage(e.target.files[0])}
//                             type='file'
//                             id='edit-service-img'
//                             hidden
//                         />
//                         <p className='text-xs font-semibold text-[#0ea5e9] underline'>تغيير صوره المنتج</p>
//                     </div>


//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>اسم المنتج :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={productName}
//                                 onChange={(e) => setProductName(e.target.value)}

//                                 placeholder='اسم المنتج'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
//                                         border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>سعر البيع :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={price}
//                                 onChange={(e) => setPrice(e.target.value)}

//                                 placeholder='سعر بيع المنتج'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
//                                         border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

           

//                     <div className='flex items-center justify-between gap-5'>
//                         {/* <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>Quantity:</label> */}
//                         <div className='w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 value={qty}
//                                 onChange={(e) => setQty(e.target.value)}

//                                 placeholder='رصيد الكميه'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
//                                         border-b border-yellow-700  w-full'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>


//                         <div className='flex w-full items-center rounded-xs p-2 bg-white shadow-lg/30'>
//                             <select className='w-full bg-zinc-100 h-8 rounded-xs text-xs font-normal'
//                                 value={unit}
//                                 onChange={(e) => setUnit(e.target.value)}
//                                 required
//                             >
//                                 {units.map((unit) => (

//                                     <option key={unit._id} value={unit.unitName}>
//                                         {unit.unitName}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <button
//                         type='submit'
//                         className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                             cursor-pointer w-full'
//                     >
//                         تعديل
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     )
// };

// export default ProductEdit ; 