import { Request, Response } from 'express'
import { Shop } from '../models/shop.model'
import { Product } from '../models/product.model'
import { Order } from '../models/order.model'
import { User } from '../models/user.model'
export const getUserIdOrFail = (req: Request): string | undefined => {
  if (!req.user) {
    throw new Error('User not logged in')
  }
  return req.user._id.toString()
}

export const findOwnedProduct = async (productId: string, userId: string) => {
  const shop = await Shop.findOne({ owner: userId }).exec()
  if (!shop) return null
  const product = await Product.findOne({ _id: productId, shop: shop._id }).exec()
  return product
}

//migrated logic to middleware/requireShopAccess.ts
// export const findOwnedShop = async (shopId: string, userId: string) => {
//   const shop = await Shop.findOne({ _id: shopId, owner: userId }).exec()
//   if(!shop){
//     throw new Error('You do not have a shop or you can not access this shop')
//   }
//   return shop
// }

export const canAccessOrder = async (orderId: string, userId: string) => {
  const order = await Order.findById(orderId)
  if (!order) {
    throw new Error('Order not found')
  }
  const shop = await Shop.findById(order.shop)
  const isBuyer = order.buyer.equals(userId)
  const isSeller = shop && shop.owner.equals(userId)
  if(isBuyer && isSeller){
    throw new Error('User is not authorized to view this order')
  }
  const role = isBuyer? 'buyer' : 'seller'
  return {order, role}
}