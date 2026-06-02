import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (!isHome) {
      window.location.href = '/#' + id;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-950/90 backdrop-blur-md border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Aumentei para w-20 h-20 para o texto da imagem ficar legível */}
              <Logo className="w-20 h-20 drop-shadow-[0_0_15px_rgba(250,204,21,0.2)]" />
              
              <div className="hidden sm:flex flex-col justify-center">
                 {/* Removido o texto "MARKETING" grande pois já está na logo, mantendo apenas o descritivo menor */}
                 <span className="text-[10px] tracking-[0.3em] text-brand-400 uppercase font-bold border-l-2 border-brand-500 pl-3 ml-1">
                   Marketing Automotivo
                 </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {isHome ? (
              <>
                <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Serviços</button>
                <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Consultoria</button>
                <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">FAQ</button>
              </>
            ) : (
              <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Voltar ao Início</Link>
            )}
            
            {/* Botão Gerar Contrato ocultado conforme solicitação */}

            <button 
              onClick={() => window.open('https://t.me/autoleadsbrbot', '_blank')}
              className="btn-primary px-7 py-3 rounded-2xl font-bold text-sm shadow-lg uppercase"
            >
              Converse com a Trinity
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-brand-400 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-900 border-t border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {isHome ? (
              <>
                <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-brand-800 rounded-xl">Serviços</button>
                <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-brand-800 rounded-xl">Consultoria</button>
              </>
            ) : (
              <Link to="/" className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-brand-800 rounded-xl">Voltar ao Início</Link>
            )}
            {/* Link mobile Gerar Contrato ocultado */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;