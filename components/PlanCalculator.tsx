import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Timer,
  Zap,
  Bot,
  MessageSquare,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

export const PlanCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [includeIA, setIncludeIA] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Lead Form State
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    orcamento: '',
    carros_mes: ''
  });

  const getBasePrice = () => 2700;
  const getIAPrice = () => 300;
  const getTotalPrice = () => getBasePrice() + (includeIA ? getIAPrice() : 0);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome completo é obrigatório';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp com DDD obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Insira um e-mail válido';
    }
    if (!formData.orcamento) newErrors.orcamento = 'Selecione a faixa do seu orçamento';
    if (!formData.carros_mes || Number(formData.carros_mes) < 0) {
      newErrors.carros_mes = 'Insira a estimativa de carros vendidos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    let cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp && !cleanWhatsapp.startsWith('55')) {
      cleanWhatsapp = '55' + cleanWhatsapp;
    }
    const formattedWhatsapp = cleanWhatsapp ? '+' + cleanWhatsapp : '';

    const checkoutItems = [
      {
        name: "Plano Único AutoLeads (Anúncios + CRM WhatsApp para 10 atendentes)",
        description: "Gestão completa de tráfego (Meta/Google Ads), CRM unificado, rastreamento de conversões e suporte VIP.",
        price: getBasePrice(),
        quantity: 1
      }
    ];

    if (includeIA) {
      checkoutItems.push({
        name: "Assistente de Atendimento Inteligente de IA (Trinity)",
        description: "Robô inteligente humanizado respondendo leads 24/7 de forma rápida e automática.",
        price: getIAPrice(),
        quantity: 1
      });
    }

    const leadData = {
      nome: formData.nome,
      whatsapp: formattedWhatsapp,
      email: formData.email,
      orcamento: formData.orcamento,
      carros_mes: formData.carros_mes,
      plano_customizado: checkoutItems.map(i => `${i.name} (R$ ${i.price})`).join(', '),
      total_estimado: `R$ ${getTotalPrice()}/mês`,
      data_hora: new Date().toLocaleString('pt-BR')
    };

    try {
      // 1. Submit the lead info to Google Sheets Webhook asynchronously
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxCyJq5G0S6sjCF6CHf_PWEFzdV2WoySmXyb_NwzmNs9xu4ljqq7PlAXgHEROTasbre/exec';
      try {
        await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(leadData)
        });
        console.log("Lead sincronizado no Google Sheets com sucesso!");
      } catch (sheetError) {
        console.error("Incapaz de registrar planilha directamente:", sheetError);
      }

      // 2. Request our Express proxy backend to establish the Stripe Checkout redirection
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: checkoutItems,
          successUrl: `${window.location.origin}/#/obrigado?stripe_session_id={CHECKOUT_SESSION_ID}&plan_total=${getTotalPrice()}&items=${encodeURIComponent(JSON.stringify(checkoutItems))}`,
          cancelUrl: `${window.location.origin}/`
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao iniciar a transação do Stripe.');
      }

      const resData = await response.json();
      
      if (resData.url) {
        window.location.href = resData.url;
      } else {
        throw new Error('Retorno inválido do gateway de pagamentos.');
      }

    } catch (err: any) {
      console.error("Erro no processamento do checkout:", err);
      alert("Houve um problema de rede ou configuração ao iniciar o checkout Stripe. Mas seu contato foi registrado!");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Benefits & Mental Triggers */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Plan Card Presentation */}
          <div className="bg-gradient-to-br from-brand-950/70 to-black/85 border border-brand-500/20 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
            {/* Scarcity Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/30 text-brand-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
              <Timer className="w-3.5 h-3.5 text-brand-400" />
              Apenas 3 Vagas Disponíveis Este Mês
            </div>

            <div className="mb-6 mt-1 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1">
                <Flame className="w-3 h-3 text-brand-500 fill-brand-500" />
                Plano Ouro de Performance Completa
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                Plano Único AutoLeads
              </h3>
            </div>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              O ecossistema definitivo que une anúncios de alta tração com um sistema impecável de vendas e organização pelo WhatsApp. Perfeito para concessionárias modernas que querem parar de perder leads e explodir suas vendas.
            </p>

            {/* Price Presentation */}
            <div className="bg-black/45 border border-white/5 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Investimento mensal recorrente</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-300">R$</span>
                  <span className="text-4xl font-black text-white leading-none">2.700</span>
                  <span className="text-xs font-bold text-brand-400">/mês</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-xs text-gray-400">
                <div className="flex items-center gap-1.5 text-brand-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" /> Sem fidelidade abusiva
                </div>
                <div className="flex items-center gap-1.5 text-brand-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" /> Suporte VIP incluso
                </div>
              </div>
            </div>

            {/* List of Benefits (Mental Triggers Included) */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Tudo que está incluso neste plano:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Target className="w-3 h-3 text-brand-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">AutoLeads Anúncios</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                      Gestão completa patrocinada (Meta + Google Ads) focada nos veículos com melhor margem do seu pátio.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-3 h-3 text-brand-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">CRM - 10 Conexões de WhatsApp</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                      Software exclusivo de vendas automotivas integrando até 10 conexões de WhatsApp simultâneas para otimizar seu funil.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-brand-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Rastreamento Avançado de Leads</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                      Saiba exatamente qual vídeo, story ou anúncio gerou cada conversa em seu WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-brand-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Suporte Premium e Grupo VIP</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                      Atendimento preferencial de equipe tática por WhatsApp para suporte rápido do dia a dia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional AI Toggle */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div 
                onClick={() => setIncludeIA(p => !p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none ${
                  includeIA 
                    ? 'bg-brand-500/10 border-brand-500/50 shadow-md shadow-brand-500/5' 
                    : 'bg-black/45 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                    includeIA 
                      ? 'bg-brand-500 border-brand-500 text-white' 
                      : 'border-gray-600 bg-black/45'
                  }`}>
                    {includeIA && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-brand-400" />
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-2">
                        Atendimento com IA (Opcional - Trinity Bot)
                        <span className="text-[9px] bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-full uppercase">VIP</span>
                      </h5>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Agente de IA humanizado respondendo, qualificando e agendando leads rápidos 24h por dia.
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-brand-400 shrink-0">
                  + R$ 300/mês
                </span>
              </div>
            </div>

          </div>

          {/* External platforms & services links based on user requests */}
          <div className="bg-gradient-to-r from-brand-950/50 to-brand-900/50 border border-brand-500/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 blur-2xl rounded-full pointer-events-none" />
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Serviços e Ferramentas Adicionais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/35 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Criação & Audiovisual</h5>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Demais serviços de design, gravação, edição de vídeo, e postagens em redes sociais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.open('https://loja.autolead.site', '_blank')}
                  className="w-full text-center text-xs bg-white/5 hover:bg-white/10 text-brand-300 font-bold py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Visitar Loja de Criativos ↗
                </button>
              </div>

              <div className="bg-black/35 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Agentes & Robôs de IA</h5>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Configuração completa de robôs de atendimento automático, agentes inteligentes e inteligência artificial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.open('https://setup.autolead.site', '_blank')}
                  className="w-full text-center text-xs bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 font-bold py-2 rounded-xl border border-brand-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Configurar Robô IA ↗
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-xs text-gray-400">
              💡 <strong>Como funciona o Stripe?</strong> Ao preencher os dados ao lado, você será redirecionado para o ambiente criptografado e seguro do Stripe para validar sua contratação no valor total exato.
            </p>
          </div>
        </div>

        {/* Right Column: Lead Form & Stripe Checkout */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-b from-brand-900/80 to-brand-950/80 border-2 border-brand-600 rounded-3xl p-6 shadow-2xl shadow-brand-900/50 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Preencha Seus Dados para Contratar Já
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={`w-full bg-black/30 border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all ${
                    errors.nome ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="Nome do Diretor ou Sócio"
                />
                {errors.nome && <p className="text-red-400 text-[10px] mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">WhatsApp (com DDD)</label>
                <input 
                  type="tel" 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className={`w-full bg-black/30 border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all ${
                    errors.whatsapp ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="Ex: (49) 98410-1144"
                />
                {errors.whatsapp && <p className="text-red-400 text-[10px] mt-1">{errors.whatsapp}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">E-mail Corporativo</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-black/30 border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all ${
                    errors.email ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="contato@minharevenda.com.br"
                />
                {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Verba de Anúncio</label>
                  <select 
                    name="orcamento"
                    value={formData.orcamento}
                    onChange={handleInputChange}
                    className={`w-full bg-black/30 border rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all appearance-none ${
                      errors.orcamento ? 'border-red-500/50' : 'border-white/10'
                    }`}
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="Ate R$ 2.000">Até R$ 2K</option>
                    <option value="De R$ 2.000 a R$ 5.000">De R$ 2K a R$ 5K</option>
                    <option value="De R$ 5.000 a R$ 10.000">De R$ 5K a R$ 10K</option>
                    <option value="Acima de R$ 10.000">Acima de R$ 10K</option>
                  </select>
                  {errors.orcamento && <p className="text-red-400 text-[10px] mt-1">{errors.orcamento}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Carros Vendidos/Mês</label>
                  <input 
                    type="number" 
                    name="carros_mes"
                    value={formData.carros_mes}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full bg-black/30 border rounded-xl px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all ${
                      errors.carros_mes ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Ex: 15"
                  />
                  {errors.carros_mes && <p className="text-red-400 text-[10px] mt-1">{errors.carros_mes}</p>}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-black/45 rounded-2xl border border-white/5 space-y-2 mt-4">
                <span className="text-[10px] font-bold uppercase text-brand-400 tracking-wider">Resumo de Ativação</span>
                
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <span>Plano Premium Principal:</span>
                  <span className="font-bold text-white">R$ {getBasePrice().toLocaleString('pt-BR')}/mês</span>
                </div>

                {includeIA && (
                  <div className="flex justify-between items-center text-xs text-brand-300 pt-1 border-t border-white/5">
                    <span>Opcional: Robô IA Trinity:</span>
                    <span className="font-bold text-white">R$ {getIAPrice().toLocaleString('pt-BR')}/mês</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10 font-extrabold text-white">
                  <span>Valor Total da Assinatura:</span>
                  <span className="text-brand-400 text-lg">
                    R$ {getTotalPrice().toLocaleString('pt-BR')}/mês
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm shadow-xl mt-4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Configurando Checkout...</span>
                ) : (
                  <>
                    <span>Contratar via Stripe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Garantia total de 7 dias e segurança Stripe Encryption.</span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
