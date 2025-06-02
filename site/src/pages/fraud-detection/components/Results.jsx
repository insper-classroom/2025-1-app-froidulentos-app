import { motion } from 'framer-motion'
import { FiDollarSign } from 'react-icons/fi'
import './Results.css'

const Results = ({ mode, results }) => {
  if (!results) return null

  return (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <h4>Model Performance</h4>
          <div className="evaluation-metrics">
            <div className="metrics-grid">
              <div className="metric-card">
                <h5>Accuracy</h5>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${results.metrics.accuracy * 100}%` }}
                  />
                  <div className="metric-value">
                    {(results.metrics.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <h5>Precision</h5>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${results.metrics.precision * 100}%` }}
                  />
                  <div className="metric-value">
                    {(results.metrics.precision * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <h5>Recall</h5>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${results.metrics.recall * 100}%` }}
                  />
                  <div className="metric-value">
                    {(results.metrics.recall * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <h5>F1 Score</h5>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${results.metrics.f1Score * 100}%` }}
                  />
                  <div className="metric-value">
                    {(results.metrics.f1Score * 100).toFixed(1)}%
                  </div>
                </div>
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
  )
}

export default Results