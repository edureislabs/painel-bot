import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { checkGuildAccess } from "@/lib/checkGuildAccess"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ guildId: string }> }
) {
    const session = await auth()
    if (!session?.accessToken) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { guildId } = await params

    const hasAccess = await checkGuildAccess(guildId, session.accessToken)
    if (!hasAccess) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const punishments = await prisma.punishment.findMany({
        where: { guildId },
        orderBy: { createdAt: "desc" },
        take: 100,
    })

    return NextResponse.json(punishments)
}