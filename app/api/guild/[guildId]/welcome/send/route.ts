import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ guildId: string }> }
) {
    console.log("=== 📨 ENVIANDO WELCOME ===")
    
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { guildId } = await params
    const { userId, username, memberCount } = await request.json()

    console.log(`👋 Novo membro: ${username} (${userId})`)

    // Buscar configurações do welcome
    const welcome = await prisma.welcome.findUnique({ where: { guildId } })
    
    if (!welcome || !welcome.enabled || !welcome.channelId) {
        console.log("❌ Welcome desativado ou sem canal configurado")
        return NextResponse.json({ error: "Welcome desativado" }, { status: 400 })
    }

    // Buscar servidor
    const guildResponse = await fetch(`https://discord.com/api/guilds/${guildId}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    })
    const guildData = await guildResponse.json()
    const serverName = guildData.name

    // Buscar avatar
    const userResponse = await fetch(`https://discord.com/api/users/${userId}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    })
    const userData = await userResponse.json()
    const avatarUrl = userData.avatar 
        ? `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=256`
        : "https://cdn.discordapp.com/embed/avatars/0.png"

    // Processar mensagem
    const processText = (text: string) => {
        return text
            .replace(/{user}/g, username)
            .replace(/{username}/g, username)
            .replace(/{server}/g, serverName)
            .replace(/{count}/g, memberCount.toString())
    }

    const messageText = processText(welcome.message || "Bem-vindo(a) ao servidor, {user}!")

    let imageArrayBuffer: ArrayBuffer | null = null

    // Gerar imagem personalizada se tiver template
    if (welcome.templateJson) {
        console.log("🎨 Gerando imagem personalizada...")
        
        try {
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
            
            const imageResponse = await fetch(`${baseUrl}/api/guild/${guildId}/welcome/generate-image`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
    username,
    memberCount,
    serverName,
    message: messageText,
    avatarUrl
})
            })
            
            if (imageResponse.ok) {
                imageArrayBuffer = await imageResponse.arrayBuffer()
                console.log(`✅ Imagem gerada: ${imageArrayBuffer.byteLength} bytes`)
            } else {
                console.error("❌ Falha ao gerar imagem:", await imageResponse.text())
            }
        } catch (error) {
            console.error("❌ Erro ao gerar imagem:", error)
        }
    }

    // Construir embed
    const embed: any = {
        color: 0x5865F2,
        timestamp: new Date().toISOString(),
        footer: {
            text: `Membro #${memberCount}`
        },
        thumbnail: {
            url: avatarUrl
        }
    }

    let response

    if (imageArrayBuffer) {
        // Enviar com imagem anexada - usar ArrayBuffer diretamente
        console.log("📤 Enviando mensagem com imagem...")
        
        const formData = new FormData()
        // Criar Blob a partir do ArrayBuffer
        const blob = new Blob([imageArrayBuffer], { type: "image/png" })
        formData.append("file", blob, "welcome.png")
        formData.append("payload_json", JSON.stringify({
            content: messageText,
            embeds: [embed]
        }))
        
        response = await fetch(`https://discord.com/api/channels/${welcome.channelId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
            body: formData
        })
    } else {
        // Enviar apenas texto
        console.log("📤 Enviando mensagem sem imagem...")
        
        embed.description = messageText
        
        response = await fetch(`https://discord.com/api/channels/${welcome.channelId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ embeds: [embed] })
        })
    }

    if (!response.ok) {
        const error = await response.text()
        console.error("❌ Erro ao enviar:", error)
        return NextResponse.json({ error: "Erro ao enviar" }, { status: 500 })
    }

    console.log("✅ Mensagem enviada com sucesso!")

    // Dar cargo automático
    if (welcome.autoroleId) {
        console.log(`🎭 Adicionando cargo ${welcome.autoroleId}`)
        await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}/roles/${welcome.autoroleId}`, {
            method: "PUT",
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
        }).catch(console.error)
    }

    return NextResponse.json({ success: true })
}