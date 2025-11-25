import React, { useState, useRef, useEffect } from 'react';
import { generatePVResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AgentPV: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Olá. Eu sou PV. Tenho acesso ao acervo de "Filosofia da Música". Consulte-me sobre as obras, as variáveis analíticas ou peça uma interpretação técnica no estilo de Paulo Volker.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await generatePVResponse(userMessage.content);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      let errorContent = "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.";
      
      if (error instanceof Error) {
        if (error.message === 'CHAVE_API_NAO_CONFIGURADA') {
          errorContent = "⚙️ A chave de API do Gemini não foi configurada. Por favor, adicione sua chave de API no arquivo .env.local com a variável VITE_GEMINI_API_KEY.";
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          errorContent = "⚠️ Limite de cota atingido\n\n" + error.message.replace('QUOTA_EXCEEDED: ', '') + "\n\nAcesse: https://console.cloud.google.com/billing para adicionar um método de pagamento.";
        } else if (error.message) {
          errorContent = error.message;
        }
      }
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Agente PV
          </h1>
          <p className="text-slate-400">
            Assistente de IA especializado em Filosofia da Música
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="text-xs text-amber-500 font-bold uppercase mb-2 tracking-wider">{message.role === 'user' ? 'Você' : 'PV'}</div>
                <div
                  className={`rounded-lg p-4 ${message.role === 'user'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="text-xs text-amber-500 font-bold uppercase mb-2 tracking-wider">PV</div>
                <div className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-800 bg-slate-950 p-4">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre música..."
              className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            PV pode gerar imprecisões. Sempre verifique as fontes oficiais do projeto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentPV;
