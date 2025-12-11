// src/components/BlindTest.jsx
import React, { useState } from 'react';
import Menu from './Menu';
import Game from './Game';

function BlindTest({ onBack }) {
  const [phase, setPhase] = useState('menu'); 
  const [questions, setQuestions] = useState([]);
  const [artistName, setArtistName] = useState('');

  const fetchMusic = async (artist) => {
    setPhase('loading');
    setArtistName(artist);
    
    console.log(`🔍 Recherche Apple (iTunes) lancée pour : ${artist}`);

    try {
      // 1. URL Optimisée :
      // - media=music : On veut que de la musique
      // - entity=song : On veut des chansons (pas des albums)
      // - limit=200 : On en demande plein pour avoir du choix
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&media=music&entity=song&limit=200`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      console.log(`📦 Chansons reçues : ${data.resultCount}`);

      // 2. Filtrage Robuste
      const uniqueTracks = [];
      const names = new Set();
      
      // On prépare le nom de l'artiste recherché en minuscule pour comparer (ex: "angele" vs "Angèle")
      const searchLower = artist.toLowerCase();

      data.results.forEach(t => {
        // Nettoyage du titre
        const cleanTitle = t.trackName.split('(')[0].split('[')[0].trim().toLowerCase();
        const artistMatch = t.artistName.toLowerCase();

        // FILTRES :
        // 1. Doit avoir un extrait audio (previewUrl)
        // 2. Pas de doublon de titre
        // 3. (Optionnel) Pour éviter les remix bizarres, on peut privilégier quand l'artiste match
        if (t.previewUrl && !names.has(cleanTitle)) {
           
           // Petite astuce : Si on cherche "Angele", on accepte "Angèle"
           // On ajoute tout ce qu'Apple nous renvoie car leur tri par pertinence est bon
           names.add(cleanTitle);
           uniqueTracks.push({
            id: t.trackId,
            title: t.trackName, // Titre original propre
            artist: t.artistName,
            preview: t.previewUrl,
            image: t.artworkUrl100.replace('100x100', '600x600') // Image HD
          });
        }
      });

      console.log(`✅ Chansons valides : ${uniqueTracks.length}`);

      // 3. Vérification
      if (uniqueTracks.length < 4) {
        alert(`Oups ! Pas assez de chansons trouvées pour "${artist}". Essaie de vérifier l'orthographe (ex: "The Weeknd" et pas "Weeknd").`);
        setPhase('menu');
        return;
      }

      // 4. Mélange et Création du Jeu
      const gameQ = uniqueTracks.sort(() => 0.5 - Math.random()).slice(0, 10).map(correct => {
        const others = uniqueTracks.filter(t => t.id !== correct.id).sort(() => 0.5 - Math.random()).slice(0, 2);
        
        return {
            correctTrack: correct,
            choices: [correct, ...others].sort(() => 0.5 - Math.random())
        };
      });

      setQuestions(gameQ);
      setPhase('game');

    } catch (e) {
      console.error("ERREUR :", e);
      alert("Erreur de connexion ! Vérifie ta connexion internet.");
      setPhase('menu');
    }
  };

  return (
    <div className="blind-test-container">
      <button className="btn-back-home" onClick={onBack}>🏠 Accueil</button>

      {phase === 'menu' && <Menu onStart={fetchMusic} />}
      
      {phase === 'loading' && (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Recherche des titres de <strong>{artistName}</strong>...</p>
        </div>
      )}

      {phase === 'game' && (
        <Game questions={questions} onEnd={() => setPhase('end')} />
      )}

      {phase === 'end' && (
        <div className="card end-card">
          <h1>🏆 Terminé !</h1>
          <p>Session <strong>{artistName}</strong> finie.</p>
          <div className="options-grid">
            <button className="btn-primary" onClick={() => setPhase('menu')}>Rejouer</button>
            <button className="btn-option" onClick={onBack}>Retour Accueil</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlindTest;