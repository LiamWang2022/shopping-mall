import { Schema, model, Document, Types } from 'mongoose'

const PaymentSchema = new Schema(
  {
    order:      { type: Types.ObjectId, ref: 'Order', required: true },
    provider:   { type: String, required: true },          // 'stripe' / 'paypal' …
    providerId: { type: String, required: true },
    status:     { type: String, enum: ['pending','succeeded','failed'], default: 'pending' },
    amount:     { type: Number, required: true }
  },
  { timestamps: true }
)

export interface IPayment extends Document {
  order: Types.ObjectId
  provider: string
  providerId: string
  status: string
  amount: number
}

export const Payment = model<IPayment>('Payment', PaymentSchema)