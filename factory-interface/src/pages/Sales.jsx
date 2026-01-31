import React, { useState, useEffect } from 'react'
import BackButton from '../components/shared/BackButton'
import { useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import { IoMdArrowDropleft } from "react-icons/io";
import { ImUserPlus } from "react-icons/im";
// import SelectCustomer from '../components/sales/SelectCustomer';

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { getBgColor } from '../utils'
import { GrRadialSelected } from 'react-icons/gr';
import { getProducts } from '../https';
// import CustomerInfo from '../components/sales/CustomerInfo';

// import Bills from '../components/sales/Bills';
import { BsFillCartCheckFill } from "react-icons/bs";
import { IoMdArrowDropupCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";

import {useDispatch} from 'react-redux';
import { addItems} from '../redux/slices/saleSlice';

import { toast } from 'react-toastify';
import CartInfo from '../components/sales/CartInfo';
import SelectCustomer from '../components/sales/SelectCustomer';
import CustomerInfo from '../components/sales/CustomerInfo';
import Bills from '../components/sales/Bills';
// import CustomerAdd from '../components/customers/CustomerAdd';


// import CustomerAdd from '../components/sales/CustomerAdd'; // Assuming this is the correct import

const Sales = () => {
    const saleBtn = [{ label: "اختيار العميل", action: 'sale'}];

    const [isSelectCustomerModalOpen, setIsSelectCustomerModalOpen] = useState(false);
    const handleSaleModalOpen = (action) => {
        if (action === 'sale') setIsSelectCustomerModalOpen(true)
    }

    // Add new customer
    const addcstButton = [
        { label: '', icon: <ImUserPlus className='text-white' size={18} />, action: 'customer' }
    ];

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const handleOpenModal = (action) => {
        if (action === 'customer') setIsCustomerModalOpen(true);
    };


    
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});

    const [loading, setLoading] = useState(false);

    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await getProducts({
                // category: filters.category || 'all',
                search: filters.search || '',
                sort: filters.sort || '-createdAt',
                page: filters.page || 1,
                limit: filters.limit || 10
            });
            setProducts(response.data.data);
            // setPagination(response.data.pagination);
        
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch services when category changes
    useEffect(() => {
        fetchProducts({
            
        });
    }, []);

    // to fetch customer name from customer Modal  bg-[#D2B48C]
    const customerData = useSelector(state => state.customer);

    // State to track quantities for each service by their _id
    // Increment and decrement functions
    const [selectedService, setSelectedService] = useState(null);
    const [quantities, setQuantities] = useState({});

    const increment = () => {
        if (!selectedService) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: (prev[selectedService._id] || 0) + 1
        }));
    }

    const decrement = () => {
        if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 0) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: prev[selectedService._id] - 1
        }));
    }


    const handleServiceChange = (e) => {
        const selectedServiceName = e.target.value;
        const product = products.find(s => s.productName === selectedServiceName);
        setSelectedService(product || null);
    }

    const getCurrentQuantity = () => {
        if (!selectedService) return 0;
        return quantities[selectedService._id] || 1;
    };


    // handle add to cart
    
    const dispatch = useDispatch();

    const handleAddToCard = (item) => {
        const { id, name, price, qty, unit } = item ;
        const getCurrentQuantity = quantities[item.id] || 1;
        if (getCurrentQuantity === 0) {
            toast.warning('الرجاء تحديد الكميه المباعه .');
            return;
        }
        if (qty < 0 ) {
            toast.error ('عفوا رصيد الكميه غير كافي .') ;
            return;
        }
        if (qty < getCurrentQuantity) {
            toast.error('عفوا رصيد الكميه اقل من الكميه المراد بيعها .');
            return;
        }
        if (getCurrentQuantity > 0 && getCurrentQuantity <= qty) {
            // slice item for sale send ID versiaal ID
            const service = {serviceId: id}
            // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}
            const newObj = { id: id, name, pricePerQuantity: price, quantity: getCurrentQuantity, price: price * getCurrentQuantity }
            // send data to saleInfo
            // store data in sale Slice
            dispatch(addItems(newObj));
            // // slice item
            // dispatch(updateService({service}))
            setQuantities(prev => ({
                ...prev, [item.id] : 0
            }))

            setSelectedService(null);
            fetchProducts({  page: 1 })
        }

            return;
     }

 
    return (
       <section dir='rtl' className='min-h-screen bg-gradient-to-br from-blue-50 to-white p-3 md:p-4 lg:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white" />
                            <h1 className='text-lg md:text-xl font-bold'>فواتير المبيعات</h1>
                        </div>
        
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto'>
                            <button 
                                onClick={() => handleSaleModalOpen('sale')}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200 cursor-pointer'
                            >
                                <p className='text-sm'>اختيار العميل</p>
                                <IoMdArrowDropleft className='text-white' size={18}/>
                            </button>

                            <div className='flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg'>
                                <FaCircleUser className='h-5 w-5 text-blue-200'/>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            السيد:
                                        </p>
                                        <p className='text-sm font-bold text-white'>
                                            {customerData.customerName || 'اسم العميل'}
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            الرصيد:
                                        </p>
                                        <p className={`text-sm font-bold ${customerData.balance === 0 ? 'text-green-200' : 'text-red-200'}`}>
                                            {(Number(customerData.balance) || 0).toFixed(2)}
                                            <span className='text-blue-100 font-normal'> ر.ع</span>
                                        </p>  
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleOpenModal('customer')}
                                    className='p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition duration-150 cursor-pointer'
                                    title="إضافة عميل جديد"
                                >
                                    <ImUserPlus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left Column - Products and Cart */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Product Selection Card */}
                        <div className='bg-white rounded-xl shadow-lg p-5 border border-blue-100'>
                            <h2 className='text-blue-800 font-semibold mb-4 text-sm flex items-center gap-2'>
                                <span className='w-2 h-5 bg-blue-600 rounded-full'></span>
                                اختيار المنتج
                            </h2>
                            
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>اختيار المنتج:</label>
                                <div className='relative flex-1'>
                                    <select
                                        className='w-full bg-white border border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer'
                                        required
                                        onChange={handleServiceChange}
                                        value={selectedService?.productName || ''}
                                    >
                                        <option value="">اختر منتج...</option>
                                        {products.map((product, index) => (
                                            <option 
                                                key={index} 
                                                value={product.productName} 
                                                className='text-sm'
                                            >
                                                {product.productName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-3 top-2.5 text-blue-500 pointer-events-none">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {loading && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="mr-2 text-blue-600">جاري التحميل...</span>
                                </div>
                            )}

                            {selectedService && (
                                <div className='bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 border border-blue-200'>
                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                                        <div className='flex-1'>
                                            <h3 className='text-lg font-bold text-blue-800 mb-2'>{selectedService.productName}</h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='bg-white p-3 rounded-lg border border-blue-100'>
                                                    <p className='text-xs text-gray-500 mb-1'>سعر البيع</p>
                                                    <p className='text-lg font-bold text-green-600'>
                                                        {selectedService.price}
                                                        <span className='text-sm text-gray-500'> ر.ع</span>
                                                    </p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg border border-blue-100'>
                                                    <p className='text-xs text-gray-500 mb-1'>رصيد الكمية</p>
                                                    <p className='text-lg font-bold text-blue-600'>
                                                        {selectedService.qty}
                                                        <span className='text-sm text-gray-500'> {selectedService.unit}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-center gap-4'>
                                            <div className='flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm'>
                                                <button
                                                    onClick={increment}
                                                    className='text-blue-600 hover:text-blue-700 cursor-pointer transition duration-200'
                                                >
                                                    <IoMdArrowDropupCircle className='w-6 h-6'/>
                                                </button>

                                                <span className='text-2xl font-bold text-blue-700 w-8 text-center'>
                                                    {getCurrentQuantity()}
                                                </span>

                                                <button
                                                    onClick={decrement}
                                                    className='text-red-500 hover:text-red-600 cursor-pointer transition duration-200'
                                                >
                                                    <IoMdArrowDropdownCircle className='w-6 h-6'/>
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => handleAddToCard({
                                                    id: selectedService._id,
                                                    name: selectedService.productName, 
                                                    price: selectedService.price, 
                                                    qty: selectedService.qty, 
                                                    unit: selectedService.unit,
                                                    cat: selectedService.category
                                                })}
                                                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition duration-200 cursor-pointer shadow-md'
                                            >
                                                <BsFillCartCheckFill className='text-white' size={18} />
                                                <span className='font-medium'>أضف للسلة</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart Information */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <CartInfo />
                        </div>
                    </div>

                    {/* Right Column - Customer Info & Bills */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Customer Information */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <CustomerInfo />
                        </div>

                        {/* Bills Section */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <Bills fetchProducts={fetchProducts} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isSelectCustomerModalOpen && 
                <SelectCustomer
                    setIsSelectCustomerModalOpen={setIsSelectCustomerModalOpen}
                />
            }
            
            {/* Note: CustomerAdd component is commented in imports */}
            {/* {isCustomerModalOpen &&
                <CustomerAdd
                    setIsCustomerModalOpen={setIsCustomerModalOpen}
                />
            } */}
       </section>
    );
};

export default Sales;

// import React, { useState, useEffect } from 'react'
// import BackButton from '../components/shared/BackButton'
// import { useSelector } from 'react-redux'
// import { FaCircleUser } from "react-icons/fa6";
// import { IoMdArrowDropleft } from "react-icons/io";
// import { ImUserPlus } from "react-icons/im";
// // import SelectCustomer from '../components/sales/SelectCustomer';

// import { keepPreviousData, useQuery } from '@tanstack/react-query'
// import { enqueueSnackbar } from 'notistack'
// import { getBgColor } from '../utils'
// import { GrRadialSelected } from 'react-icons/gr';
// import { getProducts } from '../https';
// // import CustomerInfo from '../components/sales/CustomerInfo';

// // import Bills from '../components/sales/Bills';
// import { BsFillCartCheckFill } from "react-icons/bs";
// import { IoMdArrowDropupCircle } from "react-icons/io";
// import { IoMdArrowDropdownCircle } from "react-icons/io";

// import {useDispatch} from 'react-redux';
// import { addItems} from '../redux/slices/saleSlice';

// import { toast } from 'react-toastify';
// import CartInfo from '../components/sales/CartInfo';
// import SelectCustomer from '../components/sales/SelectCustomer';
// import CustomerInfo from '../components/sales/CustomerInfo';
// import Bills from '../components/sales/Bills';
// // import CustomerAdd from '../components/customers/CustomerAdd';


// // import CustomerAdd from '../components/sales/CustomerAdd'; // Assuming this is the correct import

// const Sales = () => {
//     const saleBtn = [{ label: "اختيار العميل", action: 'sale'}];

//     const [isSelectCustomerModalOpen, setIsSelectCustomerModalOpen] = useState(false);
//     const handleSaleModalOpen = (action) => {
//         if (action === 'sale') setIsSelectCustomerModalOpen(true)
//     }

//     // Add new customer
//     const addcstButton = [
//         { label: '', icon: <ImUserPlus className='text-[#0ea5e9]' size={20} />, action: 'customer' }
//     ];

//     const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
//     const handleOpenModal = (action) => {
//         if (action === 'customer') setIsCustomerModalOpen(true);
//     };


    
//     const [products, setProducts] = useState([]);
//     const [pagination, setPagination] = useState({});

//     const [loading, setLoading] = useState(false);

//     const fetchProducts = async (filters = {}) => {
//         setLoading(true);
//         try {
//             const response = await getProducts({
//                 // category: filters.category || 'all',
//                 search: filters.search || '',
//                 sort: filters.sort || '-createdAt',
//                 page: filters.page || 1,
//                 limit: filters.limit || 10
//             });
//             setProducts(response.data.data);
//             // setPagination(response.data.pagination);
        
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch services when category changes
//     useEffect(() => {
//         fetchProducts({
            
//         });
//     }, []);

//     // to fetch customer name from customer Modal  bg-[#D2B48C]
//     const customerData = useSelector(state => state.customer);

//     // State to track quantities for each service by their _id
//     // Increment and decrement functions
//     const [selectedService, setSelectedService] = useState(null);
//     const [quantities, setQuantities] = useState({});

//     const increment = () => {
//         if (!selectedService) return;

//         setQuantities(prev => ({
//             ...prev,
//             [selectedService._id]: (prev[selectedService._id] || 0) + 1
//         }));
//     }

//     const decrement = () => {
//         if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 0) return;

//         setQuantities(prev => ({
//             ...prev,
//             [selectedService._id]: prev[selectedService._id] - 1
//         }));
//     }


//     const handleServiceChange = (e) => {
//         const selectedServiceName = e.target.value;
//         const product = products.find(s => s.productName === selectedServiceName);
//         setSelectedService(product || null);
//     }

//     const getCurrentQuantity = () => {
//         if (!selectedService) return 0;
//         return quantities[selectedService._id] || 1;
//     };


//     // handle add to cart
    
//     const dispatch = useDispatch();

//     const handleAddToCard = (item) => {
//         const { id, name, price, qty, unit } = item ;
//         const getCurrentQuantity = quantities[item.id] || 1;
//         if (getCurrentQuantity === 0) {
//             toast.warning('الرجاء تحديد الكميه المباعه .');
//             return;
//         }
//         if (qty < 0 ) {
//             toast.error ('عفوا رصيد الكميه غير كافي .') ;
//             return;
//         }
//         if (qty < getCurrentQuantity) {
//             toast.error('عفوا رصيد الكميه اقل من الكميه المراد بيعها .');
//             return;
//         }
//         if (getCurrentQuantity > 0 && getCurrentQuantity <= qty) {
//             // slice item for sale send ID versiaal ID
//             const service = {serviceId: id}
//             // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}
//             const newObj = { id: id, name, pricePerQuantity: price, quantity: getCurrentQuantity, price: price * getCurrentQuantity }
//             // send data to saleInfo
//             // store data in sale Slice
//             dispatch(addItems(newObj));
//             // // slice item
//             // dispatch(updateService({service}))
//             setQuantities(prev => ({
//                 ...prev, [item.id] : 0
//             }))

//             setSelectedService(null);
//             fetchProducts({  page: 1 })
//         }

//             return;
//      }

 
//     return (
//        <section dir ='rtl' className='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5] shadow-xl'>
//             <div className='flex-[3] bg-white shadow-xl rounded-lg pt-0'>
                
//                 <div className='flex items-center justify-between px-4 py-2 shadow-xl mb-2 bg-white rounded-t-lg'>
//                     <div className='flex flex-wrap gap-0 items-center cursor-pointer'>
//                         <BackButton />
//                         <h1 className='text-[#1a1a1a] text-sm font-bold tracking-wide'>فواتير المبيعات</h1>
//                     </div>
        
//                     <div className='flex items-center justify-content gap-4 shadow-xl px-1 h-8 bg-[#f5f5f5] rounded-sm'>
//                         <div className='flex items-center gap-3 cursor-pointer '>
//                             <div className='p-2 mb-4 flex justify-center cursor-pointer'>
//                                 {saleBtn.map(({ label, action }) => {
//                                     return (
//                                         <button onClick={() => handleSaleModalOpen(action)} 
//                                             className='flex gap-1 items-center cursor-pointer'>
//                                             <p className='text-xs mt-3 underline text-zinc-600 font-semibold'>{label}</p>
//                                             <IoMdArrowDropleft className='inline mt-4 text-[#0ea5e9]' size={20}/>
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             <FaCircleUser className='h-5 w-5 text-yellow-700'/>
//                             <div className='flex items-center gap-1'>
//                                 <p className='text-xs font-normal text-[#1a1a1a]'>
//                                     السيد :
//                                 </p>
//                                 <p className='text-xs font-medium text-yellow-700'>
//                                     {customerData.customerName || 'اسم العميل'}
//                                 </p>
//                             </div>
                            
//                             <div className='flex items-center gap-1'>
//                                 <p className='text-xs font-normal text-[#1a1a1a]'>
//                                     الرصيد :
//                                 </p>
                               
//                                 <p className={`${customerData.balance === 0 ? 'text-[#0ea5e9]' : 'text-[#be3e3f]'} 
//                                     text-xs font-medium`}>
//                                     {(Number(customerData.balance) || 0).toFixed(2)}
//                                     <span className='text-xs text-[#1a1a1a] font-normal'> ر.ع</span>
//                                 </p>  
//                             </div>

//                             <div className='flex items-center justify-around gap-3'>
//                                 {addcstButton.map(({ label, icon, action }) => {
//                                     return (
//                                         <button
//                                             onClick={() => handleOpenModal(action)}
//                                             className='cursor-pointer px-2 py-2 font-semibold text-sm 
//                                             flex items-center gap-2'>
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
                
               
                
//                 <div className='flex w-full gap-1 justify-start items-start p-1'>
                 

//                     {/* Services */}
//                     <div className='flex flex-col w-full px-5 gap-5'>
//                         <div className='flex items-center'>
//                             <label className='w-[10%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>اختيار المنتج :</label>
//                             <div className='flex w-[90%] items-center p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-[#f5f5f5] h-8 rounded-sm w-[500px] text-xs font-normal border-b-1 border-yellow-700'
//                                     required
//                                     onChange={handleServiceChange}
//                                     value={selectedService?.productName || ''}
//                                 >
//                                     <option value="">...</option>
//                                     {products.map((product, index) => (
//                                         <option 
//                                             key={index} 
//                                             value={product.productName} 
//                                             className='text-xs font-normal'>
//                                             {product.productName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                         {loading && (
//                             <div className="mt-4 flex gap-2 justify-center">
//                                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0ea5e9] text-xs"></div>
//                                 <span className="ml-2">تحميل...</span>
//                             </div>
//                         )}

//                         {selectedService && (
//                             <div className='flex items-center justify-between p-2 bg-white shadow-lg/30 rounded-sm'>
//                                 <div className='flex-1'>
//                                     <h3 className='text-sm font-semibold text-gray-500'>{selectedService.productName}</h3>
//                                     <p>
//                                         <span className='text-xs text-gray-600 font-normal'>سعر البيع : </span>
//                                         <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.price}</span>
//                                         <span className='text-xs text-gray-600'> ر.ع</span>
//                                     </p>
                                    
//                                     <p>
//                                         <span className ='text-xs text-gray-600 font-normal'>رصيد الكميه : </span>
//                                         <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.qty}</span> 
//                                         <span className ='text-xs text-gray-600'> {selectedService.unit}</span>
//                                     </p>
//                                 </div>

//                                 <div className='flex gap-3 items-center justify-between shadow-xl
//                                     px-4 py-1 rounded-sm mr-0 bg-[#f5f5f5]'>
                                    
//                                     <button
//                                         onClick={increment}
//                                         className='text-[#0ea5e9] text-md cursor-pointer'
//                                     >
//                                         <IoMdArrowDropupCircle className ='w-5 h-5'/>
//                                     </button>

//                                     <span className={`${getCurrentQuantity() > 9 ? "text-lg" : "text-xl"} text-[#0ea5e9] flex flex-wrap gap-2 font-semibold`}>
//                                         {getCurrentQuantity()}
//                                     </span>

//                                     <button
//                                         onClick={decrement}
//                                         className='text-emerald-600 text-md cursor-pointer'
//                                     >
//                                         <IoMdArrowDropdownCircle className ='w-5 h-5'/>
//                                     </button>
//                                 </div>
//                                 <div className='ml-3'>
//                                     {/* disabled={getCurrentQuantity() === 0}  */}
//                                     <button onClick={() => handleAddToCard({
//                                         id: selectedService._id,
//                                         name: selectedService.productName, 
//                                         price: selectedService.price, 
//                                         qty: selectedService.qty, 
//                                         unit: selectedService.unit,
//                                         cat: selectedService.category
//                                     })}
//                                         className='cursor-pointer mt-0 mr-3'>
//                                         <BsFillCartCheckFill className='text-[#0ea5e9] rounded-lg flex justify-end items-end'
//                                          size={25} />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                      <CartInfo /> 
//                     </div>
//                 </div>

//             </div>
            
//             <div className='flex-[1] bg-white h-[100vh] rounded-lg shadow-lg pt-2'>
//                 <CustomerInfo />

//                 <Bills
//                     fetchProducts={fetchProducts} 
//                 />   
//             </div>

//             {isSelectCustomerModalOpen && 
//             <SelectCustomer
//             setIsSelectCustomerModalOpen={setIsSelectCustomerModalOpen}/>}
            
//             {isCustomerModalOpen &&
//                 <CustomerAdd
//                     setIsCustomerModalOpen={setIsCustomerModalOpen}
//                 />} 
       
       
//        </section>
//     );
// };

// export default Sales;
