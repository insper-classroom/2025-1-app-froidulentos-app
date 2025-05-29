import React from 'react';
import Header from './components/header/header.jsx';
import FileUpload from './components/fileUpload/fileUpload.jsx';
import Footer from './components/footer/footer.jsx';
import './App.css';

function App() {
  const handleFileUpload = (file) => {
    console.log('Arquivo recebido:', file);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <FileUpload onFileUpload={handleFileUpload} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
