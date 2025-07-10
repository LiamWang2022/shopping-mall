import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { Shop } from '../models/shop.model'
import { getUserIdOrFail } from '../utils/auth.helper'

export const requireShopAccess = async (req: Request, res: Response, next: NextFunction) => {
  const shopId = req.query.shopId || req.params.shopId || req.body.shopId

  if (!shopId || typeof shopId !== 'string' || !Types.ObjectId.isValid(shopId)) {
    res.status(400).json({ message: 'Invalid or missing shop ID' })
    return
  }

  const userId = getUserIdOrFail(req)

  const shop = await Shop.findOne({ _id: shopId, owner: userId })
  if (!shop) {
    res.status(403).json({ message: 'Access denied: You do not own this shop' })
    return
  }

  req.shopId = shopId
  req.shop = shop
  next()
}