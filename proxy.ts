// proxy.ts
import { auth } from "@/auth"
import { NextResponse } from 'next/server'
import { checkGuildAccess } from '@/lib/checkGuildAccess'

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname

  // 🔑 Garantir que rotas de auth NUNCA sejam processadas
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Verificar se é uma rota de dashboard de um servidor específico
  const match = pathname.match(/^\/dashboard\/([^\/]+)/)
  if (!match) return NextResponse.next()

  const guildId = match[1]
  const session = req.auth

  if (!session || !session.accessToken) {
    const signInUrl = new URL('/api/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  const hasAccess = await checkGuildAccess(guildId, session.accessToken as string)

  if (!hasAccess) {
    return NextResponse.redirect(new URL('/acesso-negado', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: '/dashboard/:guildId/:path*',
}