import './Header.css';
import { useState } from 'react';

function Header({ 
  children,
  login,
  onLogin,
  onLogout
}: { 
  children: React.ReactNode;
  login: string;
  onLogin: (username: string) => void;
  onLogout: () => void;
}) {

  // Только для модалок
  const [localLogin, setLocalLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [registr, setRegisr] = useState(false);

  const openModel = () => {
    setIsVisible(true);
    setLocalLogin(""); 
  };

  const closeModal = () => {
    setIsVisible(false);
    setLocalLogin("");
    setPassword("");
  };

  const openRegistr = () => {
    setRegisr(true);
  };

  const closeRegistr = () => {
    setRegisr(false);
    setLocalLogin("");
    setPassword("");
  };

  const handleLoginClick = () => {
    if (localLogin.trim()) {
      onLogin(localLogin);
      closeModal();
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
              type="password"
              placeholder="Номер телефона"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>Регистрация</button>
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