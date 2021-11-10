const User = require('../models/User');

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors( async (req, res, next)=>{
    const {name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: 'avatar_ehqcee',
            url: "https://res.cloudinary.com/dvsvjzdee/image/upload/v1636458747/avatar_ehqcee.jpg"
        }
    });


    sendToken(user, 200, res);    

    /*
    const token = user.getJwtToken();

    return res.status(201).json({
        success:true,
        token
    });*/
});

// Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next)=>{
    const {email, password} = req.body;

    // Checks if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password',400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid Email & Password',400));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email & Password',400));
    }

    sendToken(user, 200, res);    

});

exports.forgotPassword = catchAsyncErrors(async (req, res, next)=>{

    console.log("Forgot Password");
    const user = await User.findOne({ email: req.body.email });
    
    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    
    try{

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }
})

exports.resetPassword = catchAsyncErrors(async (req, res, next)=>{
    
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpiry: { $gt: Date.now() }
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400))
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;


    await user.save()

    sendToken(user, 200, res)
})

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

// Update / Change password   => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req.user.id).select('+password')

    //Checked Previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)

    if(!isMatched){
        return next(new ErrorHandler('Old password is Incorrect',400))
    }

    user.password = req.body.password
    await user.save();

    sendToken(user, 200, res);

})

// Update Profile   => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    console.log(newUserData);
    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true
    })

})

// Get all Users   => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success:true,
        users
    })
})

// Get user Detail   => /api/v1/admin/user/:id
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})

// Update user profile   => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    console.log(newUserData);
    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true
    })

})

// Update user profile   => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`,400))
    }

    // Remove avatar from couldinary avatar: TODO

    await user.remove();

    res.status(200).json({
        success:true
    })

})

// Logout user =>  /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next)=>{
    console.log("Request: Logout");
    res.cookie('token', null, {
        expire: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})