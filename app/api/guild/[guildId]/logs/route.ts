import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { checkGuildAccess } from "@/lib/checkGuildAccess"

async function getDiscordUser(userId: string) {
    const response = await fetch(`https://discord.com/api/users/${userId}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        cache: "no-store"
    })
    if (!response.ok) return null
    return response.json()
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ guildId: string }> }
) {
    console.log("📥 [LOGS API] Iniciando")

    const session = await auth()

    console.log("🔑 [LOGS API] session?", !!session, "accessToken?", !!session?.accessToken)

    if (!session?.accessToken) {
        console.log("❌ [LOGS API] Sem accessToken")
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { guildId } = await params
    console.log(`📌 [LOGS API] guildId: ${guildId}`)

    const hasAccess = await checkGuildAccess(guildId, session.accessToken)
    console.log(`✅ [LOGS API] hasAccess: ${hasAccess}`)

    if (!hasAccess) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    console.log("📦 [LOGS API] Buscando logs do banco...")
    const logs = await prisma.log.findMany({
        where: { guildId },
        orderBy: { createdAt: "desc" },
        take: 100,
    })

    console.log(`📊 [LOGS API] Encontrados ${logs.length} logs`)

    const uniqueUserIds = [...new Set([
        ...logs.map(l => l.userId).filter(Boolean),
        ...logs.map(l => l.moderatorId).filter(Boolean),
    ])] as string[]

    const users = await Promise.all(uniqueUserIds.map(id => getDiscordUser(id)))
    const userMap = Object.fromEntries(uniqueUserIds.map((id, i) => [id, users[i]]))

    const enriched = logs.map(l => ({
        ...l,
        user: l.userId && userMap[l.userId] ? {
            username: userMap[l.userId].username,
            avatar: userMap[l.userId].avatar
                ? `https://cdn.discordapp.com/avatars/${l.userId}/${userMap[l.userId].avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/0.png`
        } : null,
        moderator: l.moderatorId && userMap[l.moderatorId] ? {
            username: userMap[l.moderatorId].username,
            avatar: userMap[l.moderatorId].avatar
                ? `https://cdn.discordapp.com/avatars/${l.moderatorId}/${userMap[l.moderatorId].avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/0.png`
        } : null,
    }))

    console.log("✅ [LOGS API] Retornando dados")
    return NextResponse.json(enriched)
}