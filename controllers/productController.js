import slugify from "slugify";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import categoryModel from '../models/categoryModel.js';
import fs from 'fs';
import braintree from "braintree";
import dotenv from 'dotenv';

dotenv.config();


//payment gateway
try {
    var gateway = new braintree.BraintreeGateway({
        environment: braintree.Environment.Sandbox,
        merchantId: process.env.BRAINTREE_MERCHANT_ID,
        publicKey: process.env.BRAINTREE_PUBLIC_KEY,
        privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    });
} catch (err) {
    console.error('Error setting up Braintree gateway:', err);
}


export const CreateProductController =async (req,res)=>{
    try {
        const {name,description,price,category,quantity}=req.fields;
        const {photo}=req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'Description is required'})
            case !price:
                return res.status(500).send({error:'Price is required'})
            case !category:
                return res.status(500).send({error:'Category is required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required'})
            case photo && photo.size>1000000:
                return res.status(500).send({error:'photo is required and should be less than 1mb'})
        }

        const products =await new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
        }
        await products.save();
        res.status(200).send({
            success:true,
            message:'Product Created Successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while creating Product',
            error
        })
    }
}

//get products
export const getProductController= async (req,res)=>{
    try {
        const products=await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            countTotal:products.length,
            message:'All Products',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:true,
            message:'Error while getting products',
            error:error.message
        })
    }
}

//get single product
export const getSingleProductController= async (req,res)=>{
    try {
        const product= await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category')
        res.status(200).send({
            success:true,
            message:'Single product fetched',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error While getting single product',
            error
        })
    }
}

//get photo
export const productPhotoController =async(req,res)=>{
    try {
        const product= await productModel.findById(req.params.pid).select('photo');
        if(product.photo.data){
            res.set('content-type',product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while fetching product photo',
            error
        })
    }
}

//delete product
export const deleteProductController = async (req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo')
        res.status(200).send({
            success:true,
            message:'Product deleted successfully',

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error:'Error while deleting product',
            error
        })
    }
}

//update product
export const updateProductController =async(req,res)=>{
    try {
        const {name,description,price,category,quantity}=req.fields;
        const {photo}=req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'Description is required'})
            case !price:
                return res.status(500).send({error:'Price is required'})
            case !category:
                return res.status(500).send({error:'Category is required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required'})
            case photo && photo.size>1000000:
                return res.status(500).send({error:'photo is required and should be less than 1mb'})
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)},
            {new:true}
        )
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
        }
        await products.save();
        res.status(200).send({
            success:true,
            message:'Product Updated Successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while Updating Product',
            error
        })
    }
}

//product filter
export const productFilterController = async (req, res) => {
    try {
      const { checked = [], radio = [] } = req.body;
  
      let args = {};
  
      if (checked.length > 0) args.category = checked;
      if (radio.length ) args.price = { $gte: radio[0], $lte: radio[1] };
      const products = await productModel.find(args);
  
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: 'Error while filtering products',
        error,
      });
    }
  };

//product count
export const productCountController =async(req,res)=>{
    try {
        const total=await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'error in product count',
            error
        })
    }
}

//product list based on page
export const productListController =async(req,res)=>{
    try {
        const perPage=6;
        const page=req.params.page? req.params.page:1
        const products=await productModel.find({}).select('-photo').skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'error in per page',
            error
        })
    }
}

//search product
export const searchProductController =async(req,res)=>{
    try {
        const {keyword}=req.params
        const results=await productModel.find({
            $or:[
                {name:{$regex:keyword,$options:'i'}},
                {description:{$regex:keyword,$options:'i'}},
            ]
        }).select('-photo');
        res.json(results)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while searching product',
            error
        })
    }
}

//related product
export const relatedProductController =async(req,res)=>{
    try {
        const {pid,cid}= req.params
        const products=await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select('-photo').limit(3).populate("category")
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error while fetching related Products',
            error
        })
    }
}

//category wise product
export const productCategoryController =async(req,res)=>{
    try {
        const category=await categoryModel.findOne({slug:req.params.slug})
        const products=await productModel.find({category}).populate('category')
        res.status(200).send({
            success:true,
            category,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:'Error while fetching cat wise product'
        })
    }
}

//payment gatway
//token
export const braintreeTokenController=async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//payments
export const braintreePaymentController=async(req,res)=>{
    try {
       const {cart,nonce}=req.body 
       let total=0
       cart.map((i)=>{
        total+=i.price})
        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(error,result){
            if(result){
                const order= new orderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id,
                }).save()
                res.json({ok:true})
            }else{
                res.status(500).send(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
