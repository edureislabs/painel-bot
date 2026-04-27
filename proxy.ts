// proxy.ts
import { auth } from "@/auth"
import { NextResponse } from 'next/server'
import { checkGuildAccess } from '@/lib/checkGuildAccess'

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname

  // 🔑 IGNORAR ROTAS DE AUTENTICAÇÃO (primeira verificação)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // ... resto do código para proteger /dashboard/* ...
})

export const config = {
  matcher: '/dashboard/:guildId/:path*',
}