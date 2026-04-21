import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getGuilds, getBotGuilds, isAdmin, getGuildIcon } from "@/lib/discord"
import Link from "next/link"

export default async function Dashboard() {
  const session = await auth()

  // Se não houver sessão, redireciona para login (com callback para voltar ao dashboard)
  if (!session) {
  redirect("/api/auth/signin?callbackUrl=/dashboard")
}

  // Se a sessão existir mas não tiver accessToken (raro), também redireciona
  if (!session?.accessToken) {
    redirect("/api/auth/signin?callbackUrl=/dashboard")
  }

  console.log("🔑 Token presente na sessão:", !!session.accessToken)

  try {
    const [userGuilds, botGuilds] = await Promise.all([
      getGuilds(session.accessToken),
      getBotGuilds()
    ])

    const botGuildIds = new Set(botGuilds.map((g: any) => g.id))

    const guilds = userGuilds.filter((g: any) => {
      const isUserAdmin = isAdmin(g.permissions)
      const botIsPresent = botGuildIds.has(g.id)
      return isUserAdmin && botIsPresent
    })

    console.log(`📊 Total de servidores acessíveis: ${guilds.length}`)

    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header com botão de voltar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-[#FF6B00] transition-colors"
              >
                <span>←</span>
                <span>Voltar ao site</span>
              </Link>
              <div className="w-px h-6 bg-gray-700"></div>
              <img
                src={session.user?.image ?? ""}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-[#FF6B00]"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  Olá, {session.user?.name}! 👋
                </h1>
                <p className="text-gray-400">
                  Selecione um servidor para gerenciar
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/api/auth/signout"
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
              >
                Sair
              </Link>
            </div>
          </div>

          {guilds.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl p-6 text-center">
              <p className="text-gray-400">
                😕 Nenhum servidor encontrado onde você é admin e o bot está presente.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Certifique-se de que o bot está no servidor e você tem permissões de administrador.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {guilds.map((guild: any) => {
                const icon = getGuildIcon(guild.id, guild.icon)
                return (
                  <Link
                    key={guild.id}
                    href={`/dashboard/${guild.id}`}
                    className="bg-[#1a1a1a] hover:bg-[#202020] rounded-xl p-4 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:border-[#FF6B00]/30 border border-transparent"
                  >
                    {icon ? (
                      <img
                        src={icon}
                        alt={guild.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#FF6B00] flex items-center justify-center font-bold text-lg">
                        {guild.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-semibold truncate">
                      {guild.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error("❌ Erro ao carregar dashboard:", error)
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-400">Erro ao carregar servidores</p>
            <p className="text-gray-400 text-sm mt-2">Token pode estar expirado.</p>
            <Link
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="mt-4 inline-block bg-[#FF6B00] hover:bg-[#E55A00] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Fazer login novamente
            </Link>
          </div>
        </div>
      </main>
    )
  }
}