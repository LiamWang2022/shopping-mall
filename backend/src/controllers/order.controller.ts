import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Shop } from "../models/shop.model";
import { getUserIdOrFail, canAccessOrder } from "../utils/auth.helper";
import { Product } from "../models/product.model";
import { error } from "console";
import { populate } from "dotenv";
interface CreateOrderRequestBody {
  shop: string
  items: {
    product: string
    quantity: number
  }[]
  address: string
}
// Buyer function
//Create Order
export const createOrder = async(req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    const { shop, items, address } = req.body as CreateOrderRequestBody

    if (!shop || !items || !address || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    const shopExists = await Shop.findById(shop)
    if (!shopExists || !shopExists.isActive) {
      res.status(404).json({ error: 'Shop not found' })
      return
    }

    const orderItems = []
    let total = 0

    for (const item of items) {
      const product = await Product.findById(item.product)
      // check if the product is active
      if(!product || !product.isActive){
        res.status(404).json({ error: `Product not found: ${product?.display_name}` })
        return
      }
      //check if the product belongs to the shop
      if(!product.shop.equals(shop)){
        res.status(400).json({ error: `Product ${product.display_name} does not belong to the shop` })
      }
      // check if the quantity is valid
      if(item.quantity <= 0|| product.stock_count <= 0||item.quantity > product.stock_count){
        res.status(400).json({ error: `Invalid quantity for product: ${product.display_name}` })
        return
      }
      const price = product.price
      total += price * item.quantity

      product.stock_count -= item.quantity
      await product.save()

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price
      })
    }

    // create new order
    const newOrder = await Order.create({
      buyer: userId,
      shop: shop,
      items: orderItems,
      total: total,
      status: 'pending',
      shipping_address:   address
    })

    res.status(201).json(newOrder)
    return
  }catch(err){
    res.status(500).json({ error: 'Server error' })
    return
  }
}
// Get all orders of the buyer
export const getBuyerOrder = async(req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    
    const orders = await Order.find({buyer: userId})
      .populate('shop', 'name')
      .populate('items.product', 'display_name price')
      .sort({ createdAt: -1 })

    if(orders.length === 0){
      res.status(200).json({ orders: [] })
      return
    }
    res.status(200).json({orders})
    return
  }catch(err) {
    res.status(500).json({ error: 'Server error'})
    return
  }
}
//Buyer cancell order
export const cancelBuyerOrder= async(req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    const orderId = req.params.orderId
    const {order, role} = await canAccessOrder(orderId, userId!)
    if(order.status !== 'pending'){
      res.status(405).json({error: 'You can only cancel order when it is pending'})
      return
    }
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock_count += item.quantity
        await product.save()
      }
    }

    order.status = 'cancelled'
    await order.save()
    res.status(200).json({
      message: 'Order cancelled',
      order: order,
      role
    })
  }catch(err){
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}
//Seller
//Get all orders of the shop
export const getShopOrders = async(req: Request, res: Response) => {
  try{
    const shopId = req.shopId
    if (!shopId) {
      res.status(400).json({ error: 'Missing shopId' })
      return
    }
    const orders = await Order.find({ shop: shopId })
      .populate('buyer', 'name')
      .populate('items.product', 'display_name price')
      .sort({ createdAt: -1 })
    res.status(200).json({
      message: 'Shop orders fetched successfully',
      orders
    })
    return
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
      return
    }
}
//Update order
export const updateOrderStatusBySeller = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdOrFail(req)
    const orderId = req.params.orderId
    const { status } = req.body

    const { order, role } = await canAccessOrder(orderId, userId!)

    if (role !== 'seller') {
      res.status(403).json({ error: 'Only seller can update order status' })
      return
    }

    const validNextStatuses: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped'],
      shipped: ['delivered']
    }

    const currentStatus = order.status
    const allowedNext = validNextStatuses[currentStatus]

    if (!allowedNext || !allowedNext.includes(status)) {
      res.status(400).json({ 
        error: `Invalid status transition from '${currentStatus}' to '${status}'` 
      })
      return
    }
    if (status === currentStatus) {
      res.status(400).json({ 
        error: `Order is already in status '${status}'`
      })
      return
    }
    order.status = status
    await order.save()

    res.status(200).json({ message: 'Order status updated', order })
    return
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

//Public
//Get one order details
export const getOrderById = async (req: Request, res: Response) => {
  try{
    const userId = getUserIdOrFail(req)
    const orderId = req.params.orderId
    const {order, role} = await canAccessOrder(orderId, userId!)
    const populatedOrder = await Order.findById(orderId)
      .populate('shop', 'name')
      .populate('items.product', 'display_name price')

    res.status(200).json({
      message: 'Get order details successful',
      order: populatedOrder,
      role
    })
    return
  }catch (err: any) {
    console.error(err)

    if (err instanceof Error) {
      if (err.message === 'Order not found') {
        res.status(404).json({ error: err.message })
        return
      }
      if (err.message === 'User is not authorized to view this order') {
        res.status(403).json({ error: err.message })
        return
      }
    }

    res.status(500).json({ error: 'Internal server error' })
  }
}