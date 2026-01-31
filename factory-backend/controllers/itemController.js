const { mongoose } = require('mongoose');
const Item = require('../models/itemmodel');

// const addItem = async (req, res, next) => {
   
//     try {

//     const { itemName, price, qty, unit } = req.body ;
    
//     if (!itemName) {
//         res.status(400).json({ status: false, message: 'Please privide item name' })
//     }

//     const isItemPresent = await Item.findOne({ itemName });
//     if (isItemPresent) {
//         res.status(400).json({ status: false, message: 'Item is already exist' });
//     } else {

//         const item = { 
//             itemName , 
//             price ,
//             qty ,
//             unit 
//         };
//         const newItem = Item(item);
//         await newItem.save();

//         res.status(200).json({ status: true, message: 'Item added Successfully', data: newItem })

//     }

//     } catch (error) {
//        next(error)    
//     }
// };

const addItem = async (req, res, next) => {
    try {
        const { itemName, price, qty, unit } = req.body;

        // Validate all required fields
        if (!itemName || !price || !qty || !unit) {
            return res.status(400).json({ 
                status: false, 
                message: 'Please provide all required fields: itemName, price, qty, and unit' 
            });
        }

        // Validate data types
        if (isNaN(price) || isNaN(qty)) {
            return res.status(400).json({ 
                status: false, 
                message: 'Price and quantity must be numbers' 
            });
        }

        // Check if item already exists (case insensitive)
        const isItemPresent = await Item.findOne({ 
            itemName: { $regex: new RegExp(`^${itemName}$`, 'i') } 
        });
        
        if (isItemPresent) {
            return res.status(400).json({ 
                status: false, 
                message: 'Item already exists' 
            });
        }

        // Create new item
        const newItem = new Item({
            itemName,
            price: parseFloat(price),
            qty: parseFloat(qty),
            unit
        });

        // Save to database
        await newItem.save();

        // Return success response
        return res.status(200).json({ 
            status: true, 
            message: 'Item added success  ', 
            data: newItem 
        });

    } catch (error) {
        // Handle specific database errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: false,
                message: 'Validation error',
                error: error.message
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                status: false,
                message: 'Item already exists (duplicate key error)'
            });
        }
        
        // Pass other errors to the error handling middleware
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }

        const { id } = req.params;
        const { itemName, price, qty, unit } = req.body;

        // Validate required fields
        if (!itemName) {
            return res.status(400).json({
                success: false,
                message: 'Item name is required'
            });
        }

        const updateData = {
            itemName ,
            price ,
            qty ,
            unit
        };

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item updated successfully',
            item: updatedItem
        });
    } catch (error) {
        console.log('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//exports.updateQuantities = async (req, res) => {
const updateBuyQuantities = async(req, res) => {  
    try {
    const { items } = req.body;
    for (const { id, quantity } of items) {
      await Item.findByIdAndUpdate(id, { $inc: { qty: +quantity } }); // subtract purchased qty
    }
    res.status(200).json({ success: true, message: 'Quantities updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeItem = async(req, res, next) => {
    try {
        await Item.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Item removed Successfully' })
        
    } catch (error) {
        
    }
};


const getItems = async (req, res, next) => {
    
    try {
            
      const { search, sort = '-createdAt', page = 1, limit = 10 } = req.body;

      const query = {
       
        ...(search && {
          $or: [
          
            { itemName: { $regex: search, $options: 'i' } }
          ]
        })
      };

      let sortOption = {};
      if (sort === '-createdAt') {
        sortOption = { createdAt: -1 }; // Newest first
      } else if (sort === 'createdAt') {
        sortOption = { createdAt: 1 }; // Oldest first

      } else if (sort === 'itemName') {
        sortOption = { itemName: 1 }; // A-Z
      } else if (sort === '-itemName') {
        sortOption = { itemName: -1 }; // Z-A

      } 

      // Calculate pagination values
      const startIndex = (page - 1) * limit;
      // const endIndex = page * limit;
      const total = await Item.countDocuments(query);

      // Get paginated results
      const items = await Item.find(query)

        .sort(sortOption)
        .skip(startIndex)
        .limit(limit)

      res.status(200).json({
        message: 'All items fetched successfully',
        success: true,
        data: items,
        items,

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


module.exports = { 
    addItem ,
    updateItem ,
    getItems ,
    removeItem,
    updateBuyQuantities
}