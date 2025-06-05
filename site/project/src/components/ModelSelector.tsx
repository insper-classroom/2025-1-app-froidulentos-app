import React from 'react';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onChange: (model: string) => void;
  isLoading: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onChange,
  isLoading,
}) => {
  return (
    <div className="mb-6">
      <label htmlFor="model-select\" className="block text-sm font-medium text-gray-700 mb-2">
        Select ML Model
      </label>
      <select
        id="model-select"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-[#FFE600] transition-colors"
        value={selectedModel}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading || models.length === 0}
      >
        {models.length === 0 ? (
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
    </div>
  );
};