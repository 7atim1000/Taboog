const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    
    customerName :{type: String, required :[true, 'Customername is required']},
    contactNo :{ type: String, required: [true, 'Contact number is required']},
    address :{ type: String, required :[true, 'Customer address is required']},
    email : { type: String },

    balance :{ type: Number, rquired :[true, 'balance field is required']},

} ,{timestamps: true})



module.exports = mongoose.model('Customers', customerSchema) ;