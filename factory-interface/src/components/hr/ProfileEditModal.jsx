import React , {useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { Helmet } from 'react-helmet'
// import { useSelector } from 'react-redux'

const ProfileEditModal = ({ user, setIsEditProfileModal, userData }) => {
    
    // const userData = useSelector(state => state.user);
  
    const [newImage, setNewImage] = useState(null);

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleClose = () => {
        setIsEditProfileModal(false)
        window.location.reload()
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            if (newImage) {
                formData.append('image', newImage);
            }
        
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);

            const { data } = await api.put(`/api/auth/update/${userData._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data.success) {
                // toast.success(data.message);
                toast.success('تم تعديل البيانات الشخصيه بنجاح ');
                // fetchEmployees();
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };


    return(
    <>
        

            <div className='fixed inset-0 flex items-center justify-center shadow-lg/10 z-50'
                style={{ backgroundColor: 'rgba(6, 76, 133, 0.4)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh-2rem)] overflow-y-scroll scrollbar-hidden
                border-b-4 border-yellow-700'
                >
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-4 shadow-xl p-2">
                        <h2 className='text-sky-600 text-xs font-bold'>تعديل البيانات الشخصيه</h2>
                        <button onClick={handleClose} className='rounded-lg border-b border-[#be3e3f] text-[#be3e3f] cursor-pointer'>
                            <IoCloseCircle size={25} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
                        {/* Image Upload */}
                        <div className='flex items-center gap-4 mb-2'>
                            <label htmlFor='edit-user-img'>
                                <img
                                    className='w-16 h-16 cursor-pointer rounded-lg p-1 border border-sky-500 shadow-lg/30 object-cover'
                                    src={newImage ? URL.createObjectURL(newImage) : user.image}
                                    alt="user"
                                />
                            </label>
                            <input
                                onChange={(e) => setNewImage(e.target.files[0])}
                                type='file'
                                id='edit-user-img'
                                hidden
                            />
                            <p className='text-xs font-semibold text-green-600'>تعديل الصوره</p>
                        </div>


                        {/* user Name */}


                        <div className='flex items-center justify-between shadow-xl p-3'>
                            <label className='w-[25%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>الاسم :</label>
                            <div className='flex w-[75%] items-center rounded-lg py-3 px-4 bg-white shadow-xl'>
                                <input
                                    type='text'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs border-b border-yellow-700'
                                    required
                                />
                            </div>
                        </div>
                        
                        
                        <div className='flex items-center justify-between shadow-xl p-3'>
                            <label className='w-[25%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>البريد اللاكتروني :</label>
                            <div className='flex w-[75%] items-center rounded-lg py-3 px-4 bg-white shadow-xl'>
                                <input
                                    type='text'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs border-b border-yellow-700'
                                    required
                                />
                            </div>
                        </div>


                        <div className='flex items-center justify-between shadow-xl p-3'>
                            <label className='w-[25%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>كلمه المرور :</label>

                            <div className=' w-[75%]' style={{ position: 'relative', marginBottom: '1rem' }}>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={userData?.password ? "••••••••" : "كلمه المرور الجديده"}
                                    style={{
                                        paddingRight: '40px',
                                        width: '100%',
                                        padding: '8px',
                                    }}
                                    className='border-b border-yellow-700 text-xs'
                                />


                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>


                        </div>



                        <button
                            type='submit'
                            className='p-2 w-full rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold cursor-pointer'
                        >
                            تعديل
                        </button>
                    </form>
                </motion.div>
            </div>
    </>
    
    );
};


export default ProfileEditModal