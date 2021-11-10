const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/APIFeatures");

// Create new Product => /api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
})

// Get all Products => /api/v1/products
exports.getProducts = async (req, res, next)=>{

    const resPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
                .search()
                .filter()
                .pagination(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
        success:true,
        count: products.length,
        productCount,
        products
    });
}

//Get sigle Product Detail => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next)=>{
 
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }

    res.status(200).json({
        success:true,
        product
    });
})

//Update Product => /api/v1/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next)=>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        product
    });
})

//Delete product => /api/v1/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product is deleted."
    });
})