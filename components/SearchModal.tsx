import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { SONGS_DB } from '../data/songs';
import { Song } from '../types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FuseResult {
    item: Song;
    score?: number;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FuseResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Configuração do Fuse.js para busca fuzzy
    const fuse = useRef(
        new Fuse(SONGS_DB, {
            keys: [
                { name: 'titulo', weight: 2 },
                { name: 'autor', weight: 1.5 },
                { name: 'genero', weight: 1 },
                { name: 'textoAnalitico', weight: 0.5 }
            ],
            threshold: 0.4, // 0 = match exato, 1 = match qualquer coisa
            distance: 100,
            minMatchCharLength: 2,
            includeScore: true,
            useExtendedSearch: true
        })
    );

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.length >= 2) {
            const searchResults = fuse.current.search(query);
            setResults(searchResults.slice(0, 10)); // Limita a 10 resultados
            setSelectedIndex(0);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results.length > 0) {
            e.preventDefault();
            handleSelectSong(results[selectedIndex].item);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSelectSong = (song: Song) => {
        navigate('/explore', { state: { selectedSongId: song.id } });
        onClose();
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-start justify-center p-4 pt-20">
                <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-slate-800 shadow-2xl transition-all border border-slate-700">

                    {/* Search Input */}
                    <div className="flex items-center gap-3 border-b border-slate-700 px-4 py-4">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Buscar músicas, artistas, gêneros ou textos... (min. 2 caracteres)"
                            className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {query.length < 2 && (
                            <div className="px-4 py-8 text-center text-slate-500">
                                <svg className="mx-auto h-12 w-12 mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-sm">Digite pelo menos 2 caracteres para buscar</p>
                                <p className="text-xs mt-2 text-slate-600">
                                    A busca tolera erros de digitação e funciona em múltiplos idiomas
                                </p>
                            </div>
                        )}

                        {query.length >= 2 && results.length === 0 && (
                            <div className="px-4 py-8 text-center text-slate-500">
                                <svg className="mx-auto h-12 w-12 mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">Nenhum resultado encontrado para "{query}"</p>
                                <p className="text-xs mt-2 text-slate-600">
                                    Tente usar termos diferentes ou verifique a ortografia
                                </p>
                            </div>
                        )}

                        {results.length > 0 && (
                            <div className="py-2">
                                {results.map((result, index) => {
                                    const song = result.item;
                                    const isSelected = index === selectedIndex;
                                    const score = result.score ? (1 - result.score) * 100 : 100;

                                    return (
                                        <button
                                            key={song.id}
                                            onClick={() => handleSelectSong(song)}
                                            className={`w-full text-left px-4 py-3 transition-colors ${isSelected
                                                ? 'bg-slate-700 border-l-4 border-amber-500'
                                                : 'hover:bg-slate-750 border-l-4 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-white truncate">
                                                            {song.titulo}
                                                        </h4>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 whitespace-nowrap">
                                                            {Math.round(score)}% match
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 truncate">
                                                        {song.autor} • {song.genero}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                            Atração: {song.atracaoMusical}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                            Introspecção: {song.grauIntrospeccao}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                            Complexidade: {song.complexidadeEmocional}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="text-amber-500 font-bold text-lg">
                                                        {song.grauSignificacao}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {song.data.substring(0, 4)}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-700 px-4 py-3 bg-slate-900/50">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">↑</kbd>
                                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">↓</kbd>
                                    navegar
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Enter</kbd>
                                    selecionar
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Esc</kbd>
                                    fechar
                                </span>
                            </div>
                            <span>{results.length} resultado{results.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchModal;
