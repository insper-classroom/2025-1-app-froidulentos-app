// src/services/api.ts
import { Model, PredictionResponse } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8080/api/v1/freudulentos';
export const PAGE_SIZE = 10; 

export async function fetchModels(): Promise<Model[]> {
  const response = await fetch(`${API_BASE_URL}/models`);
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  const data = await response.json();
  // Ensure data.models is an array before mapping
  if (Array.isArray(data.models)) {
    return data.models.map((name: string) => ({ name }));
  }
  return []; // Return empty array if models list is not as expected
}

export async function submitPrediction(
  model: string,
  files: { payers: File; terminals: File; transactions: File }
  // trainTestSplit parameter removed for this reverted version
): Promise<void> {
  const formData = new FormData();
  formData.append('model_name', model);
  formData.append('payers', files.payers);
  formData.append('terminals', files.terminals);
  formData.append('transactions', files.transactions);
  // formData.append('train_test_split', trainTestSplit); // Line removed

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`Failed to submit prediction: ${errorData.error || response.statusText}`);
  }
}

export async function fetchPredictionList(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/model_predictions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch prediction list: ${response.statusText}`);
  }
  const data = await response.json();
  if (Array.isArray(data.model_predictions)) {
    return data.model_predictions;
  }
  return [];
}

export async function fetchPredictionPage(
  modelName: string,
  page = 1 
): Promise<PredictionResponse> { 
  const response = await fetch(
    `${API_BASE_URL}/model_predictions/${modelName}?page=${page}&page_size=${PAGE_SIZE}`
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`Failed to fetch prediction page for ${modelName}: ${errorData.error || response.statusText}`);
  }
  return await response.json();
}


export async function addModel(modelFile: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('model', modelFile); // The backend expects the file under the key 'model'

  const response = await fetch(`${API_BASE_URL}/add_model`, {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || `Failed to add model: ${response.statusText}`);
  }
  return responseData; // Should contain { message: "Model '...' added successfully" }
}
