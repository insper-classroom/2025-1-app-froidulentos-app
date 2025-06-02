import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { motion } from 'framer-motion'
import './MetricCard.css'

const MetricCard = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0
  
  const getChangeColor = () => {
    if (color === 'error') {
      return isPositive ? 'text-error' : 'text-success'
    }
    return isPositive ? 'text-success' : 'text-error'
  }
  
  return (
    <motion.div 
      className={`metric-card ${color}`}
      whileHover={{ y: -5, boxShadow: '0 12px 20px -4px rgba(0, 0, 0, 0.15)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="metric-icon">
        {icon}
      </div>
      <div className="metric-info">
        <h4 className="metric-title">{title}</h4>
        <div className="metric-value-container">
          <div className="metric-value">{value}</div>
          <div className={`metric-change ${getChangeColor()}`}>
            {isPositive ? <FiArrowUp /> : <FiArrowDown />}
            {Math.abs(change)}%
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MetricCard