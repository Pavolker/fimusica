import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-950 border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <div className="text-slate-500 text-sm">
            MDH - Todos os direitos reservados. copywriter {new Date().getFullYear()} - Versão 4.0 - Desenvolvido por PVolker
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default Layout;
