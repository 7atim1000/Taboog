import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { register } from '../../https';
import { enqueueSnackbar } from 'notistack';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaBuilding, FaUserTie, FaUserCog } from 'react-icons/fa';

const Register = ({setIsRegister}) => {

    const[formData , setFormData] = useState({
        name : "", 
        email : "", 
        phone : "", 
        password : "", 
        role : ""   
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleRoleSelection = (selectedRole) => {
        setFormData({...formData, role: selectedRole});
    }

    const handleSubmit =(e) => {
        e.preventDefault();
        registerMutation.mutate(formData);
    }

    // Role options with icons
    const roleOptions = [
        { value: 'admin', label: 'Admin', icon: <FaUserCog className="h-4 w-4" /> },
        { value: 'manager', label: 'Manager', icon: <FaUserTie className="h-4 w-4" /> },
        { value: 'employee', label: 'Employee', icon: <FaUser className="h-4 w-4" /> }
    ];

    // backend connection
    const registerMutation = useMutation({
        mutationFn : (reqData) => register(reqData),
        onSuccess: (res) => {
            const { data } = res;
            enqueueSnackbar(data.message, { variant: "success"});
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                role: "",
            });

            setTimeout(() => {
                setIsRegister(false);
            }, 1500)
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response?.data?.message || "Registration failed", { variant: "error"});
        }
    });

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-2 border border-blue-100">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                
                {/* Name Field */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FaUser className="h-4 w-4 text-blue-600" />
                        <label className="text-sm sm:text-base font-medium text-gray-700">Full Name</label>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <input 
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="relative w-full px-4 py-3 sm:py-3.5 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                            required
                            autoComplete="off"
                        />
                    </div>
                </div>

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
                            placeholder="Enter your email address"
                            className="relative w-full px-4 py-3 sm:py-3.5 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                            required
                            autoComplete="off"
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FaPhone className="h-4 w-4 text-blue-600" />
                        <label className="text-sm sm:text-base font-medium text-gray-700">Phone Number</label>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <input 
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="relative w-full px-4 py-3 sm:py-3.5 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            required
                            autoComplete="off"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FaLock className="h-4 w-4 text-blue-600" />
                        <label className="text-sm sm:text-base font-medium text-gray-700">Password</label>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a secure password"
                            className="relative w-full px-4 py-3 sm:py-3.5 pr-12 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                            required
                            autoComplete="off"
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
                    <p className="text-xs text-gray-500 mt-1">
                        Use 8+ characters with a mix of letters, numbers & symbols
                    </p>
                </div>

                {/* Role Selection */}
                {/* <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FaBuilding className="h-4 w-4 text-blue-600" />
                        <label className="text-sm sm:text-base font-medium text-gray-700">Select Role</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        {roleOptions.map((role) => (
                            <button
                                type="button"
                                key={role.value}
                                onClick={() => handleRoleSelection(role.value)}
                                className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                                    formData.role === role.value
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                        : 'border-blue-100 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                            >
                                <div className={`p-2 rounded-full ${
                                    formData.role === role.value
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-blue-50 text-blue-400'
                                }`}>
                                    {role.icon}
                                </div>
                                <span className="text-sm font-medium">{role.label}</span>
                            </button>
                        ))}
                    </div>
                    {formData.role && (
                        <p className="text-sm text-blue-600 mt-2">
                            Selected: <span className="font-semibold capitalize">{formData.role}</span>
                        </p>
                    )}
                </div> */}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={registerMutation.isPending}
                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 sm:py-4 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {registerMutation.isPending ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                        </div>
                    ) : (
                        <>
                            <span className="relative z-10">Create Account</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                    )}
                </button>

                {/* Already have account */}
                {/* <div className="text-center pt-4 border-t border-blue-100">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setIsRegister(false)}
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                        >
                            Sign in here
                        </button>
                    </p>
                </div> */}
            </form>

            {/* Loading State Overlay */}
            {registerMutation.isPending && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-700 font-medium">Creating your account...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;

// import { useMutation } from '@tanstack/react-query';
// import React, { useState } from 'react'
// import { register } from '../../https';
// import { enqueueSnackbar } from 'notistack'   // for message 


// const Register = ({setIsRegister}) => {

//     const[formData , setFormData] = useState({
//     name : "", email : "", phone : "", password : "", role : ""   
//     });

//     const handleChange = (e) => {
//         setFormData({...formData, [e.target.name]: e.target.value})
//     }

//     const handleRoleSelection = (selectedRole) => {
//         setFormData({...formData, role: selectedRole});
//     }

//     const handleSubmit =(e) => {
//         e.preventDefault();

//         registerMutation.mutate(formData);
       
//     }


//     // backend connection
//      const registerMutation = useMutation({
//         mutationFn : (reqData) => register(reqData),
        
//         onSuccess: (res) => {
//             const { data } = res;
//             //console.log(data)
//             enqueueSnackbar(data.message, { variant: "success"});
//             setFormData({
//                 name: "",
//                 email: "",
//                 phone: "",
//                 password: "",
//                 role: "",
//             });

//             setTimeout(() => {
//                 setIsRegister(false);
//             }, 1500)
     

//         },
//         onError: (error) => {
//             //console.log(error);
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error"});
//         }
//     });


//     return (
   
//         <div className ='bg-white rounded-lg shadow-lg p-2 mt-0 '>
//             <form onSubmit ={handleSubmit}>
                
//                 <div>
//                     <label className ='text-[#1f1f1f] block mb-2 text-sm font-medium'>Name :</label>
                
//                     <div className ='flex items-center rounded-lg p-5 px-4 bg-[#f5f5f5] shadow-lg'>
//                         <input 
//                             type ='text'
//                             name ='name'
//                             value ={formData.name}
//                             onChange ={handleChange}
//                             placeholder = 'Enter employee name'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-medium'>Email :</label>
                
//                     <div className ='flex items-center rounded-lg p-5 px-4 bg-[#f5f5f5] shadow-lg'>
//                         <input 
//                             type ='email'
//                             name ='email'
//                             value ={formData.email}
//                             onChange ={handleChange}
//                             placeholder = 'Enter employee email'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>

                
//                 <div>
//                     <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-medium'>Phone :</label>
                
//                     <div className ='flex items-center rounded-lg p-5 px-4 bg-[#f5f5f5] shadow-lg'>
//                         <input 
//                             type ='number'
//                             name ='phone'
//                             value ={formData.phone}
//                             onChange ={handleChange}
//                             placeholder = 'Enter employee phone'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>

                
//                 <div>
//                     <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-medium'>Password :</label>
                
//                     <div className ='flex items-center rounded-lg p-5 px-4 bg-[#f5f5f5] shadow-lg'>
//                         <input 
//                             type ='password'
//                             name ='password'
//                             value ={formData.password}
//                             onChange ={handleChange}
//                             placeholder = 'Enter password'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>

              
//                 {/*important  */}
//                 <div>
//                     <label className ='block text-[#1a1a1a] mb-2 mt-3 text-sm font-medium'>Choose your role</label>
                  
//                     <div className ='flex items-center gap-3 mt-4'>
//                          {['Admin', 'Cashier', 'Services'].map((role) => {
//                             return (
//                                 <button key={role}
//                                 type ='button'
//                                 onClick ={() => handleRoleSelection(role)}
//                                 className ={`px-3 py-3 px-4 w-full cursor-pointer  rounded-lg shadow-lg/30 text-xs font-semibold  
//                                 ${formData.role === role ? "bg-yellow-700 text-white" : "bg-white text-blue-600"}  
//                                 `}
//                                 >
//                                     {role}
//                                 </button>
//                             )
//                          })}
//                     </div>
                    
//                 </div>

//                 <button type ='submit' className ='mt-15 cursor-pointer w-full rounded-lg mt-6 py-3 text-lg text-white bg-yellow-700 shadow-lg font-semibold'>Sign up</button>

//             </form>

//         </div>
//     );
// };


// export default Register; 