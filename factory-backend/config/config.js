require('dotenv').config();

const config = Object.freeze({
    
    port: process.env.PORT || 7000,
    databaseURI: process.env.MONGODB_URI || "mongodb+srv://7atim1000:YNp4cO4gTbrbzYyn@cluster0.eo9dnwi.mongodb.net/Factory",     

    nodeEnv : process.env.NODE_ENV || "development",

    accessTokenSecret : process.env.JWT_SECRET,

});

module.exports = config ;