import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VocabularyManager.css';
import logo from './logo_premium.png';

const VocabularyManager = () => {
  const [vocab, setVocab] = useState([]);
  const [newWord, setNewWord] = useState({ word: '', ipa: '', meaning: '', example: '', image: '', topic: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [autoJobEnabled, setAutoJobEnabled] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/autojob/status')
      .then(res => res.json())
      .then(data => setAutoJobEnabled(data.enabled))
      .catch(console.error);
  }, []);

  const toggleAutoJob = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/autojob/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !autoJobEnabled })
      });
      if (response.ok) {
        const data = await response.json();
        setAutoJobEnabled(data.enabled);
      }
    } catch (e) {
      alert("Không thể thay đổi trạng thái tự động thêm từ!");
    }
  };

  const refreshVocab = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/vocabularies');
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => b.id - a.id);
        setVocab(data);
        localStorage.setItem('my_vocabulary', JSON.stringify(data));
      } else {
        const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary')) || [];
        setVocab(savedVocab);
      }
    } catch (e) {
      console.error(e);
      const savedVocab = JSON.parse(localStorage.getItem('my_vocabulary')) || [];
      setVocab(savedVocab);
    }
  };

  useEffect(() => {
    refreshVocab();
    window.addEventListener('vocab_updated', refreshVocab);
    return () => window.removeEventListener('vocab_updated', refreshVocab);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newWord.word || !newWord.meaning) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/vocabularies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWord)
      });
      if (response.ok) {
        const createdWord = await response.json();
        const updatedVocab = [createdWord, ...vocab];
        setVocab(updatedVocab);
        localStorage.setItem('my_vocabulary', JSON.stringify(updatedVocab));
      } else {
        alert("Có lỗi xảy ra khi lưu từ vựng!");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối tới server!");
    }
    setNewWord({ word: '', ipa: '', meaning: '', example: '', image: '', topic: '' });
    e.target.reset(); // Reset file input
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch('http://localhost:8080/api/vocabularies/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Import thành công!");
        setCsvFile(null);
        refreshVocab();
        e.target.reset();
      } else {
        const errorText = await response.text();
        alert(`Lỗi import: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối tới server!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/vocabularies/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const updatedVocab = vocab.filter(item => item.id !== id);
        setVocab(updatedVocab);
        localStorage.setItem('my_vocabulary', JSON.stringify(updatedVocab));
      } else {
        alert('Có lỗi xảy ra khi xóa!');
      }
    } catch (err) {
      alert('Không thể kết nối tới server!');
    }
  };

  const filteredVocab = vocab.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manager-container">
      <nav className="manager-nav">
        <Link to="/" className="back-link">← Home</Link>
        <div className="nav-brand">
          <img src={logo} alt="Logo" className="nav-logo" />
          <h2 className="brand-name">Vocabulary Manager</h2>
        </div>
      </nav>

      <main className="manager-main">
        <section className="add-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Thêm từ vựng mới</h3>
            <button 
              onClick={toggleAutoJob}
              style={{
                backgroundColor: autoJobEnabled ? '#22c55e' : '#ef4444',
                color: 'white', border: 'none', padding: '8px 15px',
                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}>
              Tự Động Thêm Từ: {autoJobEnabled ? 'BẬT (ON)' : 'TẮT (OFF)'}
            </button>
          </div>
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
            
            <input 
              type="text" 
              placeholder="Chủ đề (Topic) - VD: Công việc, Thu thập" 
              list="topic-options"
              value={newWord.topic} 
              onChange={(e) => setNewWord({...newWord, topic: e.target.value})}
            />
            <datalist id="topic-options">
              {[...new Set(vocab.map(v => v.topic?.name).filter(Boolean))].map(topicName => (
                <option key={topicName} value={topicName} />
              ))}
            </datalist>

            <div className="file-upload">
              <label htmlFor="file-input">Hình ảnh mô tả (URL - Tùy chọn):</label>
              <input 
                id="file-input"
                type="text" 
                placeholder="Ví dụ: https://example.com/cat.jpg"
                value={newWord.image}
                onChange={(e) => setNewWord({...newWord, image: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />
              {newWord.image && (
                <div className="image-preview">
                  <img src={newWord.image} alt="Preview" />
                </div>
              )}
            </div>


            <button type="submit" className="add-btn">Thêm vào danh sách</button>
          </form>

          <div className="csv-import-section">
            <hr className="divider" />
            <h3>Import từ file CSV</h3>
            <p className="hint">Định dạng file: <code>word, meaning, example, ipa, image, topic</code></p>
            <form onSubmit={handleCsvUpload} className="csv-form">
              <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => setCsvFile(e.target.files[0])}
                required
              />
              <button type="submit" className="import-btn" disabled={isUploading || !csvFile}>
                {isUploading ? 'Đang xử lý...' : 'Bắt đầu Import'}
              </button>
            </form>
          </div>
        </section>

        <section className="list-section">
          <div className="list-header">
            <h3>Danh sách của bạn ({vocab.length})</h3>
            <input 
              type="text" 
              placeholder="Tìm kiếm từ..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="vocab-list">
            {filteredVocab.length === 0 ? (
              <p className="empty-msg">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có từ vựng nào.'}
              </p>
            ) : (
              filteredVocab.map(item => (
                <div key={item.id} className="list-item">
                  <div className="item-info">
                    <strong>{item.word}</strong> <span className="item-ipa">{item.ipa}</span>
                    <p>{item.meaning}</p>
                    {item.topic && <span className="topic-tag">{item.topic.name}</span>}
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
