import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import { error } from "console";
import jwt, {SignOptions} from "jsonwebtoken";
export const registerUser = async (req: Request, res: Response) => {
  try{
    const {email, password, name} = req.body

    const existingUser = await User.findOne({ email })
    if(existingUser) {
      res.status(400).json({message: 'email existed'})
      return
    }

    const newUser = await User.create({
      email,
      password,
      name,
      roles: ['buyer'],
      activeRole: 'buyer'
    })
    
    res.status(201).json({
      message: 'register successful',
      user:{
        id:    newUser._id,
        email: newUser.email,
        name:  newUser.name,
        roles: newUser.roles,
        activeRole: newUser.activeRole
      }
    })
  }catch(error){
    console.error('register failed', error)
    res.status(500).json({error: 'register failed, please try it later'})
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try{
    const { email, password} = req.body
    const userInfo = await User.findOne({ email }) as IUser
    if (!userInfo){
      res.status(404).json({ message: 'User not found' })
      return
    }
    const isMatch = await userInfo.comparePassword(password)
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' })
      return
    }

    const JWT_SECRET = process.env.JWT_SECRET as string
    const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn']

    const token = jwt.sign(
     {
        id: userInfo._id,
       activeRole: userInfo.activeRole
     },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
)

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: userInfo._id,
        name: userInfo.name,
        activeRole: userInfo.activeRole,
        roles: userInfo.roles
      }
     })
    }catch (err) {
      console.error('[Login Error]',err)
      res.status(500).json({ message: 'Server error, please try it later' })
      return
    }
}

export const getProfile = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'User have not login' })
    return 
  }

  const { _id, name, email, avatar, roles, activeRole } = req.user

  res.status(200).json({
    id: _id,
    name: name,
    email: email,
    avatar: avatar,
    roles: roles,
    activeRole: activeRole
  })
  return
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
    res.status(401).json({ message: 'User have not login' })
    return 
    }
    const userId = req.user._id
    const { name, avatar } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({
      message: 'User profile updated',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        roles: updatedUser.roles,
        activeRole: updatedUser.activeRole
      }
    })
    return
  } catch (err) {
    console.error('[Update Profile Error]', err)
    res.status(500).json({ message: 'Sever error' })
    return
  }
}