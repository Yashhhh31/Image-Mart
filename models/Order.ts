import mongoose, { Schema, model, models } from "mongoose";
import { ImageVariant } from "./Product";

interface populatedUser {
    _id: mongoose.Types.ObjectId;
    email: string;
}

interface populatedProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    imageUrl: string;
}

export interface IOrder {
    userId: mongoose.Types.ObjectId | populatedUser;
    productId: mongoose.Types.ObjectId | populatedProduct;
    _id?: mongoose.Types.ObjectId;
    variant: ImageVariant;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    status: "PENDING" | "PAID" | "FAILED";
    downLoadUrl?: string;
    previewUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    variant: {
        type: {
            type: String,
            required: true,
            enum: ["SQUARE", "PORTRAIT", "LANDSCAPE"],
        },

        price: {
            type: Number,
            required: true,
        },
        license: {
            type: String,
            required: true,
            enum: ["PERSONAL", "COMMERCIAL"],
        },
    },

    razorpayOrderId: {
        type: String,
        required: true, 
    },
    razorpayPaymentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true, 
    },
    status: {
        type: String,
        required: true,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
    },

    downLoadUrl: {
        type: String,
    },

    previewUrl: {
        type: String,
    }
}, { timestamps: true });

const Order = models.Order || model("Order", OrderSchema);

export default Order;
