import { useState, useRef } from 'react'
import { FiUpload, FiCheckCircle, FiFile } from 'react-icons/fi'
import './DatasetUpload.css'

const DatasetUpload = ({ title, type, onFileUpload }) => {
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileUpload(droppedFile)
  }
  
  const handleFileUpload = (uploadedFile) => {
    if (uploadedFile) {
      setFile(uploadedFile)
      onFileUpload(type, uploadedFile)
    }
  }
  
  return (
    <div 
      className={`upload-box ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h4>{title}</h4>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files[0])}
        className="file-input"
        accept=".csv,.feather"
      />
      {file ? (
        <div className="file-info">
          <FiCheckCircle className="file-icon success" />
          <span>{file.name}</span>
        </div>
      ) : (
        <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
          <FiUpload className="upload-icon" />
          <button className="btn btn-outline">Upload CSV or Feather</button>
          <p className="upload-hint">Supported formats: CSV, Feather</p>
        </div>
      )}
    </div>
  )
}

export default DatasetUpload