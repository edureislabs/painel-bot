import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    
    // Verificar se o token expirou
    if (token?.expiresAt && Date.now() >= (token.expiresAt as number) * 1000) {
        console.log("⚠️ Token expirado, redirecionando para login")
        const url = new URL("/api/auth/signin", request.url)
        url.searchParams.set("callbackUrl", request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*"],
}