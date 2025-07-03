import { Schema, model, Document, Types } from "mongoose"
import bcrypt from 'bcrypt'
export type UserRole = 'buyer' | 'seller'

const UserSchema = new Schema(
    {
        email:      { type: String, required: true, unique: true, lowercase: true },
        password:   { type: String, required: true, minlength: 6 },
        name:       { type: String, required: true },
        avatar:     String,
        roles:      { type: [String], enum: ['buyer', 'seller'], default: ['buyer'] },
        activeRole: {type: String, enum: ['buyer', 'seller'], default: 'buyer' },
        addresses:  [{ type: Types.ObjectId, ref: 'Address' }],
        isActive:   { type: Boolean, required: true, default: true }
    },
  { timestamps: true }
)

export interface IUser extends Document {
  email: string
  password: string
  name: string
  avatar?: string
  roles: UserRole[]
  activeRole: UserRole
  addresses: Types.ObjectId[]
  isActive: boolean
  comparePassword: (candidatePassword: string) => Promise<boolean>
}

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password)
}


export const User = model<IUser>('User', UserSchema)