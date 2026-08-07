import './Header.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ 
  children,
  login,
  onLogin,
  onLogout,
  isAdmin,
  onAdminCheck
}: { 
  children: React.ReactNode;
  login: string;
  onLogin: (username: string) => void;
  onLogout: () => void;
  isAdmin: boolean;
  onAdminCheck: (email: string) => Promise<void>;
}) {

  // Только для модалок
  const [localLogin, setLocalLogin] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [registr, setRegisr] = useState(false);
  const [error, setError] = useState("");

  // API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const openModel = () => {
    setIsVisible(true);
    setLocalLogin(""); 
    setError("");
  };

  const closeModal = () => {
    setIsVisible(false);
    setLocalLogin("");
    setPassword("");
    setError("");
  };

  const openRegistr = () => {
    setRegisr(true);
    setError("");
  };

  const closeRegistr = () => {
    setRegisr(false);
    setLocalLogin("");
    setPassword("");
    setPhone("");
    setError("");
  };

  const handleLoginClick = async () => {
    if (!localLogin.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localLogin, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(localLogin);
        await onAdminCheck(localLogin);
        closeModal();
      } else {
        setError(data.error || "Ошибка входа");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
      console.error(err);
    }
  };

  const handleRegisterClick = async () => {
    if (!localLogin.trim() || !password.trim() || !phone.trim()) {
      setError("Заполните все поля");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: localLogin, 
          password: password,
          phone: phone
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Регистрация успешна!");
        onLogin(localLogin);
        await onAdminCheck(localLogin);
        closeRegistr();
      } else {
        setError(data.error || "Ошибка регистрации");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
      console.error(err);
    }
  };

  const handleAuthClick = () => {
    if (login) {
      onLogout();
    } else {
      openModel();
    }
  };

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">🏊 БаняSPA</div>
        <nav className="nav">
          {children}
          {login && isAdmin && (
            <Link to="/adminPanelUse" style={{ color: '#ffd700', fontWeight: 'bold' }}>
              ⚙️ Админ
            </Link>
          )}
        </nav>
        <button onClick={handleAuthClick} className="login-btn">
          {login ? "Выйти" : "Войти"}
        </button>
        {login && <h1>Привет, {login}!</h1>}
      </div>

      {/* Модалка входа */}
      {isVisible && (
        <div className='modal_okno' onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className='buttCloseModal' onClick={closeModal}>Закрыть</button>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <input
              type="text"
              placeholder="Логин"
              value={localLogin}
              onChange={(e) => setLocalLogin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => {
              openRegistr();
              closeModal();
            }}>Регистрация</button>
            <button className='formButtLogin' onClick={handleLoginClick}>
              Войти
            </button>
          </div>
        </div>
      )}

      {/* Модалка регистрации */}
      {registr && (
        <div className='modal_okno' onClick={closeRegistr}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className='buttCloseModal' onClick={closeRegistr}>Закрыть</button>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <input
              type="text"
              placeholder="Логин"
              value={localLogin}
              onChange={(e) => setLocalLogin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handleRegisterClick}>Регистрация</button>
            <button className='formButtLogin' onClick={() => {
              openModel();
              closeRegistr();
            }}>Вход</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;