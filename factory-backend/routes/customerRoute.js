const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerfication');
const { addCustomer, getCustomers, removeCustomer, updateCustomerBalance, updateCustomer } = require('../controllers/customerController');

const router = express.Router();

router.route('/').post(isVerifiedUser, addCustomer);
router.put('/:id', isVerifiedUser, updateCustomer);

router.route('/fetch').post(isVerifiedUser, getCustomers);
router.route('/remove').post(isVerifiedUser, removeCustomer);
router.route('/balance/:id').put(isVerifiedUser, updateCustomerBalance);

module.exports = router ;

