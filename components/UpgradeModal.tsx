import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    if (!isOpen) return null;

    const handleSubscribe = () => {
        // Placeholder for Stripe Checkout redirection
        // In a real app, this would call a function to create a checkout session
        // and redirect the user to the Stripe payment page.
        alert("Redirecionando para o Stripe Checkout... (Simulação)");
        // window.location.href = 'YOUR_STRIPE_CHECKOUT_URL';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                >
                    ✕
                </button>

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                        Atingiu o Limite Diário
                    </h2>

                    <p className="text-slate-400 mb-8">
                        {user
                            ? "Você atingiu seu limite de perguntas diárias como usuário gratuito."
                            : "Você atingiu o limite de perguntas para visitantes."}
                        <br />
                        Desbloqueie o potencial total do Agente PV.
                    </p>

                    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-8 text-left">
                        <h3 className="text-lg font-bold text-white mb-4">Plano Premium</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center text-slate-300 text-sm">
                                <svg className="w-5 h-5 text-amber-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Acesso ilimitado ao Agente PV
                            </li>
                            <li className="flex items-center text-slate-300 text-sm">
                                <svg className="w-5 h-5 text-amber-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Análises musicais aprofundadas
                            </li>
                            <li className="flex items-center text-slate-300 text-sm">
                                <svg className="w-5 h-5 text-amber-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Suporte prioritário
                            </li>
                        </ul>
                        <div className="mt-6 flex items-baseline justify-center">
                            <span className="text-3xl font-bold text-white">R$ 19,90</span>
                            <span className="text-slate-500 ml-2">/mês</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-900/20"
                    >
                        Assinar Agora
                    </button>

                    {!user && (
                        <button
                            onClick={() => {
                                onClose();
                                // Trigger login modal logic here if needed, or rely on parent to handle switching
                            }}
                            className="mt-4 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Já tem uma conta? Faça login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
