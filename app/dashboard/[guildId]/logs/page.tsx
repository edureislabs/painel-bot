"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"
import { useParams } from "next/navigation"

interface Log {
    id: number
    type: string
    userId: string | null
    moderatorId: string | null
    motivo: string | null
    createdAt: string
    user: { username: string; avatar: string } | null
    moderator: { username: string; avatar: string } | null
}

const typeLabels: Record<string, { label: string; color: string; emoji: string }> = {
    BAN:       { label: "Ban",        color: "bg-red-500/20 text-red-400",       emoji: "🔨" },
    KICK:      { label: "Kick",       color: "bg-orange-500/20 text-orange-400", emoji: "👢" },
    MUTE:      { label: "Mute",       color: "bg-yellow-500/20 text-yellow-400", emoji: "🔇" },
    UNMUTE:    { label: "Unmute",     color: "bg-green-500/20 text-green-400",   emoji: "🔊" },
    WARN:      { label: "Warn",       color: "bg-blue-500/20 text-blue-400",     emoji: "⚠️" },
    UNWARN:    { label: "Unwarn",     color: "bg-green-500/20 text-green-400",   emoji: "✅" },
    TIMEOUT:   { label: "Timeout",    color: "bg-purple-500/20 text-purple-400", emoji: "⏱️" },
    UNBAN:     { label: "Unban",      color: "bg-green-500/20 text-green-400",   emoji: "✅" },
    DEAFEN:    { label: "Deafen",     color: "bg-yellow-500/20 text-yellow-400", emoji: "🔕" },
    UNDEAFEN:  { label: "Undeafen",   color: "bg-green-500/20 text-green-400",   emoji: "🔔" },
    CLEAR:     { label: "Clear",      color: "bg-gray-500/20 text-gray-400",     emoji: "🗑️" },
}

export default function LogsPage() {
    const params = useParams()
    const guildId = params.guildId as string

    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("TODOS")

    useEffect(() => {
    fetch(`/api/guild/${guildId}/logs`)
    
        .then(res => {
            if (res.status === 401 || res.status === 403) {
                window.location.href = "/acesso-negado"
                return null
            }
            return res.json()
        })
        .then(data => {
            if (!data) return

            setLogs(data)
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
        })
}, [guildId])

    const filtered = filter === "TODOS"
        ? logs
        : logs.filter(l => l.type === filter)

    return (
        <div className="flex min-h-screen bg-[#0e0e0e] text-white">
            {/* Sidebar */}
           <Sidebar guildId={guildId} />
            {/* Conteúdo */}
            <main className="ml-64 flex-1 p-8">
                <h1 className="text-3xl font-bold mb-2">Logs</h1>
                <p className="text-gray-400 mb-6">Histórico de ações de moderação</p>

                {/* Filtros */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["TODOS", "BAN", "UNBAN", "KICK", "MUTE", "UNMUTE", "WARN", "UNWARN", "TIMEOUT", "DEAFEN", "UNDEAFEN", "CLEAR"].map(type => (
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
                        Nenhum log encontrado.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map(log => {
                            const tipo = typeLabels[log.type] ?? { label: log.type, color: "bg-gray-500/20 text-gray-400", emoji: "📌" }
                            return (
                                <div key={log.id} className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tipo.color}`}>
                                            {tipo.emoji} {tipo.label}
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                {log.user && (
                                                    <img src={log.user.avatar} alt={log.user.username} className="w-6 h-6 rounded-full" />
                                                )}
                                                <p className="text-sm font-semibold">
                                                    {log.user?.username ?? log.userId ?? "—"}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Motivo: {log.motivo ?? "Nenhum"}
                                                {log.moderator && ` · por ${log.moderator.username}`}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}