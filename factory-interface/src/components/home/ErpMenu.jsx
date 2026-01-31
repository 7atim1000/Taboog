import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SiDatabricks } from "react-icons/si";
import { 
  FaFileInvoiceDollar,
  FaCalculator,
  FaSignOutAlt,
  FaStoreAlt,
  FaCogs,
  FaChartLine,
  FaBuilding
} from "react-icons/fa";
import FinanModal from './FinanModal';
import InvoiceModal from './InvoiceModal';
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { logout } from '../../https';
import { removeUser } from '../../redux/slices/userSlice';
import ProductionModal from './ProductionModal';

const ErpMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Menu items configuration
    const menuItems = [
        {
            id: 'invoice',
            label: 'اداره الفواتير',
            icon: <FaFileInvoiceDollar className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-blue-500 to-blue-600',
            action: 'invoice'
        },
        {
            id: 'production',
            label: 'اداره الانتاج',
            icon: <SiDatabricks className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-blue-500 to-indigo-600',
            action: 'production'
        },
        {
            id: 'financial',
            label: 'الاداره الماليه',
            icon: <FaCalculator className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-blue-500 to-blue-700',
            action: 'finan'
        },
        {
            id: 'logout',
            label: 'خروج',
            icon: <FaSignOutAlt className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-red-500 to-red-600',
            action: 'logout'
        }
    ];

    // Modal states
    const [isFinanModalOpen, setIsFinanModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isProductionModal, setIsProductionModal] = useState(false);

    // Logout mutation
    const logOutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: (data) => {
            dispatch(removeUser());
            localStorage.removeItem('token');
            document.cookie = 'accessToken=; Max-Age=0; path=/;';
            navigate('/auth');
        },
        onError: (error) => {
            console.error('Logout error:', error);
        }
    });

    const handleLogOut = () => {
        if (!logOutMutation.isLoading) {
            document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            logOutMutation.mutate();
        }
    };

    // Modal handler
    const handleModal = (action) => {
        switch (action) {
            case 'finan':
                setIsFinanModalOpen(true);
                break;
            case 'invoice':
                setIsInvoiceModalOpen(true);
                break;
            case 'production':
                setIsProductionModal(true);
                break;
            case 'logout':
                handleLogOut();
                break;
            default:
                break;
        }
    };

    return (
        <div className="w-full bg-gradient-to-b from-blue-50 to-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-blue-100">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-md bg-gradient-to-r from-blue-500 to-blue-600">
                        <FaBuilding className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-gray-800">
                        لوحة التحكم الرئيسية
                    </h2>
                </div>
                <p className="text-xs text-gray-600">الوصول السريع للنظام</p>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleModal(item.action)}
                        disabled={item.id === 'logout' && logOutMutation.isLoading}
                        className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-blue-100"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
                        
                        {/* Content */}
                        <div className="relative p-3 sm:p-4 flex flex-col items-center justify-center">
                            {/* Icon Container */}
                            <div className={`mb-2 p-2 rounded-md bg-gradient-to-br ${item.color} text-white shadow-sm group-hover:shadow transition-shadow duration-200`}>
                                {item.icon}
                            </div>
                            
                            {/* Label */}
                            <h3 className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-gray-900 text-center leading-tight">
                                {item.label}
                            </h3>
                            
                            {/* Loading Indicator for Logout */}
                            {item.id === 'logout' && logOutMutation.isLoading && (
                                <div className="mt-1">
                                    <div className="h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Hover Border */}
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
                    </button>
                ))}
            </div>

            {/* Quick Stats */}
            {/* <div className="mt-4 pt-3 border-t border-blue-100">
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">نشط</p>
                    </div>
                    <div className="text-center">
                        <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">متوسط</p>
                    </div>
                    <div className="text-center">
                        <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">ممتاز</p>
                    </div>
                </div>
            </div> */}

            {/* Modals */}
            {isFinanModalOpen && <FinanModal setIsFinanModalOpen={setIsFinanModalOpen} />}
            {isInvoiceModalOpen && <InvoiceModal setIsInvoiceModalOpen={setIsInvoiceModalOpen} />}
            {isProductionModal && <ProductionModal setIsProductionModal={setIsProductionModal} />}
        </div>
    );
};

export default ErpMenu;

// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import { SiDatabricks } from "react-icons/si";

// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { CiCalculator2 } from "react-icons/ci";
// import { FaStoreAlt } from "react-icons/fa";
// import { AiOutlineLogout } from "react-icons/ai";


// import FinanModal from './FinanModal';
// import InvoiceModal from './InvoiceModal';

// import { useDispatch } from 'react-redux'
// import { useMutation } from '@tanstack/react-query'
// import { logout } from '../../https';
// import { removeUser } from '../../redux/slices/userSlice';
// import ProductionModal from './ProductionModal';

// const ErpMenu = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const logOutMutation = useMutation({
//         mutationFn: () => logout(),
//         onSuccess: (data) => {

//             console.log(data);
//             dispatch(removeUser());
           
//             //////////////////////////////////////////////////////
//             // to remove token from localStorage
//             localStorage.removeItem('token');
//             // remove token from cookie 
//             document.cookie = 'accessToken=; Max-Age=0; path=/;';
//             ///////////////////////////////////////////////////////

//             navigate('/auth');
//         },

//         onError: (error) => {
//             console.log(error);
//         }
//     });

    
    
//     const handleLogOut = () => {
//     if (!logOutMutation.isLoading) {
        
//         // Clear client-side cookie just in case
//         document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//         logOutMutation.mutate();
//     }
// };

//     const accountBtn = [{ label: "الاداره الماليه", action: 'finan'}];
//     const invoiceBtn = [{ label: "اداره الفواتير", action: 'invoice'}];
//     const productionBtn = [{ label :'اداره الانتاج', action :'production'}]

//     const [isFinanModalOpen, setIsFinanModalOpen] = useState(false);
//     const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
//     const [isProductionModal, setIsProductionModal] = useState(false);

//     const handleOpenModal = (action) => {
//         if (action === 'finan') setIsFinanModalOpen(true)
//     };

//     const handleInvoiceModal = (action) => {
//         if (action === 'invoice') setIsInvoiceModalOpen(true)
//     };
    
//     const handleProductionModal = (action) => {
//         if (action === 'production') setIsProductionModal(true)
//     };

//     // border-[#e3d1b9]
//     return (
//         <div className ='flex flex-wrap justify-beween gap-4 py-2 w-full'>

//             <div className='w-35 h-14  bg-white flex justify-around items-center  p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#0ea5e9]'>
//                 {invoiceBtn.map(({ label, action }) => {
//                     return (
//                         <button 
//                         onClick={() => handleInvoiceModal(action)} 
//                         className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'>
//                             {label} <LiaFileInvoiceDollarSolid className='text-[#0ea5e9] inline' size={25} />

//                         </button>

//                     )
//                 })}
//             </div>

//             <div className='w-35 h-14  flex bg-white justify-around items-center p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#0ea5e9]'>
//                 {productionBtn.map(({ label, action }) => {
//                     return(
//                         <button 
//                         onClick={() => handleProductionModal(action)} 
//                         className='bg-white  w-30 p-2  text-sm text-black font-semibold cursor-pointer'>
//                             {label} <SiDatabricks className='text-[#0ea5e9] inline' size={25} />

//                         </button>
//                     )
//                 })}
//             </div>
            
//             <div className='w-35 h-14 bg-white flex justify-around items-center  p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#0ea5e9]'>
//                 {accountBtn.map(({ label, action }) => {
//                     return (
//                         <button onClick={() => handleOpenModal(action)} className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'>
//                             {label} <CiCalculator2 className='text-[#0ea5e9] inline' size={25} />
//                         </button>
//                     )
//                 })}
//             </div>

//             <div className='w-35 h-14 bg-white flex justify-around items-center  p-2 shadow-xl w-45 rounded-sm border-b-2 border-[#be3e3f]'>
//                 {accountBtn.map(({ label, action }) => {
//                     return (
//                         <button 
//                            className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'
//                            onClick ={ handleLogOut }
//                         >
                            
//                             خروج <AiOutlineLogout className='text-[#be3e3f] inline' size={25} />
//                         </button>
//                     )
//                 })}
//             </div>
           
        

//             {isFinanModalOpen && <FinanModal setIsFinanModalOpen={setIsFinanModalOpen}/>}
//             {isInvoiceModalOpen && <InvoiceModal setIsInvoiceModalOpen={setIsInvoiceModalOpen}/>}

//             {isProductionModal && <ProductionModal setIsProductionModal={setIsProductionModal}/>}
            
//         </div>
        
//     );
// };

// export default ErpMenu ;