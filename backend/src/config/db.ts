import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
  const { MONGO_URI } = process.env
  if (!MONGO_URI) throw new Error('MONGO_URI not defined in .env')

  await mongoose.connect(MONGO_URI)
}

export default connectDB