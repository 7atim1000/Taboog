const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerfication');
const { addItem, getItems, removeItem, updateItem, updateBuyQuantities } = require('../controllers/itemController')

const router = express.Router();

router.route('/').post(addItem);
router.route('/:id').put(isVerifiedUser, updateItem);
router.route('/fetch').post(isVerifiedUser, getItems);
router.route('/remove').post(isVerifiedUser, removeItem);

router.route('/update-buyquantities').post(isVerifiedUser, updateBuyQuantities);

module.exports = router;