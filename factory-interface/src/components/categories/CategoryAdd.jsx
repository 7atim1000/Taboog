import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { IoCloseCircle } from 'react-icons/io5';
import { FiFolderPlus, FiTag, FiPlus } from 'react-icons/fi';
import { enqueueSnackbar } from 'notistack';
import { addCategory } from '../../https'

const CategoryAdd = ({ setIsCategoryModalOpen, fetchCategories }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.categoryName.trim()) {
            enqueueSnackbar('يرجى إدخال اسم النوع', { variant: "warning" });
            return;
        }
        
        setIsLoading(true);
        CategoryMutation.mutate(formData);
    }

    const CategoryMutation = useMutation({
        mutationFn: (reqData) => addCategory(reqData),
        onSuccess: (res) => {
            const { data } = res;
            enqueueSnackbar(data.message || 'تم إضافة النوع بنجاح', { variant: "success" });
            if (fetchCategories) {
                fetchCategories();
            }
            handleClose();
            resetForm();
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء الإضافة';
            enqueueSnackbar(errorMessage, { variant: "error" });
            console.error(error);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    });

    const handleClose = () => {
        setIsCategoryModalOpen(false);
    };

    const resetForm = () => {
        setFormData({ categoryName: "" });
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
                                <FiFolderPlus className="text-white text-xl" />
                            </div>
                            <h2 className='text-white text-lg font-bold'>إضافة نوع منتج جديد</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-white cursor-pointer'
                            disabled={isLoading}
                        >
                            <IoCloseCircle size={24} />
                        </button>
                    </div>
                    <p className='text-blue-100 text-sm mt-2'>أدخل اسم النوع لتصنيف المنتجات</p>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6">
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Category Name Field */}
                        <div className='space-y-3'>
                            <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm'>
                                <FiTag className="text-blue-600" />
                                اسم النوع:
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    name='categoryName'
                                    value={formData.categoryName}
                                    onChange={handleInputChange}
                                    placeholder='مثال: إلكترونيات، ملابس، أثاث...'
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
                                سيتم استخدام هذا النوع لتصنيف المنتجات وتنظيمها في النظام
                            </p>
                        </div>

                        {/* Example Categories */}
                        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                            <h3 className="text-blue-900 font-bold text-sm mb-3 flex items-center gap-2">
                                <span className='w-2 h-2 bg-blue-400 rounded-full'></span>
                                أمثلة على الأنواع الشائعة:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['إلكترونيات', 'ملابس', 'أثاث', 'مكتبية', 'أطعمة', 'مشروبات', 'أدوات', 'ألعاب'].map((example, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setFormData({ categoryName: example })}
                                        className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg 
                                        text-blue-700 text-xs hover:bg-blue-100 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {example}
                                    </button>
                                ))}
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
                                مسح
                            </button>
                            <button
                                type='submit'
                                disabled={isLoading || !formData.categoryName.trim()}
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
                                        إضافة النوع
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
                            <span>النوع يساعد في تنظيم وتصنيف المنتجات</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>يمكن إضافة أكثر من نوع للمنتجات</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CategoryAdd;


// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { useMutation } from '@tanstack/react-query'
// import { IoCloseCircle } from 'react-icons/io5';
// import { enqueueSnackbar } from 'notistack';

// import { addCategory } from '../../https'

// const CategoryAdd = ({setIsCategoryModalOpen}) => {
    
//     const [formData, setFormData] = useState({
//         categoryName :""
//     });
    
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({...prev, [name] : value}));
//     };
    
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData)

//         CategoryMutation.mutate(formData)
//         window.location.reload()
//         setIsCategoryModalOpen(false)
//     }


//     const CategoryMutation = useMutation({
//         mutationFn: (reqData) => addCategory(reqData),
//         onSuccess: (res) => {
        
//         const { data } = res;
//         //console.log(data)
//         enqueueSnackbar(data.message, { variant: "success"});
//         },
        
//         onError: (error) => {
//         const { response } = error;
//         enqueueSnackbar(response.data.message, { variant: "error"});
        
//         console.log(error);
//             },
//         });
             
//         const handleClose = () => {
//             setIsCategoryModalOpen(false)
//         };
        

//     return (
//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50' 
//         style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}}>
//             <motion.div
//                 initial ={{opacity :0 , scale :0.9}}
//                 animate ={{opacity :1, scale :1}}
//                 exit ={{opacity :0, scale :0.9}}
//                 transition ={{duration :0.3 , ease: 'easeInOut'}}
//                 className ='bg-white p-2 rounded-xs shadow-xl w-120 md:mt-0 mt-0'
//                 >
                
                
//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>اضافه انواع المنتجات</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                         border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>
                          
//                 {/*Modal Body*/}
//                 <form className ='mt-5 space-y-6' onSubmit ={handleSubmit}>
//                     <div className =''>
                            
//                         <label className ='text-[#1a1a1a] block mb-2 mt-3 px-4 text-sm font-medium'>نوع المنتج :</label>
//                         <div className ='flex items-center justify-between gap-5'>
//                             <div className ='w-full flex items-center rounded-xs p-3 bg-white shadow-xl'>
//                                 <input 
//                                     type ='text'
//                                     name ='categoryName'
//                                     value ={formData.categoryName}
//                                     onChange ={handleInputChange}
                                           
//                                     placeholder = 'الرجاء كتابه نوع المنتج'
//                                     className ='bg-transparent w-full text-[#1a1a1a] focus:outline-none border-b border-yellow-700 text-sm'
//                                     required
//                                     autoComplete='none'
//                                 />
//                             </div>
                
//                         </div>

//                         <button
//                             type='submit'
//                             className='p-1 text-xs bg-[#0ea5e9] text-white font-semibold 
//                                 cursor-pointer py-3 rounded-sm w-full mt-10'
//                         >
//                             حفظ
//                         </button>
                    
        
//                     </div>
                        
//                 </form>
//             </motion.div>
//         </div> 
        
//     );
// };

// export default CategoryAdd ;