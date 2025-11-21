import React, { useState } from 'react';

interface Quote {
    text: string;
    author: string;
}

const quotes: Quote[] = [
    {
        text: "Uma só coisa pode ser ao mesmo tempo boa e má, e também indiferente. Por exemplo, a música é boa para o melancólico, má para o aflito, para o surdo não é boa nem má",
        author: "Spinoza"
    },
    {
        text: "Um dia, quando todos os livros forem queimados por inúteis, há de haver alguém, pode ser que tenor, e talvez italiano, que ensine esta verdade aos homens. Tudo é música, meu amigo. No princípio era o dó, e o dó fez-se ré, etc",
        author: "Machado de Assis"
    },
    {
        text: "Certos momentos da música. A música era da categoria do pensamento, ambos vibravam no mesmo movimento e espécie",
        author: "Clarice Lispector"
    },
    {
        text: "Música e mito trágicos são expressões idênticas da capacidade dionisíaca do povo, sendo inseparável uma do outro",
        author: "Friedrich Nietzsche"
    },
    {
        text: "Ó rei, eu guardei tal música no fundo da minha alma, e toda vez que a relembro, é mais um momento de êxtase",
        author: "Bhagavad Gita"
    },
    {
        text: "E assim o longo e o curto se delimitam entre si, o alto e o baixo surgem de seu próprio contraste, as notas musicais se harmonizam na própria melodia, e aquele que veio antes demarca o que veio após",
        author: "Tao Te Ching"
    }
];

const QuoteCarousel: React.FC = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleQuoteChange = (index: number) => {
        if (index === currentQuoteIndex) return;

        setIsAnimating(true);
        setTimeout(() => {
            setCurrentQuoteIndex(index);
            setIsAnimating(false);
        }, 300);
    };

    const currentQuote = quotes[currentQuoteIndex];

    return (
        <div className="w-full">
            {/* Quote Display */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                <p className="text-lg leading-8 text-slate-300 font-body-serif italic text-center max-w-3xl mx-auto mb-6">
                    "{currentQuote.text}"
                </p>
            </div>

            {/* Author Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {quotes.map((quote, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuoteChange(index)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${index === currentQuoteIndex
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 border border-slate-700'
                            }
            `}
                    >
                        {quote.author}
                    </button>
                ))}
            </div>

            {/* Navigation Dots (optional, for visual feedback) */}
            <div className="flex items-center justify-center gap-2">
                {quotes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuoteChange(index)}
                        className={`
              h-2 rounded-full transition-all duration-200
              ${index === currentQuoteIndex
                                ? 'w-8 bg-amber-500'
                                : 'w-2 bg-slate-700 hover:bg-slate-600'
                            }
            `}
                        aria-label={`Ver citação ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuoteCarousel;
