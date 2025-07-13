import { Router } from "express"
import {
  createOrder,
  getBuyerOrder,
  cancelBuyerOrder,
  getShopOrders,
  updateOrderStatusBySeller,
  getOrderById
} from "../controllers/order.controller"
import { requireAuth } from "../middleware/requireAuth.middleware"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shop, items, address]
 *             properties:
 *               shop:
 *                 type: string
 *                 description: ID of the shop
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", requireAuth, createOrder)

/**
 * @swagger
 * /api/orders/buyer:
 *   get:
 *     summary: Get all orders of the logged-in buyer
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/buyer", requireAuth, getBuyerOrder)

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel a pending order (Buyer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled
 *       405:
 *         description: Only pending orders can be cancelled
 */
router.patch("/:orderId/cancel", requireAuth, cancelBuyerOrder)

/**
 * @swagger
 * /api/orders/shop:
 *   get:
 *     summary: Get all orders of the authenticated seller's shop
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop orders fetched
 */
router.get("/shop", requireAuth, getShopOrders)

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Update order status (Seller only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch("/:orderId/status", requireAuth, updateOrderStatusBySeller)

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get one order details (Buyer or Seller with permission)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order detail returned
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Order not found
 */
router.get("/:orderId", requireAuth, getOrderById)

export default router