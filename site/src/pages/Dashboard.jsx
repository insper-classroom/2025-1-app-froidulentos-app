import { useState, useEffect } from 'react'
import { FiArrowUp, FiArrowDown, FiAlertCircle, FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'
import MetricCard from '../components/dashboard/MetricCard'
import FraudChart from '../components/dashboard/FraudChart'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import './Dashboard.css'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    fraudRate: 2.7,
    fraudChange: 0.3,
    totalTransactions: 35842,
    transactionChange: 12.5,
    flaggedTransactions: 973,
    flaggedChange: -5.2,
    preventedLoss: 127500,
    preventedChange: 15.8
  })
  
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [])
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h3>Fraud Detection Overview</h3>
        <div className="date-selector">
          <select defaultValue="today">
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <motion.div 
          className="dashboard-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="metrics-grid" variants={itemVariants}>
            <MetricCard
              title="Fraud Rate"
              value={metrics.fraudRate + '%'}
              change={metrics.fraudChange}
              icon={<FiAlertCircle />}
              color="error"
            />
            <MetricCard
              title="Total Transactions"
              value={metrics.totalTransactions.toLocaleString()}
              change={metrics.transactionChange}
              icon={<FiShield />}
              color="primary"
            />
            <MetricCard
              title="Flagged Transactions"
              value={metrics.flaggedTransactions.toLocaleString()}
              change={metrics.flaggedChange}
              icon={<FiAlertCircle />}
              color="warning"
            />
            <MetricCard
              title="Prevented Loss"
              value={'$' + metrics.preventedLoss.toLocaleString()}
              change={metrics.preventedChange}
              icon={<FiShield />}
              color="success"
            />
          </motion.div>
          
          <div className="dashboard-row">
            <motion.div className="chart-container" variants={itemVariants}>
              <h4>Fraud Detection Trends</h4>
              <FraudChart />
            </motion.div>
            
            <motion.div className="activity-container" variants={itemVariants}>
              <h4>Recent Activity</h4>
              <ActivityFeed />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard