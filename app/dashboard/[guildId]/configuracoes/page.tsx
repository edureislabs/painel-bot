"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Sidebar from "@/components/Sidebar"

interface Channel {
    id: string
    name: string
}

interface Role {
    id: string
    name: string
    color: number
}

interface Setting {
    logChannelId: string | null
    muteRoleId: string | null
    modChannelId: string | null
    prefix: string
    lang: string
}

export default function ConfiguracoesPage() {
    const params = useParams()
    const guildId = params.guildId as string

    const [channels, setChannels] = useState<Channel[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [setting, setSetting] = useState<Setting>({
        logChannelId: null,
        muteRoleId: null,
        modChannelId: null,
        prefix: "!",
        lang: "pt-BR",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        fetch(`/api/guild/${guildId}/configuracoes`)
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
                setRoles(data.roles ?? [])
                setSetting(data.setting ?? {
                    logChannelId: null,
                    muteRoleId: null,
                    modChannelId: null,
                    prefix: "!",
                    lang: "pt-BR",
                })
                setLoading(false)
            })
    }, [guildId])

    async function salvar() {
    console.log("📤 Enviando configurações:", setting)  // <-- adicione
    setSaving(true)
    const response = await fetch(`/api/guild/${guildId}/configuracoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("📥 Resposta da API:", data)  // <-- adicione
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
}
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white">
            <Sidebar guildId={guildId} />

            <main className="ml-64 flex-1 p-8">
                <h1 className="text-3xl font-bold mb-2">Configurações</h1>
                <p className="text-gray-400 mb-8">Configure o comportamento do bot no servidor</p>

                {loading ? (
                    <div className="text-gray-400 text-center py-12">Carregando...</div>
                ) : (
                    <div className="flex flex-col gap-6 max-w-2xl">

                        {/* Prefixo de comandos */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-1">🔤 Prefixo de comandos</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Caractere usado antes dos comandos (ex: !help)
                            </p>
                            <input
    type="text"
    value={setting.prefix}
    onChange={e => setSetting(prev => ({ ...prev, prefix: e.target.value }))}
    onBlur={() => {
        if (setting.prefix === "") {
            setSetting(prev => ({ ...prev, prefix: "!" }))
        }
    }}
    maxLength={5}
    className="w-full bg-[#0e0e0e] border border-[#333] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B00]"
/>
                        </div>

                        {/* Idioma */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-1">🌐 Idioma</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Idioma das mensagens do bot
                            </p>
                            <select
                                value={setting.lang}
                                onChange={e => setSetting(prev => ({ ...prev, lang: e.target.value }))}
                                className="w-full bg-[#0e0e0e] border border-[#333] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B00]"
                            >
                                <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                                <option value="en-US">🇺🇸 Inglês (EUA)</option>
                                <option value="es-ES">🇪🇸 Espanhol</option>
                            </select>
                        </div>

                        {/* Canal de Logs Gerais */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-1">📋 Canal de Logs Gerais</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Eventos como entrada/saída de membros, exclusão de mensagens, etc.
                            </p>
                            <select
                                value={setting.logChannelId ?? ""}
                                onChange={e => setSetting(prev => ({ ...prev, logChannelId: e.target.value || null }))}
                                className="w-full bg-[#0e0e0e] border border-[#333] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B00]"
                            >
                                <option value="">— Nenhum canal —</option>
                                {channels.map(c => (
                                    <option key={c.id} value={c.id}>#{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Canal de Moderação */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-1">🔨 Canal de Moderação</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Ações de moderação (ban, kick, mute) serão enviadas aqui.
                            </p>
                            <select
                                value={setting.modChannelId ?? ""}
                                onChange={e => setSetting(prev => ({ ...prev, modChannelId: e.target.value || null }))}
                                className="w-full bg-[#0e0e0e] border border-[#333] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B00]"
                            >
                                <option value="">— Nenhum canal —</option>
                                {channels.map(c => (
                                    <option key={c.id} value={c.id}>#{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Cargo de Mute - Seleção visual */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-1">🔇 Cargo de Mute</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Selecione o cargo que será aplicado ao mutar um membro.
                            </p>
                            <select
                                value={setting.muteRoleId ?? ""}
                                onChange={e => setSetting(prev => ({ ...prev, muteRoleId: e.target.value || null }))}
                                className="w-full bg-[#0e0e0e] border border-[#333] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B00]"
                            >
                                <option value="">— Nenhum cargo —</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botão salvar */}
                        <button
                            onClick={salvar}
                            disabled={saving}
                            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                                saved
                                    ? "bg-green-500 text-white"
                                    : "bg-[#FF6B00] hover:bg-[#E55A00] text-white hover:scale-[1.01]"
                            } disabled:opacity-50`}
                        >
                            {saving ? "💾 Salvando..." : saved ? "✅ Salvo!" : "💾 Salvar configurações"}
                        </button>

                    </div>
                )}
            </main>
        </div>
    )
}