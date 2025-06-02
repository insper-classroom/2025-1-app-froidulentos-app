import { useState } from 'react'
import { motion } from 'framer-motion'
import DatasetUpload from './components/DatasetUpload'
import Results from './components/Results'
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
  const [selectedModel, setSelectedModel] = useState('random-forest')
  
  const models = [
    { id: 'random-forest', name: 'Random Forest' },
    { id: 'xgboost', name: 'XGBoost' },
    { id: 'neural-network', name: 'Neural Network' },
    { id: 'logistic-regression', name: 'Logistic Regression' }
  ]
  
  const handleModeChange = (newMode) => {
    setMode(newMode)
    setResults(null)
  }
  
  const handleFileUpload = (type, file) => {
    setDatasets(prev => ({
      ...prev,
      [type]: file
    }))
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
  
  return (
    <div className="fraud-detection-container">
      <div className="header-controls">
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
        
        <div className="model-selector">
          <label htmlFor="model">Model:</label>
          <select 
            id="model" 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="datasets-grid">
        <DatasetUpload 
          title="Terminals Dataset"
          type="terminals"
          onFileUpload={handleFileUpload}
        />
        <DatasetUpload 
          title="Payers Dataset"
          type="payers"
          onFileUpload={handleFileUpload}
        />
        <DatasetUpload 
          title="Transactions Dataset"
          type="transactions"
          onFileUpload={handleFileUpload}
        />
        {mode === 'evaluate' && (
          <DatasetUpload 
            title="Real Labels (Y)"
            type="yLabels"
            onFileUpload={handleFileUpload}
          />
        )}
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
      
      <Results mode={mode} results={results} />
    </div>
  )
}

export default FraudDetection