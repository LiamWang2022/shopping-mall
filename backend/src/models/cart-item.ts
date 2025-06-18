export interface CartItem {
  product_id: string
  display_name: string
  image: { url: string; alt: string }
  price: number
  qty: number
  stock_count: number
  seller_id: string
  shop_name?: string
}