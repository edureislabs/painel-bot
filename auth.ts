import NextAuth, { DefaultSession } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user: {
            id?: string
        } & DefaultSession["user"]
        expiresAt?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        refreshToken?: string
        expiresAt?: number
        userId?: string
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "identify guilds email",
                    prompt: "consent"
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token ?? undefined
                token.refreshToken = account.refresh_token ?? undefined
                token.expiresAt = account.expires_at ?? undefined
                token.userId = profile?.id as string | undefined
            }
            return token
        },
        async session({ session, token }) {
    console.log("📝 Session Callback - Token:", token)
    console.log("📝 Session Callback - accessToken:", token.accessToken)
    
    if (token.accessToken) {
        session.accessToken = token.accessToken
    }
    
    return session
}
    },
    debug: false,
})