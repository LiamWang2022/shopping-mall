import { Request, Response } from 'express'
import { Product } from '../models/product.model'
import { Shop } from '../models/shop.model'

/** Seller — create & list a product */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product', details: err })
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { shop, _id, isActive, ...editable } = req.body
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    editable,
    { new: true, runValidators: true }
  )
  if (!updated) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(updated)
}

export const delistProduct = async (req: Request, res: Response): Promise<void> => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  )
  if (!updated) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json({ message: 'Product delisted', product: updated })
}

export const listProducts = async (req: Request, res: Response): Promise<void> => {
  const { q, category, minPrice, maxPrice, shop } = req.query
  const filter: any = { isActive: true }

  if (q)        filter.display_name = { $regex: q, $options: 'i' }
  if (category) filter.category = category
  if (shop)     filter.shop = shop
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  const list = await Product.find(filter)
    .populate('shop', 'name logo')
    .sort({ createdAt: -1 })
    .limit(15)

  res.json(list)
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true })
    .populate('shop', 'name logo')

  if (!product) {
    res.status(404).json({ error: 'Product not found or delisted' })
    return
  }

  res.json(product)
}

export const restoreProduct = async(req: Request, res: Response) => {
  const restored = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  )
  if(!restored) {
    res.status(404).json({ error: 'Product not found' })
    return
  }

  res.json({message: 'Product restored', product: restored})
}
