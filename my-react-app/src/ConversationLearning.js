import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ConversationLearning.css';
import logo from './logo_premium.png';
import { CONVERSATIONS } from './ConversationData';

const ConversationLearning = () => {
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [currentConvIndex, setCurrentConvIndex] = useState(0);
  const [voice, setVoice] = useState(null);
  const [activeTab, setActiveTab] = useState('dialogue'); // 'dialogue', 'vocab', 'grammar'

  const filteredConvs = selectedLevel === 'All' 
    ? CONVERSATIONS 
    : CONVERSATIONS.filter(c => c.level === selectedLevel);

  // Reset index when level changes
  useEffect(() => {
    setCurrentConvIndex(0);
    setActiveTab('dialogue');
  }, [selectedLevel]);

  useEffect(() => {
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
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentConv = filteredConvs[currentConvIndex];

  const nextConv = () => {
    setCurrentConvIndex((prev) => (prev + 1) % filteredConvs.length);
    setActiveTab('dialogue');
  };

  const prevConv = () => {
    setCurrentConvIndex((prev) => (prev - 1 + filteredConvs.length) % filteredConvs.length);
    setActiveTab('dialogue');
  };

  return (
    <div className="conv-container">
      <nav className="conv-nav">
        <Link to="/" className="back-link">← Home</Link>
        <div className="nav-brand">
          <img src={logo} alt="Logo" className="nav-logo" />
          <h2 className="brand-name">English Master</h2>
        </div>
      </nav>

      <main className="conv-main">
        <div className="level-selector">
          {['All', 'A1', 'A2', 'B1', 'B2'].map(level => (
            <button 
              key={level} 
              className={`level-badge ${selectedLevel === level ? 'active' : ''}`}
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="conv-header">
          {currentConv && (
            <div className="conv-meta">
              <span className="level-tag">{currentConv.level}</span>
              <span className="category-tag">{currentConv.category}</span>
            </div>
          )}
          <span className="conv-number">
            Bài học {filteredConvs.length > 0 ? currentConvIndex + 1 : 0} / {filteredConvs.length}
          </span>
          <h1 className="conv-title">{currentConv?.title || "Không có nội dung"}</h1>
          <p className="conv-desc">{currentConv?.description || "Vui lòng chọn cấp độ khác."}</p>
        </div>

        <div className="tab-control">
          <button 
            className={`tab-btn ${activeTab === 'dialogue' ? 'active' : ''}`}
            onClick={() => setActiveTab('dialogue')}
          >
            Hội thoại
          </button>
          <button 
            className={`tab-btn ${activeTab === 'vocab' ? 'active' : ''}`}
            onClick={() => setActiveTab('vocab')}
          >
            Từ vựng
          </button>
          <button 
            className={`tab-btn ${activeTab === 'grammar' ? 'active' : ''}`}
            onClick={() => setActiveTab('grammar')}
          >
            Ngữ pháp
          </button>
        </div>

        <div className="content-area glass">
          {!currentConv ? (
            <div className="empty-state">Hiện chưa có cuộc hội thoại nào cho cấp độ này.</div>
          ) : (
            <>
              {activeTab === 'dialogue' && (
                <div className="dialogue-list">
                  {currentConv.dialogue.map((line, idx) => (
                    <div key={idx} className={`dialogue-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                      <div className="speaker-label">{line.speaker}</div>
                      <div className="bubble-container">
                        <div className="bubble">
                          <p className="en-text">{line.text}</p>
                          <p className="vi-text">{line.translation}</p>
                          <button className="play-btn" onClick={() => speak(line.text)}>🔊</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'vocab' && (
                <div className="vocab-grid">
                  {currentConv.vocabulary.map((v, idx) => (
                    <div key={idx} className="vocab-card-mini">
                      <div className="vocab-header">
                        <h3>{v.word}</h3>
                        <span className="ipa">{v.ipa}</span>
                        <button className="play-btn-small" onClick={() => speak(v.word)}>🔊</button>
                      </div>
                      <p className="meaning">{v.meaning}</p>
                      <p className="example italic">"{v.example}"</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'grammar' && (
                <div className="grammar-list">
                  {currentConv.grammar.map((g, idx) => (
                    <div key={idx} className="grammar-card">
                      <h4>{g.title}</h4>
                      <p>{g.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {filteredConvs.length > 1 && (
          <div className="conv-controls">
            <button className="ctrl-btn" onClick={prevConv}>Bài trước</button>
            <button className="ctrl-btn primary" onClick={nextConv}>Bài tiếp theo</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConversationLearning;
