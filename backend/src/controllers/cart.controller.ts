import { Request, Response } from "express";
import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";
import { getUserIdOrFail } from "../utils/auth.helper";

export const addToCart = async(req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    const {productId, quantity} = req.body
    if(!productId || !quantity || quantity <= 0){
      res.status(400).json({ error: 'Invalid product or quantity' })
      return
    }
    const product = await Product.findById(productId)
    if(!product || !product.isActive){
      res.status(400).json({ error: 'Product not found or invaild' })
      return
    }
    let cart = await Cart.findOne({buyer: userId})
    if(!cart){
      cart = new Cart({
        buyer: userId,
        items: [{ productId, quantity }]
      })
    }else{
      const existingItem =cart.items.find(item => item.product.equals(productId))
      if(existingItem){
        existingItem.quantity += quantity 
      }else{
        cart.items.push({ product: productId, quantity: quantity })
      }
    }
    await cart.save()
    res.status(200).json({
      message: 'Item added to cart',
      cart
    })
    return
  }catch(err){
    res.status(500).json({ error: 'Intenal Server Error'})
    return
  }
}

export const getCart = async(req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    const cart = await Cart.findOne({buyer: userId})
      .populate('items.product', 'display_name price images')
    if(!cart || cart.items.length === 0){
      res.status(200).json({ items:[] })
      return
    }
    res.status(200).json({ cart })
    return
  }catch(error){
    res.status(500).json({ error: "Internal sever error" })
    return
  }
}

export const deleteItemFromCart = async(req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    const productId = req.params.productId
    const cart = await Cart.findOne({buyer: userId})
    if(!cart || cart.items.length === 0){
      res.status(400).json({ error: 'Cart invalid or no item in cart' })
      return
    }
    const originalLength = cart.items.length
    cart.items = cart.items.filter((item) => !item.product.equals(productId))
    if (cart.items.length === originalLength) {
      res.status(404).json({ error: 'Product not found in cart' })
      return
    }
    await cart.save()
    res.status(200).json({ message: 'Item removed from cart', cart })
    return
  }catch(err){
    res.status(500).json({ error: "Internal sever error" })
    return
  }
}

export const updateCartItem = async(req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    const { productId, quantity } = req.body

    if (!productId || typeof quantity !== 'number') {
      res.status(400).json({ error: 'Missing productId or quantity' })
      return
    }

    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      res.status(404).json({ error: 'Product not found or inactive' })
      return
    }

    let cart = await Cart.findOne({ buyer: userId })
    if (!cart) {
      if (quantity <= 0) {
        res.status(400).json({ error: 'Cannot set quantity <= 0 for new cart' })
        return
      }

      cart = await Cart.create({
        buyer: userId,
        items: [{ product: productId, quantity }]
      })

      res.status(200).json({ message: 'Cart created with item', cart })
      return
    }
    const existingItem = cart.items.find(item => item.product.equals(productId))
      if (existingItem) {
        if (quantity <= 0) {
          cart.items = cart.items.filter(item => !item.product.equals(productId))
        }else{
          existingItem.quantity = quantity
        }
      }else{
        if (quantity <= 0) {
        res.status(400).json({ error: 'Cannot set quantity <= 0 for item not in cart' })
        return  
        }
      cart.items.push({ product: productId, quantity })
      }
    await cart.save()
    res.status(200).json({ message: 'Cart updated', cart })
    return
  }catch(err){
    res.status(500).json({ error: 'Internal server error' })
    return 
  }
}