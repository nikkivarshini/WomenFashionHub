import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';

export const registerController =async(req,res)=>{
    try{
        const {name,email,password,phone,address,answer}=req.body;
        if(!name){
            return res.send({message:'Name is required'})
        }
        if(!email){
            return res.send({message:'Email is required'})
        }
        if(!password){
            return res.send({message:'password is required'})
        }
        if(!phone){
            return res.send({message:'phone number is required'})
        }
        if(!address){
            return res.send({message:'address is required'})
        }if(!answer){
            return res.send({message:'answer is required'})
        }
        const existingUser=await userModel.findOne({email:email})
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"Already Register please Login",
            })
        }
        const hashedPassword=await hashPassword(password)
        const user=await new userModel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer,
        }).save()
        res.status(201).send({
            success:true,
            message:"User Registered Successfully",
            user
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registration',error
        })
    }
};

//LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are required.",
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered.",
            });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid password.",
            });
        }

        // Generate JWT token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        console.log("Login successful. Token:", token);

        res.status(200).send({
            success: true,
            message: "Login successful.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:user.role
            },
            token,
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send({
            success: false,
            message: 'Error in login.',
            error
        });
    }
};

//forgotPassword Controller
export const forgotPasswordController= async(req,res)=>{
    try {
        const {email,answer,newPassword}=req.body
        if(!email){
            res.status(400).send({message:'Email is Required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is Required'})
        }
        if(!newPassword){
            res.status(400).send({message:'New Password is Required'})
        }
        //check
        const user= await userModel.findOne({email,answer})
        //validate
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong email or answer'
            })
        }
        const hashed=await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:'Password Reset Successdully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:FileSystemEntry,
            message:'Something went wrong',
            error
        })
    }
}

//test controller
export const testController=(req,res)=>{
    res.send('protected routes');
}

//update profile
export const updateProfileController=async(req,res)=>{
    try {
        const {name,email,password,phone,address}=req.body
        const user=await userModel.findById(req.user._id)
        if (password && password.length<6){
            return res.json({error:'password is required and 6 characters long'})
        }
        const hashedPassword= password ? await hashPassword(password):undefined
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
            name: name ||user.name,
            password: hashedPassword ||user.password,
            email: email ||user.email,
            phone: phone ||user.phone,
            address: address ||user.address,

        },{new:true})
        res.status(200).send({
            success:true,
            message:'Profile Updated',
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while updating profile',
            error
        })
    }
}

//orders
export const getOrdersController= async(req,res)=>{
    try {
        const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
        res.json(orders)
        } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            error
        })
    }
}

//get all orders
export const getAllOrdersController= async(req,res)=>{
    try {
        const orders = await orderModel
        .find({ })
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({createdAt: -1})
        res.json(orders)
        } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            error
        })
    }
}

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

        if (updatedOrder) {
            res.status(200).send({
                success: true,
                message: 'Order status updated successfully',
                order: updatedOrder
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Order not found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating order status'
        });
    }
};
