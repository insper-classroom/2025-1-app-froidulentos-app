import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header.jsx';
import Footer from './components/footer/footer.jsx';
import FileUpload from './components/fileUpload/fileUpload.jsx';
import DashboardResultados from './pages/DashboardResultados.jsx';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/resultados" element={<DashboardResultados />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
