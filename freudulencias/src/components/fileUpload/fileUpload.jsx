import React, { useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';
import './fileUpload.css';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    setUploadStatus('idle');
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

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao enviar para o backend");

      const resultData = await response.json();
      navigate("/resultados", { state: resultData });
    } catch (error) {
      console.error(error);
      message.error("Erro ao analisar os dados.");
    } finally {
      setLoading(false);
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

          <div className="file-actions">
            <button 
              className="action-button primary"
              disabled={loading}
              onClick={handleAnalyze}
            >
              {loading ? <Spin size="small" /> : "Analisar dados"}
            </button>
            <button 
              className="action-button secondary"
              onClick={resetUpload}
              disabled={loading}
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
