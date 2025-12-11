import React from 'react';

function Home({ onNavigate }) {
  return (
    <div className="card home-card">
      <h1>Pour les OG</h1>
      <p>Choisis une activité :</p>
      
      <div className="menu-grid">
        {/* Activité 1 : Le Blind Test */}
        <button 
          className="menu-item" 
          onClick={() => onNavigate('blindtest')}
        >
          <span className="icon">🎵</span>
          <span>Blind Test</span>
        </button>

        {/* Activité 2 : Bientôt disponible (Exemple) */}
        <button className="menu-item disabled">
          <span className="icon">💌</span>
          <span>Pour dehek</span>
        </button>

         {/* Activité 3 : Bientôt disponible */}
         <button className="menu-item disabled">
          <span className="icon">📸</span>
          <span>e-Souvenirs (Bientôt)</span>
        </button>
      </div>
    </div>
  );
}

export default Home;