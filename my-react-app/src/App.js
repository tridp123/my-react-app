import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EnglishLearningPage from './EnglishLearningPage';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Chào mừng đến với ứng dụng học tiếng Anh!</p>
        <Link className="App-link" to="/learn">
          Bắt đầu học
        </Link>
      </header>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<EnglishLearningPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EnglishLearningPage from './EnglishLearningPage';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Chào mừng đến với ứng dụng học tiếng Anh!</p>
        <Link className="App-link" to="/learn">
          Bắt đầu học
        </Link>
      </header>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <option path="/" element={<Home />} />
        <option path="/learn" element={<EnglishLearningPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
