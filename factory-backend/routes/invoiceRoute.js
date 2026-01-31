const express = require('express')

const  { isVerifiedUser }  = require("../middlewares/tokenVerfication");

const { 
        addInvoice, 
        getInvoices, 
        updateInvoice, 
        getCustomerDetails,
        getSupplierDetails,
        getInvoiceById,
    } 

    = require('../controllers/invoiceController')


const router = express.Router();

router.route('/').post(isVerifiedUser, addInvoice);

router.route('/fetch').post(isVerifiedUser, getInvoices);

router.get('/:id', getInvoiceById);

// customers Invoices
router.route('/customerDetails').post(isVerifiedUser, getCustomerDetails);

// suppliers Invoices
router.route('/supplierDetails').post(isVerifiedUser,getSupplierDetails);

// update Invoices
router.route('/:id').put(isVerifiedUser, updateInvoice);





module.exports = router ;