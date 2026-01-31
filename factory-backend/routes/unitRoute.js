const express = require('express');
const  { isVerifiedUser }  = require("../middlewares/tokenVerfication");
const { addUnit, getUnits, removeUnit, updateUnit } = require('../controllers/unitController');

const router = express.Router()

router.route('/').post( addUnit);
router.route('/:id').put(isVerifiedUser, updateUnit);
router.route('/').get(isVerifiedUser ,getUnits);
router.route('/remove').post(isVerifiedUser, removeUnit)

module.exports = router ;