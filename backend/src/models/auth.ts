import { UserRole } from "./shared/user-role";

export interface RegisterInput {
    name: string
    email: string
    password: string
    roles?: UserRole[]
}

export interface LoginInput{
    email: string
    password: string
    as_role: UserRole
}

export interface LoginResponse {
    token: string
    user: {
        id: string
        name: string
        roles: UserRole[]
        active_role: UserRole
        shop_name?: string
    }
}