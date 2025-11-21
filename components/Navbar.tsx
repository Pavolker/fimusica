import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => `
    block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${isActive(path)
      ? 'bg-slate-800 text-amber-400 border border-slate-700'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
  `;

  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="font-serif text-xl font-bold text-amber-500 tracking-widest">
                FILOSOFIA DA MÚSICA
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={linkClass('/')}>Início</Link>
              <Link to="/explore" className={linkClass('/explore')}>Explorar Músicas</Link>
              <Link to="/conceitos" className={linkClass('/conceitos')}>Conceitos</Link>
              <Link to="/melos" className={linkClass('/melos')}>
                              <div className="text-center">
                                <div>Tem pergunta sobre música ?</div>
                                <div>Consulte o PV</div>
                              </div>
                            </Link>
              <Link to="/biblioteca" className="text-slate-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Explore o Livro</Link>
              <a
                href="https://sites.google.com/mdh-hability.com/filosofiadamusica/início"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm font-bold ml-4 transition-colors"
              >
                Comprar Livro
              </a>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
            >
              <span className="sr-only">Abrir menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className={linkClass('/')}>Início</Link>
            <Link to="/explore" onClick={() => setIsOpen(false)} className={linkClass('/explore')}>Explorar Músicas</Link>
            <Link to="/conceitos" onClick={() => setIsOpen(false)} className={linkClass('/conceitos')}>Conceitos</Link>
            <Link to="/melos" onClick={() => setIsOpen(false)} className={linkClass('/melos')}>
                            <div className="text-center">
                              <div>Tem pergunta sobre música ?</div>
                              <div>Consulte o PV</div>
                            </div>
                          </Link>
            <Link to="/biblioteca" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">Explore o Livro</Link>
            <a
              href="https://sites.google.com/mdh-hability.com/filosofiadamusica/início"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:text-amber-300 font-bold"
            >
              Comprar Livro
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
