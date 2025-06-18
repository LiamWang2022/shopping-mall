export interface CreateProductInput {
  display_name: string
  price: number
  images: { url: string; alt: string }[]
  stock_count: number
  shop_name: string
  colour?: string
  category?: string
  product_description?: string
  shipping_description?: string
}