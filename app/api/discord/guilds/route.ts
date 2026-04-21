import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })

  // Se token expirou, avisa o cliente
  if (res.status === 401) {
    return NextResponse.json(
      { error: "Token Discord expirado" },
      { status: 401 }
    )
  }

  const guilds = await res.json()

  console.log("DISCORD RESPONSE:", guilds)

  if (!Array.isArray(guilds)) {
    return NextResponse.json(
      { error: "Erro ao buscar guilds", details: guilds },
      { status: 500 }
    )
  }

  const adminGuilds = guilds.filter(
    (g: any) => (g.permissions & 0x8) === 0x8
  )

  return NextResponse.json(adminGuilds)
}