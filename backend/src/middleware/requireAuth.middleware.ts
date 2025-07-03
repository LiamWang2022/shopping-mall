import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  id: string
  activeRole: string
}

declare module 'express' {
  interface Request {
    user?: IUser
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Can not accessed without token' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload

    const user = await User.findById(decoded.id)
    if (!user) {
      res.status(401).json({ message: 'User not found or deleted' })
      return
    }

    req.user = user
    next()
  } catch (err) {
    console.error('[Auth Error]', err)
    res.status(401).json({ message: 'Token invalid or expired' })
    return
  }
}