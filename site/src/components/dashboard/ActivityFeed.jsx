import { motion } from 'framer-motion'
import './ActivityFeed.css'

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'alert',
      message: 'Unusual transaction pattern detected',
      time: '12 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'flagged',
      message: 'Transaction #38291 flagged for review',
      time: '43 minutes ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'resolved',
      message: 'False positive case #1204 resolved',
      time: '1 hour ago',
      severity: 'low'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Multiple failed login attempts',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      id: 5,
      type: 'resolved',
      message: 'Fraud case #1203 confirmed and blocked',
      time: '3 hours ago',
      severity: 'high'
    }
  ]
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      className="activity-feed"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {activities.map((activity) => (
        <motion.div 
          key={activity.id} 
          className={`activity-item severity-${activity.severity}`}
          variants={item}
        >
          <div className="activity-icon"></div>
          <div className="activity-content">
            <p className="activity-message">{activity.message}</p>
            <span className="activity-time">{activity.time}</span>
          </div>
          <button className="activity-action">View</button>
        </motion.div>
      ))}
      
      <a href="#" className="view-all-link">View all activity</a>
    </motion.div>
  )
}

export default ActivityFeed