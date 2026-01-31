const Customers = require('../models/customerModel')
const { mongoose } = require('mongoose') ;

const addCustomer = async(req, res, next) => {
    
    try {
        const { customerName , email, contactNo, address , balance } = req.body ;
    
        const isCustomerPresent = await Customers.findOne({email});
        if(isCustomerPresent) {
            res.status(200).json({ success :true, message :'This customer already exist'})
        } else{
            
            const customer = { customerName , email, contactNo, address, balance } ;
        
            const newCustomer = Customers(customer);
            await newCustomer.save();

            res.status(201).json({ success: true, message: 'New customer added Successfully', data: newCustomer });
        }
    

    } catch (error) {
        next(error)
    }
};

const updateCustomer = async (req, res, next) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Request body is missing' 
      });
    }

    const { id } = req.params;
    const { customerName, email, contactNo, address, balance } = req.body;
    
    // Validate required fields
    if (!customerName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Customer name is required' 
      });
    }

    const updateData = {
      customerName,
      email: email || '',
      contactNo: contactNo || '',
      address: address || '',
      balance: balance || 0,
    };

    const updatedCustomer = await Customers.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Customer updated successfully', 
      customer: updatedCustomer 
    });
  } catch (error) {
    console.log('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getCustomers = async (req, res, next) => {
    try {
        const { search, sort = '-createdAt', page = 1, limit = 10 } = req.body;
        
        // Build query object
        const query = {};
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { contactNo: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortOption = { createdAt: -1 }; // Default sort

        if (sort === 'createdAt') {
            sortOption = { createdAt: 1 };

        } else if (sort === 'customerName') {
            sortOption = { customerName: 1 };

        } else if (sort === '-customerName') {
            sortOption = { customerName: -1 };
            
        } else if (sort === 'balance') {
            sortOption = { balance: 1 };
        }

        // Calculate pagination values
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const startIndex = (pageNum - 1) * limitNum;
        
        const total = await Customers.countDocuments(query);

        // Get paginated results
        const customers = await Customers.find(query)
            .sort(sortOption)
            .skip(startIndex)
            .limit(limitNum);

        // Response
        res.status(200).json({
            message: 'Customers fetched successfully',
            success: true,
            customers,
            pagination: {
                currentPage: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            message: 'Error fetching customers',
            success: false,
            error: error.message
        });
    }
};



const removeCustomer = async(req, res, next) => {
    try {
        await Customers.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Selected customer removed Successfully .' })
        
    } catch (error) {
        
    }
}



const updateCustomerBalance = async (req, res, next) => {
   
    try {

        const { balance } = req.body;
        const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)){
            const error = createHttpError(404, "Invalid Id");
            return next(error);
        };

        const customer = await Customers.findByIdAndUpdate(
            id,
            
            { balance },
            { new : true }
        );

       
        if (!customer) {
            const error = createHttpError(404, 'Customer is not Exist!');
            return error;
        }

        res.status(200).json({ success: true, message: 'Customer balance updated successfully..', data: customer })
        
    } catch (error) {
        next(error)
    }

}


module.exports = { addCustomer, getCustomers, removeCustomer, updateCustomerBalance, updateCustomer }