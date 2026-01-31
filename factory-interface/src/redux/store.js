import { configureStore } from "@reduxjs/toolkit";

import userSlice from './slices/userSlice';
import customerSlice from './slices/customerSlice'
import supplierSlice from './slices/supplierSlice';
import saleSlice from './slices/saleSlice';
import buySlice from './slices/buySlice';
import invoiceSlice from './slices/invoiceSlice';
import produceSlice from './slices/produceSlice';

const store = configureStore({
    reducer : {
        user : userSlice,
        customer :customerSlice,
        sale :saleSlice,
        buy :buySlice,
        invoice :invoiceSlice,
        supplier: supplierSlice,
        produce: produceSlice
    },

    devTools: import.meta.env.NODE_ENV !== 'production',
   
});

export default store;
