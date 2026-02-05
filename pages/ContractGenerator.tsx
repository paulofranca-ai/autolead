import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateContractText } from '../services/geminiService';
import { ContractData } from '../types';
import { Loader2, FileText, Download, Copy, Check, Printer } from 'lucide-react';

const ContractGenerator: React.FC = () => {
  const [formData, setFormData] = useState<ContractData>({
    contractorName: '',
    contractorCNPJ: '',
    clientName: '',
    clientCNPJ: '',
    value: 'R$ 2.500,00',
    duration: '12 meses'
  });
  
  const [contractText, setContractText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setContractText('');
    
    try {
      const text = await generateContractText(formData);
      setContractText(text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-12 pb-24 bg-brand-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-brand-900/30 rounded-full mb-4 border border-brand-500/20 shadow-lg">
            <FileText className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Gerador de Contratos <span className="text-brand-500">IA</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Crie contratos de prestação de serviços de marketing blindados juridicamente, 
            incluindo as novas regras tributárias de 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-1">
            <div className="bg-brand-900/20 border border-brand-800/50 rounded-3xl p-6 sticky top-24 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-brand-800/50 pb-4">Dados do Contrato</h3>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Nome do Contratado (Você)</label>
                  <input 
                    type="text" 
                    name="contractorName"
                    value={formData.contractorName}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-brand-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-gray-600"
                    placeholder="Sua Empresa Ltda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">CNPJ/CPF do Contratado</label>
                  <input 
                    type="text" 
                    name="contractorCNPJ"
                    value={formData.contractorCNPJ}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-brand-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-gray-600"
                    placeholder="00.000.000/0001-00"
                    required
                  />
                </div>
                <div className="border-t border-brand-800/50 my-4"></div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Nome do Cliente</label>
                  <input 
                    type="text" 
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-brand-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-gray-600"
                    placeholder="Loja de Carros Ltda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">CNPJ/CPF do Cliente</label>
                  <input 
                    type="text" 
                    name="clientCNPJ"
                    value={formData.clientCNPJ}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-brand-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-gray-600"
                    placeholder="00.000.000/0001-00"
                    required
                  />
                </div>
                <div className="border-t border-brand-800/50 my-4"></div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Valor Mensal (Gestão)</label>
                  <input 
                    type="text" 
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-brand-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Vigência/Prazo</label>
                  <input 
                    type="text" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-brand-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none placeholder-gray-600"
                    placeholder="12 meses"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
                  {loading ? "Gerando..." : "Gerar Minuta"}
                </button>
              </form>
            </div>
          </div>

          {/* Result Side */}
          <div className="lg:col-span-2">
            <div className="bg-brand-900/20 border border-brand-800/50 rounded-3xl min-h-[600px] flex flex-col relative overflow-hidden backdrop-blur-md shadow-xl">
              
              {!contractText && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-brand-900/50 flex items-center justify-center mb-6 border border-brand-800">
                    <FileText size={40} className="text-brand-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-400">Preencha os dados ao lado e clique em Gerar para visualizar seu contrato.</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Loader2 className="w-16 h-16 text-brand-500 animate-spin mb-4" />
                  <p className="text-white font-bold text-lg">Consultando IA jurídica...</p>
                  <p className="text-xs text-brand-400 mt-2 uppercase tracking-widest">Aguarde um momento</p>
                </div>
              )}

              {contractText && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-brand-800/50 bg-brand-900/50">
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Minuta Gerada</h4>
                    <div className="flex gap-2">
                       <button 
                        onClick={handlePrint}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wide shadow-lg"
                      >
                        <Printer size={16} />
                        Salvar PDF
                      </button>
                      <button 
                        onClick={handleCopy}
                        className="px-4 py-2 hover:bg-brand-800 rounded-xl text-brand-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wide border border-transparent hover:border-brand-500/20"
                      >
                        {copied ? <Check size={16} className="text-brand-500" /> : <Copy size={16} />}
                        {copied ? "Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </div>
                  {/* Adicionado ID para a área de impressão */}
                  <div 
                    id="contract-print-area"
                    className="flex-1 p-8 overflow-y-auto max-h-[800px] prose prose-invert prose-headings:text-brand-400 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white max-w-none"
                  >
                    <ReactMarkdown>{contractText}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;