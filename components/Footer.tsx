import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Logo } from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-950 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <Logo className="w-12 h-12" />
               <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-none">AUTOLEADS</span>
                  <span className="text-[10px] text-gray-400">Marketing Automotivo</span>
               </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Assessoria de Marketing e Vendas especializada em revendas de carros. Resolvemos seus gargalos de forma eficiente.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Serviços</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Gestão de Tráfego</li>
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Social Media</li>
              <li className="hover:text-brand-400 transition-colors cursor-pointer">CRM com IA</li>
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Produção de Conteúdo</li>
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Consultoria de Vendas</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Empresa</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Sobre Nós</li>
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Depoimentos</li>
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Política de Privacidade</li>
              <li className="hover:text-brand-400 transition-colors cursor-pointer">Termos de Uso</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Contato</h4>
            <div className="flex flex-col space-y-4">
              <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors bg-white/5 p-3 rounded-2xl hover:bg-white/10 border border-white/5">
                <MessageCircle size={20} className="text-brand-500" />
                <span>+55 49 98410-1144</span>
              </a>
              <div className="text-sm text-gray-500 pt-2">
                <p className="text-white font-medium">Paulo H. França</p>
                <p>Gestor de Tráfego | Especialista em Veículos</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AutoLeads. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-600">Brasil</span>
            <span className="text-xs text-gray-600">Portugal</span>
            <span className="text-xs text-gray-600">EUA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;