import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { checkGuildAccess } from '@/lib/checkGuildAccess'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignorar rotas de autenticação
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Verificar se é uma rota de dashboard de um servidor específico
  const match = pathname.match(/^\/dashboard\/([^\/]+)/)
  if (!match) return NextResponse.next()

  const guildId = match[1]

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Se não autenticado, redireciona para a página de sign‑in padrão do NextAuth
  if (!token?.accessToken) {
    const signInUrl = new URL('/api/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  const hasAccess = await checkGuildAccess(guildId, token.accessToken as string)
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/acesso-negado', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:guildId/:path*',
}