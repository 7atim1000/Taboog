const express = require('express');
const { isVerifiedUser } = require('../middlewares/tokenVerfication');
const { addCategory, getCategories, removeCategory, updateCategory } = require('../controllers/categoryController')

const router = express.Router();

router.route('/').post(isVerifiedUser, addCategory);
router.route('/:id').put(isVerifiedUser, updateCategory);

router.route('/').get(isVerifiedUser, getCategories)
router.route('/remove').post(isVerifiedUser, removeCategory)


module.exports = router;