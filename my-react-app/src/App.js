import logo from './logo_premium.png';
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EnglishLearningPage from './EnglishLearningPage';
import VocabularyManager from './VocabularyManager';
import ConversationLearning from './ConversationLearning';
import { DEFAULT_VOCABULARY } from './AutoVocabularyData';

function Home() {
  const [isAuto, setIsAuto] = React.useState(() => {
    return localStorage.getItem('is_auto_enabled') !== 'false';
  });
  const [wordCount, setWordCount] = React.useState(0);

  React.useEffect(() => {
    const updateCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/vocabularies');
        if (response.ok) {
          const data = await response.json();
          setWordCount(data.length);
          localStorage.setItem('my_vocabulary', JSON.stringify(data));
        } else {
          const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary')) || [];
          setWordCount(savedVocab.length);
        }
      } catch (err) {
        const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary')) || [];
        setWordCount(savedVocab.length);
      }
    };
    updateCount();
    window.addEventListener('vocab_updated', updateCount);
    return () => window.removeEventListener('vocab_updated', updateCount);
  }, []);

  const toggleAuto = () => {
    const newState = !isAuto;
    setIsAuto(newState);
    localStorage.setItem('is_auto_enabled', newState);
    window.dispatchEvent(new CustomEvent('auto_toggle', { detail: newState }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="English Master Logo" />
        <h1 className="hero-title">English Master Premium</h1>
        <p className="hero-subtitle">Nâng tầm tiếng Anh của bạn mỗi ngày</p>
        
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-value">{wordCount}</span>
            <span className="stat-label">Từ vựng đã có</span>
          </div>
        </div>

        <div className="home-links">
          <Link className="start-btn" to="/learn">
            Bắt đầu học ngay
          </Link>
          <Link className="conv-btn" to="/conversation">
            Học qua hội thoại
          </Link>
          <Link className="manage-btn" to="/manage">
            Quản lý từ vựng
          </Link>
        </div>

        <div className="auto-control">
          <div className="auto-status">
            <span className={`dot ${isAuto ? 'pulse' : 'off'}`}></span> 
            {isAuto ? 'Hệ thống đang tự động cập nhật từ vựng' : 'Tự động cập nhật đang TẮT'}
          </div>
          <button className={`toggle-btn ${isAuto ? 'active' : ''}`} onClick={toggleAuto}>
            {isAuto ? 'Dừng tự động' : 'Bật tự động'}
          </button>
        </div>
      </header>
    </div>
  );
}

function App() {
  useEffect(() => {
    let interval;
    
    const startInterval = () => {
      if (localStorage.getItem('is_auto_enabled') === 'false') return;
      
      interval = setInterval(() => {
        const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary')) || [];
        const availableWords = DEFAULT_VOCABULARY.filter(
          v => !savedVocab.some(sv => sv.word.toLowerCase() === v.word.toLowerCase())
        );

        if (availableWords.length > 0) {
          const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
          fetch('http://localhost:8080/api/vocabularies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(randomWord)
          })
          .then(res => res.ok ? res.json() : Promise.reject('Failed'))
          .then(createdWord => {
            const updatedVocab = [createdWord, ...savedVocab];
            localStorage.setItem('my_vocabulary', JSON.stringify(updatedVocab));
            window.dispatchEvent(new Event('vocab_updated'));
          })
          .catch(console.error);
        }
      }, 60000);
    };

    startInterval();

    const handleToggle = (e) => {
      clearInterval(interval);
      if (e.detail) startInterval();
    };

    window.addEventListener('auto_toggle', handleToggle);
    return () => {
      clearInterval(interval);
      window.removeEventListener('auto_toggle', handleToggle);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<EnglishLearningPage />} />
        <Route path="/conversation" element={<ConversationLearning />} />
        <Route path="/manage" element={<VocabularyManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
