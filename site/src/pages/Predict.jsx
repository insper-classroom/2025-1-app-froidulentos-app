import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import './Predict.css'

const Predict = () => {
  const [file, setFile] = useState(null)
  const [predictions, setPredictions] = useState(null)
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
    setFile(droppedFile)
  }
  
  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile)
  }
  
  const handlePredict = async () => {
    // This would be connected to your API
    console.log('Predicting with file:', file)
    
    // Mock predictions for now
    setPredictions([
      { id: 1, probability: 0.92, isFraud: true, amount: 1500, date: '2024-02-15' },
      { id: 2, probability: 0.15, isFraud: false, amount: 250, date: '2024-02-15' },
      { id: 3, probability: 0.88, isFraud: true, amount: 3000, date: '2024-02-15' },
      { id: 4, probability: 0.23, isFraud: false, amount: 100, date: '2024-02-15' },
      { id: 5, probability: 0.95, isFraud: true, amount: 5000, date: '2024-02-15' }
    ])
  }
  
  return (
    <div className="predict-container">
      <div className="predict-header">
        <h3>Fraud Detection Prediction</h3>
        <p className="predict-description">
          Upload your dataset to detect potential fraudulent transactions using our machine learning model.
        </p>
      </div>
      
      <div 
        className={`upload-section ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <FiUpload />
            </div>
            <h4>Drag & Drop Your Dataset</h4>
            <p>or</p>
            <input
              type="file"
              id="file-upload"
              className="file-input"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <label htmlFor="file-upload" className="btn btn-primary">
              Browse Files
            </label>
            <p className="upload-hint">Supported format: CSV</p>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <FiUpload className="file-icon" />
              <div className="file-details">
                <h4>{file.name}</h4>
                <p>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              className="btn btn-primary predict-btn"
              onClick={handlePredict}
            >
              Generate Predictions
            </button>
          </div>
        )}
      </div>
      
      {predictions && (
        <motion.div 
          className="predictions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="predictions-header">
            <h4>Prediction Results</h4>
            <div className="predictions-summary">
              <div className="summary-item fraud">
                <FiAlertCircle />
                <span>
                  {predictions.filter(p => p.isFraud).length} Fraudulent
                </span>
              </div>
              <div className="summary-item normal">
                <FiCheckCircle />
                <span>
                  {predictions.filter(p => !p.isFraud).length} Normal
                </span>
              </div>
            </div>
          </div>
          
          <div className="predictions-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Probability</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map(pred => (
                  <motion.tr 
                    key={pred.id} 
                    className={pred.isFraud ? 'fraud' : 'normal'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{pred.id}</td>
                    <td>{pred.date}</td>
                    <td>${pred.amount.toLocaleString()}</td>
                    <td>
                      <div className="probability-bar">
                        <div 
                          className="probability-fill"
                          style={{ width: `${pred.probability * 100}%` }}
                        />
                        <span>{(pred.probability * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${pred.isFraud ? 'fraud' : 'normal'}`}>
                        {pred.isFraud ? 'Fraud' : 'Normal'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Predict