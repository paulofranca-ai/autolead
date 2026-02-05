export interface ContractData {
  contractorName: string;
  contractorCNPJ: string;
  clientName: string;
  clientCNPJ: string;
  value: string;
  duration: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}