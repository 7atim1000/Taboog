import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { IoCloseCircle } from 'react-icons/io5';
import { enqueueSnackbar } from 'notistack';

import { addUnit } from '../../https'



const UnitAdd = ({setIsUnitModalOpen, fetchUnits}) => {
    
    const [formData, setFormData] = useState({
        unitName :""
    });
        
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name] : value}));
    };
        
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
    
        UnitMutation.mutate(formData)
        // window.location.reload()
        setIsUnitModalOpen(false)
    }
    
    
    const UnitMutation = useMutation({
        mutationFn: (reqData) => addUnit(reqData),
        onSuccess: (res) => {
            const { data } = res;
            //console.log(data)
            enqueueSnackbar('تم اضافه الوحده بنجاح', { variant: "success"});
            fetchUnits();
            },
            
            onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error"});
            
            console.log(error);
        },
    });
                 
    const handleClose = () => {
        setIsUnitModalOpen(false)
    };
            
    
    return (
        <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50' 
        style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}}>
        <motion.div
            initial ={{opacity :0 , scale :0.9}}
            animate ={{opacity :1, scale :1}}
            exit ={{opacity :0, scale :0.9}}
            transition ={{duration :0.3 , ease: 'easeInOut'}}
            className ='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-0 mt-0'
        >
                        
                        
         {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-sm font-bold'>اضافه وحده</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={22} />
                    </button>
                </div>
                                  
        {/*Modal Body*/}
        <form className ='mt-5 space-y-6' onSubmit ={handleSubmit}>
            <div className =''>
                                    
                <label className ='text-[#1a1a1a] block mb-2 mt-3 px-4 text-xs font-medium'>اسم الوحده :</label>
                <div className ='flex items-center justify-between gap-5'>
                    <div className ='w-full flex items-center rounded-xs p-3 bg-white shadow-xl'>
                        <input 
                            type ='text'
                            name ='unitName'
                            value ={formData.unitName}
                            onChange ={handleInputChange}
                                                   
                            placeholder = 'Enter unit name'
                            className ='bg-transparent w-full text-[#1a1a1a] focus:outline-none border-b border-yellow-700 font-semibold text-xs'
                            required
                            autoComplete='none'
                        />
                    </div>
                
                </div>

                        <button
                            type='submit'
                            className='p-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                               mt-5 cursor-pointer w-full'
                        >
                            Add Unit
                        </button>

                            
            </div>
                                
        </form>
        </motion.div>
        </div>
    );
};




export default UnitAdd;