const Supplier = require("../models/supplierModel");
const { mongoose } = require('mongoose');


const addSupplier = async (req, res, next) => {

    try {
        const { supplierName, email, contactNo, address, balance } = req.body;

        const isSupplierPresent = await Supplier.findOne({ email });
        if (isSupplierPresent) {
            res.status(200).json({ success: true, message: 'This supplier already exist' })

        } else {
            const supplier = { supplierName, email, contactNo, address, balance };
            const newSupplier = Supplier(supplier)
            await newSupplier.save();

            res.status(200).json({ success: true, message: 'New supplier added Successfully', data: newSupplier })
        }

    } catch (error) {
        next(error)
    }
};


const updateSupplier = async (req, res, next) => {
    try {
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }

        const { id } = req.params;
        const { supplierName, email, contactNo, address, balance } = req.body;

        // Validate required fields
        if (!supplierName) {
            return res.status(400).json({
                success: false,
                message: 'Supplier name is required'
            });
        }

        const updateData = {
            supplierName,
            email: email || '',
            contactNo: contactNo || '',
            address: address || '',
            balance: balance || 0,
        };

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }

        res.json({
            success: true,
            message: 'Supplier updated successfully',
            supplier: updatedSupplier
        });
    } catch (error) {
        console.log('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getSuppliers = async (req, res, next) => {
    try {
        const { search, sort = '-createdAt', page = 1, limit = 10 } = req.body;

        // Build query object
        const query = {};
        if (search) {
            query.$or = [
                { supplierName: { $regex: search, $options: 'i' } },
                { contactNo: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortOption = { createdAt: -1 }; // Default sort

        if (sort === 'createdAt') {
            sortOption = { createdAt: 1 };

        } else if (sort === 'supplierName') {
            sortOption = { supplierName: 1 };

        } else if (sort === '-supplierName') {
            sortOption = { supplierName: -1 };

        } else if (sort === 'balance') {
            sortOption = { balance: 1 };
        }

        // Calculate pagination values
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const startIndex = (pageNum - 1) * limitNum;

        const total = await Supplier.countDocuments(query);

        // Get paginated results
        const suppliers = await Supplier.find(query)
            .sort(sortOption)
            .skip(startIndex)
            .limit(limitNum);

        // Response
        res.status(200).json({
            message: 'Suppliers fetched successfully',
            success: true,
            suppliers,
            pagination: {
                currentPage: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({
            message: 'Error fetching suppliers',
            success: false,
            error: error.message
        });
    }
};

const removeSupplier = async (req, res, next) => {
    try {

        await Supplier.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Selected supplier removed Successfully .' })

    } catch (error) {

    }
}


const updateSupplierBalance = async (req, res, next) => {

    try {

        const { balance } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid Id");
            return next(error);
        };

        const supplier = await Supplier.findByIdAndUpdate(
            id,

            { balance },
            { new: true }
        );

        if (!supplier) {
            const error = createHttpError(404, 'Supplier is not Exist!');
            return error;
        }

        res.status(200).json({ success: true, message: 'Supplier balance updated successfully..', data: supplier })

    } catch (error) {
        next(error)
    }

}


module.exports = { addSupplier, getSuppliers, removeSupplier, updateSupplierBalance, updateSupplier }