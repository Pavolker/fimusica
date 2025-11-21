import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { SONGS_DB } from '../data/songs';
import { Song } from '../types';

interface FuseResult {
    item: Song;
    score?: number;
}

const GoogleStyleSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FuseResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
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
            threshold: 0.4,
            distance: 100,
            minMatchCharLength: 2,
            includeScore: true,
            useExtendedSearch: true
        })
    );

    useEffect(() => {
        if (query.length >= 2) {
            const searchResults = fuse.current.search(query);
            setResults(searchResults.slice(0, 8));
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
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const handleSelectSong = (song: Song) => {
        navigate('/explore', { state: { selectedSongId: song.id } });
        setQuery('');
        setIsFocused(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto relative">
            {/* Search Input - Google Style */}
            <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-105' : ''}`}>
                <div className={`flex items-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 ${isFocused ? 'shadow-2xl' : ''}`}>
                    <div className="pl-6 pr-3">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder="Buscar músicas, artistas ou gêneros..."
                        className="flex-1 py-4 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent text-base"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="px-3 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <div className="pr-6 pl-3">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                </div>

                {/* Hint Text */}
                {!isFocused && !query && (
                    <div className="absolute -bottom-8 left-0 right-0 text-center">
                        <p className="text-xs text-slate-500">
                            A busca tolera erros de digitação e funciona em múltiplos idiomas
                        </p>
                    </div>
                )}
            </div>

            {/* Results Dropdown - Google Style */}
            {isFocused && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-200">
                    <div className="max-h-96 overflow-y-auto">
                        {results.map((result, index) => {
                            const song = result.item;
                            const isSelected = index === selectedIndex;
                            const score = result.score ? (1 - result.score) * 100 : 100;

                            return (
                                <button
                                    key={song.id}
                                    onClick={() => handleSelectSong(song)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full text-left px-6 py-4 transition-colors ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                </svg>
                                                <h4 className="font-medium text-slate-800 truncate">
                                                    {song.titulo}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate ml-6">
                                                {song.autor} • {song.genero} • {song.data.substring(0, 4)}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 ml-6">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                    Significação: {song.grauSignificacao}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {Math.round(score)}% match
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 px-6 py-3 bg-slate-50">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Use ↑↓ para navegar, Enter para selecionar</span>
                            <span className="font-medium">{results.length} resultado{results.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* No Results */}
            {isFocused && query.length >= 2 && results.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-slate-200">
                    <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-600 font-medium">Nenhum resultado encontrado</p>
                    <p className="text-sm text-slate-400 mt-1">Tente usar termos diferentes</p>
                </div>
            )}
        </div>
    );
};

export default GoogleStyleSearch;
