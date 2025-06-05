import React from 'react';
import { Package } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#FFE600] shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-gray-800" />
            <h1 className="text-xl font-bold text-gray-800">ML Fraud Detection</h1>
          </div>
          <div className="text-sm text-gray-700">Powered by Mercado Livre</div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Mercado Livre Fraud Detection System
        </div>
      </footer>
    </div>
  );
};