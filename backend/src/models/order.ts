import { Address } from "./shared/address"

export interface OrderItem {
    product_id: string
    display_name: string
    seller_id: string
    price: number
    image_url: string
    qty: number
}

export type DeliverStatus = 'preparing' | 'shipping' | 'arrived' | 'cancelled'

export interface ShippingInfo extends Address{
    status: DeliverStatus
    carrier?: string
}

export interface Order {
    id: string
    user_id: string
    order_items: OrderItem[]
    total_price: number
    payment_method: string
    created_at: Date
    is_paid: boolean
    paid_at?: Date
    shipping_info?: ShippingInfo
    delivered_at?: Date
    is_cancelled?: boolean
    is_cancelled_at?: Date
}