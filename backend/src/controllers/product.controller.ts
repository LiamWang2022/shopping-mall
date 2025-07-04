import { Request, Response } from 'express'
import { Product } from '../models/product.model'
import { Shop } from '../models/shop.model'
import { findOwnedProduct, getUserIdOrFail } from '../utils/auth.helper'
/** Seller — create a product */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdOrFail(req)
    if (!userId) return

    const shop = await Shop.findOne({ owner: userId }).exec()
    if (!shop) {
      res.status(403).json({ error: 'You do not have a shop' })
      return
    }

    const product = await Product.create({
      ...req.body,
      shop: shop._id
    })

    res.status(201).json(product)
  } catch (err) {
    console.error('[Create Product Error]', err)
    res.status(400).json({
      error: 'Failed to create product',
      details: err instanceof Error ? err.message : String(err)
    })
  }
}

/** Seller — update a product */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdOrFail(req)
    if (!userId) return

    const { shop, _id, isActive, ...editable } = req.body

    const owned = await findOwnedProduct(req.params.id, userId)
    if (!owned) {
      res.status(403).json({ error: 'Unauthorized to modify this product' })
      return
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      editable,
      { new: true, runValidators: true }
    ).exec()

    res.json(updated)
  } catch (err) {
    console.error('[Update Product Error]', err)
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) })
  }
}

/** Seller — delist a product */
export const delistProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserIdOrFail(req)
    if (!userId) return

    const owned = await findOwnedProduct(req.params.id, userId)
    if (!owned) {
      res.status(403).json({ error: 'Unauthorized to modify this product' })
      return
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).exec()

    res.json({ message: 'Product delisted', product: updated })
  } catch (err) {
    console.error('[Delist Product Error]', err)
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) })
  }
}

/** Public — list active products */
export const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
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
      .exec()

    res.json(list)
  } catch (err) {
    console.error('[List Products Error]', err)
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) })
  }
}

/** Public — get product details */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('shop', 'name logo')
      .exec()

    if (!product) {
      res.status(404).json({ error: 'Product not found or delisted' })
      return
    }

    res.json(product)
  } catch (err) {
    console.error('[Get Product Error]', err)
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) })
  }
}

/** Seller — restore a delisted product */
export const restoreProduct = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdOrFail(req)
    if (!userId) return

    const owned = await findOwnedProduct(req.params.id, userId)
    if (!owned) {
      res.status(403).json({ error: 'Unauthorized to restore this product' })
      return
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).exec()

    res.json({ message: 'Product restored', product: updated })
  } catch (err) {
    console.error('[Restore Product Error]', err)
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) })
  }
}