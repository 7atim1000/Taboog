const createHttpError = require('http-errors');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const cloudinary = require('cloudinary').v2;

const register = async(req, res, next) => {
    
    try{
        
        const { name, phone, email, password } = req.body;
        const imageFile = req.file;
        
        if (!name || !phone || !email || !password ) {
            const error = createHttpError(400, 'All fields are required !');
            return next(error);
        }

        const isUserPresent = await User.findOne({email})
        if (isUserPresent) {
            const error = createHttpError(400, 'User already exist !');
            return next(error);
        }

        // Upload image to Cloudinary optional 
        let imageUrl;
        if (imageFile) {
            // upload image to cloudinary if file exists
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const user = { name, phone, email, password };

        if (imageUrl) {
            user.image = imageUrl;
        }

        const newUser = User(user);
        await newUser.save();

        res.status(201).json ({ message: 'New user created successfully .', data: newUser});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};





const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = createHttpError(400, 'All fields are required !');
            return next(error);
        }

        const isUserPresent = await User.findOne({ email });
        if (!isUserPresent) {
            const error = createHttpError(400, 'Invalid Credentials');
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, isUserPresent.password);
        if (!isMatch) {
            const error = createHttpError(400, 'Invalid Credentials');
            return next(error);
        }

        // jsonwebtoken
        const accessToken = jwt.sign({ _id: isUserPresent._id }, config.accessTokenSecret, {
            expiresIn: '10d'
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        res.status(200).json({
            success: true, message: 'User login successfully ...',
           
            data: {
                _id: isUserPresent._id,
                name: isUserPresent.name,
                phone: isUserPresent.phone,
                adress: isUserPresent.address,
                email: isUserPresent.email,
                role: isUserPresent.role,
            },

            accessToken
        });

    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        let imageUrl;


        // If a new image was uploaded
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const updateData = { name , email };
        // Only hash and add password if it was provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Only add image to update if a new one was uploaded
        if (imageUrl) {
            updateData.image = imageUrl;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Return updated doc and run validators
        ).select('-password'); // Exclude password from the returned user data

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({ success: true, message: 'Profile Updated Successfully', user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getUserData = async (req, res, next) => {

    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
};


const logout = async (req, res, next) => {
    try {
        // Clear the cookie
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true  // Must be true if sameSite is none
        });

        res.status(200).json({
            success: true,
            message: "User logout successfully ..."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getUserData, logout, updateProfile }



