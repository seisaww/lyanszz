import React, { useState } from 'react';

function Menu({ onStart }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) onStart(term);
  };

  return (
    <div className="card menu-card">
      <div className="logo">🎵</div>
      <h1>Blind Test <span className="highlight">Love</span></h1>
      <p>Choisis un artiste et devine les titres !</p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Ex: The Weeknd, Angèle..." 
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn-primary">
          Lancer la musique
        </button>
      </form>
    </div>
  );
}

export default Menu;