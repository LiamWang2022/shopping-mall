import { OrderItem } from "./order"
import { ShippingInfo } from "./order"

export interface SellerOrderView {
  order_id: string
  buyer_id: string
  items: OrderItem[]
  shipping_info?: ShippingInfo
  created_at: Date
  is_paid: boolean
  is_cancelled?: boolean
}
