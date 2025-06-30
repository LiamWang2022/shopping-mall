import { Schema, model, Document, Types, isObjectIdOrHexString } from 'mongoose'
import { ref } from 'process'

const ShopSchema = new Schema(
  {
    name:        { type: String, required: true },
    description: String,
    owner:       { type: Types.ObjectId, ref: 'User', required: true },
    logo:        String,
    category:    {type: Types.ObjectId, ref:'ShopCategory'},
    ratingAvg:   { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true}
  },
  { timestamps: true }
)

export interface IShop extends Document {
  name: string
  description?: string
  owner: Types.ObjectId
  logo?: string
  ratingAvg: number
  isActive: boolean
}

export const Shop = model<IShop>('Shop', ShopSchema)