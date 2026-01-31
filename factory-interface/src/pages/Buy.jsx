import React, { useState, useEffect } from 'react'
import BackButton from '../components/shared/BackButton'
import { useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import SupplierInfo from '../components/buy/SupplierInfo';
import Bills from '../components/buy/Bills';
import { IoMdArrowDropright } from "react-icons/io";
import SelectSupplier from '../components/buy/SelectSupplier';
import { ImUserPlus } from "react-icons/im";
import SupplierAdd from '../components/suppliers/SupplierAdd';
import { IoMdArrowDropupCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { BsFillCartCheckFill } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { getItems } from '../https';
import { addBuyItems } from '../redux/slices/buySlice';
import CartInfo from '../components/buy/CartInfo';
import { FaShoppingCart, FaBoxes, FaSearch } from "react-icons/fa";

const Buy = () => {
    // to fetch supplier name from supplier Modal 
    const supplierData = useSelector(state => state.supplier);
    const userData = useSelector(state => state.user);

    const buyBtn = [{ label: "اختيار المورد", action: 'buy' }];
    
    const [isSelectSupplierModalOpen, setIsSelectSupplierModalOpen] = useState(false);
    const handleSupplierModalOpen = (action) => {
        if (action === 'buy') setIsSelectSupplierModalOpen(true)
    }

    // Add new Supplier
    const addSuppButton = [
        { label: '', icon: <ImUserPlus className='text-white' size={18} />, action: 'supplier' }
    ];

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const handleAddSupplierModal = (action) => {
        if (action === 'supplier') setIsSupplierModalOpen(true);
    };

    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchItems = async (filters = {}) => {
        setLoading(true)
        try {
            const response = await getItems({
                search: filters.search || '',
                sort: filters.sort || '-createdAt',
                page: filters.page || 1,
                limit: filters.limit || 10
            });
            setItems(response.data.data || response.data.items);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error(error);
        } finally{
            setLoading(false);
        }
    };

    // Fetch services when category changes
    useEffect(() => {
        fetchItems({
            page: 1
        });
    }, []);

    // Increment and decrement functions
    const [selectedService, setSelectedService] = useState(null);
    const [quantities, setQuantities] = useState({});

    const increment = () => {
        if (!selectedService) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: (prev[selectedService._id] || 1) + 1
        }));
    }

    const decrement = () => {
        if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 1) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: prev[selectedService._id] - 1
        }));
    }

    const handleServiceChange = (e) => {
        const selectedServiceName = e.target.value;
        const item = items.find(s => s.itemName === selectedServiceName);
        setSelectedService(item || null);
    }

    const getCurrentQuantity = () => {
        if (!selectedService) return 1;
        return quantities[selectedService._id] || 1;
    };

    const dispatch = useDispatch();

    const handleAddToCart = (item) => {
        const { id, name, price, qty, unit } = item;
        const currentQuantity = quantities[item.id] || 1;
        if (currentQuantity === 0) {
            toast.warning('الرجاء تحديد الكمية المطلوبة.');
            return;
        }
       
        if (currentQuantity > 0 ) {
            const newObj = { 
                id: id, 
                name, 
                pricePerQuantity: price, 
                quantity: currentQuantity, 
                price: price * currentQuantity 
            };
        
            dispatch(addBuyItems(newObj));
          
            setSelectedService(null);
            fetchItems({ page: 1 })
        }

        return;
    }

    return (
        <section dir='rtl' className='min-h-screen bg-gradient-to-br from-blue-50 to-white p-3 md:p-4 lg:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-xl shadow-lg mb-3 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white" />
                            <h1 className='text-lg md:text-xl font-bold'>فواتير المشتريات</h1>
                        </div>

                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto'>
                            <button 
                                onClick={() => handleSupplierModalOpen('buy')}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200 cursor-pointer'
                            >
                                <p className='text-sm'>اختيار المورد</p>
                                <IoMdArrowDropright className='text-white' size={18}/>
                            </button>

                            <div className='flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg'>
                                <FaCircleUser className='h-5 w-5 text-blue-200'/>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            السيد:
                                        </p>
                                        <p className='text-sm font-bold text-white'>
                                            {supplierData.supplierName || 'اسم المورد'}
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            الرصيد:
                                        </p>
                                        <p className={`text-sm font-bold ${supplierData.balance === 0 ? 'text-green-200' : 'text-red-200'}`}>
                                            {(Number(supplierData.balance) || 0).toFixed(2)}
                                            <span className='text-blue-100 font-normal'> ر.ع</span>
                                        </p>  
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddSupplierModal('supplier')}
                                    className='p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition duration-150 cursor-pointer'
                                    title="إضافة مورد جديد"
                                >
                                    <ImUserPlus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Right Column - Supplier Info & Bills */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Supplier Information */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <SupplierInfo />
                        </div>

                        {/* Bills Section */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <Bills fetchItems={fetchItems} />
                        </div>
                    </div>

                    {/* Left Column - Items and Cart */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Item Selection Card */}
                        <div className='bg-white rounded-xl shadow-lg p-5 border border-blue-100'>
                            <h2 className='text-blue-800 font-semibold mb-4 text-sm flex items-center gap-2'>
                                <FaBoxes className="text-blue-600 w-4 h-4" />
                                اختيار الصنف
                            </h2>
                            
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>اختيار الصنف:</label>
                                <div className='relative flex-1'>
                                    <select
                                        className='w-full bg-white border border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer'
                                        required
                                        onChange={handleServiceChange}
                                        value={selectedService?.itemName || ''}
                                    >
                                        <option value="">اختر صنف...</option>
                                        {items.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.itemName}
                                                className='text-sm'
                                            >
                                                {item.itemName}
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
                                            <h3 className='text-lg font-bold text-blue-800 mb-2'>{selectedService.itemName}</h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='bg-white p-3 rounded-lg border border-blue-100'>
                                                    <p className='text-xs text-gray-500 mb-1'>سعر الشراء</p>
                                                    <p className='text-lg font-bold text-blue-600'>
                                                        {selectedService.price}
                                                        <span className='text-sm text-gray-500'> ر.ع</span>
                                                    </p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg border border-blue-100'>
                                                    <p className='text-xs text-gray-500 mb-1'>الكمية المتاحة</p>
                                                    <p className='text-lg font-bold text-green-600'>
                                                        {selectedService.qty}
                                                        <span className='text-sm text-gray-500'> {selectedService.unit}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-center gap-4'>
                                            <div className='flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm'>
                                                <button
                                                    onClick={decrement}
                                                    className='text-red-500 hover:text-red-600 cursor-pointer transition duration-200'
                                                >
                                                    <IoMdArrowDropdownCircle className='w-6 h-6'/>
                                                </button>

                                                <span className='text-2xl font-bold text-blue-700 w-8 text-center'>
                                                    {getCurrentQuantity()}
                                                </span>

                                                <button
                                                    onClick={increment}
                                                    className='text-blue-600 hover:text-blue-700 cursor-pointer transition duration-200'
                                                >
                                                    <IoMdArrowDropupCircle className='w-6 h-6'/>
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => handleAddToCart({
                                                    id: selectedService._id,
                                                    name: selectedService.itemName,
                                                    price: selectedService.price,
                                                    qty: selectedService.qty,
                                                    unit: selectedService.unit
                                                })}
                                                className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition duration-200 cursor-pointer shadow-md'
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
                </div>
            </div>

            {/* Modals */}
            {isSelectSupplierModalOpen && 
                <SelectSupplier 
                    setIsSelectSupplierModalOpen={setIsSelectSupplierModalOpen}
                />
            }

            {isSupplierModalOpen && 
                <SupplierAdd 
                    setIsSupplierModalOpen={setIsSupplierModalOpen} 
                />
            }
        </section>
    );
}

export default Buy;
// import React, { useState, useEffect } from 'react'

// import BackButton from '../components/shared/BackButton'
// import { useSelector } from 'react-redux'
// import { FaCircleUser } from "react-icons/fa6";

// import SupplierInfo from '../components/buy/supplierInfo';

// import Bills from '../components/buy/Bills';
// import { IoMdArrowDropright } from "react-icons/io";
// import SelectSupplier from '../components/buy/SelectSupplier';
// import { ImUserPlus } from "react-icons/im";
// import SupplierAdd from '../components/suppliers/SupplierAdd';

// import { IoMdArrowDropupCircle } from "react-icons/io";
// import { IoMdArrowDropdownCircle } from "react-icons/io";
// import { BsFillCartCheckFill } from "react-icons/bs";

// import {useDispatch} from 'react-redux';
// import { toast } from 'react-toastify'
// import { getItems } from '../https';
// import { addBuyItems } from '../redux/slices/buySlice';
// import CartInfo from '../components/buy/CartInfo';

// const Buy = () => {
//     // to fetch customer name from customer Modal 
//     const supplierData = useSelector(state => state.supplier);
//     const userData = useSelector(state => state.user);

//     const buyBtn = [{ label: "اختيار المورد", action: 'buy' }];
    
//     const [isSelectSupplierModalOpen, setIsSelectSupplierModalOpen] = useState(false);
//     const handleSupplierModalOpen = (action) => {
//         if (action === 'buy') setIsSelectSupplierModalOpen(true)
//     }

//     // Add new Supplier
//     const addSuppButton = [
//         { label: '', icon: <ImUserPlus className='text-[#0ea5e9]' size={20} />, action: 'supplier' }
//     ];

//     const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
//     const handleAddSupplierModal = (action) => {
//         if (action === 'supplier') setIsSupplierModalOpen(true);
//     };

//     const [items, setItems] = useState([]);
//     const [pagination, setPagination] = useState({});
//     const [loading, setLoading] = useState(false);

//     const fetchItems = async (filters = {}) => {
//         setLoading(true)
//         try {
//             const response = await getItems({
//                 search: filters.search || '',
//                 sort: filters.sort || '-createdAt',
//                 page: filters.page || 1,
//                 limit: filters.limit || 10
//             });
//             setItems(response.data.data || response.data.items);
//             setPagination(response.data.pagination);
//         } catch (error) {
//             console.error(error);
//         } finally{
//             setLoading(false);
//         }
//     };

//     // Fetch services when category changes
//     useEffect(() => {
//         fetchItems({
//             page: 1 // Reset to first page when category changes
//         });
//     }, []);

//     // Increment and decrement functions
//     const [selectedService, setSelectedService] = useState(null);
//     const [quantities, setQuantities] = useState({});

//     const increment = () => {
//         if (!selectedService) return;

//         setQuantities(prev => ({
//             ...prev,
//             [selectedService._id]: (prev[selectedService._id] || 1) + 1
//         }));
//     }

//     const decrement = () => {
//         if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 1) return;

//         setQuantities(prev => ({
//             ...prev,
//             [selectedService._id]: prev[selectedService._id] - 1
//         }));
//     }

//     const handleServiceChange = (e) => {
//         const selectedServiceName = e.target.value;
//         const item =items.find(s => s.itemName === selectedServiceName);
//         setSelectedService(item || null);
//     }

//     const getCurrentQuantity = () => {
//         if (!selectedService) return 1;
//         return quantities[selectedService._id] || 1;
//     };

//     const dispatch = useDispatch();

//     const handleAddToCard = (item) => {
//         const { id, name, price, qty, unit } = item;
//         const getCurrentQuantity = quantities[item.id] || 1;
//         if (getCurrentQuantity === 0) {
//             toast.warning('Please specify the required quantity.');
//             return;
//         }
       
//         if (getCurrentQuantity > 0 ) {
//             // slice item for sale send ID versiaal ID
//             const service = { serviceId: id }
//             // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}
//             const newObj = { id: id, name, pricePerQuantity: price, quantity: getCurrentQuantity, price: price * getCurrentQuantity }
        
//             dispatch(addBuyItems(newObj));
          
//             setSelectedService(null);
//             fetchItems({ page: 1 })
//         }

//         return;
//     }

      
//     return (
//         <section dir ='rtl' className='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5] shadow-xl'>
               
//             <div className='flex-[3] bg-white shadow-xl rounded-lg pt-0'>

//                 <div className='flex items-center justify-between px-4 py-2 shadow-xl mb-2 bg-white rounded-t-lg'>
//                     <div className='flex flex-wrap gap-0 items-center cursor-pointer'>
//                         <BackButton />
//                         <h1 className='text-[#1a1a1a] text-sm font-bold tracking-wide'>فواتير المشتروات</h1>
//                     </div>

//                     <div className='flex items-center justify-content gap-4 shadow-xl px-1 h-8 bg-[#f5f5f5] rounded-sm'>
//                         <div className='flex items-center gap-3 cursor-pointer '>
//                             <div className='p-2 mb-4 flex justify-center cursor-pointer'>

//                                 {buyBtn.map(({ label, action }) => {
//                                     return (
//                                         <button
//                                             onClick={() => handleSupplierModalOpen(action)}
//                                             className='flex gap-1 items-center cursor-pointer'>
//                                             <p className='text-xs mt-3 underline text-zinc-600 font-semibold'>{label}</p>
//                                             <IoMdArrowDropright className='inline mt-4 text-[#0ea5e9]' size={20} />
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             <FaCircleUser className='h-5 w-5 text-yellow-700' />
//                              <div className='flex items-center gap-1'>
//                                 <p className='text-xs font-normal text-[#1a1a1a]'>
//                                     السيد :
//                                 </p>
//                                 <p className='text-xs font-medium text-yellow-700'>
//                                     {supplierData.supplierName || 'اسم المورد'}
//                                 </p>
//                             </div>
//                             <div className='flex items-center gap-1'>
//                                 <p className='text-xs font-normal text-[#1a1a1a]'>
//                                     الرصيد :
//                                 </p>

//                                 <p className={`${supplierData.balance === 0 ? 'text-[#0ea5e9]' : 'text-[#be3e3f]'} 
//                                     text-xs font-medium`}>
//                                     {(Number(supplierData.balance) || 0).toFixed(2)}
//                                     <span className='text-xs text-[#1a1a1a] font-normal'> ر.ع</span>
//                                 </p>
//                             </div>

//                             <div className='flex items-center justify-around gap-3'>
//                                 {addSuppButton.map(({ label, icon, action }) => {
//                                     return (
//                                         <button
//                                             onClick={() => handleAddSupplierModal(action)}
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
          
                  
//                     <div className='flex w-full gap-1 justify-start items-start p-1'>
                    
//                     {/* Services */}
//                      <div className='flex flex-col w-full px-5 gap-5'>
//                         <div className='flex items-center'>
//                             <label className='w-[10%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>اختيار الصنف :</label>
//                             <div className='flex w-[90%] items-center p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-[#f5f5f5] h-8 rounded-sm w-[500px] text-xs font-normal border-b-1 border-yellow-700'
//                                     required
//                                     onChange={handleServiceChange}
//                                     value={selectedService?.itemName || ''}
//                                 >
//                                     <option value="">...</option>
//                                     {items.map((item, index) => (
//                                         <option
//                                             key={index}
//                                             value={item.itemName}
//                                             className='text-xs font-normal'>
//                                             {item.itemName}
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
//                                     <h3 className='text-sm font-semibold text-gray-500'>{selectedService.itemName}</h3>
//                                      <p>
//                                         <span className='text-xs text-gray-600 font-normal'>سعر الشراء : </span>
//                                         <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.price}</span>
//                                         <span className='text-xs text-gray-600'> ر.ع</span>
//                                     </p>
//                                     <p>
//                                         <span className='text-xs text-gray-600 font-normal'>رصيد الكميه : </span>
//                                         <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.qty}</span>
//                                         <span className='text-xs text-gray-600'> {selectedService.unit}</span>
//                                     </p>
//                                 </div>

//                                 <div className='flex gap-3 items-center justify-between shadow-xl
//                                     px-4 py-1 rounded-sm mr-0 bg-[#f5f5f5]'>
                                   
//                                     <button
//                                         onClick={increment}
//                                         className='text-[#0ea5e9] text-md cursor-pointer'
//                                     >
//                                         <IoMdArrowDropupCircle className='w-5 h-5' />
//                                     </button>
//                                     <span className={`${getCurrentQuantity() > 9 ? "text-lg" : "text-xl"} text-[#0ea5e9] flex flex-wrap gap-2 font-semibold`}>
//                                         {getCurrentQuantity()}
//                                     </span>
//                                     <button
//                                         onClick={decrement}
//                                         className='text-emerald-600 text-md cursor-pointer'
//                                     >
//                                         <IoMdArrowDropdownCircle className='w-5 h-5' />
//                                     </button>

                                  
//                                 </div>

//                                 <div className='ml-3'>
//                                     {/* disabled={getCurrentQuantity() === 0}  */}
//                                     <button onClick={() => handleAddToCard({
//                                         id: selectedService._id,
//                                         name: selectedService.itemName,
//                                         price: selectedService.price,
//                                         qty: selectedService.qty,
//                                         unit: selectedService.unit
//                                     })}
//                                         className='cursor-pointer mt-0 mr-2'>
//                                         <BsFillCartCheckFill className='text-emerald-600 rounded-lg flex justify-end items-end' 
//                                         size={25} />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         <CartInfo />
//                     </div>
//                 </div>
               
                
//                 </div>

//                 {isSelectSupplierModalOpen && 
//                 <SelectSupplier 
//                 setIsSelectSupplierModalOpen={setIsSelectSupplierModalOpen}
//                 />
//                 }

//                 {isSupplierModalOpen && 
//                 <SupplierAdd 
//                 setIsSupplierModalOpen ={setIsSupplierModalOpen} 
//                 />
//                 }


//             <div className='flex-[1] bg-white shadow-xl rounded-lg pt-0'>
//                 <SupplierInfo />

//                 <Bills
//                     fetchItems={fetchItems} 
//                 />
//             </div>
       
//               </section>
//     );
// }


// export default Buy ;