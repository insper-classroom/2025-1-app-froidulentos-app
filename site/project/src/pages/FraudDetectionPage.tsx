import React, { useState, useEffect } from "react";
import { ModelSelector } from "../components/ModelSelector";
import { FileUploader } from "../components/FileUploader";
import { ResultsTable } from "../components/ResultsTable";
import { Tabs } from "../components/Tabs";
import { FileUploadState, PredictionResult } from "../types";
import {
  fetchModels,
  fetchPredictionList,
  fetchPredictionPage,
  submitPrediction,
} from "../services/api";
import { AlertCircle } from "lucide-react";

export const FraudDetectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"predict" | "history">("predict");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [files, setFiles] = useState<FileUploadState>({
    payers: null,
    terminals: null,
    transactions: null,
  });
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [modelPredictions, setModelPredictions] = useState<string[]>([]);
  const [selectedHistoryModel, setSelectedHistoryModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getModels = async () => {
      try {
        const modelData = await fetchModels();
        setModels(modelData.map((model) => model.name));
      } catch (err) {
        setError(
          "Failed to load models. Please check if the backend server is running."
        );
        console.error(err);
      }
    };

    getModels();
  }, []);

  useEffect(() => {
    if (activeTab === "history") {
      const getModelPredictionList = async () => {
        try {
          const modelList = await fetchPredictionList();
          setModelPredictions(modelList);
        } catch (err) {
          setError("Failed to load prediction list.");
          console.error(err);
        }
      };

      getModelPredictionList();
    }
  }, [activeTab]);

  const handleFileChange = (
    fileType: keyof FileUploadState,
    file: File | null
  ) => {
    setFiles((prev) => ({ ...prev, [fileType]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModel) {
      setError("Please select a model.");
      return;
    }

    if (!files.payers || !files.terminals || !files.transactions) {
      setError("Please upload all required files.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await submitPrediction(selectedModel, {
        payers: files.payers!,
        terminals: files.terminals!,
        transactions: files.transactions!,
      });

      const predictionFiles = await fetchPredictionList();
      const latest = predictionFiles[predictionFiles.length - 1];

      const response = await fetchPredictionPage(latest);
      setResults(
        response.tx_id.map((id, index) => ({
          transaction_id: id,
          prediction:
            response.predictions[index] === 1 ? "fraud" : "legitimate",
          probability: response.probabilities[index],
        }))
      );
    } catch (err) {
      setError("Failed to process prediction. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const allFilesUploaded =
    files.payers && files.terminals && files.transactions;
  const isFormDisabled = isLoading;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Fraud Detection System
      </h2>

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {activeTab === "predict" ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onChange={setSelectedModel}
              isLoading={isLoading}
            />

            <FileUploader
              files={files}
              onFileChange={handleFileChange}
              isDisabled={isFormDisabled}
            />

            <div className="mt-6">
              <button
                type="submit"
                disabled={!selectedModel || !allFilesUploaded || isLoading}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  !selectedModel || !allFilesUploaded || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#FFE600] text-gray-900 hover:bg-yellow-500"
                }`}
              >
                {isLoading ? "Processing..." : "Run Prediction"}
              </button>
            </div>
          </form>

          <ResultsTable results={results} isLoading={isLoading} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Previous Predictions
          </h3>
          <select
            className="mb-4 p-2 border rounded"
            value={selectedHistoryModel}
            onChange={(e) => setSelectedHistoryModel(e.target.value)}
          >
            <option value="">Select a prediction run</option>
            {modelPredictions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>

          {selectedHistoryModel && (
            <ResultsTable
              modelName={selectedHistoryModel}
              paginated
              isLoading={false}
              results={[]}
            />
          )}
        </div>
      )}
    </div>
  );
};
