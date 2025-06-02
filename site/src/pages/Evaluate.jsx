import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiArrowUp, FiArrowDown, FiBarChart2, FiDollarSign } from 'react-icons/fi'
import './Evaluate.css'

const Evaluate = () => {
  const [files, setFiles] = useState({
    xDataset: null,
    yReal: null
  })
  
  const [results, setResults] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e, type) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileUpload(type, droppedFile)
  }
  
  const handleFileUpload = (type, file) => {
    setFiles(prev => ({
      ...prev,
      [type]: file
    }))
  }
  
  const handleEvaluate = async () => {
    // Mock results for demonstration
    setResults({
      accuracy: 0.92,
      precision: 0.89,
      recall: 0.94,
      f1Score: 0.91,
      confusionMatrix: {
        truePositive: 150,
        trueNegative: 800,
        falsePositive: 20,
        falseNegative: 30
      },
      profitMetrics: {
        savedAmount: 750000,
        preventedLosses: 450000,
        operationalCosts: 50000,
        netProfit: 1150000,
        roi: 2300
      }
    })
  }
  
  return (
    <div className="evaluate-container">
      <div className="evaluate-header">
        <h3>Model Evaluation</h3>
        <p className="evaluate-description">
          Upload your dataset and real labels to evaluate the model's performance and financial impact.
        </p>
      </div>
      
      <div className="upload-grid">
        <motion.div 
          className={`upload-box ${isDragging ? 'dragging' : ''} ${files.xDataset ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'xDataset')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <FiUpload />
            </div>
            <h4>Training Dataset (X)</h4>
            {files.xDataset ? (
              <div className="file-info">
                <p className="file-name">{files.xDataset.name}</p>
                <p className="file-size">{(files.xDataset.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <>
                <p>Drag & drop or click to upload</p>
                <input
                  type="file"
                  id="x-dataset"
                  className="file-input"
                  onChange={(e) => handleFileUpload('xDataset', e.target.files[0])}
                  accept=".csv,.feather"
                />
                <label htmlFor="x-dataset" className="btn btn-outline">Browse Files</label>
              </>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className={`upload-box ${isDragging ? 'dragging' : ''} ${files.yReal ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'yReal')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <FiUpload />
            </div>
            <h4>Real Labels (Y)</h4>
            {files.yReal ? (
              <div className="file-info">
                <p className="file-name">{files.yReal.name}</p>
                <p className="file-size">{(files.yReal.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <>
                <p>Drag & drop or click to upload</p>
                <input
                  type="file"
                  id="y-real"
                  className="file-input"
                  onChange={(e) => handleFileUpload('yReal', e.target.files[0])}
                  accept=".csv,.feather"
                />
                <label htmlFor="y-real" className="btn btn-outline">Browse Files</label>
              </>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="evaluate-actions">
        <motion.button 
          className="evaluate-btn"
          onClick={handleEvaluate}
          disabled={!files.xDataset || !files.yReal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Evaluate Model
        </motion.button>
      </div>
      
      {results && (
        <motion.div 
          className="results-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="results-header">
            <h4>Model Performance & Financial Impact</h4>
            <div className="results-icon">
              <FiBarChart2 />
            </div>
          </div>
          
          <div className="profit-section">
            <div className="profit-header">
              <FiDollarSign className="profit-icon" />
              <h5>Financial Impact Analysis</h5>
            </div>
            <div className="profit-metrics">
              <div className="profit-card total">
                <h6>Net Profit</h6>
                <div className="profit-amount">
                  ${results.profitMetrics.netProfit.toLocaleString()}
                </div>
                <div className="profit-roi">
                  ROI: {results.profitMetrics.roi}%
                </div>
              </div>
              <div className="profit-details">
                <div className="profit-item positive">
                  <span className="label">Saved Amount</span>
                  <span className="value">+${results.profitMetrics.savedAmount.toLocaleString()}</span>
                </div>
                <div className="profit-item positive">
                  <span className="label">Prevented Losses</span>
                  <span className="value">+${results.profitMetrics.preventedLosses.toLocaleString()}</span>
                </div>
                <div className="profit-item negative">
                  <span className="label">Operational Costs</span>
                  <span className="value">-${results.profitMetrics.operationalCosts.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <h5>Accuracy</h5>
              <div className="metric-value">
                <span className="number">{(results.accuracy * 100).toFixed(1)}</span>
                <span className="unit">%</span>
              </div>
              <div className="metric-bar" style={{ width: `${results.accuracy * 100}%` }}></div>
            </div>
            
            <div className="metric-card">
              <h5>Precision</h5>
              <div className="metric-value">
                <span className="number">{(results.precision * 100).toFixed(1)}</span>
                <span className="unit">%</span>
              </div>
              <div className="metric-bar" style={{ width: `${results.precision * 100}%` }}></div>
            </div>
            
            <div className="metric-card">
              <h5>Recall</h5>
              <div className="metric-value">
                <span className="number">{(results.recall * 100).toFixed(1)}</span>
                <span className="unit">%</span>
              </div>
              <div className="metric-bar" style={{ width: `${results.recall * 100}%` }}></div>
            </div>
            
            <div className="metric-card">
              <h5>F1 Score</h5>
              <div className="metric-value">
                <span className="number">{(results.f1Score * 100).toFixed(1)}</span>
                <span className="unit">%</span>
              </div>
              <div className="metric-bar" style={{ width: `${results.f1Score * 100}%` }}></div>
            </div>
          </div>
          
          <div className="confusion-matrix">
            <h5>Confusion Matrix</h5>
            <div className="matrix-grid">
              <div className="matrix-cell true-positive">
                <span className="cell-value">{results.confusionMatrix.truePositive}</span>
                <span className="cell-label">True Positive</span>
              </div>
              <div className="matrix-cell false-positive">
                <span className="cell-value">{results.confusionMatrix.falsePositive}</span>
                <span className="cell-label">False Positive</span>
              </div>
              <div className="matrix-cell false-negative">
                <span className="cell-value">{results.confusionMatrix.falseNegative}</span>
                <span className="cell-label">False Negative</span>
              </div>
              <div className="matrix-cell true-negative">
                <span className="cell-value">{results.confusionMatrix.trueNegative}</span>
                <span className="cell-label">True Negative</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Evaluate