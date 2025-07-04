import { Request, Response } from "express";
import { Shop } from "../models/shop.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { error } from "console";
import { getUserIdOrFail, findOwnedShop } from "../utils/auth.helper";
import { Category } from "../models/productCategory.model";
import { findSourceMap } from "module";

const getMyShopOrFail = async (req: Request, res: Response) => {
  const userId = getUserIdOrFail(req, res)
  if (!userId) {
    throw { status: 404, error: 'User not found' }
  }

  const shop = await findOwnedShop(req.params.id, userId)
  if (!shop) {
    throw { status: 404, error: 'You can only access your own shop' }
  }

  return shop
}

// Public
export const listShops = async (req: Request, res: Response) => {
  try {
    const { q, minRating, maxRating, category } = req.query
    const filter: any = { isActive: true }

    if (q)        filter.name = { $regex: q, $options: 'i' }
    if (category) filter.category = category
    if (minRating || maxRating) {
      filter.rating = {}
      if (minRating) filter.rating.$gte = Number(minRating)
      if (maxRating) filter.rating.$lte = Number(maxRating)
    }

    const list = await Shop.find(filter)
      .sort({ createdAt: -1 })
      .limit(15)

    res.json({ success: true, data: list })
    return
  } catch (err: any) {
    res.status(500).json({error: 'Failed to list shops', details: err})
    return
  }
}

export const getShopById = async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, isActive: true })

    if (!shop) {
      res.status(404).json({ success: false, error: 'Shop not found or delisted' })
      return
    }

    res.json({ success: true, data: shop })
  } catch (err: any) {
    res.status(500).json({error: 'Failed to retrieve shop', details: err})
    return
  }
}
// Private
export const createShop = async (req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req,res)
    const user = await User.findById(userId)
    if(!user){
      res.status(404).json({ error: 'User not found' })
      return
    }

    if(!user?.roles.includes('seller')){
      res.status(403).json({ error: 'You have to become a seller first' })
      return
    }

    const shop = await Shop.create({ ...req.body, seller: userId })
    res.status(201).json(shop)
  }catch(err){
    res.status(400).json({ error: 'Failed to create shop', details: err })
    return
  }
}

export const updateShop = async (req: Request, res: Response) => {
  try{
    const shop = await getMyShopOrFail(req, res)
    const {_id, isActive, ...editable} = req.body
    Object.assign(shop, editable)
    await shop.save()
    
    res.json(shop)
    return
  }catch(err){
    res.status(400).json({ error: 'Failed to update shop', details: err })
    return
  }
}

export const delistShop = async(req: Request, res: Response) => {
  try{
    const shop = await getMyShopOrFail(req,res)
    shop.isActive = false
    await shop.save()

    res.json({ message: 'Shop delisted', shop })
    return
  }catch(err){
    res.status(400).json({ error: 'Failed to delist shop', details: err })
    return
  }
}

export const restoreShop = async(req: Request, res: Response) => {
  try{
    const shop = await getMyShopOrFail(req, res)
    shop.isActive = true
    await shop.save()
    
    res.json({ message: 'Shop restored', shop })
    return
  }catch(err){
    res.status(400).json({ error: 'Failed to restore shop', details: err })
    return
  }
}