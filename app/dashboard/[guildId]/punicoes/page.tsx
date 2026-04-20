"use client"
import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface Punishment {
    id: number
    userId: string
    moderatorId: string
    type: string
    motivo: string | null
    active: boolean
    createdAt: string
    user: {
        username: string
        avatar: string
    } | null
}

const typeLabels: Record<string, { label: string; color: string }> = {
    BAN:     { label: "Ban",     color: "bg-red-500/20 text-red-400" },
    KICK:    { label: "Kick",    color: "bg-orange-500/20 text-orange-400" },
    MUTE:    { label: "Mute",    color: "bg-yellow-500/20 text-yellow-400" },
    WARN:    { label: "Warn",    color: "bg-blue-500/20 text-blue-400" },
    TIMEOUT: { label: "Timeout", color: "bg-purple-500/20 text-purple-400" },
}

export default function PunicoesPage() {
    const params = useParams()
    const guildId = params.guildId as string

    const [punishments, setPunishments] = useState<Punishment[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("TODOS")

    useEffect(() => {
    fetch(`/api/guild/${guildId}/punicoes`)
        .then(res => {
            if (res.status === 401 || res.status === 403) {
                window.location.href = "/acesso-negado"
                return null
            }
            return res.json()
        })
        .then(data => {
            if (!data) return

            setPunishments(data)
        })
        .catch(() => {
            // opcional: tratar erro
        })
        .finally(() => {
            setLoading(false)
        })
}, [guildId])

async function revogar(id: number, type: string, userId: string) {
    await fetch(`/api/guild/${guildId}/punicoes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, userId })
    })
    setPunishments(prev =>
        prev.map(p => p.id === id ? { ...p, active: false } : p)
    )
}

    const filtered = filter === "TODOS"
        ? punishments
        : punishments.filter(p => p.type === filter)

    return (
        <div className="flex min-h-screen bg-[#0e0e0e] text-white">
            {/* Sidebar */}
            <Sidebar guildId={guildId} />

            {/* Conteúdo */}
            <main className="ml-64 flex-1 p-8">
                <h1 className="text-3xl font-bold mb-2">Punições</h1>
                <p className="text-gray-400 mb-6">Gerencie as punições do servidor</p>

                {/* Filtros */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["TODOS", "BAN", "KICK", "MUTE", "WARN", "TIMEOUT"].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                filter === type
                                    ? "bg-[#5865F2] text-white"
                                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-gray-400 text-center py-12">Carregando...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-gray-400 text-center py-12">
                        Nenhuma punição encontrada.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map(p => {
                            const tipo = typeLabels[p.type] ?? { label: p.type, color: "bg-gray-500/20 text-gray-400" }
                            return (
                                <div key={p.id} className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tipo.color}`}>
                                            {tipo.label}
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-2">
    {p.user && (
        <img src={p.user.avatar} alt={p.user.username} className="w-7 h-7 rounded-full" />
    )}
    <p className="text-sm font-semibold">
        {p.user?.username ?? p.userId}
    </p>
</div>
                                            <p className="text-xs text-gray-400">
                                                Motivo: {p.motivo ?? "Nenhum"} · {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {p.active ? (
                                            <>
                                                <span className="text-xs text-green-400 font-medium">● Ativo</span>
                                                <button
                                                    onClick={() => revogar(p.id, p.type, p.userId)}
                                                    className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    Revogar
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-500 font-medium">● Inativo</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}