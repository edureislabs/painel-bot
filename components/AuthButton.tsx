"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleLogin = () => {
    // Redireciona para o dashboard após autenticação bem-sucedida
    signIn("discord", { callbackUrl: "/dashboard" })
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const handleDashboard = () => {
    router.push("/dashboard")
  }

  if (status === "loading") {
    return (
      <div className="w-24 h-10 bg-gray-800/50 rounded-lg animate-pulse" />
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <motion.button
          onClick={handleDashboard}
          className="bg-[#FF6B00] hover:bg-[#E55A00] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ir para o Painel
        </motion.button>
        <motion.button
          onClick={handleLogout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sair
        </motion.button>
      </div>
    )
  }

  return (
    <motion.button
      onClick={handleLogin}
      className="bg-[#5865F2] hover:bg-[#4752C4] px-6 py-2 rounded-lg font-semibold transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Entrar com Discord
    </motion.button>
  )
}