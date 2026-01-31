const mongoose = require('mongoose') ;

const unitSchema = new mongoose.Schema ({
    unitName :{ type: String, required: [true ,'Unit field is required']},
});


module.exports = mongoose.model('Unit', unitSchema) ;