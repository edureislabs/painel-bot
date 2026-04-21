import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await auth()

  // Se não houver sessão ou token de acesso, retorna 401
  if (!session || !session.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized - No session or access token" },
      { status: 401 }
    )
  }

  // Aguarda a resolução da Promise de params
  const { guildId } = await context.params

  try {
    const res = await fetch(`https://discord.com/api/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    // Se o Discord retornar 401, o token expirou
    if (res.status === 401) {
      return NextResponse.json(
        { error: "Discord token expired" },
        { status: 401 }
      )
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch guilds from Discord" },
        { status: res.status }
      )
    }

    const guilds = await res.json()

    const guild = guilds.find((g: any) => g.id === guildId)

    if (!guild) {
      return NextResponse.json(
        { error: "Guild not found or you don't have access" },
        { status: 404 }
      )
    }

    return NextResponse.json({ guild })
  } catch (error) {
    console.error("Erro API guild:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
    
  }
  
}