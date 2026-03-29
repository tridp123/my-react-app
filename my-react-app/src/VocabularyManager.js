import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VocabularyManager.css';
import logo from './logo_premium.png';

const VocabularyManager = () => {
  const [vocab, setVocab] = useState([]);
  const [newWord, setNewWord] = useState({ word: '', ipa: '', meaning: '', example: '', image: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewWord({ ...newWord, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
    setNewWord({ word: '', ipa: '', meaning: '', example: '', image: '' });
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
            
            <div className="file-upload">
              <label htmlFor="file-input">Hình ảnh mô tả (Tùy chọn):</label>
              <input 
                id="file-input"
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
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
            <p className="hint">Định dạng file: <code>word, meaning, example, ipa, image</code></p>
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
