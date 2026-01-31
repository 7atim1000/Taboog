import React, { useState } from 'react'
import { GiPerpendicularRings } from "react-icons/gi";
import { FaSearch, FaBell, FaCog, FaUserCircle, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";  // Changed this import
import { IoIosLogOut } from "react-icons/io";
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'


const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAttendanceModal, setIsAttendanceModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New task assigned', time: '2 min ago', read: false },
        { id: 2, message: 'Meeting at 3 PM', time: '1 hour ago', read: false },
        { id: 3, message: 'System updated', time: '2 hours ago', read: true },
    ]);

    const userData = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAttendanceModal = () => {
        setIsAttendanceModal(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
        }
    };

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logging out...');
        navigate('/login');
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <>
            <header dir="rtl" className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
                <div className="container mx-auto px-3 sm:px-4 md:px-2 lg:px-2">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        
                        {/* Left Section: Logo & Brand */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Mobile Menu Toggle */}
                            <button 
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {showMobileMenu ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
                            </button>
                            
                            {/* Logo */}
                            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <GiPerpendicularRings className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white group-hover:text-blue-100 transition-colors" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                        مصنع الطابوق الاسمنتي
                                    </h1>
                                    <p className="text-xs text-blue-200">Business Management System</p>
                                </div>
                            </div>
                        </div>

                        {/* Center Section: Search (Desktop) */}
                        {/* <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search employees, tasks, reports..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-50/10 backdrop-blur-sm border border-blue-400/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-4 w-4" />
                                <button type="submit" className="sr-only">Search</button>
                            </form>
                        </div> */}

                        {/* Right Section: User Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            
                            {/* Attendance Button */}
                            {/* <button
                                onClick={handleAttendanceModal}
                                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors duration-200 shadow-sm hover:shadow-md"
                                aria-label="Mark attendance"
                            >
                                <FaClockRotateLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="hidden md:inline text-sm font-medium">Attendance</span>
                            </button> */}

                            {/* Mobile Attendance Button */}
                            {/* <button
                                onClick={handleAttendanceModal}
                                className="sm:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                aria-label="Mark attendance"
                            >
                                <FaClockRotateLeft className="h-5 w-5" />
                            </button> */}

                            {/* Notifications */}
                            {/* <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(false)}
                                    className="p-2 rounded-lg hover:bg-blue-700 transition-colors relative"
                                    aria-label="Notifications"
                                >
                                    <FaBell className="h-5 w-5" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                                            {unreadNotifications}
                                        </span>
                                    )}
                                </button>
                            </div> */}

                            {/* Settings */}
                            <button
                                onClick={() => navigate('/settings')}
                                className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                aria-label="Settings"
                            >
                                <FaCog className="h-5 w-5" />
                            </button>

                            {/* User Profile */}
                            <div dir="rtl" className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    aria-label="User menu"
                                >
                                    <div className="relative">
                                        {userData?.image ? (
                                            <img 
                                                src={userData.image} 
                                                alt={userData.name}
                                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-blue-300 object-cover"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-400 flex items-center justify-center border-2 border-blue-300">
                                                <FaUserCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-semibold truncate max-w-[120px]">{userData?.name || 'User'}</p>
                                        <p className="text-xs text-blue-200 capitalize">{userData?.role || 'Employee'}</p>
                                    </div>
                                    <FaChevronDown className={`hidden md:block h-3 w-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl border border-blue-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-blue-50">
                                            <p className="text-sm font-semibold text-gray-800">{userData?.name}</p>
                                            <p className="text-xs text-gray-500">{userData?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                                        >
                                            <FaUserCircle className="h-4 w-4 text-blue-600" />
                                            <span>My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                                        >
                                            <FaCog className="h-4 w-4 text-blue-600" />
                                            <span>Settings</span>
                                        </button>
                                        <div className="border-t border-blue-50">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <IoIosLogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="lg:hidden py-3 border-t border-blue-500/30">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-50/10 backdrop-blur-sm border border-blue-400/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-4 w-4" />
                            <button type="submit" className="sr-only">Search</button>
                        </form>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="lg:hidden bg-blue-700 border-t border-blue-600 shadow-lg">
                        <div className="container mx-auto px-4 py-3 space-y-2">
                            <button
                                onClick={() => { navigate('/dashboard'); setShowMobileMenu(false); }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => { navigate('/employees'); setShowMobileMenu(false); }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                Employees
                            </button>
                            <button
                                onClick={() => { navigate('/reports'); setShowMobileMenu(false); }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                Reports
                            </button>
                            <button
                                onClick={() => { navigate('/tasks'); setShowMobileMenu(false); }}
                                className="w-full px-4 py-3 text-left text-white hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                Tasks
                            </button>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;

// import React from 'react'
// import { BsBricks } from "react-icons/bs";
// import { FaUserCircle } from 'react-icons/fa';
// import { FaBell } from 'react-icons/fa';
// import { useMutation } from '@tanstack/react-query';

// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// const Headers = () => {
  
//     const userData = useSelector(state => state.user);
//     const navigate = useNavigate();

//     return(
//         <header dir="rtl" className='flex justify-between items-center py-2 px-8 bg-linear-65 from-[#f5f5f5] to-white
//                 border-b border-yellow-700 shadow-lg/30'>

//             <div className='flex items-center justify-content gap-2'>
//                 <BsBricks className='h-10 w-10 text-yellow-700 rounded-full' />
//                 <h1 className='text-md font-semibold text-[#1a1a1a]'>Factory</h1>
//             </div>

            


//             <div className='flex items-center gap-4'>

//                 <div className='flex items-center gap-3'>
//                     {/* <FaCircleUser className ='text-yellow-700 h-10 w-10' size={30}/> */}
//                     <img className='h-10 w-10 rounded-full cursor-pointer border-b-3 border-amber-900' src={userData.image}
//                         onClick={() => navigate('/profile')}
//                     />

//                     <div className='flex flex-col item-start'>

//                         <h1 className='text-xs text-black font-semibold cursor-pointer'
//                             onClick={() => navigate('/profile')}
//                         >{userData.name || 'Username'}
//                         </h1>

//                         <p className='text-xs text-zinc-500 cursor-pointer'
//                             onClick={() => navigate('/profile')}
//                         >{userData.role || 'Role'}
//                         </p>
//                     </div>

//                 </div>


//             </div>


//         </header>

//     )
// };


// export default Headers ;