const mongoose = require('mongoose') ;

const supplierSchema = new mongoose.Schema({
    supplierName :{ type: String, required :[true, 'Supplier name field is required']},
    email :{ type: String, required: true },
    contactNo :{ type: String, required :[true, 'Contact number field is required']},
    address :{ type: String, required :[true, 'Address field is required']},
    
    balance :{ type: Number, required :[true, 'Balance field is required']}
}, {timestamps: true})



module.exports = mongoose.model('Supplier', supplierSchema)