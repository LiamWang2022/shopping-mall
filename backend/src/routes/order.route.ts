import { Router } from "express";
import { createOrder } from "../controllers/order.controller";

import { requireAuth } from "../middleware/requireAuth.middleware";

const router = Router()

router.post('/', requireAuth, createOrder)