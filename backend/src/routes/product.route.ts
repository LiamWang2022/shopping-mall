import { Router } from 'express'
import {
  createProduct,
  updateProduct,
  delistProduct,
  listProducts,
  getProductById,
  restoreProduct
} from '../controllers/product.controller'

const router = Router()

/** ---------------- Swagger tag ---------------- */
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Manage and query products
 */

/** ---------------- Public (Buyer) ---------------- */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Browse or search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Fuzzy search in display_name
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: shop
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: An array of active products
 */
router.get('/', listProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *       404: { description: Product not found }
 */
router.get('/:id', getProductById)

/** ---------------- Seller-only ---------------- */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Seller lists (creates) a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201: { description: Created }
 */
router.post('/', createProduct) // TODO: add authSeller middleware

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Seller updates product attributes
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200: { description: Updated product }
 *       404: { description: Product not found }
 */
router.patch('/:id', updateProduct) // TODO: add authSeller middleware

/**
 * @swagger
 * /api/products/{id}/delist:
 *   patch:
 *     summary: Seller delists (soft-deletes) a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product delisted }
 *       404: { description: Product not found }
 */
router.patch('/:id/delist', delistProduct) // TODO: add authSeller middleware

/**
 * @swagger
 * /api/products/{id}/restore:
 *   patch:
 *     summary: Restore a previously delisted product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to restore
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product restored
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.patch('/:id/restore', restoreProduct)
export default router