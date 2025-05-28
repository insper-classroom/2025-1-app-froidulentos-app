import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import './fileUpload.css';


const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    setUploadStatus('idle');
    setTimeout(() => {
      setUploadStatus(Math.random() > 0.2 ? 'success' : 'error');
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange} 
        className="file-input" 
        accept=".csv,.xlsx,.json"
      />
      
      {!file ? (
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload size={48} />
          <p className="upload-text">Arraste e solte seu arquivo aqui ou clique para selecionar</p>
          <p className="upload-subtext">Formatos suportados: CSV, XLSX, JSON</p>
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-info">
            <File size={24} />
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
          
          {uploadStatus === 'idle' && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-bar-fill"></div>
              </div>
              <p>Processando arquivo...</p>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="upload-result success">
              <CheckCircle size={24} />
              <p>Arquivo processado com sucesso!</p>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="upload-result error">
              <AlertCircle size={24} />
              <p>Erro ao processar o arquivo. Tente novamente.</p>
            </div>
          )}
          
          <div className="file-actions">
            <button 
              className="action-button primary"
              disabled={uploadStatus === 'idle'}
            >
              Analisar dados
            </button>
            <button 
              className="action-button secondary"
              onClick={resetUpload}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;