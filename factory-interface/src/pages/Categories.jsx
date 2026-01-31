import React, { useState} from 'react'
import BackButton from '../components/shared/BackButton';
import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";

import { api, getCategories } from '../https/'

import { toast } from 'react-toastify'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBgColor } from '../utils';
import CategoryAdd from '../components/categories/CategoryAdd';
import BottomNav from '../components/shared/BottomNav';
import CategoryEdit from '../components/categories/categoryEdit';

const Categories = () => {
    const Button = [
        { label : 'اضافه نوع جديد' , icon : <MdOutlineAddToDrive className ='text-yellow-700' size={20} />, action :'category' }
    ];

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const handleOpenModal = (action) => {
        if (action === 'category') setIsCategoryModalOpen(true)
    }


    // Fetch Categories

    const [loading, setLoading] = useState(false);


    const{ data: responseData, IsError } = useQuery({

        queryKey: ['categories'],

        queryFn: async () => {
            return await getCategories();
        },

        placeholderData: keepPreviousData,

    });


    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }

    console.log(responseData); 

    // edit and update
    const [isEditCategoryModal, setIsEditCategoryModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsEditCategoryModal(true);
    };



    // remove 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const removeCategory = async (id) => {

        try {

            const response = await api.post('/api/category/remove', { id },)

            if (response.data.success) {

                //Update the LIST after Remove
                toast.success('تمت عمليه المسح بنجاح')
                window.location.reload()


            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

   
    return (
        <section dir='rtl' className ='h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden'>
            <div className ='flex items-center justify-between px-8 py-2 shadow-xl mb-2'>
                <div className ='flex items-center gap-2'>
                    <BackButton />
                    <h1 className ='text-sm font-semibold text-[#1a1a1a]'>اداره انواع المنتجات</h1>
                </div>
                         
                
                <div className ='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {Button.map(({ label, icon, action}) => {
                        return(
                            <button 
                                onClick = {() => handleOpenModal(action)}
                                className ='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'> 
                                {label} {icon}
                            </button>
                            )
                        })}
                </div>
            
                {isCategoryModalOpen && <CategoryAdd setIsCategoryModalOpen={setIsCategoryModalOpen} />}
            
            </div>


            
            <div className ='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] bg-white'>
                        
                {responseData?.data.data.length === 0 
                ? (<p className ='w-full text-sm text-[#be3e3f] flex justify-center'>قائمه انواع المنتجات فارغه حاليا .</p>) 
                               
                :responseData?.data.data.map(category => ( 
                                               
                    <div key={category.categoryName} 
                    className ='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[70px] cursor-pointer
                    shadow-lg/10 bg-[#F1E8D9]'
                        // style = {{backgroundColor : getBgColor()}}
                    >
                                      
                    <div className ='flex justify-between w-full shadow-lg/30'>
                        <div className ='items-start px-3'>
                            <h1 className ='text-xs font-semibold text-[#1a1a1a]'>{category.categoryName}</h1> 
                        </div>
                        <div className ='items-end flex gap-1 px-3'>
                            <FiEdit3  
                            onClick={() => handleEdit(category)}
                            className ='w-6 h-6 text-[#0ea5e9] rounded-full hover:bg-[#0ea5e9]/30'/>  
                            
                            <MdDelete 
                            onClick={()=> {setSelectedCategory(category); setDeleteModalOpen(true); }}
                            className ='w-6 h-6 text-[#be3e3f] rounded-full hover:bg-[#be3e3f]/30   '/>
                        </div>
                                                  
                    </div>
                    </div>
                                 
                    ))} 
                   
            </div>
            
            {isEditCategoryModal && currentCategory && (
                <CategoryEdit
                    category= {currentCategory}
                    setIsEditCategoryModal= {setIsEditCategoryModal}
                    // fetchCustomers={fetchCustomers}
                />
            )}

            <BottomNav />

            <ConfirmModal
                open= {deleteModalOpen}
                categoryName= {selectedCategory?.categoryName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeCategory(selectedCategory._id);
                    setDeleteModalOpen(false);
                }}
            />

        </section>
    );
};


const ConfirmModal = ({ open, onClose, onConfirm, categoryName }) => {
  if (!open) return null;
  return (
       <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
    >
      
      <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
        {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
        <p className="mb-6">هل انت متأكد من مسح  <span className="font-semibold text-[#be3e3f] text-sm font-normal"> 
            {categoryName}</span> ؟</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm"
            onClick={onClose}
          >
            الغاء
          </button>
          <button
            className="px-4 py-2 rounded bg-[#be3e3f] text-white hover:bg-red-700 cursor-pointer text-sm"
            onClick={onConfirm}
          >
            مسح
          </button>
        </div>
      </div>

    </div>
  );
};


export default Categories ;
