// src/components/Layout.tsx
import React from 'react';
// import { Package } from 'lucide-react'; // Package icon is no longer used

// Assuming images.png is in public/assets/images.png
const logoUrl = "src/assets/images.png"; 

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#FFE600] shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between"> {/* Adjusted padding slightly */}
          <div className="flex items-center space-x-3"> {/* Adjusted space slightly */}
            {/* MODIFIED PART START: Replaced Package icon with img tag for the logo */}
            <img 
              src={logoUrl} 
              alt="Mercado Livre Logo" 
              className="w-10 h-10 object-contain" // Adjusted size, ensure object-contain if aspect ratio is important
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevents looping
                // Corrected: Fallback to a reliable placeholder URL
                target.src = "https://placehold.co/40x40/CCCCCC/333333?text=Logo"; 
                target.alt = "Fallback Logo Placeholder";
              }}
            />
            {/* MODIFIED PART END */}
            <h1 className="text-xl font-bold text-gray-800">Freudulentos Fraud Detection System</h1>
          </div>
          <div className="text-sm text-gray-700">Powered by Insper's Fraud Detection Team - Freudulentos</div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Mercado Livre & Insper Fraud Detection System
        </div>
      </footer>
    </div>
  );
};
