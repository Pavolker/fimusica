import React from 'react';
import { Link } from 'react-router-dom';
import GoogleStyleSearch from '../components/GoogleStyleSearch';
import QuoteCarousel from '../components/QuoteCarousel';

const Home: React.FC = () => {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 flex-grow flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#d97706] to-[#1e293b] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-4xl text-center w-full">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif mb-6">
            Filosofia da Música
          </h1>

          {/* Quote Carousel */}
          <div className="mt-6 mb-10">
            <QuoteCarousel />
          </div>

          {/* Google Style Search */}
          <div className="mb-12">
            <GoogleStyleSearch />
          </div>

          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20">
              Conheça o livro que originou o projeto. <a href="https://sites.google.com/mdh-hability.com/filosofiadamusica/início" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-500"><span className="absolute inset-0" aria-hidden="true" />Ler mais <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>


          <p className="mt-6 text-base leading-7 text-slate-400 max-w-2xl mx-auto">
            Bem-vindo à edição digital interativa. Explore uma curadoria de 200 obras analisadas por Paulo Volker através de métricas exclusivas como Atração Musical, Introspecção e Complexidade Emocional.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-all text-center"
            >
              Explorar as 200 Músicas
            </Link>
            <Link
              to="/conceitos"
              className="w-full sm:w-auto rounded-md bg-slate-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 border border-slate-600 transition-all text-center"
            >
              Entender os Conceitos
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <Link to="/melos" className="text-sm font-semibold leading-6 text-white hover:text-amber-400 transition-colors">
              Tem pergunta sobre música ? Consulte o PV <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1e293b] to-[#d97706] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
