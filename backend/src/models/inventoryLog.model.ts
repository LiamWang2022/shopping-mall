import { Schema, model, Document, Types } from 'mongoose'

const InventoryLogSchema = new Schema({
  product:  { type: Types.ObjectId, ref: 'Product', required: true },
  delta:    { type: Number, required: true },                  // 正数加库存，负数减库存
  type:     { type: String, enum: ['sale','refund','manual'], required: true },
  operator: { type: Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export interface IInventoryLog extends Document {
  product: Types.ObjectId
  delta: number
  type: 'sale' | 'refund' | 'manual'
  operator?: Types.ObjectId
}

export const InventoryLog = model<IInventoryLog>('InventoryLog', InventoryLogSchema)