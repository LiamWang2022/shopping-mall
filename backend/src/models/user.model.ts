import { Schema, model, Document, Types } from "mongoose"

export type UserRole = 'buyer' | 'seller'

const UserSchema = new Schema(
    {
        email:    { type: String, required: true, unique: true, lowercase: true},
        password: { type: String, required: true},
        name:     { type: String, required: true},
        avatar:   String,
        roles:    { type: [String], enum: ['buyer', 'seller'], default: ['buyer'] },
        addresses:[{ type: Types.ObjectId, ref: 'Address' }]
    },
  { timestamps: true }
)

export interface IUser extends Document {
  email: string
  password: string
  name: string
  avatar?: string
  roles: UserRole[]
  addresses: Types.ObjectId[]
}

export const User = model<IUser>('User', UserSchema)