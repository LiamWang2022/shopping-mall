import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/', (_req: Request, res: Response) => {
  res.send('Shopping-Mall API is running 🚀');
});

// 全局错误处理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal Server Error' } });
});

async function start() {
  const { MONGO_URI, PORT = '5000' } = process.env;
  if (!MONGO_URI) throw new Error('MONGO_URI not defined in .env');

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB connected');
    app.listen(Number(PORT), () => console.log(`🚀  API on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌  DB connection error →', err);
    process.exit(1);
  }
}

start();
