"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SidebarProps {
    guildId: string
}

interface GuildInfo {
    name: string
    icon: string | null
}

interface NavItem {
    name: string
    href: (id: string) => string
    badge?: string
}

const navSections: { title: string; items: NavItem[] }[] = [
    {
        title: "GERAL",
        items: [
            { name: "Visão Geral", href: (id: string) => `/dashboard/${id}` },
            { name: "Boas-vindas", href: (id: string) => `/dashboard/${id}/welcome` },
        ]
    },
    {
        title: "MODERAÇÃO",
        items: [
            { name: "Punições", href: (id: string) => `/dashboard/${id}/punicoes` },
            { name: "Logs", href: (id: string) => `/dashboard/${id}/logs` },
            { name: "AutoMod", href: (id: string) => `/dashboard/${id}/automod` },
        ]
    },
    {
        title: "CONFIGURAÇÕES",
        items: [
            { name: "Configurações", href: (id: string) => `/dashboard/${id}/configuracoes`, badge: "NOVO!" },
        ]
    }
]

export default function Sidebar({ guildId }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [guild, setGuild] = useState<GuildInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchGuildInfo() {
            try {
                const response = await fetch(`/api/guild/${guildId}`, {
                    credentials: "include"
                })

                if (response.status === 401) {
                    router.push(`/api/auth/signin?callbackUrl=/dashboard/${guildId}`)
                    return
                }

                if (!response.ok) {
                    throw new Error(`Erro ${response.status}`)
                }

                const data = await response.json()
                setGuild(data.guild)
            } catch (err) {
                console.error("Erro ao carregar dados do servidor na sidebar:", err)
                setError("Não foi possível carregar o servidor")
            } finally {
                setLoading(false)
            }
        }

        fetchGuildInfo()
    }, [guildId, router])

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + "/")
    }

    const guildIconUrl = guild?.icon
        ? `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.png`
        : null

    return (
        <aside className="w-72 bg-[#0f0f0f] flex flex-col h-full fixed border-r border-[#FF6B00]/20 overflow-y-auto">
            {/* Cabeçalho com informações do servidor */}
            <div className="px-5 py-6 border-b border-gray-800">
                {loading ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
                        <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">
                            ERRO
                        </div>
                        <span className="text-red-400 text-sm">{error}</span>
                    </div>
                ) : guild ? (
                    <div className="flex items-center gap-3">
                        {guildIconUrl ? (
                            <img
                                src={guildIconUrl}
                                alt={guild.name}
                                className="w-10 h-10 rounded-full border-2 border-[#FF6B00] object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center text-white font-bold text-lg">
                                {guild.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="font-bold text-lg text-white truncate">
                            {guild.name}
                        </span>
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">Servidor não encontrado</div>
                )}
            </div>

            {/* Navegação com categorias */}
            <nav className="flex-1 px-3 py-6 space-y-6">
                {navSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const href = item.href(guildId)
                                const active = isActive(href)
                                return (
                                    <Link
                                        key={item.name}
                                        href={href}
                                        className={`
                                            flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200
                                            ${active 
                                                ? "bg-[#FF6B00]/10 text-[#FF6B00] border-l-2 border-[#FF6B00]" 
                                                : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                                            }
                                        `}
                                    >
                                        <span className="text-sm font-medium">{item.name}</span>
                                        {item.badge && (
                                            <span className="text-[10px] bg-[#FF6B00] text-white px-1.5 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Rodapé */}
            <div className="p-4 border-t border-gray-800 space-y-2">
                <div className="flex flex-col gap-1 mb-2">
                    <Link
                        href="/terms"
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 text-sm"
                    >
                        Termos de Serviço
                    </Link>
                    <Link
                        href="/privacy"
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 text-sm"
                    >
                        Política de Privacidade
                    </Link>
                </div>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400"
                >
                    <span>←</span>
                    <span className="text-sm">Trocar servidor</span>
                </Link>
            </div>
        </aside>
    )
}