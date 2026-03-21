import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VocabularyManager.css';

const VocabularyManager = () => {
  const [vocab, setVocab] = useState([]);
  const [newWord, setNewWord] = useState({ word: '', ipa: '', meaning: '', example: '' });

  useEffect(() => {
    const refreshVocab = () => {
      const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary')) || [];
      setVocab(savedVocab);
    };

    refreshVocab();
    window.addEventListener('vocab_updated', refreshVocab);
    return () => window.removeEventListener('vocab_updated', refreshVocab);
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newWord.word || !newWord.meaning) return;
    
    const updatedVocab = [...vocab, { ...newWord, id: Date.now() }];
    setVocab(updatedVocab);
    localStorage.setItem('my_vocabulary', JSON.stringify(updatedVocab));
    setNewWord({ word: '', ipa: '', meaning: '', example: '' });
  };

  const handleDelete = (id) => {
    const updatedVocab = vocab.filter(item => item.id !== id);
    setVocab(updatedVocab);
    localStorage.setItem('my_vocabulary', JSON.stringify(updatedVocab));
  };

  return (
    <div className="manager-container">
      <nav className="manager-nav">
        <Link to="/" className="back-link">← Home</Link>
        <h2 className="brand-name">Vocabulary Manager</h2>
      </nav>

      <main className="manager-main">
        <section className="add-section">
          <h3>Thêm từ vựng mới</h3>
          <form onSubmit={handleAdd} className="add-form">
            <input 
              type="text" placeholder="Từ vựng (Ví dụ: Serendipity)" 
              value={newWord.word} onChange={(e) => setNewWord({...newWord, word: e.target.value})}
              required
            />
            <input 
              type="text" placeholder="Phiên âm (Ví dụ: /ˌserənˈdɪpəti/)" 
              value={newWord.ipa} onChange={(e) => setNewWord({...newWord, ipa: e.target.value})}
            />
            <input 
              type="text" placeholder="Nghĩa tiếng Việt" 
              value={newWord.meaning} onChange={(e) => setNewWord({...newWord, meaning: e.target.value})}
              required
            />
            <textarea 
              placeholder="Câu ví dụ..." 
              value={newWord.example} onChange={(e) => setNewWord({...newWord, example: e.target.value})}
            ></textarea>
            <button type="submit" className="add-btn">Thêm vào danh sách</button>
          </form>
        </section>

        <section className="list-section">
          <h3>Danh sách từ của bạn ({vocab.length})</h3>
          <div className="vocab-list">
            {vocab.length === 0 ? (
              <p className="empty-msg">Chưa có từ vựng nào. Hãy bắt đầu thêm!</p>
            ) : (
              vocab.map(item => (
                <div key={item.id} className="list-item">
                  <div className="item-info">
                    <strong>{item.word}</strong> <span className="item-ipa">{item.ipa}</span>
                    <p>{item.meaning}</p>
                  </div>
                  <button className="del-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default VocabularyManager;
