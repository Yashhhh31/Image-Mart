import { Schema, model, models } from "mongoose";
import type { ImageVariant, IProduct } from "@/lib/product-types";
export { IMAGE_VARIANT_TYPES } from "@/lib/product-types";
export type { ImageVariant, ImageVariantType, IProduct } from "@/lib/product-types";

const imageVariantSchema = new Schema<ImageVariant>({
    type: {
        type: String,
        required: [true, "Please provide a type for the image variant"],
        enum: ["SQUARE", "PORTRAIT", "LANDSCAPE"],
    },
    price: {
        type: Number,
        required: [true, "Please provide a price for the image variant"],
        min: [0, "Price should be a positive number"],
    },
    license: {
        type: String,
        required: [true, "Please provide a license for the image variant"],
        enum: ["PERSONAL", "COMMERCIAL"],
    },
});

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, "Please provide a name for the product"],
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description for the product"],
    },
    imageUrl: {
        type: String,
        required: [true, "Please provide an image URL for the product"],
    },
    variants: [imageVariantSchema],
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {timestamps: true});

const Product = models.Product || model("Product", ProductSchema);

export default Product;