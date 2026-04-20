import { getBotGuilds } from "@/lib/discord"

// Cache simples em memória (expira a cada 5 minutos)
let guildsCache: { [token: string]: { guilds: any[], expiresAt: number } } = {}

export async function checkGuildAccess(guildId: string, accessToken: string): Promise<boolean> {
    try {
        if (!accessToken) {
            console.log("❌ checkGuildAccess: Sem token de acesso")
            return false
        }

        console.log(`🔍 Verificando acesso ao servidor ${guildId}`)

        // Usar cache para evitar chamar a API do Discord repetidamente
        const now = Date.now()
        let guilds: any[] = []
        if (guildsCache[accessToken] && guildsCache[accessToken].expiresAt > now) {
            guilds = guildsCache[accessToken].guilds
            console.log("📦 Usando cache de servidores do usuário")
        } else {
            console.log("📡 Buscando servidores do usuário na API do Discord...")
            const response = await fetch("https://discord.com/api/users/@me/guilds", {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            if (response.status === 429) {
                const retryAfter = response.headers.get("retry-after") || "1"
                console.log(`⏳ Rate limit! Aguardando ${retryAfter}s...`)
                await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000))
                // Tentar novamente uma vez
                const retryResponse = await fetch("https://discord.com/api/users/@me/guilds", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                if (!retryResponse.ok) {
                    console.log(`❌ Discord API retornou ${retryResponse.status} após retry`)
                    return false
                }
                guilds = await retryResponse.json()
            } else if (!response.ok) {
                console.log(`❌ Discord API retornou ${response.status}`)
                return false
            } else {
                guilds = await response.json()
            }

            // Armazenar em cache por 5 minutos
            guildsCache[accessToken] = {
                guilds,
                expiresAt: now + 5 * 60 * 1000
            }
        }

        const guild = guilds.find((g: any) => g.id === guildId)
        if (!guild) {
            console.log(`❌ Usuário não está no servidor ${guildId}`)
            return false
        }

        const ADMIN_PERMISSION = 0x8
        const hasAdmin = (BigInt(guild.permissions) & BigInt(ADMIN_PERMISSION)) === BigInt(ADMIN_PERMISSION)
        if (!hasAdmin) {
            console.log(`❌ Usuário não é admin do servidor ${guildId}`)
            return false
        }

        console.log(`✅ Acesso concedido para ${guildId}`)
        return true

    } catch (error) {
        console.error("❌ Erro no checkGuildAccess:", error)
        return false
    }
}