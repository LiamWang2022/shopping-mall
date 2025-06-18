import { UserRole } from "./shared/user-role";

export interface JwtPayload {
    user_id: string
    active_role: UserRole
    iat: number
    exp: number
}