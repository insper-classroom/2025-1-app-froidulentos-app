import { createContext, useContext, useState } from 'react'

const DataContext = createContext()

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }) => {
  const [uploadedData, setUploadedData] = useState(null)
  const [datasetType, setDatasetType] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState(null)
  
  // Mock fraud detection metrics
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
  
  const processData = (data, type) => {
    setDataLoading(true)
    setDataError(null)
    
    try {
      // Process data based on type (payers, terminals, transactions, full)
      // This would contain actual processing logic in a real implementation
      
      setUploadedData(data)
      setDatasetType(type)
      
      // Update metrics based on processed data
      // This is just a mock implementation
      setMetrics({
        ...metrics,
        fraudRate: type === 'transactions' ? 3.2 : 2.7,
        flaggedTransactions: type === 'transactions' ? 1203 : 973,
      })
      
      setDataLoading(false)
    } catch (error) {
      setDataError('Error processing data: ' + error.message)
      setDataLoading(false)
    }
  }
  
  const clearData = () => {
    setUploadedData(null)
    setDatasetType(null)
  }
  
  const value = {
    uploadedData,
    datasetType,
    dataLoading,
    dataError,
    metrics,
    processData,
    clearData
  }
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}