"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-red-500/20 text-gray-400 hover:text-red-400 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
            🚪 Sair
        </button>
    )
}