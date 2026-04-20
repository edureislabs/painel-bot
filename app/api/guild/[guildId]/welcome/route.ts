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
    try {
        const session = await auth()
        
        if (!session?.accessToken) {
            console.log("❌ GET: Sem sessão ou token")
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { guildId } = await params
        
        console.log(`🔍 GET - Verificando acesso ao servidor ${guildId}`)

        // Verificar acesso usando o token do usuário
        const hasAccess = await checkGuildAccess(guildId, session.accessToken)
        
        if (!hasAccess) {
            console.log(`❌ GET - Acesso negado para ${guildId}`)
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
        }

        console.log(`✅ GET - Acesso concedido para ${guildId}`)

        // Buscar configurações
        const [welcome, channels, roles] = await Promise.all([
            prisma.welcome.findUnique({ where: { guildId } }),
            getChannels(guildId),
            getRoles(guildId)
        ])

        const textChannels = channels.filter((c: any) => c.type === 0)
        const filteredRoles = roles
            .filter((r: any) => r.name !== "@everyone")
            .sort((a: any, b: any) => b.position - a.position)

        return NextResponse.json({ 
            welcome, 
            channels: textChannels, 
            roles: filteredRoles 
        })

    } catch (error) {
        console.error("❌ GET - Erro na API:", error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ guildId: string }> }
) {
    try {
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
        
        // LOG PARA DEBUG
        console.log("📥 API RECEBEU:", {
            guildId,
            channelId: body.channelId,
            sendType: body.sendType,
            hasButtonsJson: !!body.buttonsJson,
            buttonsJsonValue: body.buttonsJson
        })

        const welcome = await prisma.welcome.upsert({
            where: { guildId },
            update: {
                channelId: body.channelId ?? null,
                message: body.message ?? "Bem-vindo(a) ao servidor, {user}!",
                enabled: body.enabled ?? true,
                autoroleId: body.autoroleId ?? null,
                bgImage: body.bgImage ?? null,
                templateJson: body.templateJson ?? null,
                sendType: body.sendType ?? "image_embed",
                embedJson: body.embedJson ?? null,
                buttonsJson: body.buttonsJson ?? null,  // <-- ADICIONE ESTA LINHA
            },
            create: {
                guildId,
                channelId: body.channelId ?? null,
                message: body.message ?? "Bem-vindo(a) ao servidor, {user}!",
                enabled: body.enabled ?? true,
                autoroleId: body.autoroleId ?? null,
                bgImage: body.bgImage ?? null,
                templateJson: body.templateJson ?? null,
                sendType: body.sendType ?? "image_embed",
                embedJson: body.embedJson ?? null,
                buttonsJson: body.buttonsJson ?? null,  // <-- ADICIONE ESTA LINHA
            }
        })

        console.log("✅ API SALVOU:", { 
            guildId: welcome.guildId, 
            hasButtonsJson: !!welcome.buttonsJson 
        })

        return NextResponse.json(welcome)

    } catch (error) {
        console.error("❌ POST - Erro na API:", error)
        return NextResponse.json({ error: "Erro interno ao salvar" }, { status: 500 })
    }
}