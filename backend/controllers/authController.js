const User = require('../models/User');

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require("../utils/sendEmail");

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

    const user = await User.findOne({ email: req.body.email });
    
    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    console.log(`User: ${user}`);

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\nIf you have not requested this email, then ignore it.`;
    
    try{

        await SendEmail({
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