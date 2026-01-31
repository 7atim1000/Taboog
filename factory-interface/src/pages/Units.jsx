import React, { useState, useEffect  } from 'react'
import BackButton from '../components/shared/BackButton';
import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import UnitAdd from '../components/units/UnitAdd';

import { toast } from 'react-toastify'

import { getBgColor } from '../utils';
import BottomNav from '../components/shared/BottomNav';
import { api } from '../https';
import UnitUpdate from '../components/units/UnitUpdate';


const Units = () => {
    const Button = [
        { label: 'اضافه وحده', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action: 'unit' }
    ];

    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
    const handleOpenModal = (action) => {
        if (action === 'unit') setIsUnitModalOpen(true)
    };


    const [loading, setLoading] = useState(false);
    const [isEditUnitModal, setIsEditUnitModal] = useState(false);
    const [currentUnit, setCurrentUnit] = useState(null);

    //fetch units
    const [list, setList] = useState([])
    const fetchUnits = async () => {
        setLoading(true);

        try {
            const response = await api.get('/api/unit/')

            if (response.data.success) {
                setList(response.data.units)

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false);
        }

    }


    useEffect(() => {
        fetchUnits()
    }, [])


    // Handle edit
    const handleEdit = (unit) => {
        setCurrentUnit(unit);
        setIsEditUnitModal(true);
    };


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const removeUnit = async (id) => {

        try {
            const response = await api.post('/api/unit/remove', { id },)

            if (response.data.success) {
                toast.success('تم مسح الوحده بنجاح')

                //Update the LIST after Remove
                await fetchUnits();

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };





    return (
        
        <section dir='rtl' className='h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden'>

            <div className='flex items-center justify-between px-8 py-2 shadow-xl mb-2'>
                <div className='flex items-center gap-2'>
                    <BackButton />
                    <h1 className='text-md font-semibold text-[#1a1a1a]'>اداره الوحدات</h1>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="mt-4 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
                        <span className="ml-2">تحميل ...</span>
                    </div>
                )}

                <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {Button.map(({ label, icon, action }) => {
                        return (
                            <button
                                onClick={() => handleOpenModal(action)}
                                className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'>
                                {label} {icon}
                            </button>
                        )
                    })}
                </div>

                {isUnitModalOpen && <UnitAdd setIsUnitModalOpen={setIsUnitModalOpen} />}


            </div>


            <div className='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] bg-white'>

                {list.length === 0
                    ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>قائمه الوحدات فارغه حاليا .</p>)
                    : list.map((unit, index) => (

                        <div key={unit.unitName}
                            className='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[70px] cursor-pointer
                    shadow-lg/10 hover:bg-[#F1E8D9]'
                        // style = {{backgroundColor : getBgColor()}}
                        >

                            <div className='flex justify-between w-full shadow-lg/30 '>
                                <div className='items-start px-3'>
                                    <h1 className='text-xs font-semibold text-[#1a1a1a]'>{unit.unitName}</h1>
                                </div>
                                <div className='items-end flex gap-1 px-3'>
                                    <FiEdit3
                                        onClick={() => handleEdit(unit)}
                                        className='w-6 h-6 text-[#0ea5e9] rounded-full hover:bg-[#0ea5e9]/30' />
                                    <MdDelete
                                        onClick={() => { setSelectedUnit(unit); setDeleteModalOpen(true); }}
                                        className='w-6 h-6 text-[#be3e3f] rounded-full hover:bg-[#be3e3f]/30' />
                                </div>

                            </div>
                        </div>

                    ))}

            </div>

            {isEditUnitModal && currentUnit && (
                <UnitUpdate
                    unit={currentUnit}
                    setIsEditUnitModal={setIsEditUnitModal}
                    fetchUnits={fetchUnits}
                />
            )}

            <BottomNav />


            <ConfirmModal
                open={deleteModalOpen}
                unitName={selectedUnit?.unitName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeUnit(selectedUnit._id);
                    setDeleteModalOpen(false);
                }}
            />

        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, unitName }) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
        >

            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
                {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
                <p className="mb-6 text-sm">هل انت متأكد من مسح <span className="font-semibold text-red-600">{unitName}</span>؟</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm font-normal"
                        onClick={onClose}
                    >
                        الغاء
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer text-sm font-normal"
                        onClick={onConfirm}
                    >
                        مسح
                    </button>
                </div>
            </div>

        </div>
    );
};
export default Units ;