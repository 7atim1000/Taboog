const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerfication');
const { addSupplier, getSuppliers, removeSupplier, updateSupplierBalance, updateSupplier } = require('../controllers/supplierController');

const router = express.Router();


router.route('/').post(isVerifiedUser, addSupplier)
router.route('/:id').put(isVerifiedUser, updateSupplier) ;

router.route('/fetch').post(isVerifiedUser, getSuppliers);
router.route('/remove').post(isVerifiedUser, removeSupplier)

router.route('/balance/:id').put(isVerifiedUser, updateSupplierBalance);

module.exports = router ;