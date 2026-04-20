"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ParticlesBackground from "@/components/ParticlesBackground"

export default function NotFound() {
    return (
        <main className="relative min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white overflow-hidden flex items-center justify-center">
            
            {/* Fundo com partículas */}
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

            {/* Conteúdo principal */}
            <motion.div
                className="relative z-10 text-center max-w-lg px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                <motion.div
                    className="text-9xl md:text-9xl font-black mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
                >
                    <span className="bg-gradient-to-r from-[#FF6B00] to-[#E55A00] bg-clip-text text-transparent">404</span>
                </motion.div>

                <motion.div
                    className="text-6xl mb-6"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    🔍
                </motion.div>

                <motion.h1
                    className="text-3xl md:text-4xl font-bold mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Página não encontrada
                </motion.h1>

                <motion.p
                    className="text-gray-300 text-lg mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    A página que você está procurando não existe ou foi movida.
                </motion.p>

                <motion.p
                    className="text-gray-500 text-sm mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Verifique o URL ou volte para o início.
                </motion.p>

                <motion.div
                    className="flex flex-wrap gap-3 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                        🏠 Ir para o painel
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                        ← Voltar ao início
                    </Link>
                </motion.div>

                {/* Linha decorativa */}
                <motion.div
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                >
                    <svg className="w-48 h-6" viewBox="0 0 200 12">
                        <defs>
                            <linearGradient id="line404" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF6B00" stopOpacity="0"/>
                                <stop offset="30%" stopColor="#FF6B00" stopOpacity="1"/>
                                <stop offset="70%" stopColor="#FF8533" stopOpacity="1"/>
                                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path
                            d="M10,6 Q50,2 100,6 Q150,10 190,6"
                            stroke="url(#line404)"
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