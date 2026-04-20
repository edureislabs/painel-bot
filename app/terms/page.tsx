export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Termos de Serviço
                </h1>
                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">1. Aceitação dos Termos</h2>
                        <p>Ao acessar e usar os serviços da EduNex, você concorda com estes Termos de Serviço. Se não concordar, não utilize nossos serviços.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">2. Descrição do Serviço</h2>
                        <p>A EduNex oferece um painel de controle para gerenciamento de bots do Discord, incluindo configuração de boas-vindas, moderação, logs e outras funcionalidades.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">3. Uso Aceitável</h2>
                        <p>Você concorda em não usar nossos serviços para atividades ilegais, abusivas ou que violem os termos de serviço do Discord.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">4. Propriedade Intelectual</h2>
                        <p>Todo o conteúdo, código e design da EduNex são protegidos por direitos autorais. Você não pode copiar, modificar ou distribuir sem autorização.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">5. Limitação de Responsabilidade</h2>
                        <p>A EduNex não se responsabiliza por danos diretos ou indiretos decorrentes do uso de nossos serviços.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">6. Modificações</h2>
                        <p>Podemos atualizar estes termos a qualquer momento. O uso contínuo dos serviços implica aceitação das alterações.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">7. Contato</h2>
                        <p>Para questões sobre estes termos, entre em contato pelo e-mail: <a href="mailto:contato@edunex.com" className="text-[#FF6B00] hover:underline">contato@edunex.com</a></p>
                    </section>
                </div>
                <p className="text-gray-500 text-sm text-center mt-12">Última atualização: Abril de 2026</p>
            </div>
        </main>
    )
}