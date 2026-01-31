const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    productName :{ type: String, required: [true, 'name field is required']},
    price :{ type: Number, required: true},
    qty :{ type: Number, required: true},
    unit :{ type: String, required: true},

    serviceNo :{ type: String },
    status: { type: String, default: 'Available'},
    image: { type: String },
    user: { type: mongoose.Schema.Types.String, ref: 'User'},
    // currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default : null}

}, { timestamps :true})

module.exports = mongoose.model('Product', productSchema);
