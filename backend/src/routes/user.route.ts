import { Router } from "express"
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  becomeSeller
} from "../controllers/user.controller"
import { requireAuth } from "../middleware/requireAuth.middleware"

const router = Router()

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: Display name
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Email already exists
 */
router.post('/register', registerUser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in and receive JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful, returns token and user info
 *       401:
 *         description: Wrong password
 *       404:
 *         description: User not found
 */
router.post('/login', loginUser)

/**
 * @swagger
 * /api/users/profile:
 *   post:
 *     summary: Get current logged-in user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized or token invalid
 */
router.post('/profile', requireAuth, getProfile)

/**
 * @swagger
 * /api/users/update:
 *   patch:
 *     summary: Update user profile (name, avatar)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New display name
 *               avatar:
 *                 type: string
 *                 description: URL of avatar image
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/update', requireAuth, updateProfile)

/**
 * @swagger
 * /api/users/become-seller:
 *   post:
 *     summary: Promote user to seller role
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is now a seller
 *       401:
 *         description: Unauthorized
 */
router.post('/become-seller', requireAuth, becomeSeller)

export default router