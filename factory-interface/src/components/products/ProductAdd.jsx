import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import imageUpload from '../../assets/images/image-upload.jpg'
import { IoCloseCircle } from 'react-icons/io5';
import { FiPackage, FiDollarSign, FiLayers, FiTag, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify'
import { api } from '../../https';


const ProductAdd = ({ setIsAddProductModal, fetchProducts }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [proImg, setProImg] = useState(null)
    const [productName, setProductName] = useState('')
    const [price, setPrice] = useState('')
    const [qty, setQty] = useState('')
    const [unit, setUnit] = useState('Pc')
    const [unitlist, setUnitList] = useState([])

    const handleClose = () => {
        setIsAddProductModal(false)
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('حجم الصورة يجب أن يكون أقل من 5MB');
                return;
            }
            setProImg(file);
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!productName || !price || !qty || !unit) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData()
            if (proImg) formData.append('image', proImg);
            formData.append('productName', productName);
            formData.append('qty', qty);
            formData.append('price', price);
            formData.append('unit', unit);

            const { data } = await api.post('/api/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (data.success) {
                toast.success('تم إضافة المنتج بنجاح');
                fetchProducts();
                handleClose();
                resetForm();
            } else {
                toast.error(data.message || 'حدث خطأ أثناء الإضافة');
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء الإضافة');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setProImg(null);
        setProductName('');
        setQty('');
        setPrice('');
        setUnit('Pc');
    }

    const fetchUnit = async () => {
        try {
            const response = await api.get('/api/unit/');
            if (response.data.success) {
                setUnitList(response.data.units || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('حدث خطأ في جدد الوحدات');
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
                className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden 
                border border-blue-100'
                onClick={(e) => e.stopPropagation()}
            >

                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FiPackage className="text-white text-xl" />
                            </div>
                            <h2 className='text-white text-lg font-bold'>إضافة منتج جديد</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-white cursor-pointer'
                            disabled={isLoading}
                        >
                            <IoCloseCircle size={24} />
                        </button>
                    </div>
                    <p className='text-blue-100 text-sm mt-2'>أدخل بيانات المنتج الأساسية</p>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <form className='space-y-6' onSubmit={onSubmitHandler}>
                        {/* Image Upload */}
                        <div className='flex flex-col items-center gap-4 mb-4'>
                            <label htmlFor='pro-img' className='cursor-pointer'>
                                <div className='relative'>
                                    <div className='w-32 h-32 rounded-2xl border-4 border-blue-200 overflow-hidden 
                                    bg-blue-50 flex items-center justify-center hover:border-blue-400 transition-all duration-200'>
                                        {proImg ? (
                                            <img
                                                className='w-full h-full object-cover'
                                                src={URL.createObjectURL(proImg)}
                                                alt='Product preview'
                                            />
                                        ) : (
                                            <div className='text-center p-4'>
                                                <FiImage className='text-blue-400 text-4xl mx-auto mb-2' />
                                                <span className='text-blue-600 text-sm'>إضافة صورة</span>
                                            </div>
                                        )}
                                    </div>
                                    {proImg && (
                                        <button
                                            type='button'
                                            onClick={() => setProImg(null)}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5'
                                        >
                                            <IoCloseCircle size={18} />
                                        </button>
                                    )}
                                </div>
                            </label>
                            <input
                                onChange={handleImageChange}
                                type='file'
                                id='pro-img'
                                hidden
                                accept='image/*'
                                disabled={isLoading}
                            />
                            <p className='text-blue-600 text-sm text-center'>
                                <span className='font-medium'>صورة المنتج</span> 
                                <span className='text-blue-400 mr-1'> (اختياري)</span>
                                <br />
                                <span className='text-blue-500 text-xs'>JPG, PNG - الحد الأقصى 5MB</span>
                            </p>
                        </div>

                        {/* Product Name */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiTag className="text-blue-600" />
                                    اسم المنتج:
                                </label>
                                <p className='text-blue-500 text-xs'>الاسم الكامل للمنتج</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative'>
                                    <input
                                        type='text'
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder='أدخل اسم المنتج'
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
                                    سعر البيع:
                                </label>
                                <p className='text-blue-500 text-xs'>سعر بيع المنتج للعميل</p>
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
                                <p className='text-blue-500 text-xs'>الكمية المتاحة والوحدة القياسية</p>
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
                        </div>

                        {/* Product Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-900 font-bold text-sm mb-3">ملخص المنتج:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-blue-600 text-xs font-medium mb-1">الاسم</div>
                                    <div className="text-blue-900 font-semibold truncate">{productName || '---'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-600 text-xs font-medium mb-1">السعر</div>
                                    <div className="text-blue-900 font-semibold">{price ? `${price} ر.ع` : '---'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-600 text-xs font-medium mb-1">الكمية</div>
                                    <div className="text-blue-900 font-semibold">
                                        {qty ? `${qty} ${unit}` : '---'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-100'>
                            <button
                                type='button'
                                onClick={resetForm}
                                className='flex-1 px-6 py-3.5 bg-blue-50 text-blue-700 rounded-xl 
                                font-semibold hover:bg-blue-100 transition-all duration-200 
                                border-2 border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={isLoading}
                            >
                                مسح النموذج
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
                                        جاري الإضافة...
                                    </>
                                ) : (
                                    'إضافة المنتج'
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
                            <span>الحقول المميزة بعلامة (*) إلزامية</span>
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

export default ProductAdd;

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import imageUpload from '../../assets/images/image-upload.jpg'
// import { IoCloseCircle } from 'react-icons/io5';
// import { toast } from 'react-toastify'
// import { api } from '../../https';

// const ProductAdd = ({setIsAddProductModal, fetchProducts}) => {
//     const handleClose = () => {
//         setIsAddProductModal(false)
//     };

//     const [proImg, setProImg] = useState(false)

//     const [productName, setProductName] = useState('')
//     const [price, setPrice] = useState('')
//     const [qty, setQty] = useState('')
//     const [unit, setUnit] = useState('Pc')

//     const onSubmitHandler = async (event) => {
//         event.preventDefault()

//         try {
//             const formData = new FormData()

//             formData.append('image', proImg)
          
//             formData.append('productName', productName)
//             formData.append('qty', qty)
//             formData.append('price', price)
//             formData.append('unit', unit)

//             //console log formData
//             formData.forEach((value, key) => {
//                 console.log(`${key} : ${value}`);
//             });

//             const { data } = await api.post('/api/product', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             })

//             if (data.success) {
//                 toast.success(data.message)
//                 // setIsServiceModalOpen(false);
//                 fetchProducts();
//                 setIsAddProductModal(false)

//                 setProImg(false)
            
//                 setProductName('')
//                 setQty('')
//                 setUnit('')
//                 setPrice('')

//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {

//         }
//     };

  
//     // Unit fetch
//     const [unitlist, setUnitList] = useState([])
//     const fetchUnit = async () => {

//         try {

//             const response = await api.get('/api/unit/') //
//             if (response.data.success) {
//                 setUnitList(response.data.units);
//             }
//             else {
//                 toast.error(response.data.message)
//             }


//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)

//         }
//     };

//     useEffect(() => {
//         fetchUnit()
//     }, []);


//     return(
      
//          <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//             <motion.div
//                 initial= {{ opacity: 0, scale: 0.9 }}
//                 animate= {{ opacity: 1, scale: 1 }}
//                 exit= {{ opacity: 0, scale: 0.9 }}
//                 transition= {{ durayion: 0.3, ease: 'easeInOut' }}
//                 className= 'bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-bold'>اضافه منتج</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6 ' onSubmit={onSubmitHandler}>
//                     <div className='flex items-center gap-4 mb-2 shadow-xl p-1'>
//                         <label htmlFor='pro-img'>
//                             <img className='w-15 h-15 bg-white cursor-pointer rounded-full  p-1 border-b-3 border-[#0ea5e9] shadow-lg/30'
//                                 src={proImg ? URL.createObjectURL(proImg) : imageUpload}
//                             />
//                         </label>
//                         <input onChange={(e) => setProImg(e.target.files[0])} type='file' id='pro-img' hidden />
//                         <p className='text-xs font-semibold text-[#1a1a1a]'>صوره المنتج 
//                             <span className='text-[#0ea5e9]'> (اختياري)</span>
//                         </p>
//                     </div>

                   

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>اسم المنتج :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={productName}
//                                 onChange={(e) => setProductName(e.target.value)}

//                                 placeholder='اسم المنتج'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
//                                        border-b border-yellow-700'
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
//                                        border-b border-yellow-700'
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
//                                        border-b border-yellow-700  w-full'
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

//                                 <option className='text-black text-xs font-normal'></option>
//                                 {unitlist.map((unit, index) => (

//                                     <option key={index} value={unit.unitName} className='text-sm font-normal'>
//                                         {unit.unitName}
//                                     </option>



//                                 ))};
//                             </select>
//                         </div>
//                     </div>

//                     <button
//                         type='submit'
//                         className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                            cursor-pointer w-full'
//                     >
//                         حفظ
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     )
// };

// export default ProductAdd ;