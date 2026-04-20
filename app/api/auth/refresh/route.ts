import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST() {
    const session = await auth()
    
    if (!session) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }
    
    // Redirecionar para reautenticação
    return NextResponse.redirect("/api/auth/signin")
}