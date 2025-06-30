import { Schema, model, Document } from 'mongoose'

const ShopCategorySchema = new Schema<IShopCategory>({
  name:        { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String }
})

export interface IShopCategory extends Document {
  name: string
  description?: string
}

export const ShopCategory = model<IShopCategory>('ShopCategory', ShopCategorySchema)