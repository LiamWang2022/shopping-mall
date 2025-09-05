import { Schema, model, Document, Types } from 'mongoose'

const ImageSchema = new Schema({
  url: { type: String, trim: true},
  alt: { type: String, trim: true }
})

const ProductSchema = new Schema(
  {
    display_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
      index: true
    },
    price:{
      type: Number,
      required: true,
      min: 0
    },
    images:       {
      type: [ImageSchema], 
      default: [],
      validate: {
        validator: (arr: any[]) => Array.isArray(arr) && arr.length <= 20, // 防止超长
        message: 'Too many images',
      },
    },
    stock_count: {
      type: Number,
      required: true,
      min: 0,
      validate:{
        validator: Number.isInteger,
        message: 'Stock count must be an integer',
      },
    },
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    category: {
      type: Types.ObjectId,
      ref: 'ProductCategory',
      index: true,
    },
    colour: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000
    },
  },
  { timestamps: true, }
)

ProductSchema.index({ isActive: 1, createdAt: -1 })

ProductSchema.index({ shop: 1, createdAt: -1 })

ProductSchema.index({ isActive: 1, category: 1, price: 1 })

export interface IProduct extends Document {
  display_name: string
  price: number
  images: { url?: string; alt?: string }[]
  stock_count: number
  shop: Types.ObjectId
  isActive: boolean
  category?: Types.ObjectId
  colour?: string
  description?: string
}
export const Product = model<IProduct>('Product', ProductSchema)