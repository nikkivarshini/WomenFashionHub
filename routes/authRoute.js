import express from 'express'
import {registerController,loginController,testController,forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js'
const router=express.Router()
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js';

//register
router.post('/register',registerController);

//login
router.post('/login',loginController);

//forgot password
router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSignin,isAdmin,testController);

//protected User route auth
router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true});
})

//protected Admin route auth
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

//update profile
router.put('/profile',requireSignin,updateProfileController);

//orders
router.get('/orders',requireSignin,getOrdersController);

//all-orders
router.get('/all-orders',requireSignin,isAdmin,getAllOrdersController);

//order status
router.put('/order-status/:orderId',requireSignin,isAdmin,orderStatusController)
export default router;