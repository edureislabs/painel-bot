import "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user: {
            id?: string
            name?: string
            email?: string
            image?: string
        }
        expiresAt?: number
    }
    
    interface Token {
        accessToken?: string
        refreshToken?: string
        expiresAt?: number
        userId?: string
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    userId?: string
  }
}