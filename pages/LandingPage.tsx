import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Video, 
  Headphones, 
  Target, 
  CheckCircle2,
  ChevronDown,
  Car
} from 'lucide-react';
import { FaqItem } from '../types';

const features = [
  {
    icon: <Target className="w-6 h-6 text-brand-400" />,
    title: "Anúncios Multi-Plataforma",
    desc: "Facebook, Instagram, Google, YouTube, TikTok. Estratégias completas para captar leads qualificados."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-brand-400" />,
    title: "Relatórios de Performance",
    desc: "Acompanhe resultados em tempo real: leads gerados, custo por lead, conversões e ROI."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-brand-400" />,
    title: "Atendimento com IA",
    desc: "Robô inteligente no WhatsApp que responde 24h, qualifica leads e transfere para humanos."
  },
  {
    icon: <Users className="w-6 h-6 text-brand-400" />,
    title: "CRM Completo",
    desc: "Sistema de gestão que organiza todos os clientes: funil de vendas, follow-ups e automações."
  },
  {
    icon: <Video className="w-6 h-6 text-brand-400" />,
    title: "Produção de Conteúdo",
    desc: "Indicação de videomaker/fotógrafo ou negociação com nossa equipe para captação de fotos e vídeos."
  },
  {
    icon: <Headphones className="w-6 h-6 text-brand-400" />,
    title: "Suporte Dedicado",
    desc: "Atendimento via WhatsApp com IA em tempo real e equipe humana das 9h às 18h."
  }
];

const faqs: FaqItem[] = [
  {
    question: "O que é o sistema CRM?",
    answer: "É uma ferramenta de gestão de relacionamento com o cliente que centraliza todos os leads, organiza o funil de vendas e automatiza o acompanhamento."
  },
  {
    question: "Como funciona a IA no atendimento?",
    answer: "Nossa IA é treinada para responder dúvidas frequentes, qualificar o interesse do cliente e agendar visitas automaticamente pelo WhatsApp."
  },
  {
    question: "Qual a diferença de contratar direto?",
    answer: "No AutoLeads, você tem uma equipe de agentes de IA + indicação de videomaker e fotógrafo, que substituem uma agência tradicional. Custo baixo, eficiência máxima."
  }
];

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openCalendly = () => {
    window.open('https://calendly.com/paulotrafegopago/consultoria-gratuita', '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const rawWhatsapp = (formData.get('whatsapp') as string) || '';
    let cleanWhatsapp = rawWhatsapp.replace(/\D/g, '');
    if (cleanWhatsapp && !cleanWhatsapp.startsWith('55')) {
      cleanWhatsapp = '55' + cleanWhatsapp;
    }
    const formattedWhatsapp = cleanWhatsapp ? '+' + cleanWhatsapp : '';

    const data = {
      nome: formData.get('nome'),
      whatsapp: formattedWhatsapp,
      email: formData.get('email'),
      orcamento: formData.get('orcamento'),
      carros_mes: formData.get('carros_mes'),
      data_hora: new Date().toLocaleString('pt-BR')
    };

    try {
      // URL do Webhook do Google Apps Script
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxCyJq5G0S6sjCF6CHf_PWEFzdV2WoySmTyb_NwzmNs9xu4ljqq7PlAXgHEROTasbre/exec';
      
      if (scriptURL !== 'COLE_SUA_URL_DO_APPS_SCRIPT_AQUI') {
        // Envia como text/plain para evitar o preflight request (OPTIONS) do CORS
        await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(data)
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Dados que seriam enviados:", data);
      }
      
      // Redireciona para a página de obrigado
      navigate('/obrigado');
    } catch (error) {
      console.error("Erro ao enviar formulário", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-brand-950">
      
      {/* Background Animated Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
         {/* Animated Sport Car */}
         <div className="absolute top-1/4 left-[-10%] animate-drive-fast">
            <Car className="w-32 h-32 text-brand-800 transform -scale-x-100 opacity-20" />
            <div className="w-48 h-1 bg-brand-500 blur-md ml-8"></div>
         </div>
         {/* Animated Sedan */}
         <div className="absolute bottom-1/3 right-[-10%] animate-drive-slow">
            <Car className="w-24 h-24 text-brand-700 opacity-20" />
         </div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 blur-[150px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-400/5 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden z-10">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide text-brand-100 uppercase">Assessoria Premium</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl">
            Ecossistema de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">Alta Performance</span> <br />
            para Revendas.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-10 font-light leading-relaxed">
            Unimos inteligência de dados, tráfego pago agressivo e produção audiovisual para escalar suas vendas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button 
              onClick={scrollToPricing}
              className="btn-primary w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-white uppercase tracking-wide text-sm"
            >
              RECEBER CONTATO DO ESPECIALISTA
            </button>
          </div>

          {/* New Video Section in Hero */}
          <div className="relative max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
             <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none z-10"></div>
             <div className="relative aspect-video bg-black">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/Arv9cMfd-Kg" 
                  title="AUTOLEADS" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
             </div>
          </div>

        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-12 bg-black/20 border-y border-white/5 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-8 gap-3">
             <div className="h-px w-12 bg-brand-500/30"></div>
             <p className="text-center text-sm font-bold text-brand-400 uppercase tracking-[0.2em]">
                Resultados de Clientes
             </p>
             <div className="h-px w-12 bg-brand-500/30"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <p className="text-4xl font-extrabold text-white mb-2 group-hover:text-brand-400 transition-colors">+R$100k</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">de ROI em menos de 7 dias</p>
            </div>
            <div className="text-center group">
              <p className="text-4xl font-extrabold text-brand-500 mb-2 group-hover:text-white transition-colors drop-shadow-sm">+738%</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">ROAS em lançamento</p>
            </div>
            <div className="text-center group">
              <p className="text-4xl font-extrabold text-white mb-2 group-hover:text-brand-400 transition-colors">34</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight px-2">Lançamentos de Produtos Digitais e Serviços de Venda Online</p>
            </div>
            <div className="text-center group">
              <p className="text-4xl font-extrabold text-brand-500 mb-2 group-hover:text-white transition-colors drop-shadow-sm">+400</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight px-2">Veículos vendidos em apenas um dos clientes (2 anos)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Highlight Section (Shorts) */}
      <section className="py-20 relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
            
            {/* Text Side */}
            <div className="order-2 md:order-1 max-w-lg text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand-900/30 border border-brand-500/20">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 <span className="text-brand-300 font-bold tracking-widest text-[10px] uppercase">Bastidores da Operação</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Resultados que você <br />
                <span className="text-brand-500">pode ver.</span>
              </h2>
              
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Não ficamos apenas na teoria. Confira na prática como nossa metodologia de tráfego e produção de conteúdo transforma o dia a dia das revendas parceiras.
              </p>

              <button 
                 onClick={scrollToPricing}
                 className="text-brand-400 font-bold uppercase tracking-wider text-sm hover:text-white transition-colors flex items-center gap-2 mx-auto md:mx-0 group"
              >
                Quero esses resultados
                <ChevronDown className="rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Video Side - Phone Mockup */}
            <div className="order-1 md:order-2 relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse-gold"></div>
              
              <div className="relative w-[300px] h-[533px] bg-black rounded-[2.5rem] border-[8px] border-brand-950 shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                <iframe 
                  width="300" 
                  height="533" 
                  src="https://www.youtube.com/embed/t93fNnIL0v0" 
                  title="Depoimento Português Play" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full object-cover"
                ></iframe>
                
                {/* Phone Notch/Bar overlay */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-brand-950 rounded-b-xl z-20 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Dominância Digital.</h2>
            <p className="text-brand-400 font-medium tracking-wide text-sm uppercase">Tecnologia e Estratégia</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-brand-500/30 transition-all group hover:bg-white/10 hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 rounded-2xl bg-brand-900/50 flex items-center justify-center mb-6 border border-brand-800/50 group-hover:border-brand-500/50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-300 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Single Plan & Lead Capture Section */}
      <section id="pricing" className="py-24 relative z-10 overflow-hidden">
         {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-400 font-bold tracking-widest text-xs uppercase bg-brand-900/50 px-3 py-1 rounded-full">Plano Único: Aceleração Total</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 mb-6 text-white">Tudo que sua revenda precisa para dominar o mercado.</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Sem letras miúdas. Um ecossistema completo focado em colocar <strong className="text-white">mais dinheiro no seu bolso</strong> com <strong className="text-white">menos esforço</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-12 max-w-4xl mx-auto items-stretch">
            
            {/* Benefits & Deliverables */}
            <div className="flex flex-col gap-8 w-full">
              <div className="bg-brand-900/30 border border-brand-500/20 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Target className="text-brand-400 w-8 h-8" />
                  Vantagens Exclusivas
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-1">
                      <BarChart3 className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">Mais Leads, Mais Vendas</h4>
                      <p className="text-gray-400 text-sm leading-relaxed mt-1">Estratégias agressivas de tráfego pago para inundar seu WhatsApp de oportunidades reais todos os dias.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-1">
                      <MessageSquare className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">Filtro Inteligente com IA</h4>
                      <p className="text-gray-400 text-sm leading-relaxed mt-1">A Inteligência Artificial separa o curioso do comprador real. O vendedor só recebe quem realmente quer e pode comprar.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">Menos Esforço, Mais Lucro</h4>
                      <p className="text-gray-400 text-sm leading-relaxed mt-1">Atendimento instantâneo 24h por dia. Sua equipe foca apenas em fechar negócio, enquanto a IA faz o trabalho duro.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6">O que está incluso no Plano Único:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Gestão de Tráfego Pago (Ads)",
                    "Gestão de Redes Sociais",
                    "Indicação de Videomaker/Fotógrafo",
                    "CRM AutoLeads Completo",
                    "Secretária de IA Integrada",
                    "Relatórios de Performance",
                    "Suporte Dedicado",
                    "Rastreamento de Origem"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lead Capture Form */}
            <div className="bg-gradient-to-b from-brand-900/80 to-brand-950/80 border-2 border-brand-600 rounded-3xl p-8 shadow-2xl shadow-brand-900/50 relative w-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                Vagas Limitadas
              </div>
              
              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-bold text-white mb-2">Aplicação para Consultoria</h3>
                <p className="text-gray-400 text-sm">Preencha os dados abaixo para agendar sua consultoria gratuita e descobrir como escalar sua revenda.</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    name="nome"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    placeholder="João da Silva"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">WhatsApp (com DDD)</label>
                    <input 
                      type="tel" 
                      required
                      name="whatsapp"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">E-mail</label>
                    <input 
                      type="email" 
                      required
                      name="email"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                      placeholder="joao@revenda.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Orçamento Mensal de Marketing</label>
                  <select 
                    required
                    name="orcamento"
                    defaultValue=""
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all appearance-none"
                  >
                    <option value="" disabled>Selecione uma opção</option>
                    <option value="Ate R$ 2.000">Até R$ 2.000</option>
                    <option value="De R$ 2.000 a R$ 5.000">De R$ 2.000 a R$ 5.000</option>
                    <option value="De R$ 5.000 a R$ 10.000">De R$ 5.000 a R$ 10.000</option>
                    <option value="Acima de R$ 10.000">Acima de R$ 10.000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Quantos carros vende por mês?</label>
                  <input 
                    type="number" 
                    required
                    name="carros_mes"
                    min="0"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    placeholder="Ex: 15"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm shadow-xl mt-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Enviando...</span>
                  ) : (
                    "Quero Escalar Minhas Vendas"
                  )}
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-4">
                  Suas informações estão seguras. Não enviamos spam.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Dúvidas Frequentes</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/5 rounded-2xl bg-white/5 overflow-hidden hover:bg-white/10 transition-colors">
                <button 
                  className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors group"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-white group-hover:text-brand-300 transition-colors">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 group-hover:text-brand-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-8 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;