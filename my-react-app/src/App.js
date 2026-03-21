import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EnglishLearningPage from './EnglishLearningPage';
import VocabularyManager from './VocabularyManager';
import { AUTO_VOCABULARY } from './AutoVocabularyData';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="hero-title">Welcome to English Master</h1>
        <p className="hero-subtitle">Nâng tầm tiếng Anh của bạn mỗi ngày</p>
        <div className="home-links">
          <Link className="start-btn" to="/learn">
            Bắt đầu học ngay
          </Link>
          <Link className="manage-btn" to="/manage">
            Quản lý từ vựng
          </Link>
        </div>
        <div className="auto-status">
          <span className="dot pulse"></span> Hệ thống đang tự động cập nhật từ vựng mới mỗi phút
        </div>
      </header>
    </div>
  );
}

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary')) || [];
      
      // Filter words that are not already in the user's list
      const availableWords = AUTO_VOCABULARY.filter(
        v => !savedVocab.some(sv => sv.word.toLowerCase() === v.word.toLowerCase())
      );

      if (availableWords.length > 0) {
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        const updatedVocab = [...savedVocab, { ...randomWord, id: Date.now() }];
        localStorage.setItem('my_vocabulary', JSON.stringify(updatedVocab));
        
        console.log(`Auto-added new word: ${randomWord.word}`);
        // Optional: Dispatch a custom event to notify components listening to localStorage
        window.dispatchEvent(new Event('vocab_updated'));
      }
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<EnglishLearningPage />} />
        <Route path="/manage" element={<VocabularyManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
