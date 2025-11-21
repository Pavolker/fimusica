import React from 'react';

interface ConceptCardProps {
    title: string;
    description: string;
    icon: string;
    color: string;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ title, description, icon, color }) => {
    return (
        <div className={`bg-slate-800 border ${color} rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-start gap-4">
                <div className={`text-4xl ${color.replace('border-', 'text-')}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-white mb-3">{title}</h3>
                    <p className="text-slate-300 leading-relaxed font-body-serif text-justify">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Conceitos: React.FC = () => {
    const concepts = [
        {
            title: "Atração Musical",
            icon: "🎵",
            color: "border-amber-500/30",
            description: "ATRAÇÃO MUSICAL é uma variável que mede o apelo estético da obra. A variável tem o valor de 1 a 3 (sendo 1= pouca atração; 3 = muita atração; e 2 = mediana atração), que define, do meu ponto de vista, a qualidade técnica e harmônica da composição, considerando ritmo, melodia e harmonia, e o quanto a música é esteticamente agradável. Esta variável se traduz no quão atraente a obra é para o ouvinte em termos técnicos, proporcionando uma compreensão de sua popularidade ou de seu valor artístico."
        },
        {
            title: "Grau de Introspecção",
            icon: "🧘",
            color: "border-blue-500/30",
            description: "O GRAU DE INTROSPECÇÃO mensura o potencial da música para induzir estados de reflexão interior. A variável tem o valor de 1 a 3 (sendo 1= baixo grau de introspecção; 3 = alto grau de introspecção; e 2 = mediano grau de introspecção). Essa variável leva em conta o tempo, o andamento e a complexidade da obra, visto que músicas mais lentas e harmonias profundas tendem a favorecer a introspecção. Avaliando o grau de introspecção, buscamos entender o poder da obra de transportar o ouvinte a uma experiência contemplativa, proporcionando um espaço para uma conexão emocional mais profunda."
        },
        {
            title: "Complexidade Emocional",
            icon: "💫",
            color: "border-purple-500/30",
            description: "A COMPLEXIDADE EMOCIONAL se refere à variedade e à profundidade das emoções que a música é capaz de evocar. A variável tem o valor de 1 a 3 (sendo 1= baixa complexidade emocional; 3 = alta complexidade emocional; e 2 = mediana complexidade emocional). Músicas com alta complexidade emocional podem proporcionar uma experiência multifacetada, transmitindo desde sensações de alegria e euforia até sentimentos de nostalgia e melancolia. Essa variável revela a capacidade da obra de criar uma experiência emocional rica e envolvente, que transcende o prazer auditivo e leva o ouvinte a uma jornada emocional."
        },
        {
            title: "Grau de Significação",
            icon: "⭐",
            color: "border-amber-600/50",
            description: "GRAU DE SIGNIFICAÇÃO é uma métrica que soma o valor das variáveis acima identificadas (Atração Musical, Grau de Introspecção e Complexidade Emocional). Essa variável identifica, dentro dos meus critérios uma \"hierarquia de significação musical\", já que possibilita saber quais foram as musicas mais pontuadas. É evidente que as 200 músicas só estão listadas porque todas elas, de uma forma ou de outra, foram importantes em algum momento da minha vida, mas dentro desse \"horizonte musical\", algumas marcaram de forma definitiva a minha consciência musical."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-serif text-white mb-4">
                        Conceitos Analíticos
                    </h1>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Compreenda as métricas exclusivas desenvolvidas por Paulo Volker para análise filosófica e técnica das obras musicais.
                    </p>
                </div>

                {/* Intro Section */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 mb-10 shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="text-5xl">📖</div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-amber-500 mb-3">
                                Metodologia de Análise
                            </h2>
                            <p className="text-slate-300 leading-relaxed font-body-serif text-justify">
                                A análise musical proposta neste projeto vai além da apreciação superficial, buscando compreender as obras através de quatro dimensões fundamentais. Cada música é avaliada em uma escala de 1 a 3 para três variáveis principais, cujo somatório resulta no Grau de Significação, uma métrica que revela o impacto profundo da obra na experiência musical do autor.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Concepts Grid */}
                <div className="space-y-6 mb-10">
                    {concepts.map((concept, index) => (
                        <ConceptCard
                            key={index}
                            title={concept.title}
                            description={concept.description}
                            icon={concept.icon}
                            color={concept.color}
                        />
                    ))}
                </div>

                {/* Scale Explanation */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-xl">
                    <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                        <span>📊</span>
                        Escala de Avaliação
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-600">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-lg font-bold text-white">Nível 1</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Baixo grau na métrica avaliada. Indica presença mínima ou superficial da característica.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-600">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-lg font-bold text-white">Nível 2</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Grau mediano na métrica avaliada. Representa equilíbrio e presença moderada.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-600">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-lg font-bold text-white">Nível 3</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Alto grau na métrica avaliada. Indica presença marcante e profunda da característica.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <p className="text-slate-400 text-sm italic text-center">
                            O Grau de Significação varia de 3 (mínimo) a 9 (máximo), representando a soma das três métricas principais.
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-10 text-center">
                    <p className="text-slate-500 text-sm italic">
                        Estas métricas são subjetivas e refletem a perspectiva filosófica e experiência pessoal do autor.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Conceitos;
