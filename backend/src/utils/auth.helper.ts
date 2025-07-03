import { Request, Response } from 'express'
import { Shop } from '../models/shop.model'
import { Product } from '../models/product.model'

export const getUserIdOrFail = (req: Request, res: Response): string | undefined => {
  if (!req.user) {
    res.status(401).json({ message: 'User not logged in' })
    return
  }
  return req.user._id.toString()
}

export const findOwnedProduct = async (productId: string, userId: string) => {
  const shop = await Shop.findOne({ owner: userId }).exec()
  if (!shop) return null
  const product = await Product.findOne({ _id: productId, shop: shop._id }).exec()
  return product
}

export const findOwnedShop = async (shopId: string, userId: string) => {
  return await Shop.findOne({ _id: shopId, owner: userId }).exec()
}