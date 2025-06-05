export interface Model {
  name: string;
}

export interface PredictionResponse {
  model_name: string;
  tx_id: string[];
  predictions: number[];
  probabilities: number[];
}

export interface PredictionResult {
  transaction_id: string;
  prediction: 'fraud' | 'legitimate';
  probability: number;
}

export interface FileUploadState {
  payers: File | null;
  terminals: File | null;
  transactions: File | null;
}

export interface FormState {
  selectedModel: string;
  files: FileUploadState;
}