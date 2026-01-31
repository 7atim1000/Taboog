import React, {useState, useEffect} from 'react'

import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';

const UnitUpdate = ({setIsEditUnitModal, fetchUnits, unit}) => {
    const handleClose = () => {
        setIsEditUnitModal(false)
    };

    const [unitName, setUnitName] = useState(unit.unitName);
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            formData.append('unitName', unitName);
       
            const { data } = await api.put(`/api/unit/${unit._id}`, formData
             
            );

            if (data.success) {
               
                fetchUnits();
                handleClose();
                toast.success('تم تعديل الوحده بنجاح');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return(
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
            style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-0 mt-0'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>تعديل الوحده</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>


                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>

                    <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>اسم الوحده :</label>
                        <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
                            <input
                                type='text'

                                value={unitName}
                                onChange={(e) => setUnitName(e.target.value)}

                                placeholder='Enter unit name'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
                                    border-b border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>




                    <button
                        type='submit'
                        className='p-3 w-full rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                            mt-5 cursor-pointer w-full '
                    >
                        تعديل
                    </button>


                </form>

            </motion.div>
        </div>

    );
};


export default UnitUpdate ;