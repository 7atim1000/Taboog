const Category = require('../models/categoryModel');

const addCategory = async (req, res, next) => {
   
    try {

    const { categoryName } = req.body ;
    
    if (!categoryName) {
        res.status(400).json({ status: false, message: 'Please privide category name' })
    }

    const isCategoryPresent = await Category.findOne({ categoryName });
    if (isCategoryPresent) {
        res.status(400).json({ status: false, message: 'Category is already exist' });
    } else {

        const category = { categoryName };
        const newCategory = Category(category);
        await newCategory.save();

        res.status(200).json({ status: true, message: 'Category added Successfully', data: newCategory })

    }

    //const newCategory = new Category({ name });
    //await newCategory.save();

    } catch (error) {
       next(error)    
    }
};

const updateCategory = async (req, res, next) => {
    try {
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }

        const { id } = req.params;
        const { categoryName } = req.body;

        // Validate required fields
        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const updateData = {
            categoryName,
        };

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        console.log('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ message: 'All categories fetched successfully', success:true, categories, data: categories })
    } catch (error) {
        next(error)
    }
}


const removeCategory = async(req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Category removed Successfully' })
        
    } catch (error) {
        
    }
}


module.exports = { addCategory, getCategories, removeCategory, updateCategory };