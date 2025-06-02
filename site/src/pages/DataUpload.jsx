import { useState, useRef } from 'react'
import { FiUpload, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import './DataUpload.css'

const DataUpload = () => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [datasetType, setDatasetType] = useState('payers')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null) // null, 'uploading', 'success', 'error'
  
  const fileInputRef = useRef(null)
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }
  
  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }
  
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    setFiles(newFiles)
  }
  
  const handleUploadClick = () => {
    if (files.length === 0) return
    
    setUploadStatus('uploading')
    let progress = 0
    
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        setUploadStatus('success')
      }
    }, 200)
  }
  
  const openFileDialog = () => {
    fileInputRef.current.click()
  }
  
  const resetUpload = () => {
    setFiles([])
    setUploadProgress(0)
    setUploadStatus(null)
  }
  
  return (
    <div className="data-upload-container">
      <h3>Upload Dataset</h3>
      <p className="upload-description">
        Upload your dataset files to begin fraud detection analysis. Supported formats: CSV, JSON, XLSX.
      </p>
      
      <div className="dataset-type-selector">
        <p className="selector-label">Select dataset type:</p>
        <div className="dataset-options">
          <label className={`dataset-option ${datasetType === 'payers' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="dataset-type"
              value="payers"
              checked={datasetType === 'payers'}
              onChange={(e) => setDatasetType(e.target.value)}
            />
            <span className="option-label">Payers</span>
          </label>
          
          <label className={`dataset-option ${datasetType === 'terminals' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="dataset-type"
              value="terminals"
              checked={datasetType === 'terminals'}
              onChange={(e) => setDatasetType(e.target.value)}
            />
            <span className="option-label">Terminals</span>
          </label>
          
          <label className={`dataset-option ${datasetType === 'transactions' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="dataset-type"
              value="transactions"
              checked={datasetType === 'transactions'}
              onChange={(e) => setDatasetType(e.target.value)}
            />
            <span className="option-label">Transactions</span>
          </label>
          
          <label className={`dataset-option ${datasetType === 'full' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="dataset-type"
              value="full"
              checked={datasetType === 'full'}
              onChange={(e) => setDatasetType(e.target.value)}
            />
            <span className="option-label">Full Dataset</span>
          </label>
        </div>
      </div>
      
      {uploadStatus === 'success' ? (
        <motion.div 
          className="upload-success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-icon">
            <FiCheckCircle />
          </div>
          <h4>Upload Complete!</h4>
          <p>Your {datasetType} dataset has been uploaded successfully.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
              View Dashboard
            </button>
            <button className="btn btn-outline" onClick={resetUpload}>
              Upload Another Dataset
            </button>
          </div>
        </motion.div>
      ) : (
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            className="file-input"
            onChange={handleChange}
            multiple
          />
          
          {files.length > 0 ? (
            <div className="files-list">
              <h4>Selected Files</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index} className="file-item">
                    <FiFile className="file-icon" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  </li>
                ))}
              </ul>
              
              {uploadStatus === 'uploading' && (
                <div className="upload-progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}% Uploaded</span>
                </div>
              )}
              
              <div className="upload-actions">
                {uploadStatus !== 'uploading' ? (
                  <>
                    <button className="btn btn-primary\" onClick={handleUploadClick}>
                      <FiUpload />
                      Upload Files
                    </button>
                    <button className="btn btn-outline" onClick={resetUpload}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <p className="uploading-message">Uploading your files, please wait...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">
                <FiUpload />
              </div>
              <h4>Drag & Drop Files Here</h4>
              <p>or</p>
              <button className="btn btn-primary" onClick={openFileDialog}>
                Browse Files
              </button>
              <p className="upload-hint">Supported formats: CSV, JSON, XLSX</p>
            </div>
          )}
        </div>
      )}
      
      <div className="upload-guidelines">
        <h4>Dataset Guidelines</h4>
        <div className="guidelines-content">
          <div className="guideline-item">
            <h5>Payers Dataset</h5>
            <p>Should include payer ID, name, email, registration date, and transaction history.</p>
          </div>
          <div className="guideline-item">
            <h5>Terminals Dataset</h5>
            <p>Should include terminal ID, location, merchant ID, and activation date.</p>
          </div>
          <div className="guideline-item">
            <h5>Transactions Dataset</h5>
            <p>Should include transaction ID, amount, date, payer ID, terminal ID, and status.</p>
          </div>
          <div className="guideline-item">
            <h5>Full Dataset</h5>
            <p>Should include all of the above data in a properly structured format.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataUpload