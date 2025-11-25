import React, { useState, useMemo, useEffect } from 'react';
import { SONGS_DB } from '../data/songs';
import { Song, SortOption } from '../types';
import { Link, useLocation } from 'react-router-dom';

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DATE_DESC);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const location = useLocation();

  // Seleciona música se vier da busca global
  useEffect(() => {
    const state = location.state as { selectedSongId?: string };
    if (state?.selectedSongId) {
      const song = SONGS_DB.find(s => s.id === state.selectedSongId);
      if (song) {
        setSelectedSong(song);
        // Limpa o state para não reselecionar ao voltar
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  // Filter and Sort Logic
  const filteredSongs = useMemo(() => {
    let result = SONGS_DB.filter(song =>
      song.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.genero.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case SortOption.TITLE_ASC:
        result.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case SortOption.SIGNIFICATION_DESC:
        result.sort((a, b) => b.grauSignificacao - a.grauSignificacao);
        break;
      case SortOption.COMPLEXITY_DESC:
        result.sort((a, b) => b.complexidadeEmocional - a.complexidadeEmocional);
        break;
      case SortOption.DATE_DESC:
      default:
        // Assuming ISO date strings
        result.sort((a, b) => b.data.localeCompare(a.data));
        break;
    }
    return result;
  }, [searchTerm, sortOption]);

  const MetricBadge = ({ value, max = 3 }: { value: number, max?: number }) => (
    <div className="flex space-x-1">
      {[...Array(max)].map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${i < value ? 'bg-amber-500' : 'bg-slate-700'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold leading-7 text-white sm:truncate font-serif">
              Acervo Musical
            </h2>
            <p className="mt-1 text-slate-400 text-sm">
              Navegue pelas 200 obras catalogadas e analisadas.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-4">
            <input
              type="text"
              placeholder="Buscar título, autor, gênero..."
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-2.5 placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              {Object.values(SortOption).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Table List - Hidden on mobile when song is selected */}
          <div className={`flex-1 transition-all ${selectedSong ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}>
            <div className="bg-slate-800 shadow overflow-hidden sm:rounded-lg border border-slate-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Música</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Gênero</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Indicadores</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {filteredSongs.map((song) => (
                      <tr
                        key={song.id}
                        onClick={() => setSelectedSong(song)}
                        className={`cursor-pointer hover:bg-slate-700 transition-colors ${selectedSong?.id === song.id ? 'bg-slate-700 ring-1 ring-inset ring-amber-500' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-white">{song.titulo}</div>
                          <div className="text-sm text-slate-400">{song.autor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-900 text-slate-300 border border-slate-600">
                            {song.genero}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-xs text-slate-400 w-32 justify-between">
                              <span>Introspecção</span>
                              <MetricBadge value={song.grauIntrospeccao} />
                            </div>
                            <div className="flex items-center text-xs text-slate-400 w-32 justify-between">
                              <span>Significação</span>
                              <span className="font-mono text-amber-500 font-bold">{song.grauSignificacao}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-amber-500 hover:text-amber-400">
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details Panel (Responsive Side/Bottom) */}
          {selectedSong && (
            <div className="w-full lg:w-1/2 animate-fade-in-up">
              <div className="bg-slate-800 border border-amber-900/30 rounded-lg shadow-xl overflow-hidden lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">

                {/* Header with YouTube Button - Always Visible */}
                <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-serif text-white truncate">{selectedSong.titulo}</h3>
                      <p className="text-base text-amber-500 truncate">{selectedSong.autor}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedSong.data}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* YouTube Buttons - Show all available links in multiple rows if needed */}
                      <div className="flex flex-wrap gap-2 justify-end">
                        {selectedSong.youtubeLinks && selectedSong.youtubeLinks.length > 0 ? (
                          selectedSong.youtubeLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2 shadow-lg hover:shadow-red-700/50 whitespace-nowrap"
                              title={`Ouvir no YouTube${selectedSong.youtubeLinks.length > 1 ? ` (${index + 1}/${selectedSong.youtubeLinks.length})` : ''}`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                              </svg>
                              <span className="hidden sm:inline">
                                YouTube{selectedSong.youtubeLinks.length > 1 ? ` ${index + 1}` : ''}
                              </span>
                            </a>
                          ))
                        ) : (
                          <a
                            href={selectedSong.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2 shadow-lg hover:shadow-red-700/50 whitespace-nowrap"
                            title="Ouvir no YouTube"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                            <span className="hidden sm:inline">YouTube</span>
                          </a>
                        )}
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={() => setSelectedSong(null)}
                        className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded transition-colors self-end"
                        title="Fechar"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile: Back to list button */}
                <div className="lg:hidden p-4 bg-slate-900/50 border-b border-slate-700">
                  <button
                    onClick={() => setSelectedSong(null)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors text-sm border border-slate-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar à lista de músicas
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto lg:max-h-[calc(100vh-16rem)] p-6">

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-900/50 p-4 rounded-lg">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Atração Musical</span>
                      <MetricBadge value={selectedSong.atracaoMusical} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Introspecção</span>
                      <MetricBadge value={selectedSong.grauIntrospeccao} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Complexidade</span>
                      <MetricBadge value={selectedSong.complexidadeEmocional} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Grau de Significação</span>
                      <span className="text-2xl font-bold text-amber-500 font-mono">{selectedSong.grauSignificacao}</span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="prose prose-invert prose-amber max-w-none mb-6">
                    <h4 className="text-sm uppercase tracking-widest text-slate-400 mb-2">Análise Filosófica</h4>
                    <p className="font-body-serif text-slate-200 leading-relaxed text-justify">
                      {selectedSong.textoAnalitico}
                    </p>
                  </div>

                  {/* Additional Action */}
                  <div className="pt-4 border-t border-slate-700">
                    <Link
                      to="/melos"
                      className="block text-center bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors text-sm border border-slate-600"
                    >
                      💬 Tem pergunta sobre música ? Consulte o PV
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
