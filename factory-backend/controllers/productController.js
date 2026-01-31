const { mongoose } = require('mongoose');
const Product = require('../models/productModel');
const cloudinary = require('cloudinary').v2;

const addProduct = async (req, res, next) => {
  try {
    const { productName, price, qty, unit } = req.body;
    const imageFile = req.file;

    if (!productName || !price ||!qty || !unit) {
      return res.json({ success: false, message: 'Missing Details' });
    }

     // Check if service with the same serviceName already exists
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return res.json({ success: false, message: 'Product with this name already exists' });
    }


    let imageUrl;
    if (imageFile) {
      // upload image to cloudinary if file exists
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    const product = {
       productName,
       price,
       qty,
       unit,
    };

    if (imageUrl) {
      product.image = imageUrl;
    }

    const newProduct = new Product(product);
    await newProduct.save();

    res.json({ success: true, message: 'New Product Added', data: newProduct });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productName, price,  qty, unit } = req.body;
    let imageUrl;

    // If a new image was uploaded
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    const updateData = {
    
      productName,
      price,
    
      qty,
      unit
    };

    // Only add image to update if a new one was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res, next) => {
    
    try {
            
      const { search, sort = '-createdAt', page = 1, limit = 10 } = req.body;

      const query = {
       
        ...(search && {
          $or: [
          
            { productName: { $regex: search, $options: 'i' } }
          ]
        })
      };

      let sortOption = {};
      if (sort === '-createdAt') {
        sortOption = { createdAt: -1 }; // Newest first
      } else if (sort === 'createdAt') {
        sortOption = { createdAt: 1 }; // Oldest first

      } else if (sort === 'productName') {
        sortOption = { productName: 1 }; // A-Z
      } else if (sort === '-productName') {
        sortOption = { productName: -1 }; // Z-A

      } 

      // Calculate pagination values
      const startIndex = (page - 1) * limit;
      // const endIndex = page * limit;
      const total = await Product.countDocuments(query);

      // Get paginated results
      const products = await Product.find(query)

        .sort(sortOption)
        .skip(startIndex)
        .limit(limit)

      res.status(200).json({
        message: 'All products fetched successfully',
        success: true,
        data: products,
        products,

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


const removeProduct = async(req, res, next) => {
    try {

        await Product.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Selected product removed Successfully' })
    
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message });
    }

};

const updateProductionQuantities = async(req, res) => {  
    try {
    const { product } = req.body;
    for (const { id, quantity } of product) {
      await Product.findByIdAndUpdate(id, { $inc: { qty: +quantity } }); // subtract purchased qty
    }
    res.status(200).json({ success: true, message: 'Quantities updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSaleQuantities = async(req, res) => {  
    try {
    const { product } = req.body;
    for (const { id, quantity } of product) {
      await Product.findByIdAndUpdate(id, { $inc: { qty: -quantity } }); // subtract purchased qty
    }
    res.status(200).json({ success: true, message: 'Quantities updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { 
    addProduct, 
    getProducts, 
    removeProduct, 
    updateProductionQuantities, 
    updateSaleQuantities 
  , updateProduct
}