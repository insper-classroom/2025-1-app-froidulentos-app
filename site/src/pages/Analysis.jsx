import { useState } from 'react'
import './Analysis.css'

const Analysis = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  return (
    <div className="analysis-container">
      <h3>Fraud Analysis</h3>
      
      <div className="analysis-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          Fraud Patterns
        </button>
        <button 
          className={`tab-button ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('cases')}
        >
          Flagged Cases
        </button>
        <button 
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <p className="tab-description">
              Overview of fraud detection results and patterns for the selected dataset.
            </p>
            
            <div className="placeholder-content">
              <p>Select and upload a dataset to view analysis results.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Dataset
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'patterns' && (
          <div className="patterns-tab">
            <p className="tab-description">
              Identified fraud patterns and behaviors in the selected dataset.
            </p>
            
            <div className="placeholder-content">
              <p>Select and upload a dataset to view fraud patterns.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Dataset
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'cases' && (
          <div className="cases-tab">
            <p className="tab-description">
              Review and manage flagged cases for further investigation.
            </p>
            
            <div className="placeholder-content">
              <p>Select and upload a dataset to view flagged cases.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Dataset
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="reports-tab">
            <p className="tab-description">
              Generate and export fraud detection reports for the selected dataset.
            </p>
            
            <div className="placeholder-content">
              <p>Select and upload a dataset to generate reports.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Dataset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis