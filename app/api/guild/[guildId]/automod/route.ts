import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { checkGuildAccess } from "@/lib/checkGuildAccess"

async function getChannels(guildId: string) {
    const response = await fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        cache: "no-store"
    })
    if (!response.ok) return []
    return response.json()
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ guildId: string }> }
) {
    const session = await auth()
    if (!session?.accessToken) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { guildId } = await params

    // ✅ Passar o accessToken do usuário
    const hasAccess = await checkGuildAccess(guildId, session.accessToken)
    if (!hasAccess) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const [automodLinks, channels] = await Promise.all([
        prisma.autoModLink.findMany({ where: { guildId } }),
        getChannels(guildId)
    ])

    const textChannels = channels.filter((c: any) => c.type === 0)

    return NextResponse.json({ automodLinks, channels: textChannels })
}

export async function POST(
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

    const { channelId, enabled } = await request.json()

    const automod = await prisma.autoModLink.upsert({
        where: { guildId_channelId: { guildId, channelId } },
        update: { enabled },
        create: { guildId, channelId, enabled }
    })

    return NextResponse.json(automod)
}

export async function DELETE(
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

    const { channelId } = await request.json()

    await prisma.autoModLink.delete({
        where: { guildId_channelId: { guildId, channelId } }
    })

    return NextResponse.json({ success: true })
}