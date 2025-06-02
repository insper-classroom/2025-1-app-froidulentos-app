import { motion } from 'framer-motion'
import './Sidebar.css'

const Sidebar = ({ isOpen }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }
  
  return (
    <motion.aside 
      className="sidebar"
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="sidebar-header">
        <div className="logo">
          <img src="/logo_mercado_pago.png" alt="Logo" className="logo-image" />
          <h1 className="logo-text">Freudulentos</h1>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar