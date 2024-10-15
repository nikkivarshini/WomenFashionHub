// cartModel.js

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    photo: {
        data:Buffer,
        contentType:String
    }
},{timestamps:true});



export default mongoose.model('Cart', cartItemSchema);
