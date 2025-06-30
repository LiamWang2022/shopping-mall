import { Schema, model, Document, Types } from 'mongoose'

const ProductCategorySchema = new Schema({
  name:   { type: String, required: true },
  parent: { type: Types.ObjectId, ref: 'Category' }
})

export interface ICategory extends Document {
  name: string
  parent?: Types.ObjectId
}

export const Category = model<ICategory>('ProductCategory', ProductCategorySchema)