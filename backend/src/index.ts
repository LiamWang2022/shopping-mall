import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'
import connectDB from './config/db'
import productRouter from './routes/product.route'
import shopRouter from './routes/shop.route'
import userRouter from './routes/user.route'
import './models/shop.model'
import './models/product.model'
import './models/user.model'
import './middleware/requireAuth.middleware'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
//api document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 健康检查
app.get('/', (_req: Request, res: Response) => {
  res.send('Shopping-Mall API is running 🚀');
});
app.use('/api/products', productRouter)
app.use('/api/shops', shopRouter)
app.use('/api/users', userRouter)
// 全局错误处理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal Server Error' } });
});

const PORT = process.env.PORT || 5000;


(async () => {
  try {
    await connectDB()
    console.log('✅  MongoDB connected')

    app.listen(Number(PORT), () =>
      console.log(`🚀  API on http://localhost:${PORT}`)
    )
  } catch (err) {
    console.error('❌  DB connection error →', err)
    process.exit(1)
  }
})();
