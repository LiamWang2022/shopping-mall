import { Schema, model, Document, Types } from 'mongoose'

const AddressSchema = new Schema({
  user:     { type: Types.ObjectId, ref: 'User', required: true },
  country:  { type: String, required: true },
  province: { type: String, required: true },
  city:     { type: String, required: true },
  detail:   { type: String, required: true },
  postcode: String,
  isDefault:{ type: Boolean, default: false }
})

export interface IAddress extends Document {
  user: Types.ObjectId
  country: string
  province: string
  city: string
  detail: string
  postcode?: string
  isDefault: boolean
}

export const Address = model<IAddress>('Address', AddressSchema)
