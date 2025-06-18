import { Address } from './shared/address'
import { UserRole } from './shared/user-role'

export interface User {
    id: string
    name: string
    email: string
    password: string
    role: UserRole[]
    phone?: string

    //buyer information
    shipping_address: Address
    
    //seller information
    shop_name?: string
}