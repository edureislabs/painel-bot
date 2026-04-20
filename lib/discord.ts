import { auth } from "@/auth"

export async function getGuilds(accessToken: string) {
    try {
        if (!accessToken) {
            console.error("❌ Token de acesso não fornecido")
            return []
        }
        
        console.log("🔍 Buscando servidores do usuário...")
        console.log("Token (primeiros 20 chars):", accessToken.substring(0, 20) + "...")
        
        const response = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store"
        })

        if (!response.ok) {
            console.error("❌ Erro ao buscar servidores do usuário:", response.status)
            const errorText = await response.text()
            console.error("Detalhes do erro:", errorText)
            return []
        }

        const data = await response.json()
        console.log(`✅ Encontrados ${data.length} servidores do usuário`)
        return data
    } catch (error) {
        console.error("❌ Erro na função getGuilds:", error)
        return []
    }
}

export async function getBotGuilds() {
    try {
        console.log("🔍 Buscando servidores do bot...")
        console.log("Token do bot presente:", !!process.env.DISCORD_BOT_TOKEN)
        
        const response = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
            cache: "no-store"
        })

        if (!response.ok) {
            console.error("❌ Erro ao buscar servidores do bot:", response.status)
            const errorText = await response.text()
            console.error("Detalhes do erro:", errorText)
            return []
        }

        const data = await response.json()
        console.log(`✅ Encontrados ${data.length} servidores do bot`)
        return data
    } catch (error) {
        console.error("❌ Erro na função getBotGuilds:", error)
        return []
    }
}

export function isAdmin(permissions: string | number) {
    try {
        const permsStr = permissions.toString()
        const permsBigInt = BigInt(permsStr)
        const isAdminResult = (permsBigInt & BigInt(0x8)) === BigInt(0x8)
        return isAdminResult
    } catch (error) {
        console.error("Erro ao verificar permissão de admin:", error)
        return false
    }
}

export function getGuildIcon(guildId: string, icon: string | null) {
    if (!icon) return null
    return `https://cdn.discordapp.com/icons/${guildId}/${icon}.png`
}

export async function getDiscordUser(userId: string) {
    try {
        const response = await fetch(`https://discord.com/api/users/${userId}`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
            cache: "no-store"
        })
        if (!response.ok) return null
        return response.json()
    } catch (error) {
        console.error("Erro ao buscar usuário do Discord:", error)
        return null
    }
}