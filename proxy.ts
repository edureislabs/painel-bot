// proxy.ts
import { auth } from "@/auth" // Importa a instância configurada do NextAuth
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkGuildAccess } from '@/lib/checkGuildAccess'

// A função exportada DEVE se chamar 'proxy'
export default auth(async (req) => {
  const pathname = req.nextUrl.pathname

  // Verificar se é uma rota de dashboard de um servidor específico
  const match = pathname.match(/^\/dashboard\/([^\/]+)/)
  if (!match) return NextResponse.next()

  const guildId = match[1]
  
  // A sessão já está disponível no objeto `req.auth`
  const session = req.auth

  // Se não tem sessão ou accessToken, redireciona para login
  if (!session || !session.accessToken) {
    const signInUrl = new URL('/api/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Verificar acesso ao servidor
  const hasAccess = await checkGuildAccess(guildId, session.accessToken as string)
  
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/acesso-negado', req.url))
  }

  return NextResponse.next()
})

// A configuração do matcher permanece a mesma
export const config = {
  matcher: '/dashboard/:guildId/:path*',
}