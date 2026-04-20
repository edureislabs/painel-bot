"use client"

import { signIn, useSession } from "next-auth/react"
import Link from "next/link"

export default function AuthButton() {
    const { data: session, status } = useSession()
    const isLoading = status === "loading"

    if (isLoading) {
        return (
            <div className="w-32 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
        )
    }

    if (session) {
        return (
            <Link
                href="/dashboard"
                className="bg-[#FF6B00] hover:bg-[#E55A00] text-white px-5 py-2 rounded-lg transition-all duration-200 font-semibold"
            >
                Ir para o Painel
            </Link>
        )
    }

    return (
        <button
            onClick={() => signIn("discord")}
            className="bg-[#FF6B00] hover:bg-[#E55A00] text-white px-5 py-2 rounded-lg transition-all duration-200 font-semibold"
        >
            Área do Cliente
        </button>
    )
}