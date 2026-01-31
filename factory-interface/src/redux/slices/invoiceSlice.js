import { createSlice } from '@reduxjs/toolkit'

const initialState = {           // Added
    invoiceId: "",
}

const invoiceSlice = createSlice({
    name: "invoice",

    initialState,

       reducers: {

        setInvoice: (state, action) => {
            const { invoiceId } = action.payload;
            state.invoiceId = invoiceId;
            
        },
    }
});

export const { setInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;