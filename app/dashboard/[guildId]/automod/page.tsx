"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { checkGuildAccess } from "@/lib/checkGuildAccess"
import Sidebar from "@/components/Sidebar"
interface Channel {
    id: string
    name: string
}

interface AutoModLink {
    id: string
    channelId: string
    enabled: boolean
}

export default function AutoModPage() {
    const params = useParams()
    const guildId = params.guildId as string

    const [channels, setChannels] = useState<Channel[]>([])
    const [automodLinks, setAutomodLinks] = useState<AutoModLink[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedChannel, setSelectedChannel] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
    fetch(`/api/guild/${guildId}/automod`)
        .then(res => {
            if (res.status === 401 || res.status === 403) {
                window.location.href = "/acesso-negado"
                return null
            }
            return res.json()
        })
        .then(data => {
            if (!data) return
            setChannels(data.channels ?? [])
            setAutomodLinks(data.automodLinks ?? [])
            setLoading(false)
        })
}, [guildId])

    async function adicionarCanal() {
        if (!selectedChannel) return
        setSaving(true)

        const res = await fetch(`/api/guild/${guildId}/automod`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelId: selectedChannel, enabled: true })
        })
        const novo = await res.json()

        setAutomodLinks(prev => {
            const existe = prev.find(a => a.channelId === novo.channelId)
            if (existe) return prev.map(a => a.channelId === novo.channelId ? novo : a)
            return [...prev, novo]
        })

        setSelectedChannel("")
        setSaving(false)
    }

    async function toggleCanal(channelId: string, enabled: boolean) {
        await fetch(`/api/guild/${guildId}/automod`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelId, enabled })
        })
        setAutomodLinks(prev =>
            prev.map(a => a.channelId === channelId ? { ...a, enabled } : a)
        )
    }

    async function removerCanal(channelId: string) {
        await fetch(`/api/guild/${guildId}/automod`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelId })
        })
        setAutomodLinks(prev => prev.filter(a => a.channelId !== channelId))
    }

    function getNomeCanal(channelId: string) {
        return channels.find(c => c.id === channelId)?.name ?? channelId
    }

    const canaisDisponiveis = channels.filter(
        c => !automodLinks.find(a => a.channelId === c.id)
    )

    return (
        <div className="flex min-h-screen bg-[#0e0e0e] text-white">
            {/* Sidebar */}
            <Sidebar guildId={guildId} />

            {/* Conteúdo */}
            <main className="ml-64 flex-1 p-8">
                <h1 className="text-3xl font-bold mb-2">AutoMod</h1>
                <p className="text-gray-400 mb-8">Configure a moderação automática por canal</p>

                {loading ? (
                    <div className="text-gray-400 text-center py-12">Carregando...</div>
                ) : (
                    <div className="flex flex-col gap-6 max-w-xl">

                        {/* Adicionar canal */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-1">➕ Adicionar canal</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Selecione um canal para ativar o AutoMod nele.
                            </p>
                            <div className="flex gap-2">
                                <select
                                    value={selectedChannel}
                                    onChange={e => setSelectedChannel(e.target.value)}
                                    className="flex-1 bg-[#0e0e0e] border border-[#333] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#5865F2]"
                                >
                                    <option value="">— Selecione um canal —</option>
                                    {canaisDisponiveis
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(c => (
                                            <option key={c.id} value={c.id}>#{c.name}</option>
                                        ))
                                    }
                                </select>
                                <button
                                    onClick={adicionarCanal}
                                    disabled={saving || !selectedChannel}
                                    className="bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    {saving ? "..." : "Adicionar"}
                                </button>
                            </div>
                        </div>

                        {/* Lista de canais */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4">📋 Canais configurados</h2>

                            {automodLinks.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-4">
                                    Nenhum canal configurado ainda.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {automodLinks.map(a => (
                                        <div key={a.channelId} className="flex items-center justify-between bg-[#0e0e0e] rounded-lg px-4 py-3">
                                            <span className="font-medium">#{getNomeCanal(a.channelId)}</span>
                                            <div className="flex items-center gap-3">
                                                {/* Toggle */}
                                                <button
                                                    onClick={() => toggleCanal(a.channelId, !a.enabled)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${a.enabled ? "bg-[#5865F2]" : "bg-[#333]"}`}
                                                >
                                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${a.enabled ? "left-7" : "left-1"}`} />
                                                </button>
                                                {/* Remover */}
                                                <button
                                                    onClick={() => removerCanal(a.channelId)}
                                                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </main>
        </div>
    )
}