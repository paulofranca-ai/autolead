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
    desc: "Visitas semanais para captação de fotos e vídeos profissionais dos seus veículos."
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
    answer: "No AutoLeads, você tem uma equipe multidisciplinar (gestor, videomaker, editor, suporte) pelo custo de um funcionário junior, além da tecnologia inclusa."
  }
];

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const navigate = useNavigate();

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openCalendly = () => {
    window.open('https://calendly.com/paulotrafegopago/consultoria-gratuita', '_blank');
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
              Consultar Planos
            </button>
            <button 
              onClick={openCalendly}
              className="btn-outline w-full sm:w-auto px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg backdrop-blur-md text-sm uppercase tracking-wide"
            >
              <MessageSquare size={18} className="text-brand-400" />
              Agendar Demo
            </button>
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

      {/* Pricing Section (MODIFIED) */}
      <section id="pricing" className="py-24 relative z-10 overflow-hidden">
         {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-400 font-bold tracking-widest text-xs uppercase bg-brand-900/50 px-3 py-1 rounded-full">Investimento Estratégico</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 mb-6 text-white">Escolha Seu Plano</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1: CRM Setup */}
            <div className="rounded-3xl border border-white/10 bg-brand-900/20 backdrop-blur-md p-1 hover:border-brand-500/30 transition-all duration-300">
              <div className="h-full rounded-3xl p-8 md:p-10 flex flex-col">
                <div className="mb-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-gray-300 text-[10px] font-bold tracking-widest uppercase mb-4 border border-white/5">
                    Tecnologia
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">CRM com IA</h3>
                  <p className="text-gray-400 text-sm">Software e Automação.</p>
                </div>

                <div className="mb-8 p-6 bg-black/20 rounded-2xl border border-white/5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-400">R$</span>
                      <span className="text-5xl font-extrabold text-white">6.000</span>
                      <span className="text-sm text-gray-400"></span>
                    </div>
                    <span className="text-xs text-brand-400 font-bold uppercase tracking-wide">
                      à vista ou 12x no cartão
                    </span>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                      Licença Anual (12 meses).
                    </p>
                    <div className="mt-2 p-2 bg-brand-500/10 rounded border border-brand-500/20">
                      <p className="text-xs text-white font-bold">
                        + R$ 300,00 / mês
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Suporte e Manutenção do CRM
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Licença anual CRM AutoLeads",
                    "Rastreamento de Origem (Anúncio/Campanha)",
                    "Secretária de IA Integrada",
                    "Filtragem Inteligente de Leads",
                    "Automação de Follow-up",
                    "Automação de Promoções",
                    "Suporte ao CRM AutoLeads"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/gerador-contrato')}
                  className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-white font-bold uppercase tracking-wider transition-all text-sm"
                >
                  Contratar CRM
                </button>
              </div>
            </div>

            {/* Card 2: Monthly Service (Featured) */}
            <div className="rounded-3xl border-2 border-brand-600 bg-gradient-to-b from-brand-900/80 to-brand-950/80 p-1 shadow-2xl shadow-brand-900/50 relative transform lg:-translate-y-4">
              
              <div className="h-full rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-brand-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Mais Popular
                </div>

                <div className="mb-8 mt-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-[10px] font-bold tracking-widest uppercase mb-4 border border-brand-500/20">
                    Mensalidade
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Gestão Completa</h3>
                  <p className="text-gray-300 text-sm">Tráfego + Social Media + Captação.</p>
                </div>

                <div className="mb-8 p-6 bg-brand-800/30 rounded-2xl border-l-4 border-brand-500">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-300">R$</span>
                    <span className="text-6xl font-extrabold text-white">2.500</span>
                    <span className="text-xl text-gray-300">/mês</span>
                  </div>
                  
                  <div className="mt-1 mb-2">
                     <span className="text-xs text-brand-400 font-bold uppercase tracking-wide">
                       + R$ 100 por carro vendido
                     </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-brand-500/30">
                     <p className="text-xs text-brand-200 font-bold uppercase tracking-tight">
                       Pagamento Antecipado
                     </p>
                     <p className="text-xs text-gray-300 mt-1">
                       Inclui 1 visita semanal para captação.
                     </p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                    Gestão de Tráfego Pago (Ads)
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                    Gestão de Redes Sociais
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                    1 Visita Semanal (Foto/Vídeo)
                  </li>
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                    Relatórios de Performance
                  </li>
                </ul>

                <button 
                  onClick={() => navigate('/gerador-contrato')}
                  className="btn-primary w-full py-4 rounded-2xl font-bold text-white uppercase tracking-wider text-sm shadow-xl"
                >
                  Contratar Agora
                </button>
              </div>
            </div>
          </div>
          
          {/* Commission Note */}
          <div className="max-w-3xl mx-auto mt-12 p-8 rounded-3xl border border-white/5 bg-white/5 text-center relative overflow-hidden group">
             <div className="flex items-center justify-center gap-2 mb-3 relative z-10">
                <Target className="text-brand-400" size={24} />
                <h4 className="font-bold text-white text-lg uppercase tracking-wide">Comissão por Performance</h4>
             </div>
             <p className="text-gray-300 text-sm relative z-10 leading-relaxed">
               R$ 100 por carro vendido através do nosso serviço. <br />
               <span className="text-brand-300 font-bold block mt-2">
                 ISENÇÃO: Os 2 primeiros carros vendidos que passarem pelos anúncios e CRM são livres de comissão.
               </span>
             </p>
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