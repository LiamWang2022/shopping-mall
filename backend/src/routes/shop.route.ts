import { Router } from "express"
import { 
  createShop,
  listShops,
  getShopById,
  updateShop,
  delistShop,
  restoreShop
} from "../controllers/shop.controller"

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Manage and query shops
 */

const router = Router()

/**
 * @swagger
 * /api/shops:
 *   post:
 *     summary: Create a shop
 *     tags: [Shops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', createShop)

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Browse or search shops
 *     tags: [Shops]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Text search in display_name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of shops
 */
router.get('/', listShops)

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get a single shop by ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop found
 *       404:
 *         description: Shop not found
 */
router.get('/:id', getShopById)

/**
 * @swagger
 * /api/shops/{id}:
 *   patch:
 *     summary: Update a shop
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Editable fields of the shop
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shop updated
 *       404:
 *         description: Shop not found
 */
router.patch('/:id', updateShop)

/**
 * @swagger
 * /api/shops/{id}/delist:
 *   patch:
 *     summary: Soft delete (delist) a shop
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop delisted
 *       404:
 *         description: Shop not found
 */
router.patch('/:id/delist', delistShop)

/**
 * @swagger
 * /api/shops/{id}/restore:
 *   patch:
 *     summary: Restore a previously delisted shop
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the shop to restore
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Shop restored
 *                 shop:
 *                   $ref: '#/components/schemas/Shop'
 *       404:
 *         description: Shop not found
 */
router.patch('/:id/restore', restoreShop)

export default router