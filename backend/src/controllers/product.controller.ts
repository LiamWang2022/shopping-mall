import { Request, Response } from 'express'
import { Product } from '../models/product.model'
import { toProductDTO, mapProductsDTO } from '../mappers/product.mapper'
import { isValidObjectId } from 'mongoose'
import { error } from 'console'
import { defaultMaxListeners } from 'events'

const parseFiniteNumber = (v: unknown): number | undefined => {
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Seller — create a product */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const shop = req.shop!
    
    //White list filter
    const {
      display_name,
      price,
      images,
      product_description,
      shipping_description,
      stock_count,
      category,
      colour,
    } = req.body ?? {}
    
    // Query validation
    if (!display_name || parseFiniteNumber(price) === undefined) {
      res.status(400).json({ error: 'Validatio error', details: 'display_name and price are required' })
      return
    }

    const product = await Product.create({
      display_name,
      price: Number(price),
      images,
      product_description,
      shipping_description,
      stock_count,
      category,
      colour,
      shop: shop._id,
    })
    await product.populate('shop', 'name logo ratingAvg isActive')
     res
      .location(`/api/products/${product._id}`)
      .status(201)
      .json(toProductDTO(product))
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
    const shop = req.shop!
    //White list filter
    const ALLOW_UPDATE_FIELDS = [
      'display_name',
      'price',
      'images',
      'product_description',
      'shipping_description',
      'stock_count',
      'category',
      'colour',
    ] as const

    const editable = Object.fromEntries(
      Object.entries(req.body ?? {}).filter(([k]) => ALLOW_UPDATE_FIELDS.includes(k as any))
    )
    // Check price validation
    if ('price' in editable) {
      const p = parseFiniteNumber(editable.price)
      if (p === undefined) {
        res.status(400).json({
          error: 'Vailidation error',
          details: 'price must be a number' 
        })
        return
      }
      editable.price = p
    }

    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      editable,
      { new: true, runValidators: true }
    )
    .populate('shop', 'name logo ratingAvg isActive')
    .exec()

    
    if (!updated) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    res.json(toProductDTO(updated))
  } catch (err) {
    console.error('Update product error', err)
    res.status(500).json({
      error: 'Server error',
      details: err instanceof Error ? err.message : String(err) })
  }
}

/** Seller — delist a product */
export const delistProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const shop = req.shop!

    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      { isActive: false },
      { new: true }
    )
    .populate('shop', 'name logo ratingAvg isActive')
    .exec()

    if (!updated) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    res.json(toProductDTO(updated))
  } catch (err) {
    console.error('Delist product error', err)
    res.status(500).json({
      error: 'Server error',
      details: err instanceof Error ? err.message : String(err),
    })
  }
}

/** Public — list active products */
export const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category, minPrice, maxPrice, shop } = req.query
    const filter: any = { isActive: true }

    if (typeof q === 'string' && q.trim()){
      const safe = escapeRegex(q.trim().slice(0, 64))
      filter.display_name = { $regex: safe, $options: 'i' }
    }

    if (shop) {
      if (!isValidObjectId(String(shop))) {
        res.status(400).json({ error: 'Validation error', details: 'Invalid shop id' })
        return
      }
      filter.shop = shop
    }

    if (category) {
      if (!isValidObjectId(String(category))) {
        res.status(400).json({ error: 'VALIDATION_ERROR', details: 'Invalid category id' })
        return
      }
      filter.category = category
    }

    const min = parseFiniteNumber(minPrice)
    const max = parseFiniteNumber(maxPrice)

    if (min !== undefined || max !== undefined) {
      filter.price = {}
      if (min !== undefined) filter.price.$gte = min
      if (max !== undefined) filter.price.$lte = max
    }

    const list = await Product.find(filter)
      .populate('shop', 'name logo ratingAvg isActive')
      .sort({ createdAt: -1 })
      .limit(15)
      .lean()
      .exec()

    res.json(mapProductsDTO(list))
  } catch (err) {
    console.error('List products error]', err)
    res.status(500).json({
      error: 'Server error',
      details: err instanceof Error ? err.message : String(err),
    })
  }
}

/** Public — get product details */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('shop', 'name logo ratingAvg isActive')
      .lean()
      .exec()

    if (!product) {
      res.status(404).json({ error: 'Product not found or delisted' })
      return
    }

    res.json(toProductDTO(product))
  } catch (err) {
    console.error('Get product error', err)
    res.status(500).json({
      error: 'Server error',
      details: err instanceof Error ? err.message : String(err) })
  }
}

/** Seller — restore a delisted product */
export const restoreProduct = async (req: Request, res: Response) => {
  try {
    const shop = req.shop!

    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      { isActive: true },
      { new: true }
    ).exec()

    if (!updated) {
      res.status(404).json({ error: 'Product not found' })
      return
    }


    res.json(toProductDTO(updated))
  } catch (err) {
    console.error('Restore product error]', err)
    res.status(500).json({
      error: 'Server error',
      details: err instanceof Error ? err.message : String(err) })
  }
}