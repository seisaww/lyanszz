// src/components/Game.jsx
import React, { useState, useEffect, useRef } from 'react';

function Game({ questions, onEnd }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0); // NOUVEAU : État pour la barre (0 à 100%)
  
  const audioRef = useRef(new Audio());
  const currentQ = questions[index];

  // Charger la musique quand la question change
  useEffect(() => {
    if (currentQ) {
      const audio = audioRef.current;
      audio.src = currentQ.correctTrack.preview;
      audio.volume = 0.5;
      
      // Reset des états
      setIsPlaying(false);
      setRevealed(false);
      setFeedback("");
      setProgress(0);

      // NOUVEAU : Écouter l'avancement de la musique
      const updateProgress = () => {
        if (audio.duration) {
          const percent = (audio.currentTime / audio.duration) * 100;
          setProgress(percent);
        }
      };

      // Si la musique finit toute seule, on remet le bouton Play
      const handleEnded = () => {
          setIsPlaying(false);
          setProgress(0);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);

      // Nettoyage quand on change de question ou quitte
      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [index, currentQ]);

  const togglePlay = () => {
    if (isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleChoice = (track) => {
    if (revealed) return;

    if (track.id === currentQ.correctTrack.id) {
      setFeedback("✨ Bonne réponse !");
      setRevealed(true);
      
      setTimeout(() => {
        if (index < questions.length - 1) {
          setIndex(index + 1);
        } else {
          audioRef.current.pause();
          onEnd();
        }
      }, 2000);
    } else {
      setFeedback("❌ Non, réessaie !");
      // Petit effet de vibration (optionnel)
      const card = document.querySelector('.game-card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
    }
  };

  return (
    <div className="card game-card">
      <div className="header-game">
        <span className="badge">{currentQ.correctTrack.artist}</span>
        <span className="counter">{index + 1} / {questions.length}</span>
      </div>

      <div className="vinyl-wrapper">
        <div 
            className={`album-cover ${revealed ? 'clear' : 'blur'}`}
            style={{ backgroundImage: `url(${currentQ.correctTrack.image})` }}
        ></div>
        <div className={`vinyl-shine ${isPlaying ? 'spinning' : ''}`}></div>
      </div>

      {/* NOUVEAU : La Barre de Progression */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <button className={`btn-play ${isPlaying ? 'active' : ''}`} onClick={togglePlay}>
        {isPlaying ? "❚❚ Pause" : "▶ Écouter"}
      </button>

      <div className="options-grid">
        {currentQ.choices.map(track => (
          <button 
            key={track.id} 
            className="btn-option"
            onClick={() => handleChoice(track)}
          >
            {track.title}
          </button>
        ))}
      </div>

      <div className="feedback-text">{feedback}</div>
    </div>
  );
}

export default Game;