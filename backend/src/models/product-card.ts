export interface ProductCard {
    id: string
    display_name: string
    image: { url: string; alt: string }
    price: number
    stock_count: number
    shop_name: string
    rating?: string
}