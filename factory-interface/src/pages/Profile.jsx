import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import { useSelector } from 'react-redux';
import { CiEdit } from "react-icons/ci";
import { getAvatarName, getBgColor } from '../utils';
import BottomNav from '../components/shared/BottomNav';
import ProfileEditModal from '../components/hr/ProfileEditModal';
import BackButton from '../components/shared/BackButton';

const Profile = () => {
    const navigate = useNavigate();
    const userData = useSelector(state => state.user);
    
    // update
    const Button = [
        { label: 'تعديل البيانات', icon: <CiEdit className='text-sky-600' size={20} />, action: 'profile' }
    ];

    const [isEditProfileModal, setIsEditProfileModal] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);

    const handleEdit = (user) => {
        setCurrentProfile(user);
        setIsEditProfileModal(true);
    };
 

  
 
    return (
        <section dir="rtl" className='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5]'>
            <div className='flex-[3] bg-white shadow-lg rounded-lg pt-0 '>
                
                <div className='flex items-center justify-between px-4 py-3 shadow-xl'>
                    
               
                    <div className='flex justify-start flex-wrap gap-3 items-center cursor-pointer'>
                        <img src={userData.image} className='h-22 w-22 rounded-full  border-b-3 border-yellow-700' />
                       
                        <div className='flex flex-col gap-1 mt-5 '>

                            <h1 className='text-black text-sm font-bold tracking-wide'>
                                {userData.name}
                            </h1>
                            <p className='text-black text-xs font-normal tracking-wide text-sky-600'>
                                {userData.department}
                            </p>
                            <p className='text-black text-xs font-normal tracking-wide text-sky-600'>
                                {userData.userJob}
                            </p>

                        </div>
                        </div>


                        <div className ='flex justify-end'>
                            <div className='flex items-center justify-end gap-3'>
                                {Button.map(({ label, icon, action }) => {
                                    return (
                                        <button
                                            onClick={() => handleEdit(userData)}
                                            className='shadow-lg/30 cursor-pointer bg-white  text-[#1a1a1a] 
                                px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2'>
                                            {label} {icon}
                                        </button>
                                    )
                                })}
                            </div>
                            <BackButton/>

                        </div>
                </div>

                {/* end header */}
                <div className ='py-2 px-10 flex flex-col gap-2 mt-5 shadow-xl'>
                    <h1 className ='text-sky-600'>البيانات الاساسيه :</h1>
                    <div className='flex items-center gap-2 text-xs px-5'>
                        <p>البريد اللاكتروني  :</p>
                        <p>{userData.email}</p>
                    </div>
                    <div className='flex items-center gap-2 text-xs px-5'>
                        <p>الاسم  :</p>
                        <p>{userData.name}</p>
                    </div>
                    <div className='flex items-center gap-2 text-xs px-5'>
                        <p>رقم الهاتف :</p>
                        <p>{userData.phone}</p>
                    </div>
                        <div className='flex items-center gap-2 text-xs px-5'>
                        <p>الصلاحيات :</p>
                        <p>{userData.role}</p>
                    </div>

                </div>

                </div>

            <div className ='flex-[2] '>
               
                {/* Edit Employee Modal */}
                {isEditProfileModal && currentProfile && (
                    <ProfileEditModal
                        user ={currentProfile}
                        setIsEditProfileModal={setIsEditProfileModal}
                        userData={userData}
                    />
                )}


            </div>
            <BottomNav />
        </section>
    );
};



export default Profile;