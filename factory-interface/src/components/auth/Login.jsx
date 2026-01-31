import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../https/index';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSignInAlt, FaArrowRight, FaKey, FaUserCircle } from 'react-icons/fa';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "", 
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    }

    // backend connection
    const loginMutation = useMutation({
        mutationFn: (reqData) => login(reqData),
        onSuccess: (res) => {
            const { data } = res;
            
            // If remember me is checked, store in localStorage
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            dispatch(setUser(data.data));
            
            enqueueSnackbar("Login successful! Redirecting...", { variant: "success" });
            
            setTimeout(() => {
                navigate('/');
            }, 1000);
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response?.data?.message || "Login failed. Please check your credentials.", { 
                variant: "error",
                autoHideDuration: 3000 
            });
        }
    });

    // Load remembered email on component mount
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-blue-100">
            
            {/* Header */}
            {/* <div className="text-center mb-0 sm:mb-0">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4 shadow-lg">
                    <FaUserCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Welcome Back
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                    Sign in to access your dashboard
                </p>
            </div> */}

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FaEnvelope className="h-4 w-4 text-blue-600" />
                        <label className="text-sm sm:text-base font-medium text-gray-700">Email Address</label>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your company email"
                            className="relative w-full px-4 py-3 sm:py-3.5 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                            required
                            autoComplete="email"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaLock className="h-4 w-4 text-blue-600" />
                            <label className="text-sm sm:text-base font-medium text-gray-700">Password</label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                        >
                            {showPassword ? (
                                <>
                                    <FaEyeSlash className="h-3 w-3" />
                                    <span>Hide</span>
                                </>
                            ) : (
                                <>
                                    <FaEye className="h-3 w-3" />
                                    <span>Show</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="relative w-full px-4 py-3 sm:py-3.5 pr-12 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200 p-1"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Remember Me & Forgot Password */}
                {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                            <input 
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 sm:h-5 sm:w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-200 cursor-pointer"
                            />
                        </div>
                        <span className="text-sm text-gray-700">Remember me</span>
                    </label>
                    
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                        onClick={() => enqueueSnackbar("Password reset feature coming soon!", { variant: "info" })}
                    >
                        <FaKey className="h-3 w-3" />
                        <span>Forgot Password?</span>
                    </button>
                </div> */}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loginMutation.isPending}
                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 sm:py-4 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loginMutation.isPending ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing In...</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-center gap-2">
                                <FaSignInAlt className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Sign In to Dashboard</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                    )}
                </button>

                {/* Divider */}
                {/* <div className="relative my-4 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-blue-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div> */}

                {/* Alternative Login Options */}
                {/* <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => enqueueSnackbar("SSO integration coming soon!", { variant: "info" })}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                    >
                        <FaUserCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">SSO Login</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => enqueueSnackbar("Mobile authentication coming soon!", { variant: "info" })}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                    >
                        <FaKey className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Mobile Auth</span>
                    </button>
                </div> */}

                {/* Security Notice */}
                {/* <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                            <FaLock className="h-3 w-3" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-700 font-medium">Secure Login</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Your credentials are encrypted and transmitted securely.
                            </p>
                        </div>
                    </div>
                </div> */}
            </form>

            {/* Demo Credentials (for testing) */}
            {/* <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-blue-100">
                <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                        <span>Demo Credentials</span>
                        <FaArrowRight className="h-3 w-3 transform transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="mt-3 space-y-2 text-xs text-gray-600">
                        <p>• Admin: admin@erp.com / admin123</p>
                        <p>• Manager: manager@erp.com / manager123</p>
                        <p>• Employee: employee@erp.com / employee123</p>
                    </div>
                </details>
            </div> */}

            {/* Loading Overlay */}
            {loginMutation.isPending && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-700 font-medium">Authenticating...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;


// import { useMutation } from '@tanstack/react-query';
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { login } from '../../https/index';
// import { enqueueSnackbar } from 'notistack'   // for message 
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../redux/slices/userSlice';


// const Login = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const[formData, setFormData] = useState({
//         email : "", password :"",
//     }) 

//     const handleChange = (e) => {
//         setFormData({...formData, [e.target.name]: e.target.value});
//     }

   
//     const handleLogin = (e) => {
//         e.preventDefault();
//         loginMutation.mutate(formData);
//     }

//     // backend connection
//      const loginMutation = useMutation({
//         mutationFn : (reqData) => login(reqData),
        
//         onSuccess: (res) => {
//             const { data } = res;
//             console.log(data);
            
//             dispatch(setUser(data.data));

//             navigate('/')

//         },
//         onError: (error) => {
//             //console.log(error);
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error"})
//         }
//     })


//     return (

//         <div className ='bg-white shadow-lg rounded-lg p-1'>

//             <form onSubmit={handleLogin}>
//             {/* <form onSubmit={(e) => { e.preventDefault(); handleLogin(formData); }}> */}
             
                 
//                 <div>
//                     <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-medium'>البريد اللاكتروني :</label>
                
//                     <div className ='flex items-center rounded-sm p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='email'
//                             name ='email'
//                             value ={formData.email}
//                             onChange ={handleChange}
//                             placeholder = 'Enter employee email'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>


//                 <div>
//                     <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-medium'>كلمه المرور :</label>
                
//                     <div className ='flex items-center rounded-sm p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='password'
//                             name ='password'
//                             value ={formData.password}
//                             onChange ={handleChange}
//                             placeholder = 'Enter password'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>

//                 <button type ='submit' 
//                 className ='cursor-pointer w-full rounded-sm mt-6 py-3 text-lg text-yellow-700 bg-[#f5f5f5] shadow-lg/30 font-semibold'>
//                     دخول</button>

//             </form>

//         </div>
//     );
// };


// export default Login;


