import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { enqueueSnackbar } from 'notistack';
import { FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign, FiSave } from 'react-icons/fi';

const SupplierEdit = ({ supplier, setIsEditSupplierModal, fetchSuppliers }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        supplierName: '',
        email: '',
        contactNo: '',
        address: '',
        balance: 0
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                supplierName: supplier.supplierName || '',
                email: supplier.email || '',
                contactNo: supplier.contactNo || '',
                address: supplier.address || '',
                balance: supplier.balance || 0
            });
        }
    }, [supplier]);

    const handleClose = () => {
        setIsEditSupplierModal(false)
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Send as JSON instead of FormData
            const updateData = {
                supplierName: formData.supplierName,
                email: formData.email,
                contactNo: formData.contactNo,
                address: formData.address,
                balance: parseFloat(formData.balance) || 0
            };

            const { data } = await api.put(`/api/supplier/${supplier._id}`, updateData);

            if (data.success) {
                enqueueSnackbar('تم تعديل بيانات المورد بنجاح', { variant: "success" });
                fetchSuppliers();
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                            <div>
                                <h2 className='text-white text-lg font-bold'>تعديل بيانات مورد</h2>
                                <p className='text-blue-100 text-sm'>{supplier?.supplierName}</p>
                            </div>
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
                </div>

                {/* Modal Body */}
                <div className="p-2 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form className='space-y-6' onSubmit={onSubmitHandler}>
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
                                    الرصيد الحالي:
                                </label>
                                <p className='text-blue-500 text-xs'>الرصيد المالي للمورد</p>
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
                                        className='w-full p-3 pr-12 pl-12 bg-blue-50 border-2 border-blue-200 
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

                        {/* Current Supplier Info */}
                        <div className='bg-blue-50 rounded-xl p-4 border-2 border-blue-200'>
                            <h3 className='text-blue-800 font-semibold text-sm mb-2 flex items-center gap-2'>
                                <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                                معلومات المورد الحالية
                            </h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
                                <div className='text-blue-600'>
                                    <span className='font-medium'>الاسم الحالي:</span> 
                                    <span className='text-blue-900 font-semibold mr-2'> {supplier?.supplierName}</span>
                                </div>
                                <div className='text-blue-600'>
                                    <span className='font-medium'>الرصيد الحالي:</span> 
                                    <span className={`font-semibold mr-2 ${supplier?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {supplier?.balance?.toFixed(2)} ر.ع
                                    </span>
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

                {/* Form Footer */}
                <div className='bg-blue-50 px-6 py-3 border-t border-blue-100'>
                    <div className='flex flex-wrap items-center gap-4 text-blue-600 text-xs'>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>جميع الحقول مطلوبة</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>سيتم تحديث البيانات فور الحفظ</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                            <span>ID: {supplier?._id?.substring(0, 8)}...</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SupplierEdit;


// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';

// const SupplierEdit = ({ supplier, setIsEditSupplierModal, fetchSuppliers }) => {
//     const handleClose = () => {
//         setIsEditSupplierModal(false)
//     };

//     const [supplierName, setSupplierName] = useState(supplier.supplierName);
//     const [email, setEmail] = useState(supplier.email);
//     const [contactNo, setContactNo] = useState(supplier.contactNo);
//     const [address, setAddress] = useState(supplier.address);
//     const [balance, setBalance] = useState(supplier.balance);

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             formData.append('supplierName', supplierName);
//             formData.append('email', email);
//             formData.append('contactNo', contactNo);
//             formData.append('address', address);
//             formData.append('balance', balance);
            
//             const { data } = await api.put(`/api/supplier/${supplier._id}`, formData
//         );

//             if (data.success) {
//                 // toast.success(data.message);
//                 enqueueSnackbar('تم تعديل بيانات المورد بنجاح', { variant: "success"});
//                 fetchSuppliers();
//                 handleClose();
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };

//     // The issue is that you're trying to send multipart/form-data but your backend is expecting JSON data. When you set 'Content-Type': 'multipart/form-data', the Express.js express.json() middleware can't parse the request body, so req.body becomes undefined.
//     // Solution 1: Remove the headers (Use JSON) this is Json : const { data } = await api.put(`/api/customers/${customer._id}`, formData);
   
//     return (
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
//                     <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل بيانات مورد</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                      border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
            
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>اسم المورد :</label>
//                         <div className='w-[75%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={supplierName}
//                                 onChange={(e) => setSupplierName(e.target.value)}

//                                 placeholder='Enter supplier name'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                             border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>البريد اللاكتروني :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='email'

//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}

//                                 placeholder='Enter supplier email'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>العنوان :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={address}
//                                 onChange={(e) => setAddress(e.target.value)}

//                                 placeholder='Enter supplier address'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                              border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>رقم الهاتف :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={contactNo}
//                                 onChange={(e) => setContactNo(e.target.value)}

//                                 placeholder='Enter supplier contact number'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                              border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>الرصيد :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={balance}
//                                 onChange={(e) => setBalance(e.target.value)}

//                                 placeholder='Enter supplier balance'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                     border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


                   

//                     <button
//                         type='submit'
//                         className='p-3 w-full rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                                  cursor-pointer '
//                     >
//                         تعديل
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     );
// };

// export default SupplierEdit ;