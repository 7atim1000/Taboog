const createHttpError = require('http-errors');
const moment = require('moment');

const { mongoose } = require('mongoose');
const Invoice = require('../models/invoiceModel');

const addInvoice = async (req, res, next) => {
    
    function getCurrentShift() {
        
        const hour = new Date().getHours();
        // Example: morning = 6:00-17:59, evening = 18:00-5:59
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }


    try {

        //const invoice = new Invoice(req.body);
        const invoice = new Invoice({
            ...req.body,
            shift : getCurrentShift(),
        });

        await invoice.save();
        res.status(201).json({ success: true, message: 'Invoice created successfuly!', data: invoice });

    } catch (error) {
        next(error)
    }
}


const getInvoices = async (req, res, next) => {

    try {

        const { frequency, type, invoiceType, invoiceStatus, shift, customer, supplier, sort ='-createdAt', search, page = 1, limit = 10 } = req.body;

        const query = {
            invoiceDate: {
                $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
            ...(type && type !== 'all' && { type }),
            ...(invoiceType && invoiceType !== 'all' && { invoiceType }),
            ...(invoiceStatus && invoiceStatus !== 'all' && { invoiceStatus }),
            ...(shift && shift !== 'all' && { shift }),
            ...(customer && customer !== 'all' && { customer }),
            ...(supplier && supplier !== 'all' && { supplier }),

            //To search on nested fields like customerDetails.name, you need to use dot notation in your MongoDB
            //$regex used to string search
            ...(search && {
                $or: [
                    { shift: { $regex: search, $options: 'i' } },
                    { invoiceNumber: { $regex: search, $options: 'i' } },
                    { customerName: { $regex: search, $options: 'i' } },
                    { supplierName: { $regex: search, $options: 'i' } },
                    { invoiceStatus: { $regex: search, $options: 'i' } },
                    { invoiceType: { $regex: search, $options: 'i' } },
                ]
            })
        };

        let sortOption = {};
        if (sort === '-createdAt') {
            sortOption = { createdAt: -1 }; // Newest first
        } else if (sort === 'createdAt') {
            sortOption = { createdAt: 1 };  // Oldest first
        } 

        // Calculate pagination values
        const startIndex = (page - 1) * limit;
        // const endIndex = page * limit;
        const total = await Invoice.countDocuments(query).populate([
            {
                path: "customer",
                select: ["email", "customerName"] ,
                // select: "email customerName" ,
            },
            {
                path: "supplier",
                select: "email",
            },
            {
                path: "user",
                select: "name",
            },
        ])

        const invoices = await Invoice.find(query).populate([
            {
                path: "customer",
                select: "email",
            },
            {
                path: "supplier",
                select: "email",
            },
            {
                path: "user",
                select: "name",
            },
        ])
            .sort(sortOption)
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            message: 'All invoices fetched successfully',
            success: true,
            data: invoices,
            invoices,

            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });


    } catch (error) {
        next(error)
    }
};


const getInvoiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: 'Invoice ID is required',
                success: false
            });
        }

        const invoice = await Invoice.findById(id)
            .populate([
                {
                    path: "customer",
                    select: "email customerName",
                },
                {
                    path: "supplier",
                    select: "email supplierName",
                },
                {
                    path: "user",
                    select: "name",
                }
                // REMOVE the items.product population since items are embedded
            ]);

        if (!invoice) {
            return res.status(404).json({
                message: 'Invoice not found',
                success: false
            });
        }

        console.log('Invoice found:', invoice);
        console.log('Invoice items:', invoice.items);

        res.status(200).json({
            message: 'Invoice fetched successfully',
            success: true,
            data: invoice
        });

    } catch (error) {
        console.error('Error in getInvoiceById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid invoice ID format',
                success: false
            });
        }
        next(error);
    }
};




const getCustomerDetails = async (req, res) => {
    try {
        let { 
            customer, 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc', 
            search 
        } = req.body;

        // Convert to numbers and validate
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));

        if (!customer) {
            return res.status(400).json({ 
                success: false, 
                message: 'Customer parameter is required' 
            });
        }

        // Build base query
        let query = { customer: customer };

        // Add search functionality - handle both string and numeric searches
        if (search && typeof search === 'string' && search.trim()) {
            const searchTerm = search.trim();
            
            // Try to convert search term to number for numeric fields
            const numericSearch = parseFloat(searchTerm);
            const isNumericSearch = !isNaN(numericSearch);
            
            query.$or = [
                // String fields - use regex
                { invoiceNumber: { $regex: searchTerm, $options: 'i' } },
                { invoiceType: { $regex: searchTerm, $options: 'i' } },
                
                // Numeric fields - use exact or range matching
                ...(isNumericSearch ? [
                    { 'bills.total': numericSearch },
                    { 'bills.tax': numericSearch },
                    { 'bills.totalWithTax': numericSearch },
                    { 'bills.payed': numericSearch }
                ] : [])
            ];
        }

        // Build sort options - handle nested fields like 'bills.total'
        const sortOptions = {};
        
        // Handle nested field sorting (e.g., 'bills.total')
        if (sortBy.includes('.')) {
            // For nested fields like 'bills.total'
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            // For regular fields
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        // Calculate pagination
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination and sorting
        const invoices = await Invoice.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const total = await Invoice.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            success: true,
            message: 'Customer details fetched successfully',
            data: invoices,
            pagination: {
                currentPage: pageNum,
                totalPages: totalPages,
                totalItems: total,
                itemsPerPage: limitNum,
                hasNext: pageNum < totalPages,
                hasPrevious: pageNum > 1
            },
            filters: {
                search: search || '',
                sortBy: sortBy,
                sortOrder: sortOrder
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching customer details',
            error: error.message
        });
    }
};


const getSupplierDetails = async (req, res) => {
    try {
        let { 
            supplier, 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc', 
            search 
        } = req.body;

        // Convert to numbers and validate
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));

        if (!supplier) {
            return res.status(400).json({ 
                success: false, 
                message: 'Supplier parameter is required' 
            });
        }

        // Build base query
        let query = { supplier: supplier };

        // Add search functionality - handle both string and numeric searches
        if (search && typeof search === 'string' && search.trim()) {
            const searchTerm = search.trim();
            
            // Try to convert search term to number for numeric fields
            const numericSearch = parseFloat(searchTerm);
            const isNumericSearch = !isNaN(numericSearch);
            
            query.$or = [
                // String fields - use regex
                { invoiceNumber: { $regex: searchTerm, $options: 'i' } },
                { invoiceType: { $regex: searchTerm, $options: 'i' } },
                
                // Numeric fields - use exact or range matching
                ...(isNumericSearch ? [
                    { 'bills.total': numericSearch },
                    { 'bills.tax': numericSearch },
                    { 'bills.totalWithTax': numericSearch },
                    { 'bills.payed': numericSearch }
                ] : [])
            ];
        }

        // Build sort options - handle nested fields like 'bills.total'
        const sortOptions = {};
        
        // Handle nested field sorting (e.g., 'bills.total')
        if (sortBy.includes('.')) {
            // For nested fields like 'bills.total'
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            // For regular fields
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        // Calculate pagination
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination and sorting
        const invoices = await Invoice.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const total = await Invoice.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            success: true,
            message: 'Supplier details fetched successfully',
            data: invoices,
            pagination: {
                currentPage: pageNum,
                totalPages: totalPages,
                totalItems: total,
                itemsPerPage: limitNum,
                hasNext: pageNum < totalPages,
                hasPrevious: pageNum > 1
            },
            filters: {
                search: search || '',
                sortBy: sortBy,
                sortOrder: sortOrder
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching supplier details',
            error: error.message
        });
    }
};


const updateInvoice = async (req, res, next) => {

    try {
        const { invoiceStatus, bills } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, 'Invalid ID !');
            return next(error);
        }

        const invoice = await Invoice.findByIdAndUpdate(
            id,
            { invoiceStatus, bills },
            { new: true }
        );

        if (!invoice) {
            const error = createHttpError(404, 'Invoice not found to update!');
            return next(error);
        }
        res.status(200).json({ success: true, message: 'Invoice updated', data: invoice })

    } catch (error) {
        next(error)
    }
};



module.exports = { 
    addInvoice, 
    getInvoices, 
    getInvoiceById, 
    updateInvoice, 
    getCustomerDetails, 
    getSupplierDetails 
};

