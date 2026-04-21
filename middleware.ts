import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds"
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Persiste o accessToken do Discord no token JWT
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Repassa o accessToken do token JWT para a sessão
      session.accessToken = token.accessToken as string | undefined
      return session
    }
  },

  // Configuração de cookies para evitar problemas em produção
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dias (alinhado com expiração do token Discord)
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Debug: apenas em desenvolvimento (opcional)
  debug: process.env.NODE_ENV === "development",
})