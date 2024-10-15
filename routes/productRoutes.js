import express from 'express'
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js';
import { CreateProductController, 
    braintreePaymentController, 
    braintreeTokenController, 
    deleteProductController, 
    getProductController, 
    getSingleProductController, 
    productCategoryController, 
    productCountController, 
    productFilterController, 
    productListController, 
    productPhotoController, 
    relatedProductController, 
    searchProductController, 
    updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router = express.Router();

//routes
//create-product
router.post('/create-product',requireSignin,isAdmin,formidable(),CreateProductController)

//update product
router.put('/update-product/:pid',requireSignin,isAdmin,formidable(),updateProductController)

//get products
router.get('/get-product',getProductController)

//single product
router.get('/get-product/:slug',getSingleProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid',deleteProductController);

//filter product
router.post('/product-filters',productFilterController);

//product count
router.get('/product-count',productCountController);

//product per page
router.get('/product-list/:page',productListController);

//search product
router.get('/search/:keyword',searchProductController);

//similar product
router.get('/related-product/:pid/:cid',relatedProductController);

//category wise product
router.get('/product-category/:slug',productCategoryController);

//payment gateway
//token
router.get('/braintree/token',braintreeTokenController);

//payment
router.post('/braintree/payment',requireSignin,braintreePaymentController);


export default router