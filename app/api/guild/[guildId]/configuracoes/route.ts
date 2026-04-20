import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { checkGuildAccess } from "@/lib/checkGuildAccess"

async function getChannels(guildId: string) {
    const response = await fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        cache: "no-store"
    })
    if (!response.ok) return []
    return response.json()
}

async function getRoles(guildId: string) {
    const response = await fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
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

    const hasAccess = await checkGuildAccess(guildId, session.accessToken)
    if (!hasAccess) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const [setting, channels, roles] = await Promise.all([
        prisma.setting.findUnique({ where: { guildId } }),
        getChannels(guildId),
        getRoles(guildId)
    ])

    const textChannels = channels.filter((c: any) => c.type === 0)

    const defaultSetting = {
        logChannelId: null,
        muteRoleId: null,
        modChannelId: null,
        prefix: "!",
        lang: "pt-BR",
    }

    return NextResponse.json({
        setting: setting ?? defaultSetting,
        channels: textChannels,
        roles: roles.filter((r: any) => r.name !== "@everyone")
    })
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

    const body = await request.json()
    console.log("📥 Recebido body:", body)  // adicione
    const setting = await prisma.setting.upsert({
        where: { guildId },
        update: {
            logChannelId: body.logChannelId ?? null,
            muteRoleId: body.muteRoleId ?? null,
            modChannelId: body.modChannelId ?? null,
            prefix: body.prefix && body.prefix.trim() !== "" ? body.prefix : "!",
            lang: body.lang ?? "pt-BR",
        },
        create: {
            guildId,
            logChannelId: body.logChannelId ?? null,
            muteRoleId: body.muteRoleId ?? null,
            modChannelId: body.modChannelId ?? null,
            prefix: body.prefix && body.prefix.trim() !== "" ? body.prefix : "!",
            lang: body.lang ?? "pt-BR",
        }
    })
console.log("✅ Configuração salva:", setting)
    return NextResponse.json(setting)
}