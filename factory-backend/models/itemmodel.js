const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({

    itemName :{ type: String, required: [true, 'name field is required']},
    price :{ type: Number, required: true},
    qty :{ type: Number, required: true},
    unit :{ type: String, required: true},

    user: { type: mongoose.Schema.Types.String, ref: 'User'},

}, { timestamps :true})

module.exports = mongoose.model('Item', itemSchema);
