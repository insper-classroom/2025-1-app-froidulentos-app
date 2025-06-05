// src/types/index.ts

export interface Model {
  name: string;
}

export interface EvaluationMetrics {
  accuracy: number;
  precision_fraud: number;
  recall_fraud: number;
  f1_score_fraud: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  total_evaluated: number;
}

export interface PredictionResponse {
  model_name: string; 
  total_predictions: number;
  tx_id: string[];
  predictions: number[];
  probabilities: number[];
  evaluation?: EvaluationMetrics | null; 
  test_df_name?: string | null; 
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
