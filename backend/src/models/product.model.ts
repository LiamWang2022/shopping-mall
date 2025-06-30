import { Schema, model, Document, Types } from 'mongoose'

const ImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String, required: true }
})

const ProductSchema = new Schema(
  {
    display_name: { type: String, required: true },
    price:        { type: Number, required: true },
    images:       { type: [ImageSchema], required: true },
    stock_count:  { type: Number, required: true },
    shop:         { type: Types.ObjectId, ref: 'Shop', required: true },
    isActive:     { type: Boolean, default: true },
    category:     { type: Types.ObjectId, ref: 'ProductCategory' },
    colour:       String,
    description:  String
  },
  { timestamps: true }
)

export interface IProduct extends Document {
  display_name: string
  price: number
  images: { url: string; alt: string }[]
  stock_count: number
  shop: Types.ObjectId
  isActive: boolean
  category?: Types.ObjectId
  colour?: string
  description?: string
}
export const Product = model<IProduct>('Product', ProductSchema)