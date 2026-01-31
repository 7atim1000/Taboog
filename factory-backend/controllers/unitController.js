const Unit = require('../models/unitModel')

const addUnit = async (req, res, next) => {
    try {
        const { unitName } = req.body ;
        const unit = { unitName };

        const newUnit = Unit(unit);
        await newUnit.save();

        res.status(200).json({ status: true, message: 'Unit added to units menu ...', data: newUnit })

    } catch (error) {
        next(error) ;
    }
};

const updateUnit = async (req, res, next) => {
    try {
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }

        const { id } = req.params;
        const { unitName } = req.body;

        // Validate required fields
        if (!unitName) {
            return res.status(400).json({
                success: false,
                message: 'Unit name is required'
            });
        }

        const updateData = {
            unitName,
        };

        const updatedUnit = await Unit.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUnit) {
            return res.status(404).json({
                success: false,
                message: 'Unit not found'
            });
        }

        res.json({
            success: true,
            message: 'Unit updated successfully',
            unit: updatedUnit
        });
    } catch (error) {
        console.log('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const getUnits = async(req, res, next) => {
    try {
        const units = await Unit.find();
        res.status(200).json({ message: 'All units fetched successfully', success:true, units, data: units })

    } catch (error) {
        next(error)
    }
}

const removeUnit = async(req, res, next) => {
    try {

        await Unit.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Unit removed Successfully' })
        
    } catch (error) {
        next(error)
    }
}


module.exports = { addUnit, getUnits, removeUnit, updateUnit };