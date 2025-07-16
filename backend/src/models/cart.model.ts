import { Schema, model, Document, Types } from 'mongoose'

const CartItemSchema = new Schema({
  product:  { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
})

const CartSchema = new Schema(
  {
    buyer:  { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] }
  },
  { timestamps: true }
)

export interface ICartItem {
  product: Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  buyer: Types.ObjectId
  items: ICartItem[]
}

export const Cart = model<ICart>('Cart', CartSchema)