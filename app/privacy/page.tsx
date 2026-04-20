export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a] text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Política de Privacidade
                </h1>
                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">1. Coleta de Informações</h2>
                        <p>A EduNex coleta informações básicas de sua conta do Discord (ID, nome, avatar) para autenticação e para associar configurações aos seus servidores.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">2. Uso das Informações</h2>
                        <p>As informações são usadas exclusivamente para fornecer os serviços do painel, como salvar configurações de boas-vindas, moderação e logs. Não compartilhamos seus dados com terceiros.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">3. Armazenamento e Segurança</h2>
                        <p>Seus dados são armazenados em um banco de dados seguro (PostgreSQL). Tomamos medidas razoáveis para proteger suas informações, mas nenhum sistema é 100% seguro.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">4. Cookies e Sessões</h2>
                        <p>Utilizamos cookies de sessão para manter sua autenticação. Não usamos cookies de rastreamento de terceiros.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">5. Direitos do Usuário</h2>
                        <p>Você pode solicitar a exclusão de seus dados a qualquer momento entrando em contato conosco. Seus dados são mantidos apenas enquanto sua conta estiver ativa.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">6. Alterações na Política</h2>
                        <p>Podemos atualizar esta política periodicamente. Recomendamos revisar esta página regularmente.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 text-[#FF6B00]">7. Contato</h2>
                        <p>Para questões de privacidade, entre em contato: <a href="mailto:privacidade@edunex.com" className="text-[#FF6B00] hover:underline">privacidade@edunex.com</a></p>
                    </section>
                </div>
                <p className="text-gray-500 text-sm text-center mt-12">Última atualização: Abril de 2026</p>
            </div>
        </main>
    )
}