import { Address } from './shared/address'
import { OrderItem } from './order'

export interface CreateOrderInput {
  user_id: string
  order_items: OrderItem[]
  shipping_address: Address
  payment_method: string
}
