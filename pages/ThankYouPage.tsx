import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Calendar, CreditCard, Sparkles, ReceiptText, ArrowRight } from 'lucide-react';

interface PurchasedItem {
  name: string;
  price: number;
}

const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(7);
  const isSimulated = searchParams.get('payment_simulated') === 'true';
  const stripeSessionId = searchParams.get('stripe_session_id');
  const planTotal = searchParams.get('plan_total');
  const rawItems = searchParams.get('items');
  const amount = searchParams.get('amount');

  const [itemsList, setItemsList] = useState<PurchasedItem[]>([]);

  useEffect(() => {
    if (rawItems) {
      try {
        const decoded = JSON.parse(decodeURIComponent(rawItems));
        if (Array.isArray(decoded)) {
          setItemsList(decoded);
        }
      } catch (e) {
        console.error("Erro ao extrair items de compra:", e);
      }
    }
  }, [rawItems]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = 'https://calendly.com/paulotrafegopago/consultoria-gratuita';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalValue = planTotal || amount || "2.500";

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-md relative z-10 shadow-2xl">
        <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <CheckCircle className="w-10 h-10 text-brand-400" />
          <div className="absolute inset-0 bg-brand-500/30 rounded-full animate-ping opacity-40 pointer-events-none" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Tudo Certo!</h1>
        <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Sua requisição foi processada com sucesso no AutoLeads! Estamos prontos para acelerar o crescimento da sua concessionária.
        </p>

        {/* Dynamic Stripe Payment Summary */}
        {(stripeSessionId || isSimulated) && (
          <div className="bg-black/30 border border-white/15 rounded-2xl p-5 mb-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs text-brand-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                {isSimulated ? "Assinatura Simulada (Stripe Sandbox)" : "Confirmação de Transação"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase tracking-wider">
                Aprovada
              </span>
            </div>

            {itemsList.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                  <ReceiptText className="w-3.5 h-3.5 text-brand-400" />
                  Módulos Contratados:
                </span>
                <ul className="text-xs space-y-1.5 text-gray-300 pl-1">
                  {itemsList.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                      <span className="font-semibold">{item.name}</span>
                      <span className="font-bold text-brand-400">R$ {Number(item.price).toLocaleString('pt-BR')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-gray-400 uppercase">Total do Plano Smart:</span>
              <span className="text-xl font-extrabold text-white">
                R$ {Number(totalValue).toLocaleString('pt-BR')}/mês
              </span>
            </div>

            {stripeSessionId && (
              <p className="text-[10px] text-gray-500 text-center font-mono select-all">
                Session Token: {stripeSessionId.substring(0, 24)}...
              </p>
            )}
          </div>
        )}

        <div className="p-4 bg-brand-900/40 rounded-2xl border border-brand-500/20 mb-6 flex items-center justify-center gap-3">
          <Calendar className="w-5 h-5 text-brand-400 shrink-0" />
          <p className="text-xs text-brand-300 font-semibold text-left">
            Redirecionando você para nossa agenda em <span className="text-white font-extrabold text-sm px-1 inline-block animate-pulse">{countdown}s</span> para finalizar o setup imediato...
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.href = 'https://calendly.com/paulotrafegopago/consultoria-gratuita'}
            className="btn-primary w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
          >
            <span>Acessar Agenda Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
