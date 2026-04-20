import { auth } from "@/auth"

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return Response.json({ error: "Não autenticado" }, { status: 401 })
  }

  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })

  const guilds = await res.json()

  // 🔥 DEBUG (muito importante)
  console.log("DISCORD RESPONSE:", guilds)

  // 🛑 proteção contra erro
  if (!Array.isArray(guilds)) {
    return Response.json(
      { error: "Erro ao buscar guilds", details: guilds },
      { status: 500 }
    )
  }

  // filtrar admin (0x8)
  const adminGuilds = guilds.filter(
    (g: any) => (g.permissions & 0x8) === 0x8
  )

  return Response.json(adminGuilds)
}