import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://calendly.com/paulotrafegopago/consultoria-gratuita';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-md">
        <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-brand-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Tudo Certo!</h1>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Recebemos suas informações com sucesso. Prepare-se para acelerar as vendas da sua revenda.
        </p>
        <div className="p-4 bg-brand-900/50 rounded-xl border border-brand-500/20 mb-8">
          <p className="text-sm text-brand-300 font-medium">
            Você será redirecionado para nossa agenda em 5 segundos...
          </p>
        </div>
        <button 
          onClick={() => window.location.href = 'https://calendly.com/paulotrafegopago/consultoria-gratuita'}
          className="btn-primary w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm"
        >
          Acessar Agenda Agora
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
