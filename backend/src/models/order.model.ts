import { Schema, model, Document, Types } from 'mongoose'

const OrderItemSchema = new Schema({
  product:  { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true }
})

const OrderSchema = new Schema(
  {
    buyer:    { type: Types.ObjectId, ref: 'User', required: true },
    shop:     { type: Types.ObjectId, ref: 'Shop', required: true },
    items:    { type: [OrderItemSchema], required: true },
    total:    { type: Number, required: true },
    status:   { type: String, enum: ['pending','paid','shipped','completed','cancelled'], default: 'pending' },
    address:  { type: Types.ObjectId, ref: 'Address', required: true },
    paymentId:{ type: Types.ObjectId, ref: 'Payment' }
  },
  { timestamps: true }
)

export interface IOrderItem {
  product: Types.ObjectId
  quantity: number
  price: number
}

export interface IOrder extends Document {
  buyer: Types.ObjectId
  shop: Types.ObjectId
  items: IOrderItem[]
  total: number
  status: string
  address: Types.ObjectId
  paymentId?: Types.ObjectId
}

export const Order = model<IOrder>('Order', OrderSchema)