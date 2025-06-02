import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiAlertCircle, FiCheckCircle, FiDollarSign } from 'react-icons/fi'
import './FraudDetection.css'

const FraudDetection = () => {
  const [datasets, setDatasets] = useState({
    terminals: null,
    payers: null,
    transactions: null,
    yLabels: null
  })
  
  const [mode, setMode] = useState('predict')
  const [results, setResults] = useState(null)
  const fileInputRefs = {
    terminals: useRef(),
    payers: useRef(),
    transactions: useRef(),
    yLabels: useRef()
  }
  
  const handleFileUpload = (type, file) => {
    if (file) {
      setDatasets(prev => ({
        ...prev,
        [type]: file
      }))
    }
  }
  
  const triggerFileInput = (type) => {
    fileInputRefs[type].current?.click()
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setResults(null) // Reset results when switching modes
  }
  
  const handleProcess = async () => {
    if (mode === 'predict') {
      setResults({
        predictions: [
          { id: 1, probability: 0.92, isFraud: true, amount: 1500 },
          { id: 2, probability: 0.15, isFraud: false, amount: 250 },
          { id: 3, probability: 0.88, isFraud: true, amount: 3000 }
        ]
      })
    } else {
      setResults({
        metrics: {
          accuracy: 0.92,
          precision: 0.89,
          recall: 0.94,
          f1Score: 0.91
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
  }
  
  const canProcess = () => {
    if (mode === 'predict') {
      return datasets.terminals && datasets.payers && datasets.transactions
    }
    return datasets.terminals && datasets.payers && datasets.transactions && datasets.yLabels
  }
  
  const renderUploadBox = (type, title) => (
    <div className="upload-box">
      <h4>{title}</h4>
      <input
        type="file"
        ref={fileInputRefs[type]}
        onChange={(e) => handleFileUpload(type, e.target.files[0])}
        className="file-input"
        accept=".csv"
      />
      {datasets[type] ? (
        <div className="file-info">
          <FiCheckCircle className="file-icon success" />
          <span>{datasets[type].name}</span>
        </div>
      ) : (
        <div className="upload-placeholder" onClick={() => triggerFileInput(type)}>
          <FiUpload className="upload-icon" />
          <button className="btn btn-outline">Upload CSV</button>
        </div>
      )}
    </div>
  )
  
  return (
    <div className="fraud-detection-container">
      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'predict' ? 'active' : ''}`}
          onClick={() => handleModeChange('predict')}
        >
          Predict
        </button>
        <button 
          className={`mode-btn ${mode === 'evaluate' ? 'active' : ''}`}
          onClick={() => handleModeChange('evaluate')}
        >
          Evaluate
        </button>
      </div>
      
      <div className="datasets-grid">
        {renderUploadBox('terminals', 'Terminals Dataset')}
        {renderUploadBox('payers', 'Payers Dataset')}
        {renderUploadBox('transactions', 'Transactions Dataset')}
        {mode === 'evaluate' && renderUploadBox('yLabels', 'Real Labels (Y)')}
      </div>
      
      <div className="actions">
        <button 
          className="btn btn-primary process-btn"
          onClick={handleProcess}
          disabled={!canProcess()}
        >
          {mode === 'predict' ? 'Generate Predictions' : 'Evaluate Model'}
        </button>
      </div>
      
      {results && (
        <motion.div 
          className="results-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {mode === 'predict' ? (
            <>
              <h4>Predictions</h4>
              <div className="predictions-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Amount</th>
                      <th>Probability</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.predictions.map(pred => (
                      <tr key={pred.id} className={pred.isFraud ? 'fraud' : 'normal'}>
                        <td>{pred.id}</td>
                        <td>${pred.amount}</td>
                        <td>{(pred.probability * 100).toFixed(1)}%</td>
                        <td>
                          <span className={`status-badge ${pred.isFraud ? 'fraud' : 'normal'}`}>
                            {pred.isFraud ? 'Fraud' : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="evaluation-metrics">
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h5>Accuracy</h5>
                    <div className="metric-value">{(results.metrics.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div className="metric-card">
                    <h5>Precision</h5>
                    <div className="metric-value">{(results.metrics.precision * 100).toFixed(1)}%</div>
                  </div>
                  <div className="metric-card">
                    <h5>Recall</h5>
                    <div className="metric-value">{(results.metrics.recall * 100).toFixed(1)}%</div>
                  </div>
                  <div className="metric-card">
                    <h5>F1 Score</h5>
                    <div className="metric-value">{(results.metrics.f1Score * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="profit-section">
                  <div className="profit-header">
                    <FiDollarSign className="profit-icon" />
                    <h5>Financial Impact</h5>
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
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default FraudDetection