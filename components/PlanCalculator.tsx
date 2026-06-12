import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Target, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface PricingItem {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'mensal' | 'único';
  fixed: boolean;
}

const planOptions: PricingItem[] = [
  {
    id: 'trafego',
    name: 'AutoLeads Anúncios',
    description: 'Gestão de anúncios patrocinados completa + Sistema de Rastreamento das conversas.',
    price: 1500,
    period: 'mensal',
    fixed: true, // Essencial, always selected
  },
  {
    id: 'social_media',
    name: 'Social Media',
    description: 'Postagem e edição de vídeos e fotos com base na estratégia e quantia apresentado anteriormente.',
    price: 2000,
    period: 'mensal',
    fixed: false,
  },
  {
    id: 'crm',
    name: 'CRM - WhatsApp & IA',
    description: 'CRM Completo com Rastreamento de WhatsApp para até 10 números + Atendimento de IA incluso (consulte taxas extras para conexões adicionais).',
    price: 3397,
    period: 'mensal',
    fixed: false,
  },
  {
    id: 'suporte',
    name: 'Suporte Dedicado',
    description: 'Atendimento prioritário premium e 100% humanizado via grupo de WhatsApp para suporte operacional.',
    price: 0,
    period: 'mensal',
    fixed: true,
  }
];

export const PlanCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>(['trafego', 'suporte']);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({ trafego: 1, social_media: 1 });
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

  const handleToggle = (id: string, fixed: boolean) => {
    if (fixed) return; // Cannot toggle fixed items
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const calculateTotalPrice = () => {
    return planOptions
      .filter(item => selectedIds.includes(item.id))
      .reduce((sum, item) => {
        const qty = quantities[item.id] || 1;
        return sum + (item.price * qty);
      }, 0);
  };

  const calculateUniqueSetupValue = () => {
    // If they purchase CRM but want full setup, we represent the optional setup fee
    return selectedIds.includes('crm') ? 950 : 0;
  };

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
    // Clear errors upon typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Format WhatsApp Number into +55...
    let cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp && !cleanWhatsapp.startsWith('55')) {
      cleanWhatsapp = '55' + cleanWhatsapp;
    }
    const formattedWhatsapp = cleanWhatsapp ? '+' + cleanWhatsapp : '';

    const leadData = {
      nome: formData.nome,
      whatsapp: formattedWhatsapp,
      email: formData.email,
      orcamento: formData.orcamento,
      carros_mes: formData.carros_mes,
      plano_customizado: planOptions
        .filter(item => selectedIds.includes(item.id))
        .map(i => {
          const qty = quantities[i.id] || 1;
          const showQty = (i.id === 'trafego' || i.id === 'social_media') && qty > 1;
          return `${i.name}${showQty ? ` (${qty}x)` : ''} (R$ ${i.price * qty})`;
        })
        .join(', '),
      total_estimado: `R$ ${calculateTotalPrice()}/mês`,
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

      // 2. Prepare checkout options representing the smart selected list of products
      const checkoutItems = planOptions
        .filter(item => selectedIds.includes(item.id))
        .map(p => {
          const qty = quantities[p.id] || 1;
          const displayPrice = p.price;
          const displayName = (p.id === 'trafego' || p.id === 'social_media') && qty > 1 
            ? `${p.name} (${qty}x)` 
            : p.name;
          return {
            name: displayName,
            description: p.description,
            price: displayPrice,
            quantity: qty
          };
        });

      // If setup is selected, append that item
      const setupCost = calculateUniqueSetupValue();
      if (setupCost > 0) {
        checkoutItems.push({
          name: "Taxa de Setup Único (CRM & IA)",
          description: "Configuração do servidor, ativação de chaves e setup inicial.",
          price: setupCost,
          quantity: 1
        });
      }

      // 3. Request our Express proxy backend to establish the Stripe Checkout redirection
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: checkoutItems,
          successUrl: `${window.location.origin}/#/obrigado?stripe_session_id={CHECKOUT_SESSION_ID}&plan_total=${calculateTotalPrice()}&items=${encodeURIComponent(JSON.stringify(checkoutItems))}`,
          cancelUrl: `${window.location.origin}/`
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao iniciar a transação do Stripe.');
      }

      const resData = await response.json();
      
      // Redirect either to Stripe Sandbox or Mock Redirection url
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

  const totalPrice = calculateTotalPrice();
  const setupFee = calculateUniqueSetupValue();

  return (
    <div className="w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Selector */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-brand-900/10 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              1. Monte seu Combo Inteligente
            </h3>
            <p className="text-gray-400 text-xs mb-6">
              Marque os itens que deseja adicionar ao ecossistema da sua concessionária:
            </p>

            <div className="flex flex-col gap-4">
              {planOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleToggle(option.id, option.fixed)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col gap-3 ${
                      isSelected 
                        ? 'bg-brand-900/30 border-brand-500 shadow-md shadow-brand-500/5' 
                        : 'bg-black/20 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="pt-0.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected 
                            ? 'bg-brand-500 border-brand-500 text-white' 
                            : 'border-gray-600 bg-black/45'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-sm text-white flex items-center gap-2">
                            {option.name}
                            {option.fixed && (
                              <span className="text-[10px] bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-full uppercase">
                                {option.id === 'suporte' ? 'Incluso' : 'Essencial'}
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-extrabold text-brand-400 shrink-0">
                            {option.price === 0 ? 'Grátis' : `R$ ${option.price.toLocaleString('pt-BR')}/${option.period === 'mensal' ? 'mês' : 'setup'}`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* Extra tools / control buttons */}
                    {isSelected && (
                      <div className="pl-9 pr-2">
                        {/* Traffic quantities counter */}
                        {option.id === 'trafego' && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1 pt-2 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs text-brand-300 font-medium">Quantidade de Fontes de Tráfego:</span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={(quantities['trafego'] || 1) <= 1}
                                onClick={() => setQuantities(prev => ({ ...prev, trafego: Math.max(1, (prev.trafego || 1) - 1) }))}
                                className="w-6 h-6 rounded bg-brand-500/20 text-white flex items-center justify-center font-bold text-xs hover:bg-brand-500/40 border border-brand-500/30 disabled:opacity-30 transition-all select-none"
                              >
                                -
                              </button>
                              <span className="text-sm font-extrabold text-white w-4 text-center">
                                {quantities['trafego'] || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQuantities(prev => ({ ...prev, trafego: (prev.trafego || 1) + 1 }))}
                                className="w-6 h-6 rounded bg-brand-500/20 text-white flex items-center justify-center font-bold text-xs hover:bg-brand-500/40 border border-brand-500/30 transition-all select-none"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Social Media quantities counter */}
                        {option.id === 'social_media' && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1 pt-2 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs text-brand-300 font-medium">Quantidade de Perfis/Plataformas:</span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={(quantities['social_media'] || 1) <= 1}
                                onClick={() => setQuantities(prev => ({ ...prev, social_media: Math.max(1, (prev.social_media || 1) - 1) }))}
                                className="w-6 h-6 rounded bg-brand-500/20 text-white flex items-center justify-center font-bold text-xs hover:bg-brand-500/40 border border-brand-500/30 disabled:opacity-30 transition-all select-none"
                              >
                                -
                              </button>
                              <span className="text-sm font-extrabold text-white w-4 text-center">
                                {quantities['social_media'] || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQuantities(prev => ({ ...prev, social_media: (prev.social_media || 1) + 1 }))}
                                className="w-6 h-6 rounded bg-brand-500/20 text-white flex items-center justify-center font-bold text-xs hover:bg-brand-500/40 border border-brand-500/30 transition-all select-none"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {setupFee > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                <span className="text-xs text-orange-200 font-medium">✨ Taxa de Setup Único Adicionada (CRM & IA):</span>
                <span className="text-xs font-bold text-orange-300">R$ {setupFee.toLocaleString('pt-BR')} (Único)</span>
              </div>
            )}
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
              💡 <strong>Como funciona o Stripe?</strong> Ao preencher a aplicação e prosseguir, você será redirecionado para a infraestrutura segura e encriptada de pagamentos do Stripe para confirmar sua assinatura inteligente com cartão de crédito ou boleto/PIX.
            </p>
          </div>
        </div>

        {/* Right Column: Information Forms + Stripe Checkout Details */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-b from-brand-900/80 to-brand-950/80 border-2 border-brand-600 rounded-3xl p-6 shadow-2xl shadow-brand-900/50 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              2. Preencha seus Dados e Inicie
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

              {/* Live Summary values */}
              <div className="p-4 bg-black/45 rounded-2xl border border-white/5 space-y-2 mt-4">
                <span className="text-[10px] font-bold uppercase text-brand-400 tracking-wider">Resumo do Pedido</span>
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <span>Plano Configurado:</span>
                  <span className="font-bold text-white">R$ {totalPrice.toLocaleString('pt-BR')}/mês</span>
                </div>
                {setupFee > 0 && (
                  <div className="flex justify-between items-center text-xs text-gray-300 pt-1 border-t border-white/5">
                    <span>Taxa de Setup Inicial:</span>
                    <span className="font-bold text-white">R$ {setupFee.toLocaleString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10 font-extrabold text-white">
                  <span>Total à Pagar:</span>
                  <span className="text-brand-400 text-base">
                    R$ {(totalPrice + setupFee).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm shadow-xl mt-4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Configurando Checkout...</span>
                ) : (
                  <>
                    <span>Contratar e Assinar via Stripe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Garantia de 7 dias e ambiente 100% criptografado pelo Stripe.</span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
