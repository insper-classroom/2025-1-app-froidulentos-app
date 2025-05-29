import React from 'react';
import { ShieldAlert } from 'lucide-react';
import './header.css';


const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/src/assets/logo_mercado_pago.png" alt="Logo Mercado Pago" />
          <h1>Freudulentos</h1>
        </div>
        <nav className="nav">
          <button className="nav-button">Upload</button>
          <button className="nav-button">Modelos</button>
          <button className="nav-button">Resultados</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;