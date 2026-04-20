"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ParticlesBackground from "@/components/ParticlesBackground" // ajuste o caminho se necessário

export default function AcessoNegado() {
    return (
        <main className="relative min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white overflow-hidden flex items-center justify-center">
            
            {/* Fundo com partículas - use o componente que já está funcionando */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a00] to-black"></div>
                <ParticlesBackground />
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]"
                    style={{ background: "radial-gradient(circle, rgba(255,107,0,0.15) 0%, rgba(255,107,0,0) 70%)" }}
                    animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px]"
                    style={{ background: "radial-gradient(circle, rgba(229,90,0,0.15) 0%, rgba(229,90,0,0) 70%)" }}
                    animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            {/* Conteúdo principal (igual ao que você já tem, sem as partículas) */}
            <motion.div
                className="relative z-10 text-center max-w-md px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                <motion.div
                    className="text-8xl mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
                >
                    🚫
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Acesso Negado
                </motion.h1>

                <motion.p
                    className="text-gray-300 text-lg mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Você não tem permissão para acessar este servidor.
                </motion.p>

                <motion.p
                    className="text-gray-500 text-sm mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Apenas administradores do servidor podem acessar o painel.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link
                        href="/dashboard"
                        className="group relative inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10">← Voltar para meus servidores</span>
                        <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </Link>
                </motion.div>

                {/* Linha decorativa */}
                <motion.div
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <svg className="w-48 h-6" viewBox="0 0 200 12">
                        <defs>
                            <linearGradient id="deniedLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF6B00" stopOpacity="0"/>
                                <stop offset="30%" stopColor="#FF6B00" stopOpacity="1"/>
                                <stop offset="70%" stopColor="#FF8533" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path
                            d="M10,6 Q50,2 100,6 Q150,10 190,6"
                            stroke="url(#deniedLine)"
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <circle cx="100" cy="6" r="2.5" fill="#FF8533">
                            <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                </motion.div>
            </motion.div>
        </main>
    )
}