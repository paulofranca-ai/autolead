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
  Layers,
  Award
} from 'lucide-react';

export const PlanCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Configurator Options State
  const [networks, setNetworks] = useState({
    meta: true,
    google: true,
    tiktok: false,
  });

  const [addons, setAddons] = useState({
    crm: true,
    ai: true,
  });

  // Lead Form State
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    orcamento: '',
    carros_mes: ''
  });

  // Toggle handlers
  const handleNetworkToggle = (key: 'meta' | 'google' | 'tiktok') => {
    setNetworks(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Clear global error if any option is selected
      if (errors.global) {
        setErrors(prevErrors => ({ ...prevErrors, global: '' }));
      }
      return updated;
    });
  };

  const handleAddonToggle = (key: 'crm' | 'ai') => {
    setAddons(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Clear global error if any option is selected
      if (errors.global) {
        setErrors(prevErrors => ({ ...prevErrors, global: '' }));
      }
      return updated;
    });
  };

  // Pricing calculations
  const metaPrice = networks.meta ? 500 : 0;
  const googlePrice = networks.google ? 500 : 0;
  const tiktokPrice = networks.tiktok ? 500 : 0;
  const trafficPrice = metaPrice + googlePrice + tiktokPrice;

  const crmPrice = addons.crm ? 1000 : 0;
  const aiPrice = addons.ai ? 1000 : 0;

  const totalPrice = trafficPrice + crmPrice + aiPrice;

  const activeNetworksList: string[] = [];
  if (networks.meta) activeNetworksList.push('Meta Ads');
  if (networks.google) activeNetworksList.push('Google Ads');
  if (networks.tiktok) activeNetworksList.push('TikTok Ads');

  const activeAddonsList: string[] = [];
  if (addons.crm) activeAddonsList.push('CRM Rastreável + Consultoria');
  if (addons.ai) activeAddonsList.push('IA Trinity 24/7');

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

    if (totalPrice === 0) {
      newErrors.global = 'Por favor, selecione ao menos uma solução no configurador ao lado.';
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

    const summaryNetworks = activeNetworksList.length > 0 ? activeNetworksList.join(', ') : 'Nenhuma';
    const summaryExtras = activeAddonsList.length > 0 ? activeAddonsList.join(', ') : 'Nenhum';

    const leadData = {
      nome: formData.nome,
      whatsapp: formattedWhatsapp,
      email: formData.email,
      orcamento: formData.orcamento,
      carros_mes: formData.carros_mes,
      plano_customizado: `Tráfego: [${summaryNetworks}] | Extras: [${summaryExtras}]`,
      total_estimado: `R$ ${totalPrice}/mês`,
      data_hora: new Date().toLocaleString('pt-BR')
    };

    try {
      // 1. Submit lead to Google Sheets asynchronously
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
        console.error("Incapaz de registrar planilha diretamente:", sheetError);
      }

      // 2. Redirect to WhatsApp with requested message
      const text = `Olá! Quero contratar a Autoleads Marketing Automotivo.\n\n*Opções Selecionadas:*\n- Canais de Tráfego: ${summaryNetworks}\n- Recursos Extras: ${summaryExtras}\n- Total do Plano: R$ ${totalPrice.toLocaleString('pt-BR')}/mês\n\n*Dados de Cadastro:*\n- Nome: ${formData.nome}\n- WhatsApp: ${formData.whatsapp}\n- E-mail: ${formData.email}\n- Verba de Anúncio: ${formData.orcamento}\n- Carros Vendidos: ${formData.carros_mes}/mês`;
      const whatsappUrl = `https://wa.me/5549984101144?text=${encodeURIComponent(text)}`;
      
      setIsSubmitting(false);
      window.location.href = whatsappUrl;

    } catch (err: any) {
      console.error("Erro no processamento do checkout:", err);
      // Fallback redirect directly
      const text = `Olá! Quero contratar a Autoleads Marketing Automotivo.`;
      window.location.href = `https://wa.me/5549984101144?text=${encodeURIComponent(text)}`;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Plan Configurator */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-brand-950/75 to-black/90 border border-brand-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl transition-all">
            {/* Scarcity Badge */}
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/30 text-brand-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
              <Timer className="w-3.5 h-3.5 text-brand-400" />
              Poucas Vagas Disponíveis Este Mês
            </div>

            <div className="mb-6 flex flex-col gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1">
                <Flame className="w-3 h-3 text-brand-500 fill-brand-500" />
                Monte o seu plano de alta performance
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Personalize Sua Operação
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-1">
                Selecione os canais de tráfego pago e as soluções de inteligência sob demanda perfeitas para o pátio da sua loja ou revenda.
              </p>
            </div>

            {/* Step 1: Paid Traffic Channels */}
            <div className="space-y-4 mb-8">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                Canais de Tráfego Pago (R$ 500/mês por Rede Social)
              </h4>
              <p className="text-[11px] text-gray-400">
                Atraia clientes quentes com planejamento e criação de campanhas de mídia paga profissionais por canal escolhido:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Meta Ads */}
                <div 
                  onClick={() => handleNetworkToggle('meta')}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between h-[150px] relative ${
                    networks.meta 
                      ? 'bg-brand-500/10 border-brand-500 text-white shadow-lg shadow-brand-500/5' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <MessageSquare className={`w-6 h-6 ${networks.meta ? 'text-brand-400' : 'text-gray-500'}`} />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      networks.meta ? 'border-brand-400 bg-brand-500 text-white' : 'border-white/20'
                    }`}>
                      {networks.meta && <CheckCircle2 className="w-4.5 h-4.5 text-white fill-brand-600" />}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm mt-2">Meta Ads</h5>
                    <span className="text-[10px] text-gray-400 block mb-1">Instagram & Facebook</span>
                    <p className="text-[9px] text-gray-400 leading-tight">Clientes locais direto no seu WhatsApp.</p>
                  </div>
                  <div className="text-[10px] font-extrabold text-brand-300 mt-2">
                    R$ 500<span className="text-[9px] font-normal text-gray-400">/mês</span>
                  </div>
                </div>

                {/* Google Ads */}
                <div 
                  onClick={() => handleNetworkToggle('google')}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between h-[150px] relative ${
                    networks.google 
                      ? 'bg-brand-500/10 border-brand-500 text-white shadow-lg shadow-brand-500/5' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <Target className={`w-6 h-6 ${networks.google ? 'text-brand-400' : 'text-gray-500'}`} />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      networks.google ? 'border-brand-400 bg-brand-500 text-white' : 'border-white/20'
                    }`}>
                      {networks.google && <CheckCircle2 className="w-4.5 h-4.5 text-white fill-brand-600" />}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm mt-2">Google Ads</h5>
                    <span className="text-[10px] text-gray-400 block mb-1">Busca & YouTube</span>
                    <p className="text-[9px] text-gray-400 leading-tight">Destaque para quem já busca seu estoque.</p>
                  </div>
                  <div className="text-[10px] font-extrabold text-brand-300 mt-2">
                    R$ 500<span className="text-[9px] font-normal text-gray-400">/mês</span>
                  </div>
                </div>

                {/* TikTok Ads */}
                <div 
                  onClick={() => handleNetworkToggle('tiktok')}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between h-[150px] relative ${
                    networks.tiktok 
                      ? 'bg-brand-500/10 border-brand-500 text-white shadow-lg shadow-brand-500/5' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <Zap className={`w-6 h-6 ${networks.tiktok ? 'text-brand-400' : 'text-gray-500'}`} />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      networks.tiktok ? 'border-brand-400 bg-brand-500 text-white' : 'border-white/20'
                    }`}>
                      {networks.tiktok && <CheckCircle2 className="w-4.5 h-4.5 text-white fill-brand-600" />}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm mt-2">TikTok Ads</h5>
                    <span className="text-[10px] text-gray-400 block mb-1">Vídeos Dinâmicos</span>
                    <p className="text-[9px] text-gray-400 leading-tight">Vídeos de carros engajando público local.</p>
                  </div>
                  <div className="text-[10px] font-extrabold text-brand-300 mt-2">
                    R$ 500<span className="text-[9px] font-normal text-gray-400">/mês</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Step 2: Extras & Advanced Automation */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                Módulos Extras de Alta Performance (+ R$ 1.000/mês cada)
              </h4>
              <p className="text-[11px] text-gray-400">
                Alavanque os resultados do pátio com sistemas integrados e acompanhamento estratégico ativo:
              </p>

              <div className="space-y-3">
                
                {/* CRM + Consultoria */}
                <div 
                  onClick={() => handleAddonToggle('crm')}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex gap-4 ${
                    addons.crm 
                      ? 'bg-brand-500/10 border-brand-500/60 text-white shadow-lg' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    <TrendingUp className={`w-7 h-7 ${addons.crm ? 'text-brand-400' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-bold text-sm sm:text-base">CRM Rastreável + Consultoria Mensal</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                          Saiba com precisão cirúrgica de onde veio cada lead e de qual anúncio ele clicou. Integração de atendimento e organização de funil completa para seus vendedores.
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-brand-400 whitespace-nowrap">+R$ 1.000/mês</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          addons.crm ? 'border-brand-400 bg-brand-500 text-white' : 'border-white/20'
                        }`}>
                          {addons.crm && <CheckCircle2 className="w-4 h-4 text-white fill-brand-600" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendedora Trinity IA 24/7 */}
                <div 
                  onClick={() => handleAddonToggle('ai')}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex gap-4 ${
                    addons.ai 
                      ? 'bg-brand-500/10 border-brand-500/60 text-white shadow-lg' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    <Bot className={`w-7 h-7 ${addons.ai ? 'text-brand-400' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-bold text-sm sm:text-base">Atendimento com IA (Vendedora Trinity 24/7)</h5>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                          Sua vendedora virtual inteligente operando dia e noite sem parar no WhatsApp. Ela atende de imediato, qualifica os compradores de carros ou motos e agenda visitas de forma humanizada.
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-brand-400 whitespace-nowrap">+R$ 1.000/mês</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          addons.ai ? 'border-brand-400 bg-brand-500 text-white' : 'border-white/20'
                        }`}>
                          {addons.ai && <CheckCircle2 className="w-4 h-4 text-white fill-brand-600" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Dynamic Total Price Summary */}
            <div className="bg-black/45 border border-white/5 rounded-2xl p-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Investimento mensal estimado do seu ecossistema</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-300">R$</span>
                  <span className="text-4xl font-black text-white leading-none">{totalPrice.toLocaleString('pt-BR')}</span>
                  <span className="text-xs font-bold text-brand-400">/mês</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-xs text-gray-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" /> Sem multas de cancelamento
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" /> Acompanhamento tático ativo
                </div>
              </div>
            </div>

          </div>

          {/* Beautiful and direct CTA Banner pointing to the Talent Central */}
          <div className="bg-gradient-to-r from-brand-950/50 to-brand-900/50 border border-brand-500/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 blur-2xl rounded-full pointer-events-none" />
            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Nossa Central de Talentos e Agentes de IA
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Para fotos, gravação de vídeo, design, edição e demais serviços físicos em sua região, consulte as soluções diretamente em nossa plataforma.
            </p>
            <button
              type="button"
              onClick={() => window.open('https://lp.autolead.site', '_blank')}
              className="w-full text-center text-xs bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 font-bold py-3 rounded-2xl border border-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Acessar lp.autolead.site ↗</span>
            </button>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-xs text-gray-400">
              💡 <strong>Como funciona a ativação?</strong> Personalize os canais de tráfego e sistemas que você quer ao lado, preencha os dados e fale com nossa central pelo WhatsApp para ligar sua máquina de vendas.
            </p>
          </div>
        </div>

        {/* Right Column: Lead Form & WhatsApp Redirect */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-b from-brand-900/80 to-brand-950/80 border-2 border-brand-600 rounded-3xl p-6 shadow-2xl shadow-brand-900/50 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
              Preencha para Contratar Já
            </div>

            <div className="text-center mt-3 mb-1 pt-1">
              <p className="text-[10px] font-bold text-brand-300 uppercase tracking-wide leading-tight">
                Exclusivo para Lojas, Revendas e Vendedores de Carros e Motos
              </p>
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
                  placeholder="Seu nome"
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
                <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">E-mail de Contato</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-black/30 border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all ${
                    errors.email ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="Seu e-mail"
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
              <div className="p-4 bg-black/45 rounded-2xl border border-white/5 space-y-2 mt-4 text-xs">
                <span className="text-[10px] font-bold uppercase text-brand-400 tracking-wider">Resumo do Plano Personalizado</span>
                
                <div className="flex justify-between items-center text-gray-300">
                  <span>Tráfego Selecionado ({activeNetworksList.length}):</span>
                  <span className="font-bold text-white">R$ {trafficPrice}/mês</span>
                </div>
                {activeNetworksList.length > 0 && (
                  <p className="text-[10px] text-gray-400 italic pl-2 border-l border-brand-500/30">
                    {activeNetworksList.join(', ')}
                  </p>
                )}

                {addons.crm && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>CRM + Consultoria:</span>
                    <span className="font-bold text-white">R$ 1.000/mês</span>
                  </div>
                )}

                {addons.ai && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Vendedora IA Trinity:</span>
                    <span className="font-bold text-white">R$ 1.000/mês</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10 font-extrabold text-white">
                  <span>Mensalidade Total:</span>
                  <span className="text-brand-400 text-base sm:text-lg">
                    R$ {totalPrice.toLocaleString('pt-BR')}/mês
                  </span>
                </div>
              </div>

              {errors.global && (
                <p className="text-red-400 text-[11px] font-bold text-center mt-2 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
                  {errors.global}
                </p>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm shadow-xl mt-4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Registrando Lead...</span>
                ) : (
                  <>
                    <span>Contratar via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Atendimento oficial sem robôs genéricos.</span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
