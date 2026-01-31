import { createSlice } from '@reduxjs/toolkit' ;

const initialState = [] ;

const produceSlice = createSlice ({
    name :'produce',
    
    initialState, 

    reducers :{

        addProduce :(state, action) => {
            state.push(action.payload);
        },
        removeProduce :(state, action) => {
            return state.filter(item => item.id != action.payload)
        },
        removeAllProduce :(state) => {
            return [];
        }
    }

});

export const getTotalPrice = (state) => state.produce.reduce((total, item) => total + item.price, 0);

export const { addProduce, removeProduce, removeAllProduce } = produceSlice.actions ;
export default produceSlice.reducer ;