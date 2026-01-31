import React, {useState, useEffect} from 'react' 

import { GiSunflower } from "react-icons/gi";
import { BsFillMoonStarsFill } from "react-icons/bs";

import { useSelector } from 'react-redux';
import AnalogClock from './AnalogClock';

const Greetings = () => {
    
    const userData = useSelector(state => state.user);
    const [dateTime, setDateTime] = useState(new Date());
    
    // Add this function inside your component (before return)
    function getCurrentShift() {
        const hour = new Date().getHours();
        // Example: Morning = 6:00-17:59, Evening = 18:00-5:59
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }
    
    //const userData = useSelector(state => state.user)

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const months = [
            'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, 
            ${date.getFullYear()}`;
    };

    const formatTime = (date) =>
        `${String(date.getHours()).padStart(2, '0')}:${String(
            date.getMinutes()
        ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    
    return (
       
        <div className ='flex justify-between items-center mt-0 px-8 py-1 border-bottom shadow-xl'>
            
            <div className ='flex flex-col gap-1'>
                <h1 className ='text-xs font-medium text-[#0ea5e9] flex items-center gap-2'>مرحبا : 
                <p className ='text-md font-semibold text-[#1a1a1a]'>{userData.name || 'Username'}</p></h1>
                <p className ='text-sm font-medium flex items-center justify-between gap-1 text-[#0ea5e9]'>Give your best services for customers</p>
            </div>

            <div className='flex items-center gap-2 justify-center'>

                {getCurrentShift() === 'Morning' ? (
                    <GiSunflower className='text-orange-400' size={24} />
                ) : (
                    <BsFillMoonStarsFill className='text-[#0ea5e9]' size={24} />
                )}
                <h1 className='text-sm text-black font-semibold'>
                    {getCurrentShift()} shift
                </h1>

            </div>
            
            <div className ='flex flex-col gap-1 items-center'>
            {/* <h1 className ='text-sm font-semibold text-blue-700'>{formatTime(dateTime)}</h1>  */}
                <AnalogClock className="w-10 h-10 flex items-center" />
                <p className ='text-xs font-normal text-[#1f1f1f]'>{formatDate(dateTime)}</p>
            </div>

        </div>
    
    );
  
};



export default Greetings ;