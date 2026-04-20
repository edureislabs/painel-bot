// painel-bot/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { checkGuildAccess } from '@/lib/checkGuildAccess'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Verificar se é uma rota de dashboard de um servidor específico
    // Ex: /dashboard/123456789, /dashboard/123456789/welcome, /dashboard/123456789/welcome/editor
    const match = pathname.match(/^\/dashboard\/([^\/]+)/)
    if (!match) return NextResponse.next()

    const guildId = match[1]
    
    // Obter token da sessão
    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
    })
    
    // Se não tem token, redireciona para login
    if (!token?.accessToken) {
        const url = new URL('/api/auth/signin', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }

    // Verificar acesso ao servidor
    const hasAccess = await checkGuildAccess(guildId, token.accessToken as string)
    
    if (!hasAccess) {
        // Redirecionar para página de acesso negado
        return NextResponse.redirect(new URL('/acesso-negado', request.url))
    }

    return NextResponse.next()
}

export const config = {
    // Protege todas as rotas que começam com /dashboard/ e têm um ID de servidor
    matcher: '/dashboard/:guildId/:path*',
}