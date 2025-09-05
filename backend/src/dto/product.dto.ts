// dto/product.dto.ts
export interface ProductImageDTO {
  url: string
  alt?: string
}

export interface ShopLiteDTO {
  _id: string
  name?: string
  logo?: string
  ratingAvg?: number
  isActive?: boolean
}

export interface ProductDTO {
  id: string
  display_name: string
  price: number
  images: ProductImageDTO[]
  stock: number
  shop: ShopLiteDTO
  active: boolean
}