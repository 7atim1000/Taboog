import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { FiFolder, FiTag, FiEdit, FiSave } from 'react-icons/fi';
import { enqueueSnackbar } from 'notistack';

const CategoryEdit = ({ setIsEditCategoryModal, category, fetchCategories }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [categoryName, setCategoryName] = useState(category?.categoryName || '');

    const handleClose = () => {
        setIsEditCategoryModal(false);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!categoryName.trim()) {
            enqueueSnackbar('يرجى إدخال اسم النوع', { variant: "warning" });
            setIsLoading(false);
            return;
        }

        if (categoryName === category?.categoryName) {
            enqueueSnackbar('لم يتم إجراء أي تغيير', { variant: "info" });
            handleClose();
            setIsLoading(false);
            return;
        }

        try {
            const updateData = { categoryName };
            const { data } = await api.put(`/api/category/${category._id}`, updateData);

            if (data.success) {
                enqueueSnackbar('تم تعديل النوع بنجاح', { variant: "success" });
                if (fetchCategories) {
                    fetchCategories();
                }
                handleClose();
            } else {
                enqueueSnackbar(data.message || 'فشل في التعديل', { variant: "error" });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ أثناء التعديل';
            enqueueSnackbar(errorMessage, { variant: "error" });
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setCategoryName(category?.categoryName || '');
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-100'
                onClick={(e) => e.stopPropagation()}
            >

                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FiEdit className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className='text-white text-lg font-bold'>تعديل نوع المنتج</h2>
                                <p className='text-blue-100 text-sm'>{category?.categoryName}</p>
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
                <div className="p-4 sm:p-6">
                    <form className='space-y-6' onSubmit={onSubmitHandler}>
                        {/* Current Category Info */}
                        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-800 font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                معلومات النوع الحالية
                            </h3>
                            <div className="space-y-2 text-xs">
                                <div className="text-blue-600">
                                    <span className="font-medium">الاسم الحالي:</span>
                                    <span className="text-blue-900 font-semibold mr-2"> {category?.categoryName}</span>
                                </div>
                                <div className="text-blue-600">
                                    <span className="font-medium">معرف النوع:</span>
                                    <span className="text-blue-900 font-medium mr-2"> {category?._id?.substring(0, 8)}...</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Name Field */}
                        <div className='space-y-3'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FiTag className="text-blue-600" />
                                اسم النوع الجديد:
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder='أدخل اسم النوع الجديد'
                                    className='w-full p-4 pr-12 bg-blue-50 border-2 border-blue-200 
                                    rounded-xl text-blue-900 text-sm focus:outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                    transition-all duration-200 disabled:opacity-50'
                                    required
                                    autoComplete='off'
                                    disabled={isLoading}
                                />
                                <FiTag className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                            </div>
                            <p className='text-blue-500 text-xs'>
                                سيتم تحديث جميع المنتجات المرتبطة بهذا النوع
                            </p>
                        </div>

                        {/* Changes Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-900 font-bold text-sm mb-3">ملخص التعديلات:</h3>
                            <div className="space-y-3 text-sm">
                                <div className="text-blue-700">
                                    <span className="font-medium">التغيير:</span>
                                    <div className="mt-2 flex flex-col gap-1">
                                        <div className="text-blue-900 line-through bg-blue-100 px-3 py-2 rounded-lg">
                                            {category?.categoryName}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500">→</span>
                                            <div className="text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-lg flex-1">
                                                {categoryName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-sm ${categoryName === category?.categoryName ? 'text-blue-500' : 'text-green-600'}`}>
                                    {categoryName === category?.categoryName 
                                        ? 'لم يتم إجراء أي تغيير' 
                                        : 'سيتم تطبيق التغيير على جميع المنتجات المرتبطة'}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-100'>
                            <button
                                type='button'
                                onClick={handleReset}
                                disabled={isLoading}
                                className='flex-1 px-4 py-3.5 bg-blue-50 text-blue-700 rounded-xl 
                                font-semibold hover:bg-blue-100 transition-all duration-200 
                                border-2 border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                إعادة تعيين
                            </button>
                            <button
                                type='submit'
                                disabled={isLoading || !categoryName.trim() || categoryName === category?.categoryName}
                                className='flex-1 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 
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
                            <span>ID: {category?._id?.substring(0, 8)}...</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>سيتم تحديث جميع المنتجات المرتبطة</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CategoryEdit;

// import React, {useState, useEffect} from 'react'
// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';

// const CategoryEdit = ({setIsEditCategoryModal, category}) => {
//     const handleClose = () => {
//         setIsEditCategoryModal(false)
//     };

//     const [categoryName, setCategoryName] = useState(category.categoryName);
    
//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             formData.append('categoryName', categoryName);
       
//             const { data } = await api.put(`/api/category/${category._id}`, formData
             
//             );

//             if (data.success) {
               
//                 // fetchCustomers();
//                 window.location.reload();
//                 handleClose();
//                 toast.success(data.message);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };

//     return(
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-0 mt-0'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>تعديل انواع المنتجات</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                         border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>نوع المنتج :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={categoryName}
//                                 onChange={(e) => setCategoryName(e.target.value)}

//                                 placeholder='نوع المنتج'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                     border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>




//                     <button
//                         type='submit'
//                         className='p-3 w-full rounded-xs mt-5 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                         cursor-pointer '
//                     >
//                         تعديل
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     );
// };


// export default CategoryEdit ;