import axios from 'axios'


export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Auth
export const login = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/register', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}); 

// export const register = (data) => api.post('/api/auth/register', data, {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// });


export const getUserData = () => api.get('/api/auth');
export const logout = () => api.post('/api/auth/logout');


export const getExpenses = () => api.get('/api/expenses');
export const addExpense = (data) => api.post('/api/expenses', data);

export const getIncomes = () => api.get('/api/incomes');
export const addIncome = (data) => api.post('/api/incomes', data);

// Categories
export const getCategories = () => api.get('/api/category');
export const addCategory = (data) => api.post('/api/category', data);

// Product
export const getProducts = (filters = {}) => api.post('/api/product/fetch', filters);
export const addProduct = (data) => api.post('/api/product', data);
export const updateProduct = ({productId, ...productData}) => api.put(`/api/product/${productId}`, productData);  // serviceData explain in Bill.jsx

// Items
export const getItems = (filters = {}) => api.post('/api/item/fetch', filters);

export const getUnits = () => api.get('/api/unit');
export const addUnit = (data) => api.post('/api/unit', data);


// Add transaction
export const addTransaction = (data) => api.post('/api/transactions/add-transaction', data);


// invoices
export const addInvoice = (data) => api.post('/api/invoice', data);
export const getInvoices = (data) => api.post('/api/invoice', data);
export const updateInvoice = ({invoiceId, invoiceStatus}) => api.put(`/api/invoice/${invoiceId}`, {invoiceStatus});

//  Customers and Suppliers
export const addCustomer = (data) => api.post('/api/customer', data);
export const updateCustomer = ({customerId, ...balanceData}) => api.put(`/api/customer/balance/${customerId}`, balanceData);  // serviceData explain in Bill.jsx

export const addSupplier = (data) => api.post('/api/supplier', data);
export const updateSupplier = ({supplierId, ...balanceData}) => api.put(`/api/supplier/balance/${supplierId}`, balanceData);  // serviceData explain in Bill.jsx
