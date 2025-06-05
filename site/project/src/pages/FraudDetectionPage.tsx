// src/pages/FraudDetectionPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { ModelSelector } from "../components/ModelSelector";
import { FileUploader } from "../components/FileUploader";
import { ResultsTable } from "../components/ResultsTable";
import { Tabs } from "../components/Tabs";
import { FileUploadState } from "../types"; 
import {
  fetchModels,
  fetchPredictionList,
  fetchPredictionPage, 
  submitPrediction,
  addModel, // Import the addModel service
} from "../services/api";
import { AlertCircle, CheckCircle2 } from "lucide-react"; // Added CheckCircle2 for success

const POLLING_INTERVAL = 3000; 
const MAX_POLLS = 5; 

export const FraudDetectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"predict" | "history">("predict");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [files, setFiles] = useState<FileUploadState>({
    payers: null,
    terminals: null,
    transactions: null,
  });
  const [currentPredictionRunIdentifier, setCurrentPredictionRunIdentifier] = useState<string | null>(null);
  const [modelPredictions, setModelPredictions] = useState<string[]>([]);
  const [selectedHistoryModel, setSelectedHistoryModel] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingModel, setIsUploadingModel] = useState(false); // State for model upload loading

  const [pollingCount, setPollingCount] = useState(0);
  const [pollTimeoutId, setPollTimeoutId] = useState<number | null>(null);

  const loadModels = useCallback(async () => {
    try {
      const modelData = await fetchModels();
      setModels(modelData.map((model) => model.name));
    } catch (err) {
      setError("Failed to load models. Please check if the backend server is running.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (activeTab === "history") {
      setCurrentPredictionRunIdentifier(null); 
      const getModelPredictionList = async () => {
        setIsLoading(true); 
        setError(null);
        setSuccessMessage(null);
        try {
          const modelList = await fetchPredictionList();
          setModelPredictions(modelList);
        } catch (err) {
          setError("Failed to load prediction list.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      getModelPredictionList();
    } else {
      // setError(null); 
      // setSuccessMessage(null);
    }
  }, [activeTab]);

  const handleFileChange = (
    fileType: keyof FileUploadState,
    file: File | null
  ) => {
    setFiles((prev) => ({ ...prev, [fileType]: file }));
  };
  
  const attemptFetchResultsIdentifier = useCallback(async (predictionModelIdentifier: string, currentAttempt: number) => {
    console.log(`Polling for prediction run readiness... Attempt ${currentAttempt}/${MAX_POLLS}`);
    try {
      await fetchPredictionPage(predictionModelIdentifier, 1); 
      setCurrentPredictionRunIdentifier(predictionModelIdentifier); 
      setIsLoading(false); 
      setError(null);
      setPollingCount(0); 
      if (pollTimeoutId) clearTimeout(pollTimeoutId); 
      return true; 
    } catch (err) {
      console.error(`Attempt ${currentAttempt} for ${predictionModelIdentifier} failed:`, err);
      if (currentAttempt >= MAX_POLLS) {
        setError("Prediction processed, but failed to retrieve initial results after multiple attempts. The run might be available in History later, or there could be an issue.");
        setIsLoading(false);
        setPollingCount(0);
        if (pollTimeoutId) clearTimeout(pollTimeoutId);
        setCurrentPredictionRunIdentifier(predictionModelIdentifier); 
        return false; 
      }
      const timeoutId: number = window.setTimeout(() => {
        attemptFetchResultsIdentifier(predictionModelIdentifier, currentAttempt + 1);
      }, POLLING_INTERVAL);
      setPollTimeoutId(timeoutId);
      return false; 
    }
  }, [pollTimeoutId]); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      setError("Please select a model.");
      setSuccessMessage(null);
      return;
    }
    if (!files.payers || !files.terminals || !files.transactions) {
      setError("Please upload all required files.");
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true); 
    setError(null);
    setSuccessMessage(null);
    setCurrentPredictionRunIdentifier(null); 

    try {
      await submitPrediction(selectedModel, {
        payers: files.payers!,
        terminals: files.terminals!,
        transactions: files.transactions!,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      const predictionFiles = await fetchPredictionList();
      let modelSpecificFiles = predictionFiles.filter(name => name.startsWith(selectedModel));
      if (modelSpecificFiles.length === 0) {
          await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
          const updatedPredictionFiles = await fetchPredictionList();
          const updatedModelSpecificFiles = updatedPredictionFiles.filter(name => name.startsWith(selectedModel));
          if (updatedModelSpecificFiles.length === 0) {
            throw new Error(`No prediction files found for model ${selectedModel} after submission and delay.`);
          }
          const newFilesToAdd = updatedModelSpecificFiles.filter(f => !modelSpecificFiles.includes(f));
          modelSpecificFiles = [...modelSpecificFiles, ...newFilesToAdd];
      }

      if (modelSpecificFiles.length === 0) { 
        throw new Error(`No prediction files found for model ${selectedModel} even after extended check.`);
      }

      modelSpecificFiles.sort(); 
      const latestPredictionIdentifier = modelSpecificFiles[modelSpecificFiles.length - 1];
      
      setPollingCount(1);
      setSuccessMessage("Prediction submitted! Confirming results..."); 
      attemptFetchResultsIdentifier(latestPredictionIdentifier, 1);

    } catch (err) {
      console.error("Submission or initial result identifier fetching failed:", err);
      setError(`Error: ${(err as Error).message || "Failed to submit prediction or confirm result readiness. Please try again."}`);
      setSuccessMessage(null);
      setIsLoading(false); 
    }
  };

  // Handler for new model upload
  const handleAddModel = async (modelFile: File) => {
    setIsUploadingModel(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await addModel(modelFile);
      setSuccessMessage(response.message || "Model added successfully!");
      await loadModels(); // Refresh the model list
      
      const modelNameFromFile = modelFile.name.split('.')[0];
      // Check if the newly added model is in the updated list and select it
      const updatedModelsList = await fetchModels(); // Fetch models again to ensure we have the latest list
      const newModel = updatedModelsList.find(m => m.name === modelNameFromFile);
      if (newModel) {
         setSelectedModel(newModel.name);
      }

    } catch (err) {
      setError(`Failed to add model: ${(err as Error).message}`);
      console.error(err);
    } finally {
      setIsUploadingModel(false);
    }
  };


  useEffect(() => {
    return () => {
      if (pollTimeoutId) {
        clearTimeout(pollTimeoutId);
      }
    };
  }, [pollTimeoutId]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);


  const allFilesUploaded =
    files.payers && files.terminals && files.transactions;
  const isFormProcessing = isLoading || isUploadingModel; 

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Freudulentos Fraud Detection System
      </h2>
      <Tabs activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          setError(null); 
          setSuccessMessage(null);
          if (tab === 'predict') setCurrentPredictionRunIdentifier(null); 
      }} />

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}
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
            {/* Corrected: Added missing props onAddModel and isUploadingModel */}
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onChange={(model) => {
                  setSelectedModel(model);
                  setCurrentPredictionRunIdentifier(null); 
              }}
              isLoading={isLoading && pollingCount === 0 && !currentPredictionRunIdentifier && !isUploadingModel} 
              onAddModel={handleAddModel} 
              isUploadingModel={isUploadingModel} 
            />
            <FileUploader
              files={files}
              onFileChange={(fileType, file) => {
                  handleFileChange(fileType, file);
                  setCurrentPredictionRunIdentifier(null); 
              }}
              isDisabled={isFormProcessing} 
            />
            <div className="mt-6">
              <button
                type="submit"
                disabled={!selectedModel || !allFilesUploaded || isFormProcessing} 
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  !selectedModel || !allFilesUploaded || isFormProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#FFE600] text-gray-900 hover:bg-yellow-500"
                }`}
              >
                {isLoading ? (pollingCount > 0 ? `Confirming Results (Attempt ${pollingCount})...` : "Processing Submission...") : "Run Prediction"}
              </button>
            </div>
          </form>
          { (currentPredictionRunIdentifier || (isLoading && pollingCount > 0)) &&
            <ResultsTable 
              modelName={currentPredictionRunIdentifier ?? undefined} 
              isLoading={isLoading && !currentPredictionRunIdentifier} 
            />
          }
          {!currentPredictionRunIdentifier && !isLoading && activeTab === 'predict' && !isUploadingModel && (
             <div className="mt-6 text-center text-gray-500 italic">
               Select a model, upload data, and run prediction to see results here.
             </div>
           )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Previous Predictions
          </h3>
          {isLoading && activeTab === 'history' && <p className="text-gray-600">Loading prediction list...</p>}

          {!isLoading && activeTab === 'history' && modelPredictions.length > 0 && (
            <select
              className="mb-4 p-2 border rounded w-full"
              value={selectedHistoryModel}
              onChange={(e) => setSelectedHistoryModel(e.target.value)}
            >
              <option value="">Select a prediction run</option>
              {modelPredictions.map((modelFile) => (
                <option key={modelFile} value={modelFile}>
                  {modelFile}
                </option>
              ))}
            </select>
          )}
           {!isLoading && activeTab === 'history' && modelPredictions.length === 0 && (
             <p className="text-gray-500">No prediction history available.</p>
           )}

          {selectedHistoryModel && ( 
            <ResultsTable
              modelName={selectedHistoryModel}
              isLoading={false} 
            />
          )}
        </div>
      )}
    </div>
  );
};
