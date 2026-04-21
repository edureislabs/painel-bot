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
      // 🔥 Salva o accessToken quando o usuário loga
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },

    async session({ session, token }) {
      // 🔥 Injeta o token na sessão
      session.accessToken = token.accessToken as string
      return session
    }
  },

  pages: {
    signIn: "/"
  },

  session: {
    strategy: "jwt"
  },

  secret: process.env.AUTH_SECRET
})