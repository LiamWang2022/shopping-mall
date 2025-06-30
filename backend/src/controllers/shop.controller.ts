import { Request, Response } from "express";
import { Shop } from "../models/shop.model";
import { Product } from "../models/product.model";
import { error } from "console";

export const createShop = async (req: Request, res: Response) => {
  try{
    const shop = await Shop.create(req.body)
    res.status(201).json(shop)
  }catch (err) {
    res.status(400).json({ error: 'Failed to create shop', details: err})
  }
}

export const listShops = async (req:Request, res: Response): Promise<void> => {
  const { q, minRating, maxRating, category} = req.query
  const filter: any = {isActive: true}

  if(q)        filter.name = { $regex: q, $options: 'i' }
  if(category) filter.category = category
  if(minRating || maxRating) {
    filter.rating = {}
    if(minRating) filter.rating.$gte = Number(minRating)
    if(maxRating) filter.rating.$lte = Number(maxRating)
  }

  const list = await Shop.find(filter)
    .sort({ createdAt: -1 })
    .limit(15)
  
  res.json(list)
}

export const getShopById = async (req: Request, res: Response) => {
  const shop = await Shop.findOne({_id: req.params.id, isActive: true})

  if(!shop) {
    res.status(404).json({ error: 'Shop not found or delisted' })
    return
  }

  res.json(shop)
}

export const updateShop = async (req: Request, res: Response) => {
  const { _id, isActive, ...editable } = req.body
  const updated = await Shop.findByIdAndUpdate(
      req.params.id,
      editable,
      { new: true, runValidators: true }
    )

    if (!updated) {
      res.status(404).json({ error: 'Shop not found' })
      return
    }

    res.json(updated)
}

export const delistShop = async(req: Request, res: Response) => {
  const updated = await Shop.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true}
  )
  if (!updated) {
    res.status(404).json({ error: 'Shop not found' })
    return
  }
  res.json({ message: 'Shop delisted', shop: updated })
}

export const restoreShop = async(req: Request, res: Response) => {
  const restored = await Shop.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  )
  if(!restored) {
    res.status(404).json({ error: 'Shop not found' })
    return
  }

  res.json({message: 'Shop restored', shop: restored})
}