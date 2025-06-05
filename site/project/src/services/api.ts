// ✅ api.ts
import { Model, PredictionResponse } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8080/api/v1/freudulentos';

export async function fetchModels(): Promise<Model[]> {
  const response = await fetch(`${API_BASE_URL}/models`);
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  const data = await response.json();
  return data.models.map((name: string) => ({ name }));
}

export async function submitPrediction(
  model: string,
  files: { payers: File; terminals: File; transactions: File }
): Promise<void> {
  const formData = new FormData();
  formData.append('model_name', model);
  formData.append('payers', files.payers);
  formData.append('terminals', files.terminals);
  formData.append('transactions', files.transactions);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to submit prediction: ${response.statusText}`);
  }
  // No response data is returned by backend; just success status.
}

export async function fetchPredictionList(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/model_predictions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch prediction list: ${response.statusText}`);
  }
  const data = await response.json();
  return data.model_predictions; // string[]
}

export async function fetchPredictionPage(
  modelName: string,
  page = 1,
  pageSize = 100
): Promise<PredictionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/model_predictions/${modelName}?page=${page}&page_size=${pageSize}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch prediction page: ${response.statusText}`);
  }
  return await response.json();
}