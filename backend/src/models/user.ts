import { Address } from './shared/address'

export type UserRole = 'buyer' | 'seller' | 'admin'

export interface User {
    id: string
    name: string
    email: string
    password: string
    role: UserRole
    phone?: string

    //buyer information
    shipping_address: Address
    
    //seller information
    shop_name?: string
}