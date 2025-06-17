export interface ProductImage {
    url: string
    alt: string
}

export interface Product {
    id: string
    display_name: string
    price: number
    images: ProductImage[]
    stock_count: number
    seller_id: string
    shop_name: string
    colour?: string
    category?: string
    product_description?: string
    shipping_description?: string
}