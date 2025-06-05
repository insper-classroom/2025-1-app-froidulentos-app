// src/components/ModelSelector.tsx
import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  // Changed from onModelChange back to onChange for this version
  onChange: (model: string) => void; 
  // Changed from isLoadingModels back to isLoading for this version
  isLoading: boolean; 
  onAddModel: (file: File) => void; 
  isUploadingModel: boolean; 
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onChange, // Using onChange
  isLoading, // Using isLoading
  onAddModel,
  isUploadingModel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAddModel(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select ML Model
      </label>
      <div className="flex items-center space-x-2">
        <select
          id="model-select"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-[#FFE600] transition-colors"
          value={selectedModel}
          onChange={(e) => onChange(e.target.value)} // Using onChange
          disabled={isLoading || isUploadingModel || models.length === 0}
        >
          {isLoading && models.length === 0 ? ( 
            <option value="">Loading models...</option>
          ) : (
            <>
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </>
          )}
        </select>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pkl" 
          onChange={handleFileSelect}
          disabled={isUploadingModel}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 flex items-center space-x-2"
          disabled={isUploadingModel}
        >
          <UploadCloud size={18} />
          <span>{isUploadingModel ? "Uploading..." : "Add Model"}</span>
        </button>
      </div>
    </div>
  );
};
