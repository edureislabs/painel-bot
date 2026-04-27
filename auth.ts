// auth.ts
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
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      return session
    }
  },

  // 🔒 Força cookies seguros em produção (HTTPS)
  useSecureCookies: process.env.NODE_ENV === "production",

  // 🍪 Configuração explícita dos cookies para evitar conflitos de domínio
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      domain: process.env.NEXTAUTH_URL 
        ? new URL(process.env.NEXTAUTH_URL).hostname 
        : undefined,
    },
  },
},

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dias (mesmo tempo de expiração do token do Discord)
  },

  secret: process.env.NEXTAUTH_SECRET,
})