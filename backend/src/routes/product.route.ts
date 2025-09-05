import { Router } from 'express'
import {
  createProduct,
  updateProduct,
  delistProduct,
  listProducts,
  getProductById,
  restoreProduct
} from '../controllers/product.controller'
import { requireAuth } from '../middleware/requireAuth.middleware'
import { requireShopAccess } from '../middleware/requireShopAccess.middleware'

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
 *         description: Fuzzy search in display_name (regex-safe)
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
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: ["price","-price","createdAt","-createdAt"] }
 *     responses:
 *       200:
 *         description: Paged list of active products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDTO'
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDTO'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden (no shop access) }
 */
router.post('/', requireAuth, requireShopAccess, createProduct)

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
 *             allOf:
 *               - $ref: '#/components/schemas/ProductInput'
 *             required: []  # allow partial updates
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDTO'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Product not found }
 */
router.patch('/:id', requireAuth, requireShopAccess, updateProduct)

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
 *       200:
 *         description: Product delisted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDTO'
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Product not found }
 */
router.patch('/:id/delist', requireAuth, requireShopAccess, delistProduct)
/**
 * @swagger
 * /api/products/{id}/restore:
 *   patch:
 *     summary: Restore a previously delisted product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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
 *               $ref: '#/components/schemas/ProductDTO'
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Product not found }
 */
router.patch('/:id/restore', requireAuth, requireShopAccess, restoreProduct)

export default router
