"use client"

import { useEffect, useRef, useState } from "react"
import AuthButton from "@/components/AuthButton"
import ParticlesBackground from "@/components/ParticlesBackground"
import Image from "next/image"
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence } from "framer-motion"

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const [scrolled, setScrolled] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
    
    // Efeito de parallax no mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })
        }
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("scroll", () => setScrolled(window.scrollY > 50))
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const solutions = [
        { icon: "🌐", title: "Desenvolvimento Web", desc: "Sites institucionais, lojas virtuais, sistemas administrativos e dashboards personalizados.", items: ["Sites responsivos", "E-commerces", "Dashboards interativos", "Sistemas sob medida"], color: "#FF6B00" },
        { icon: "🤖", title: "Bots e Automação", desc: "Soluções automatizadas para Discord, Telegram, WhatsApp e outras plataformas.", items: ["Bots para Discord", "Automação para Telegram", "WhatsApp Business API", "Chatbots inteligentes"], color: "#5865F2" },
        { icon: "📊", title: "Consultoria em TI", desc: "Assessoria especializada para otimizar processos e infraestrutura tecnológica.", items: ["Análise de sistemas", "Otimização de processos", "Segurança da informação", "Suporte técnico"], color: "#00FF88" },
        { icon: "📱", title: "Aplicativos Mobile", desc: "Apps nativos e híbridos para Android e iOS, com foco em experiência do usuário.", items: ["React Native", "Flutter", "Apps nativos", "Manutenção contínua"], color: "#FF6B00" },
        { icon: "☁️", title: "Infraestrutura Cloud", desc: "Hospedagem, deploy e gerenciamento de aplicações na nuvem.", items: ["AWS e Google Cloud", "Deploy automatizado", "Monitoramento 24/7", "Escalabilidade"], color: "#5865F2" },
        { icon: "🎓", title: "Treinamentos", desc: "Capacitação em tecnologia para equipes e indivíduos.", items: ["Desenvolvimento de bots", "Programação web", "Boas práticas DevOps", "Cursos personalizados"], color: "#00FF88" }
    ]

    const technologies = ["Node.js", "TypeScript", "Next.js", "React", "Python", "Django", "Discord.js", "Telegraf", "WhatsApp API", "PostgreSQL", "MongoDB", "Prisma", "Docker", "AWS", "Git", "TailwindCSS", "Three.js", "Framer Motion", "WebGL"]

    return (
        <main ref={containerRef} className="relative min-h-screen bg-black text-white overflow-x-hidden">
            
            {/* ========== FUNDO 3D COM PARTÍCULAS ========== */}
            {/* Fundo com partículas (apenas cliente) */}
<div className="fixed inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a00] to-black"></div>
    
    {/* Componente de partículas */}
    <ParticlesBackground />
    
    {/* Esferas de luz (sem random, podem ficar no SSR) */}
    <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(255,107,0,0.2) 0%, rgba(255,107,0,0) 70%)" }}
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(229,90,0,0.2) 0%, rgba(229,90,0,0) 70%)" }}
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
</div>

            {/* ========== NAVBAR COM VIDRO 3D ========== */}
            <motion.nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                    scrolled ? "bg-black/90 backdrop-blur-xl border-b border-[#FF6B00]/30" : "bg-transparent"
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <Image
    src="/images/edunex site.png"
    alt="EduNex Logo"
    width={200}
    height={60}
    className="object-contain"
/>
                    </motion.div>
                    <div className="hidden md:flex items-center gap-8">
                        {["Empresa", "Soluções", "Tecnologias", "Projetos", "Contato"].map((item, i) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-gray-300 hover:text-[#FF6B00] transition-colors relative group"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -2 }}
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B00] group-hover:w-full transition-all duration-300"></span>
                            </motion.a>
                        ))}
                        <AuthButton />
                    </div>
                </div>
            </motion.nav>

            {/* ========== HERO SECTION 3D ========== */}
            <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    className="relative z-10 text-center px-6 max-w-6xl mx-auto"
                    style={{ opacity, scale }}
                >
                    <motion.div
                        className="inline-block px-4 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-sm mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Inovação que conecta pessoas e negócios
                    </motion.div>
                    
                    <motion.h1
    className="text-6xl md:text-8xl font-bold mb-6 relative"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, type: "spring" }}
>
    EduNex
    <span className="relative inline-block">
        {" "}Tecnologia
        <motion.svg
            className="absolute -bottom-8 left-0 w-full"
            height="32"
            viewBox="0 0 300 32"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
        >
            <defs>
                <linearGradient id="titleGradientBig" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0"/>
                    <stop offset="15%" stopColor="#FF6B00" stopOpacity="1"/>
                    <stop offset="50%" stopColor="#FF8533" stopOpacity="1"/>
                    <stop offset="85%" stopColor="#FF6B00" stopOpacity="1"/>
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="secondGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF8533" stopOpacity="0"/>
                    <stop offset="20%" stopColor="#FF8533" stopOpacity="0.6"/>
                    <stop offset="50%" stopColor="#FF6B00" stopOpacity="0.6"/>
                    <stop offset="80%" stopColor="#FF8533" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#FF8533" stopOpacity="0"/>
                </linearGradient>
                <filter id="neonGlowBig">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="glowSoft">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            {/* Sombra da linha */}
            <path
                d="M10,16 Q40,8 75,16 Q110,24 150,16 Q190,8 225,16 Q260,24 290,16"
                stroke="#FF6B00"
                fill="none"
                strokeWidth="6"
                strokeOpacity="0.15"
                filter="url(#glowSoft)"
            />
            
            {/* Linha principal grossa com neon */}
            <path
                d="M10,16 Q40,8 75,16 Q110,24 150,16 Q190,8 225,16 Q260,24 290,16"
                stroke="url(#titleGradientBig)"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#neonGlowBig)"
            />
            
            {/* Linha secundária (mais fina, por cima) */}
            <path
                d="M10,16 Q40,8 75,16 Q110,24 150,16 Q190,8 225,16 Q260,24 290,16"
                stroke="#FFFFFF"
                fill="none"
                strokeWidth="1.5"
                strokeOpacity="0.3"
                strokeLinecap="round"
            />
            
            {/* Linha tracejada inferior */}
            <path
                d="M15,22 Q45,14 80,22 Q115,30 150,22 Q185,14 220,22 Q255,30 285,22"
                stroke="url(#secondGradient)"
                fill="none"
                strokeWidth="1.5"
                strokeDasharray="4 8"
            />
            
            {/* Ponto central GRANDE pulsante */}
            <circle cx="150" cy="16" r="5" fill="#FF8533" filter="url(#neonGlowBig)">
                <animate attributeName="r" values="3;7;3" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            
            {/* Pontos laterais animados */}
            <circle cx="75" cy="16" r="3" fill="#FF6B00" filter="url(#neonGlowBig)">
                <animate attributeName="cy" values="16;8;16" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="225" cy="16" r="3" fill="#FF6B00" filter="url(#neonGlowBig)">
                <animate attributeName="cy" values="16;24;16" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            
            {/* Pontos menores nos extremos */}
            <circle cx="40" cy="8" r="2.5" fill="#FF8533">
                <animate attributeName="cy" values="8;12;8" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="260" cy="24" r="2.5" fill="#FF8533">
                <animate attributeName="cy" values="24;20;24" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            {/* Estrelas decorativas (agora mais espalhadas) */}
            <g opacity="0.7">
                {[30, 50, 100, 120, 180, 200, 240, 270].map((x, i) => (
                    <g key={i}>
                        <line x1={x} y1="12" x2={x} y2="20" stroke="#FF6B00" strokeWidth="1.5">
                            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`}/>
                        </line>
                        <line x1={x-4} y1="16" x2={x+4} y2="16" stroke="#FF6B00" strokeWidth="1.5">
                            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`}/>
                        </line>
                    </g>
                ))}
            </g>
            
            {/* Brilho pulsante no centro */}
            <circle cx="150" cy="16" r="15" fill="#FF8533" opacity="0.1">
                <animate attributeName="r" values="10;20;10" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.05;0.15;0.05" dur="1.5s" repeatCount="indefinite"/>
            </circle>
        </motion.svg>
    </span>
</motion.h1>
                    
                    <motion.p
                        className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto mb-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Soluções completas em desenvolvimento de software, automação, bots, 
                        sistemas web e consultoria tecnológica para empresas e comunidades.
                    </motion.p>
                    
                    <motion.div
                        className="flex flex-wrap gap-4 justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <AuthButton />
                        <motion.a
                            href="#solucoes"
                            className="relative border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10 px-8 py-3 rounded-lg font-semibold overflow-hidden group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">Conheça Nossas Soluções</span>
                            <motion.span
                                className="absolute inset-0 bg-[#FF6B00]"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ opacity: 0.1 }}
                            />
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator 3D */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <motion.div
                            className="w-1.5 h-2 bg-[#FF6B00] rounded-full mt-2"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* ========== SEÇÃO EMPRESA COM EFEITO 3D ========== */}
            <motion.section
                id="empresa"
                className="relative z-10 py-24 px-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Quem somos
                            </h2>
                            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                A EduNex é uma empresa de tecnologia focada em desenvolver soluções inovadoras 
                                que conectam pessoas, automatizam processos e impulsionam negócios.
                            </p>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Com uma equipe apaixonada por tecnologia, entregamos projetos de alta qualidade 
                                para clientes em todo o Brasil, sempre com foco em resultados e satisfação.
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                {[
                                    { number: "+50", label: "Projetos entregues" },
                                    { number: "+30", label: "Clientes ativos" },
                                    { number: "+5", label: "Anos de mercado" }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        className="cursor-pointer"
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="text-4xl font-bold text-[#FF6B00]">{stat.number}</div>
                                        <div className="text-gray-500 text-sm">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        
                        <motion.div
                            className="relative"
                            initial={{ x: 100, opacity: 0, rotateY: 30 }}
                            whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            viewport={{ once: true }}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-[#E55A00] rounded-2xl blur-2xl opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-[#FF6B00]/20 to-[#E55A00]/20 rounded-2xl p-10 text-center backdrop-blur-sm border border-white/10">
                                <motion.div
                                    className="text-8xl mb-6"
                                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    🚀
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-3">Missão</h3>
                                <p className="text-gray-300 mb-8">Transformar ideias em soluções tecnológicas que geram valor.</p>
                                <h3 className="text-2xl font-bold mb-3">Visão</h3>
                                <p className="text-gray-300">Ser referência em inovação e desenvolvimento de software.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* ========== CARDS 3D COM EFEITO DE ROTAÇÃO ========== */}
            <section id="solucoes" className="relative z-10 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Nossas Soluções
                        </h2>
                        <p className="text-gray-400 text-lg">Tecnologia para todas as necessidades do seu negócio</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {solutions.map((solution, i) => (
                            <motion.div
                                key={i}
                                className="group relative cursor-pointer"
                                initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                onHoverStart={() => setHoveredCard(i)}
                                onHoverEnd={() => setHoveredCard(null)}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-[#E55A00] rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                                <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 group-hover:border-[#FF6B00]/50 transition-all duration-500 overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/0 to-[#E55A00]/0 group-hover:from-[#FF6B00]/10 group-hover:to-[#E55A00]/10 transition-all duration-500"
                                        animate={hoveredCard === i ? { opacity: [0, 0.5, 0] } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <motion.div
                                        className="w-20 h-20 bg-gradient-to-br from-[#FF6B00]/20 to-[#E55A00]/20 rounded-2xl flex items-center justify-center mb-6 text-4xl"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {solution.icon}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                                    <p className="text-gray-400 mb-4">{solution.desc}</p>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        {solution.items.map((item, j) => (
                                            <motion.li
                                                key={j}
                                                className="flex items-center gap-2"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: j * 0.05 }}
                                                viewport={{ once: true }}
                                            >
                                                <motion.span
                                                    className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full"
                                                    animate={hoveredCard === i ? { scale: [1, 1.5, 1] } : {}}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== TECNOLOGIAS COM CARROSSEL 3D ========== */}
            <section id="tecnologias" className="relative z-10 py-24 px-6 bg-black/50 backdrop-blur-sm overflow-hidden">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Stack Tecnológico
                        </h2>
                        <p className="text-gray-400 text-lg mb-12">Ferramentas modernas para soluções de ponta</p>
                    </motion.div>
                </div>
                
                <div className="relative">
                    <motion.div
                        className="flex gap-6 whitespace-nowrap"
                        animate={{ x: [0, -1920] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="inline-flex gap-6">
                                {technologies.map((tech, j) => (
                                    <motion.span
                                        key={`${i}-${j}`}
                                        className="inline-block bg-gray-900/50 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-xl text-gray-300 text-sm"
                                        whileHover={{ scale: 1.1, borderColor: "#FF6B00", color: "#FF6B00" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ========== PROJETOS COM EFEITO 3D ========== */}
            <section id="projetos" className="relative z-10 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Projetos em Destaque
                        </h2>
                        <p className="text-gray-400 text-lg">Algumas soluções que já entregamos</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "🤖", title: "EN Bot", desc: "Bot completo para Discord com sistema de welcome profissional, editor de imagem e botões interativos.", tag: "Discord Bot", gradient: "from-[#5865F2]/30 to-[#4752c4]/30" },
                            { icon: "📊", title: "Dashboard Admin", desc: "Painel administrativo completo para gerenciamento de bots e servidores.", tag: "Web App", gradient: "from-[#FF6B00]/30 to-[#E55A00]/30" },
                            { icon: "💬", title: "AutoAtendimento", desc: "Sistema de automação para WhatsApp com respostas automáticas e integração com CRM.", tag: "WhatsApp Bot", gradient: "from-[#25D366]/30 to-[#128C7E]/30" }
                        ].map((project, i) => (
                            <motion.div
                                key={i}
                                className="group cursor-pointer"
                                initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -10, rotateX: 5 }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF6B00]/50 transition-all duration-500">
                                    <motion.div
                                        className={`h-48 bg-gradient-to-r ${project.gradient} flex items-center justify-center text-7xl`}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {project.icon}
                                    </motion.div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{project.desc}</p>
                                        <motion.span
                                            className="inline-block px-3 py-1 bg-[#FF6B00]/20 rounded-full text-[#FF6B00] text-xs"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {project.tag}
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== CONTATO COM EFEITO PARALLAX ========== */}
           <section id="contato" className="py-24 px-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/10 to-[#E55A00]/10"></div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Vamos conversar?</h2>
        <p className="text-gray-300 text-lg mb-10">
            Estamos prontos para ajudar sua empresa a alcançar o próximo nível com tecnologia.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-12">
    <a href="mailto:eduardo2019contato@gmail.com" className="bg-[#FF6B00] hover:bg-[#E55A00] px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105">
       eduardo2019contato@gmail.com
    </a>
    <a 
    href="https://wa.me/5562991485401?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20EduNex.%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20de%20desenvolvimento%20de%20bots%20e%20automa%C3%A7%C3%A3o.%20Podemos%20conversar%3F"
    target="_blank" 
    rel="noopener noreferrer"
    className="border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10 px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
>
    (62) 99148-5401 (WhatsApp)
</a>
</div> 
        
        {/* REDES SOCIAIS - ALTERE AQUI */}
        <div className="flex flex-wrap justify-center gap-6">
            {[
                { name: "LinkedIn", url: "https://www.linkedin.com/in/eduardodosreis18/" },
                { name: "GitHub",   url: "https://github.com/edureislabs" },
                { name: "Instagram",url: "https://www.instagram.com/dev.eduh/" },
                { name: "Discord",  url: "https://discord.gg/sTeFeKtKNV" }, 
            ].map((social, i) => (
                <motion.a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#FF6B00] transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                >
                    {social.name}
                </motion.a>
            ))}
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-gray-500 text-sm">
            <p>&copy; 2026 EduNex - Tecnologia e Inovação. Todos os direitos reservados.</p>
        </div>
    </div>
</section>
        </main>
    )
}