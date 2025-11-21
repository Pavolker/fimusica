import React, { useState } from 'react';
import { CHAPTERS, Chapter } from '../data/chapters';

const Biblioteca: React.FC = () => {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [isReading, setIsReading] = useState(false);

    const handleReadChapter = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setIsReading(true);
    };

    const handleCloseReader = () => {
        setIsReading(false);
        setTimeout(() => setSelectedChapter(null), 300);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
                    <div className="text-center">
                        <div className="inline-block mb-4">
                            <div className="flex items-center gap-3 bg-amber-500/10 px-6 py-3 rounded-full border border-amber-500/30">
                                <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <span className="text-amber-500 font-semibold">Biblioteca Digital</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
                            Filosofia da Música
                        </h1>

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Explore os capítulos que compõem esta jornada filosófica pela história e essência da música
                        </p>

                        <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <span>19 Capítulos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>Leitura estimada: 2h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CHAPTERS.map((chapter, index) => (
                        <div
                            key={chapter.id}
                            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 cursor-pointer"
                            onClick={() => handleReadChapter(chapter)}
                        >
                            {/* Chapter Number */}
                            <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-lg">{chapter.id}</span>
                            </div>

                            {/* Content */}
                            <div className="mt-4">
                                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                                    {chapter.title}
                                </h3>

                                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                    {chapter.content}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                                        Capítulo {chapter.id}
                                    </span>
                                    <div className="flex items-center gap-2 text-amber-500 text-sm font-medium group-hover:gap-3 transition-all">
                                        <span>Ler</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reading Modal */}
            {selectedChapter && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isReading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={handleCloseReader}
                    />

                    {/* Reader */}
                    <div className={`relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transition-all duration-300 ${isReading ? 'scale-100' : 'scale-95'}`}>

                        {/* Header */}
                        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 p-6 sticky top-0 z-10">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold">{selectedChapter.id}</span>
                                        </div>
                                        <span className="text-sm text-amber-500 font-medium">Capítulo {selectedChapter.id}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                                        {selectedChapter.title}
                                    </h2>
                                </div>

                                <button
                                    onClick={handleCloseReader}
                                    className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-10rem)] p-8">
                            <div className="prose prose-invert prose-amber max-w-none">
                                <p className="text-lg leading-relaxed text-slate-300 font-body-serif whitespace-pre-line">
                                    {selectedChapter.content}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 p-6">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        const prevChapter = CHAPTERS.find(c => c.id === selectedChapter.id - 1);
                                        if (prevChapter) handleReadChapter(prevChapter);
                                    }}
                                    disabled={selectedChapter.id === 1}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Anterior</span>
                                </button>

                                <span className="text-sm text-slate-400">
                                    {selectedChapter.id} de {CHAPTERS.length}
                                </span>

                                <button
                                    onClick={() => {
                                        const nextChapter = CHAPTERS.find(c => c.id === selectedChapter.id + 1);
                                        if (nextChapter) handleReadChapter(nextChapter);
                                    }}
                                    disabled={selectedChapter.id === CHAPTERS.length}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span>Próximo</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Biblioteca;
