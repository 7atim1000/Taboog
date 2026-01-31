const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerfication');
const upload = require('../middlewares/multer');

const { 
    addProduct, 
    getProducts, 
    removeProduct ,
    updateProductionQuantities ,
    updateSaleQuantities, 
    updateProduct
    } = require('../controllers/productController');


const router = express.Router();
// router.route('/').post(isVerifiedUser, addService);
router.post('/', upload.single('image'), isVerifiedUser, addProduct);
router.put('/:id', upload.single('image'), isVerifiedUser, updateProduct);

router.route('/fetch').post(isVerifiedUser, getProducts);
router.route('/remove').post(isVerifiedUser, removeProduct)

router.route('/update-producequantities').post(isVerifiedUser, updateProductionQuantities);
router.route('/update-salequantities').post(isVerifiedUser,updateSaleQuantities);


module.exports = router;


