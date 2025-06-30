import { Schema, model, Document, Types } from 'mongoose'

const ReviewSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    author:  { type: Types.ObjectId, ref: 'User', required: true },
    rating:  { type: Number, min: 1, max: 5, required: true },
    comment: String
  },
  { timestamps: true }
)

export interface IReview extends Document {
  product: Types.ObjectId
  author: Types.ObjectId
  rating: number
  comment?: string
}

export const Review = model<IReview>('Review', ReviewSchema)