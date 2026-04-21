import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { guildId: string } }
) {
  const session = await auth()

  // ❌ NUNCA usar redirect aqui
  if (!session || !session.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const res = await fetch(`https://discord.com/api/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    const guilds = await res.json()

    const guild = guilds.find((g: any) => g.id === params.guildId)

    if (!guild) {
      return NextResponse.json(
        { error: "Guild not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ guild })
  } catch (error) {
    console.error("Erro API guild:", error)

    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    )
  }
}