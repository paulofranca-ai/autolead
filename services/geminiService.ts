import { GoogleGenAI } from "@google/genai";
import { ContractData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateContractText = async (data: ContractData): Promise<string> => {
  const model = 'gemini-3-flash-preview';

  // Formatando a data atual para a assinatura
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  const prompt = `
    Aja como um advogado especializado. Gere um contrato formatado em Markdown com base EXATA no texto abaixo.
    Substitua os campos entre colchetes pelos dados fornecidos.

    DADOS:
    CONTRATANTE: ${data.clientName} (CNPJ: ${data.clientCNPJ})
    CONTRATADO: ${data.contractorName} (CNPJ: ${data.contractorCNPJ})
    VALOR GESTÃO: ${data.value}
    VIGÊNCIA: ${data.duration}
    DATA: ${today}

    TEXTO DO CONTRATO (Use exatamente este conteúdo):

    # CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GESTÃO DE TRÁFEGO E INTELIGÊNCIA COMERCIAL

    **CONTRATANTE:** ${data.clientName}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${data.clientCNPJ}, doravante denominada simplesmente **CONTRATANTE**.

    **CONTRATADO:** ${data.contractorName}, profissional autônomo/empresário individual, inscrito no CNPJ sob o nº ${data.contractorCNPJ}, doravante denominado simplesmente **PRESTADOR**.

    ### CLÁUSULA PRIMEIRA – DO OBJETO E ESCOPO
    1.1. O objeto deste contrato é a prestação de serviços de Gestão de Tráfego Pago e Comunicação Estratégica, focada em performance nas plataformas Meta (Facebook/Instagram), TikTok e YouTube.
    1.2. Inclusão de implementação e licenciamento de CRM com Inteligência Artificial (IA) para automação de leads e gestão comercial durante a vigência deste instrumento.

    ### CLÁUSULA SEGUNDA – DA AUTONOMIA E METODOLOGIA TÉCNICA
    2.1. O PRESTADOR detém total autonomia sobre a Metodologia e Estratégia aplicada. A criação de artes, vídeos e roteiros seguirá critérios técnicos de conversão, e não meras preferências estéticas subjetivas da CONTRATANTE.
    2.2. A CONTRATANTE compromete-se a fornecer os insumos (fotos e vídeos dos veículos em estoque) seguindo as orientações técnicas do PRESTADOR para garantir o padrão de qualidade das campanhas.

    ### CLÁUSULA TERCEIRA – DOS CUSTOS DE ANÚNCIOS E TRIBUTAÇÃO (REFORMA 2026)
    3.1. O investimento direto nas plataformas de anúncios é de responsabilidade exclusiva da CONTRATANTE.
    3.2. **ÔNUS TRIBUTÁRIO:** A CONTRATANTE declara-se ciente de que, a partir de 2026, novas incidências tributárias (como o IBS/CBS ou impostos sobre serviços digitais) de aproximadamente 12,5% sobre o gasto em anúncios serão suportadas integralmente pela CONTRATANTE, não afetando o valor líquido dos honorários do PRESTADOR.

    ### CLÁUSULA QUARTA – DOS VALORES E CONDIÇÕES DE PAGAMENTO
    4.1. **SETUP E LICENCIAMENTO CRM:** Pelo licenciamento anual e configuração da infraestrutura de CRM com IA, a CONTRATANTE pagará o valor de **R$ 6.000,00 (seis mil reais)**.
    4.1.1. O pagamento deste valor poderá ser feito à vista ou parcelado em até 12x no cartão de crédito, conforme negociação comercial prévia. Em caso de rescisão antecipada, o saldo restante torna-se exigível imediatamente.
    
    4.2. **SUPORTE E MANUTENÇÃO TÉCNICA:** A título de suporte técnico e manutenção da infraestrutura de automação, será cobrado o valor mensal fixo de **R$ 300,00 (trezentos reais)**.
    
    4.3. **HONORÁRIOS DE GESTÃO (ASSESSORIA):** Pela gestão estratégica de tráfego e serviços de marketing, a CONTRATANTE pagará o valor mensal de **${data.value}**, acrescido de comissão de performance de **R$ 100,00 (cem reais)** por veículo vendido.
    4.3.1. **ISENÇÃO:** Ficam isentos de comissão os 2 (dois) primeiros veículos vendidos no mês. A comissão incide a partir da 3ª venda confirmada.
    
    4.4. **VENCIMENTOS:** O primeiro pagamento das mensalidades (Soma de 4.2 e 4.3) ocorrerá em 05/03/2026. Os pagamentos subsequentes vencerão todo dia 05 de cada mês.
    
    4.5. O inadimplemento superior a 5 dias autoriza a suspensão imediata dos anúncios e dos serviços de automação do CRM.

    ### CLÁUSULA QUINTA – DA APROVAÇÃO E RESPONSABILIDADE
    5.1. Todo material será enviado para aprovação. A CONTRATANTE tem 48 horas para se manifestar. O silêncio será considerado APROVAÇÃO TÁCITA.
    5.2. A responsabilidade jurídica sobre as ofertas (preço dos veículos, estado de conservação e veracidade das informações) é exclusiva da CONTRATANTE.

    ### CLÁUSULA SEXTA – DA OBRIGAÇÃO DE MEIO E COLABORAÇÃO
    6.1. O PRESTADOR entrega uma obrigação de meio. O resultado de vendas final depende do atendimento comercial da loja e das condições de mercado.
    6.2. A falta de atendimento aos leads ou o não envio de materiais de estoque exime o PRESTADOR de responsabilidade por baixos resultados, não gerando direito à suspensão de pagamentos.

    ### CLÁUSULA SÉTIMA – PROPRIEDADE INTELECTUAL E ACESSOS
    7.1. Os ativos de conta pertencem à CONTRATANTE, mas a Inteligência de Dados e Estratégia de Campanha são propriedade intelectual do PRESTADOR.
    7.2. O suporte técnico ao CRM é um bônus condicionado à manutenção do contrato de assessoria de tráfego.

    ### CLÁUSULA OITAVA – VIGÊNCIA E RESCISÃO
    8.1. O contrato tem validade de ${data.duration}.
    8.2. Após os primeiros 90 dias, qualquer parte poderá rescindir mediante aviso prévio de 30 dias.

    ### CLÁUSULA NONA – FORO
    9.1. Fica eleito o Foro da Comarca de domicílio do PRESTADOR para dirimir questões deste contrato.

    ---
    Curitibanos (SC), ${today}.

    __________________________________________________
    **${data.clientName}**

    __________________________________________________
    **${data.contractorName}**

    NOTA: Formate em Markdown limpo e profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "Erro ao gerar o contrato. Tente novamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a IA. Verifique sua chave de API ou tente mais tarde.";
  }
};