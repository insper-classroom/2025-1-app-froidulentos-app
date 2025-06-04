import React, { useRef } from 'react';
import { FileUploadState } from '../types';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  files: FileUploadState;
  onFileChange: (fileType: keyof FileUploadState, file: File | null) => void;
  isDisabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFileChange,
  isDisabled,
}) => {
  const fileInputRefs = {
    payers: useRef<HTMLInputElement>(null),
    terminals: useRef<HTMLInputElement>(null),
    transactions: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: keyof FileUploadState
  ) => {
    const file = e.target.files?.[0] || null;
    onFileChange(fileType, file);
  };

  const triggerFileInput = (fileType: keyof FileUploadState) => {
    fileInputRefs[fileType].current?.click();
  };

  const fileTypes: Array<{ key: keyof FileUploadState; label: string }> = [
    { key: 'payers', label: 'Payers' },
    { key: 'terminals', label: 'Terminals' },
    { key: 'transactions', label: 'Transactions' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Data Files</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {fileTypes.map(({ key, label }) => (
          <div key={key} className="flex flex-col">
            <input
              type="file"
              ref={fileInputRefs[key]}
              className="hidden"
              accept=".feather"
              onChange={(e) => handleFileChange(e, key)}
              disabled={isDisabled}
            />
            <div
              onClick={() => !isDisabled && triggerFileInput(key)}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                files[key]
                  ? 'border-green-500 bg-green-50'
                  : isDisabled
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-gray-300 hover:border-[#FFE600] hover:bg-yellow-50'
              }`}
            >
              <div className="flex flex-col items-center justify-center py-4">
                <Upload
                  className={`w-8 h-8 mb-2 ${
                    files[key] ? 'text-green-500' : 'text-gray-400'
                  }`}
                />
                <span className="text-sm font-medium mb-1">{label} File</span>
                <span className="text-xs text-gray-500 mb-2">.feather format</span>
                {files[key] ? (
                  <span className="text-xs text-green-600 font-medium truncate max-w-full">
                    {files[key]?.name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">Click to browse</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};