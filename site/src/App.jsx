import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import FraudDetection from './pages/fraud-detection/FraudDetection'
import { DataProvider } from './context/DataContext'

function App() {
  return (
    <DataProvider>
      <Layout>
        <Routes>
          <Route path="/*" element={<FraudDetection />} />
        </Routes>
      </Layout>
    </DataProvider>
  )
}

export default App