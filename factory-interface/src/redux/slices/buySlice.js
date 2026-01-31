import { createSlice } from '@reduxjs/toolkit' ;

const initialState = [] ;


const buySlice = createSlice ({
    name :'buy',
    
    initialState, 

    reducers :{

        addBuyItems :(state, action) => {
            state.push(action.payload);
        },
        removeItem :(state, action) => {
            return state.filter(item => item.id != action.payload)
        },
        removeAllItems :(state) => {
            return [];
        }
    }

});

export const getTotalPrice = (state) => state.buy.reduce((total, item) => total + item.price, 0);

export const { addBuyItems, removeItem, removeAllItems } = buySlice.actions ;
export default buySlice.reducer ;