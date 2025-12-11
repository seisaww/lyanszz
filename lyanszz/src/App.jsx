// src/App.jsx
import { useState } from 'react';
import Home from './components/Home';
import './App.css';
import BlindTest from './components/Blindtest';
import './App.css';

function App() {
  // Par défaut, on affiche la page 'home'
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="app-container">
      {/* Décoration de fond */}
      <div className="bubble b1"></div>
      <div className="bubble b2"></div>

      {/* --- ROUTAGE SIMPLE --- */}
      
      {/* Si la page est 'home', on affiche le Menu Principal */}
      {currentPage === 'home' && (
        <Home onNavigate={(page) => setCurrentPage(page)} />
      )}

      {/* Si la page est 'blindtest', on affiche le Jeu */}
      {currentPage === 'blindtest' && (
        <BlindTest onBack={() => setCurrentPage('home')} />
      )}

    </div>
  );
}

export default App;