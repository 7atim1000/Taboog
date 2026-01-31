import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { addSupplier } from '../../https';
import { motion } from 'framer-motion'
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5';
import { FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign } from 'react-icons/fi';


const SupplierAdd = ({ setIsSupplierModalOpen, fetchSuppliers }) => {

    const [formData, setFormData] = useState({
        supplierName: "", email: "", contactNo: "", address: "", balance: 0
    })

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsSupplierModalOpen(false)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        setIsLoading(true);
        SupplierMutation.mutate(formData)
    };

    const SupplierMutation = useMutation({
        mutationFn: (reqData) => addSupplier(reqData),
        onSuccess: (res) => {
            const { data } = res;
            enqueueSnackbar('تم إضافة المورد بنجاح', { variant: "success" });
            fetchSuppliers();
            setIsLoading(false);
            setIsSupplierModalOpen(false);
        },

        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response?.data?.message || 'حدث خطأ أثناء الإضافة', { variant: "error" });
            console.log(error);
            setIsLoading(false);
        },
    });



    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden 
                border border-blue-100'
                onClick={(e) => e.stopPropagation()}
            >

                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FiUser className="text-white text-xl" />
                            </div>
                            <h2 className='text-white text-lg font-bold'>إضافة مورد جديد</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 rounded-full hover:bg-white/20 transition-colors duration-200
                            text-white cursor-pointer'
                            disabled={isLoading}
                        >
                            <IoCloseCircle size={26} />
                        </button>
                    </div>
                    <p className='text-blue-100 text-sm mt-2'>املأ البيانات الأساسية للمورد</p>
                </div>

                {/* Modal Body */}
                <div className="p-2 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Supplier Name */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiUser className="text-blue-600" />
                                    اسم المورد:
                                </label>
                                <p className='text-blue-500 text-xs'>الاسم الكامل للمورد</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative group'>
                                    <input
                                        type='text'
                                        name='supplierName'
                                        value={formData.supplierName}
                                        onChange={handleInputChange}
                                        placeholder='أدخل اسم المورد'
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50'
                                        required
                                        autoComplete='off'
                                        disabled={isLoading}
                                    />
                                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 
                                    text-blue-400'>
                                        <FiUser />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiMail className="text-blue-600" />
                                    البريد الإلكتروني:
                                </label>
                                <p className='text-blue-500 text-xs'>البريد الإلكتروني للتواصل</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative group'>
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder='example@domain.com'
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50'
                                        required
                                        autoComplete='off'
                                        disabled={isLoading}
                                    />
                                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 
                                    text-blue-400'>
                                        <FiMail />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiPhone className="text-blue-600" />
                                    رقم الهاتف:
                                </label>
                                <p className='text-blue-500 text-xs'>رقم التواصل الأساسي</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative group'>
                                    <input
                                        type='tel'
                                        name='contactNo'
                                        value={formData.contactNo}
                                        onChange={handleInputChange}
                                        placeholder='+249 123 456 789'
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50'
                                        required
                                        autoComplete='off'
                                        disabled={isLoading}
                                    />
                                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 
                                    text-blue-400'>
                                        <FiPhone />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiMapPin className="text-blue-600" />
                                    العنوان:
                                </label>
                                <p className='text-blue-500 text-xs'>العنوان التفصيلي</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative group'>
                                    <input
                                        type='text'
                                        name='address'
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder='العنوان الكامل للمورد'
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50'
                                        required
                                        autoComplete='off'
                                        disabled={isLoading}
                                    />
                                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 
                                    text-blue-400'>
                                        <FiMapPin />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Balance */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='w-full sm:w-1/3'>
                                <label className='flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1'>
                                    <FiDollarSign className="text-blue-600" />
                                    الرصيد الافتتاحي:
                                </label>
                                <p className='text-blue-500 text-xs'>الرصيد الحالي للمورد</p>
                            </div>
                            <div className='w-full sm:w-2/3'>
                                <div className='relative group'>
                                    <input
                                        type='number'
                                        name='balance'
                                        value={formData.balance}
                                        onChange={handleInputChange}
                                        placeholder='0.00'
                                        min="0"
                                        step="0.01"
                                        className='w-full p-3 pr-12 bg-blue-50 border-2 border-blue-200 
                                        rounded-xl text-blue-900 text-sm focus:outline-none 
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                        transition-all duration-200 disabled:opacity-50'
                                        required
                                        autoComplete='off'
                                        disabled={isLoading}
                                    />
                                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 
                                    text-blue-400'>
                                        <FiDollarSign />
                                    </div>
                                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2 
                                    text-blue-500 text-sm'>
                                        ر.ع
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
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    'حفظ المورد'
                                )}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Form Footer */}
                <div className='bg-blue-50 px-6 py-3 border-t border-blue-100'>
                    <div className='flex items-center gap-2 text-blue-600 text-xs'>
                        <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                        <span>جميع الحقول مطلوبة</span>
                        <div className='w-2 h-2 bg-blue-400 rounded-full ml-4'></div>
                        <span>سيتم إضافة المورد فور الضغط على حفظ</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SupplierAdd;


// import React, {useState} from 'react'
// import { useMutation } from '@tanstack/react-query'
// import { addSupplier } from '../../https';
// import { motion } from 'framer-motion'
// import { enqueueSnackbar } from 'notistack';
// import { IoCloseCircle } from 'react-icons/io5';

// const SupplierAdd = ({setIsSupplierModalOpen, fetchSuppliers}) => {

//     const [formData, setFormData] = useState({
//         supplierName :"", email: "", contactNo :"", address :"", balance :0
//     })

//     const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({...prev, [name] : value}));
//     };

//     const handleClose = ()=> {
//         setIsSupplierModalOpen(false)
//     }
    

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData)

//         SupplierMutation.mutate(formData)
//         setIsSupplierModalOpen(false)

//     };

//     const SupplierMutation = useMutation({
//         mutationFn: (reqData) => addSupplier(reqData),
//         onSuccess: (res) => {
                
//         const { data } = res;
//         //console.log(data)
//         // enqueueSnackbar(data.message, { variant: "success"});
//         enqueueSnackbar('تم اضافه المورد بنجاح', { variant: "success"});
//         fetchSuppliers();
//         },
                
//         onError: (error) => {
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error"});
                
//         console.log(error);
//         },
//     });
    



//     return (
//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)'}}>
//             <motion.div
//             initial ={{opacity :0 , scale :0.9}}
//             animate ={{opacity :1, scale :1}}
//             exit ={{opacity :0, scale :0.9}}
//             transition ={{durayion :0.3 , ease: 'easeInOut'}}
//             className ='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'
//             >
                                
                                
//             {/*Modal Header */}
//             <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                 <h2 className='text-[#1a1a1a] text-sm font-bold'>اضافه مورد</h2>
//                 <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                     border-b border-[#be3e3f]'>
//                     <IoCloseCircle size={22} />
//                 </button>
//             </div>
                                          
//             {/*Modal Body*/}
//             <form className ='mt-5 space-y-6' onSubmit ={handleSubmit}>
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>اسم المورد :</label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='supplierName'
//                             value ={formData.supplierName}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = 'اسم المورد'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>

//                 <div className='flex items-center justify-between'>
//                     <label className='w-[20%] text-[#1a1a1a] block text-xs font-normal'>البريد اللاكتروني :</label>
//                     <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input
//                             type='email'
//                             name='email'
//                             value={formData.email}
//                             onChange={handleInputChange}

//                             placeholder='البريد اللاكتروني للمورد'
//                             className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>
        
                
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>رقم الهاتف : </label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='contactNo'
//                             value ={formData.contactNo}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = '+249 9999999'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>       
//                 </div>        
                            
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>العنوان : </label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='address'
//                             value ={formData.address}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = 'عنوان المورد'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
                
//                     </div>
//                 </div>
                                      
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>الرصيد : </label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='balance'
//                             value ={formData.balance}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = 'الرصيد الافتتاحي'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
                
//                     </div>
//                 </div>
        
//                 <button
//                     type='submit'
//                     className='p-3 w-full rounded-xs mt-6 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                     cursor-pointer '
//                 >
//                     حفظ
//                 </button>
                                                  
                                         
//             </form>
        
//                 </motion.div>
//             </div>
//     );
// } ;

// export default SupplierAdd ;