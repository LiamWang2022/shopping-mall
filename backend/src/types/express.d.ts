import { IUser } from '../models/user.model'
import { HydratedDocument } from 'mongoose'
import { IShop } from '../models/shop.model'

declare module 'express' {
  interface Request {
    user?: IUser
    shopId?: string
    shop?: IShop
  }
}