import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Profile from './components/UserProfile';
import { useState } from 'react'; // ← 1. ДОБАВИТЬ

function App() {
  // ← 2. ДОБАВИТЬ
  const [login, setLogin] = useState(() => localStorage.getItem("login") || "");

  // ← 3. ДОБАВИТЬ
  const handleLogin = (username: string) => {
    setLogin(username);
    localStorage.setItem("login", username);
  };

  // ← 4. ДОБАВИТЬ
  const handleLogout = () => {
    localStorage.removeItem("login");
    setLogin("");
  };

  const user = { name: login }; // ← логин из состояния

  return (
    <div className="app">
      <Header 
        login={login}           // ← добавить
        onLogin={handleLogin}   // ← добавить
        onLogout={handleLogout} // ← добавить
      >
        <Link to="/">Главная</Link>
        <Link to="/profile">Профиль</Link>
      </Header>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;