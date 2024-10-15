import express from 'express'
const router=express.Router()
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';
import { isAdmin, requireSignin } from '../middlewares/authMiddleware.js';

//routes
//create category
router.post('/create-category',requireSignin,isAdmin,createCategoryController);

//update category
router.put('/update-category/:id',requireSignin,isAdmin,updateCategoryController)

//get all category
router.get('/get-category', categoryController)

//get single category
router.get('/single-category/:slug', singleCategoryController)

//delete category
router.delete('/delete-category/:id',requireSignin,isAdmin,deleteCategoryController)

export default router