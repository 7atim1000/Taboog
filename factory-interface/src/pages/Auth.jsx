import React, { useState } from 'react'
import { GiPerpendicularRings } from "react-icons/gi";
import { FaUserPlus, FaSignInAlt, FaArrowRight, FaShieldAlt, FaChartLine } from "react-icons/fa";
import { MdSecurity, MdAccessibility } from "react-icons/md";
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            
            {/* Left Section - Hero Image with Features */}
            <div className="hidden xl:flex xl:w-1/2 relative p-4 md:p-8 lg:p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                <div className="w-full h-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 border-4 border-white/20 relative">
                    <img
                        src={"https://nq5udmrdco.ufs.sh/f/Kfo4jX11ImreyuucWcPtFyGrfM8CsxjlL0U2Xn15RPAwYZo6"}
                        alt="ERP System Illustration"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-800/30 to-transparent"></div>
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-4 sm:left-6 md:left-10 right-4 sm:right-6 md:right-10 text-white">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg leading-tight">
                            Enterprise Resource Planning
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-blue-100 drop-shadow mb-6 sm:mb-8">
                            Transform your business with our comprehensive ERP solution
                        </p>
                        
                        {/* Features List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                                <FaShieldAlt className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">Bank-Level Security</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                                <FaChartLine className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">Real-time Analytics</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                                <MdSecurity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">Role-Based Access</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                                <MdAccessibility className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">Mobile Optimized</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Auth Form */}
            <div className="w-full xl:w-1/2 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 mt-20 md:mt-10 lg:mt-10">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
                    
                    {/* Logo Section */}
                    <div className="flex flex-col items-center gap-3 mb-2 sm:mb-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-30"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2 sm:p-3 shadow-lg">
                                <GiPerpendicularRings className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-white" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                Enterprise ERP
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                Secure & Efficient Business Management
                            </p>
                        </div>
                    </div>

                    {/* Form Header */}
                    <div className="text-center mb-1 sm:mb-1">
                        <div className="inline-flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="bg-blue-50 p-2 rounded-full">
                                {isRegister ? (
                                    <FaUserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                ) : (
                                    <FaSignInAlt className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                )}
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                                {isRegister ? "Create Account" : "Welcome Back"}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 px-2">
                            {isRegister 
                                ? "Join our platform to streamline your workflow" 
                                : "Sign in to access your dashboard and tools"
                            }
                        </p>
                    </div>

                    {/* Auth Component */}
                    <div className="mb-6 sm:mb-8">
                        {isRegister ? (
                            <Register setIsRegister={setIsRegister} />
                        ) : (
                            <Login />
                        )}
                    </div>

                    {/* Toggle Section */}
                    <div className="border-t border-gray-100 pt-4 sm:pt-1">
                        <div className="text-center">
                            <p className="text-sm text-gray-700 mb-1 sm:mb-1">
                                {isRegister 
                                    ? "Already have an account?" 
                                    : "New to our platform?"
                                }
                            </p>
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="group inline-flex items-center justify-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base transition-all duration-200 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 w-full sm:w-auto"
                                aria-label={isRegister ? "Switch to login" : "Switch to register"}
                            >
                                <span>{isRegister ? "Sign in instead" : "Create account"}</span>
                                <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transform transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Footer Info */}
                    {/* <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline hover:no-underline transition-colors">
                                Terms
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline hover:no-underline transition-colors">
                                Privacy
                            </a>
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <MdSecurity className="h-3 w-3" />
                                SSL Secured
                            </span>
                            <span className="h-3 w-px bg-gray-300"></span>
                            <span>© {new Date().getFullYear()} ERP System</span>
                        </div>
                    </div> */}
                </div>

                {/* Mobile Responsive Image with Features */}
                <div className="xl:hidden w-full max-w-xs sm:max-w-sm md:max-w-md mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6">
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={"https://nq5udmrdco.ufs.sh/f/Kfo4jX11ImreyuucWcPtFyGrfM8CsxjlL0U2Xn15RPAwYZo6"}
                            alt="ERP System"
                            className="w-full h-32 sm:h-40 md:h-48 object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="text-sm sm:text-base font-semibold mb-1">Enterprise ERP Platform</h3>
                            <p className="text-xs sm:text-sm opacity-90">All-in-one business solution</p>
                        </div>
                    </div>
                    
                    {/* Mobile Features */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 text-center">
                            <FaShieldAlt className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1 sm:mb-2" />
                            <p className="text-xs font-medium text-gray-700">Secure</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 text-center">
                            <FaChartLine className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1 sm:mb-2" />
                            <p className="text-xs font-medium text-gray-700">Analytics</p>
                        </div>
                    </div>
                </div>

                {/* Responsive Contact Info */}
                {/* <div className="hidden sm:block mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Need help?{" "}
                        <a href="mailto:support@erpsystem.com" className="text-blue-600 hover:text-blue-700 font-medium">
                            Contact Support
                        </a>
                    </p>
                </div> */}
            </div>
        </div>
    )
}

export default Auth;


// import React , {useState} from 'react' ;
// import brick from '../assets/images/brick.jpg' 
// import { BsBricks } from "react-icons/bs";
// import Register from '../components/auth/Register';
// import Login from '../components/auth/Login';

// const Auth = () => {
//     const [isRegister, setIsRegister] = useState(false);
//     // declares a state variable and function to update it
//     return (
//         <div dir='rtl' className='flex min-h-screen w-full overflow-y-scroll scrollbar-hidden'>
          
//             {/*right section */}
//             <div className='w-1/2 min-h-screen bg-white p-1'>
//                 <div className='flex flex-col items-center gap-2'>
//                     <BsBricks className='h-14 w-14 rounded-full p-1 text-yellow-700' />
//                     <h1 className='teext-lg font-semibold text-black'>ERP</h1>
//                 </div>

//                 <h2 className='text-xl text-center mt-5 font-semibold text-yellow-700 mb-7'>{isRegister ? "Employee Registeration" : "دخول"}</h2>

//                 {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}

//                 <div className='flex justify-center mt-6'>
//                     <p className='text-sm text-white'>{isRegister ? "Already have an account ?" : "Don't have a account ? "}</p>
//                     <p className='text-[#f5f5f5]'>-</p>
                    
//                     <a
//                         onClick={() => setIsRegister(!isRegister)}
//                         href='#'
//                         className='text-white text-sm font-semibold hover:underline hover:text-orange-700'
//                     >{isRegister ? "Sign in" : "Sign up"}
//                     </a>
//                 </div>
//             </div>


//              {/*left section */}
//             <div className='w-1/2 relative flex items-center justify-center bg-cover' >
//                 {/**bg Image */}
//                 <img className='w-full h-full object-cover' src={brick} alt='factory Image' />
//                 {/*Black overlay */}
//                 <div className='absolute inset-0  bg-opacity-80'></div>

//                 {/*Quote at bottom */}
//                 <blockquote className='absolute bottom-10 px-8 mb-10 text-blue-900 text-lg italic '>
//                     <br />
//                     <span className='block mt-4 text-[#1f1f1f] text-md'></span>
//                 </blockquote>
//             </div>



//         </div>
//     )
// };


// export default Auth ;