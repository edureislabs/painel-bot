"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function ParticlesBackground() {
    const [particles, setParticles] = useState<Array<{ id: number; style: any }>>([])

    useEffect(() => {
        // Gerar partículas apenas no cliente
        const newParticles = []
        for (let i = 0; i < 200; i++) {
            newParticles.push({
                id: i,
                style: {
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `rgba(255, 107, 0, ${Math.random() * 0.5 + 0.2})`,
                }
            })
        }
        setParticles(newParticles)
    }, [])

    if (particles.length === 0) return null

    return (
        <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={particle.style}
                    animate={{
                        y: [0, -20, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    )
}