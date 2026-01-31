import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowAltCircleRight } from "react-icons/fa";

const BackButton = () => {

    const navigate = useNavigate();
    return (
        <button onClick ={() => navigate(-1)} className ='p-1 mr-2  font-semibold rounded-full cursor-pointer'>
            <FaArrowAltCircleRight className ='text-white' size={20}/>
        </button>
    );
};


export default BackButton ;