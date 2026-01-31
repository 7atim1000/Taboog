const express = require('express');
const  { isVerifiedUser }  = require("../middlewares/tokenVerfication");

const { addTransaction, getTransactions, removeTransaction, updateTransaction } = require('../controllers/transactionController');

const router = express.Router();


router.post('/add-transaction', isVerifiedUser, addTransaction)
router.put('/:id', isVerifiedUser, updateTransaction);
router.post('/get-transactions', isVerifiedUser, getTransactions)
router.post('/remove', isVerifiedUser, removeTransaction)

module.exports = router; 