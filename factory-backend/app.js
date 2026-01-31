const express = require('express');
const connectDB = require('./config/database');

const config = require("./config/config");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
require('colors');

const connectCloudinary = require('./config/cloudinary');

//const PORT = process.env.PORT;
const PORT = config.port;
connectDB();
connectCloudinary();

//cors policy to unblock response
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}));


//Middleware Parse incoming request in json format and cookie parser for cookies and token 
app.use(express.json()); 
//To activate middleware (cookieParser)
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({message: 'Hellow from POS Server'})
});

//End points 
app.use('/api/auth', require('./routes/userRoute'));
app.use('/api/transactions', require('./routes/transactionRoute'));
app.use('/api/expenses', require('./routes/expenseRoute'));
app.use('/api/incomes', require('./routes/incomeRoute')); //differs

app.use('/api/category', require('./routes/categoryRoute'));
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/unit', require('./routes/unitRoute'));
app.use('/api/item', require('./routes/itemRoute'));

app.use('/api/invoice', require('./routes/invoiceRoute'));

app.use('/api/customer', require('./routes/customerRoute'));
app.use('/api/supplier', require('./routes/supplierRoute'));

app.listen(PORT, () => {
    console.log(`POS server is listening on port ${PORT}` .bgCyan); 
});
