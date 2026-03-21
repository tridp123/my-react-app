import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EnglishLearningPage.css';

const DEFAULT_VOCABULARY = [
  { id: 1, word: 'Ebullient', ipa: '/ɪˈbʌliənt/', meaning: 'Tràn đầy năng lượng, phấn khởi', example: 'She sounded ebullient on the phone.' },
  { id: 2, word: 'Serendipity', ipa: '/ˌserənˈdɪpəti/', meaning: 'Sự tình cờ may mắn', example: 'By pure serendipity, I met my old friend at the airport.' },
  { id: 3, word: 'Quintessential', ipa: '/ˌkwɪntɪˈsenʃl/', meaning: 'Tinh hoa, điển hình nhất', example: 'It was the quintessential sunset over the ocean.' },
  { id: 4, word: 'Ephemeral', ipa: '/ɪˈfemərəl/', meaning: 'Phù du, chóng tàn', example: 'Fame is often ephemeral in the age of social media.' },
];

const EnglishLearningPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voice, setVoice] = useState(null);
  const [vocabulary, setVocabulary] = useState(DEFAULT_VOCABULARY);

  useEffect(() => {
    const refreshVocab = () => {
      const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary'));
      if (savedVocab && savedVocab.length > 0) {
        setVocabulary(savedVocab);
      }
    };

    refreshVocab();
    window.addEventListener('vocab_updated', refreshVocab);

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const preferredVoice = availableVoices.find(v => 
        (v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Premium')) && v.lang.startsWith('en')
      ) || availableVoices.find(v => v.lang.startsWith('en'));
      
      setVoice(preferredVoice);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => window.removeEventListener('vocab_updated', refreshVocab);
  }, []);

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
  };

  const prevWord = () => {
    setCurrentIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const current = vocabulary[currentIndex];

  if (!current) return <div className="learning-container">Chưa có từ vựng.</div>;

  return (
    <div className="learning-container">
      <nav className="learning-nav">
        <Link to="/" className="back-link">← Home</Link>
        <h2 className="brand-name">English Master</h2>
      </nav>

      <main className="learning-main">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
          ></div>
        </div>

        <div className="word-card">
          <span className="word-count">{currentIndex + 1} / {vocabulary.length}</span>
          
          <div className="word-image-container">
            <img 
              src={`https://source.unsplash.com/featured/800x450/?${current.word},nature,minimalist`} 
              alt={current.word} 
              className="word-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </div>

          <div className="word-header">
            <h1 className="word-title">{current.word}</h1>
            <button className="speaker-btn" onClick={() => speak(current.word)} title="Listen to word">
              🔊
            </button>
          </div>
          <p className="word-ipa">{current.ipa}</p>
          <div className="divider"></div>
          <p className="word-meaning">{current.meaning}</p>
          <div className="example-box">
            <div className="example-header">
              <strong>Example:</strong>
              <button className="speaker-btn-small" onClick={() => speak(current.example)} title="Listen to example">
                🔊
              </button>
            </div>
            <p className="word-example">"{current.example}"</p>
          </div>
        </div>

        <div className="controls">
          <button className="ctrl-btn" onClick={prevWord}>Previous</button>
          <button className="ctrl-btn primary" onClick={nextWord}>Next</button>
        </div>
      </main>
    </div>
  );
};

export default EnglishLearningPage;
