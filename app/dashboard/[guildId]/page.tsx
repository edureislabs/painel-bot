"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

interface Guild {
  id: string
  name: string
  icon: string | null
}

export default function GuildDashboard() {
  const params = useParams()
  const router = useRouter()
  const guildId = params.guildId as string
  const [guild, setGuild] = useState<Guild | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGuild() {
      try {
        const response = await fetch(`/api/guild/${guildId}`, {
          credentials: "include"
        })

        // Se não estiver autenticado, redireciona para login com callback para voltar à página atual
        if (response.status === 401) {
  router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
  return
}

        if (response.status === 404) {
          router.push("/dashboard")
          return
        }

        if (response.ok) {
          const data = await response.json()
          setGuild(data.guild)
        }
      } catch (error) {
        console.error("Erro ao carregar servidor:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGuild()
  }, [guildId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white">
      <Sidebar guildId={guildId} />
      <main className="ml-64 flex-1 p-8">
        {/* Cabeçalho do servidor */}
        <div className="flex items-center gap-4 mb-8">
          {guild?.icon && (
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              alt={guild.name}
              className="w-12 h-12 rounded-full border-2 border-[#FF6B00]"
            />
          )}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {guild?.name}
          </h1>
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Módulo de Boas-vindas */}
          <button
            onClick={() => router.push(`/dashboard/${guildId}/welcome`)}
            className="group bg-[#1a1a1a] hover:bg-[#202020] rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] border border-transparent hover:border-[#FF6B00]/30"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👋</div>
            <h2 className="text-xl font-semibold mb-2">Boas-vindas</h2>
            <p className="text-gray-400 text-sm">
              Configure mensagens de boas-vindas, imagem personalizada, botões interativos e cargo automático.
            </p>
          </button>

          {/* Módulo de Logs */}
          <button
            onClick={() => router.push(`/dashboard/${guildId}/logs`)}
            className="group bg-[#1a1a1a] hover:bg-[#202020] rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] border border-transparent hover:border-[#FF6B00]/30"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
            <h2 className="text-xl font-semibold mb-2">Logs</h2>
            <p className="text-gray-400 text-sm">
              Visualize o histórico completo de ações de moderação, como bans, kicks, mutes e warns.
            </p>
          </button>

          {/* Módulo de AutoMod */}
          <button
            onClick={() => router.push(`/dashboard/${guildId}/automod`)}
            className="group bg-[#1a1a1a] hover:bg-[#202020] rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] border border-transparent hover:border-[#FF6B00]/30"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h2 className="text-xl font-semibold mb-2">AutoMod</h2>
            <p className="text-gray-400 text-sm">
              Ative a moderação automática por canal, bloqueie links ou palavras proibidas.
            </p>
          </button>

          {/* Módulo de Punições */}
          <button
            onClick={() => router.push(`/dashboard/${guildId}/punicoes`)}
            className="group bg-[#1a1a1a] hover:bg-[#202020] rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] border border-transparent hover:border-[#FF6B00]/30"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔨</div>
            <h2 className="text-xl font-semibold mb-2">Punições</h2>
            <p className="text-gray-400 text-sm">
              Gerencie membros punidos, visualize histórico e aplique novas penalidades.
            </p>
          </button>

          {/* Módulo de Configurações */}
          <button
            onClick={() => router.push(`/dashboard/${guildId}/configuracoes`)}
            className="group bg-[#1a1a1a] hover:bg-[#202020] rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] border border-transparent hover:border-[#FF6B00]/30"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚙️</div>
            <h2 className="text-xl font-semibold mb-2">Configurações</h2>
            <p className="text-gray-400 text-sm">
              Configure canais de logs, cargo de mute e outras preferências do servidor.
            </p>
          </button>
        </div>
      </main>
    </div>
  )
}