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

  const [localLogin, setLocalLogin] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [registr, setRegisr] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // API URL из переменных окружения или дефолтное значение
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const openModel = () => {
    setIsVisible(true);
    setLocalLogin(""); 
    setPassword("");
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
    setPhone("");
  };

  const closeRegistr = () => {
    setRegisr(false);
    setLocalLogin("");
    setPassword("");
    setPhone("");
    setError("");
  };

  // Функция для входа
  const handleLoginClick = async () => {
    if (!localLogin.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Для входа нам нужно проверить пользователя в БД
      // Так как у вас пока нет эндпоинта для входа, используем регистрацию как проверку
      // В реальном проекте нужно добавить эндпоинт /api/login
      
      // Простая проверка - делаем запрос к существующему пользователю
      const response = await fetch(`${API_URL}/api/users/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localLogin, password }),
      });

      if (response.ok) {
        onLogin(localLogin);
        closeModal();
      } else {
        const data = await response.json();
        setError(data.error || "Ошибка входа");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для регистрации
  const handleRegisterClick = async () => {
    if (!localLogin.trim() || !password.trim() || !phone.trim()) {
      setError("Заполните все поля");
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localLogin)) {
      setError("Введите корректный email");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: localLogin, 
          password: password,
          phone: phone // добавим телефон, хотя в БД его пока нет
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Регистрация успешна!");
        onLogin(localLogin);
        closeRegistr();
      } else {
        setError(data.error || "Ошибка регистрации");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
      console.error(err);
    } finally {
      setIsLoading(false);
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
            <h2>Вход</h2>
            {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={localLogin}
              onChange={(e) => setLocalLogin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLoginClick()}
            />
            <button 
              className='formButtLogin' 
              onClick={handleLoginClick}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Войти"}
            </button>
            <button 
              onClick={() => {
                openRegistr();
                closeModal();
              }}
              className="link-btn"
            >
              Нет аккаунта? Зарегистрироваться
            </button>
          </div>
        </div>
      )}

      {/* Модалка регистрации */}
      {registr && (
        <div className='modal_okno' onClick={closeRegistr}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className='buttCloseModal' onClick={closeRegistr}>Закрыть</button>
            <h2>Регистрация</h2>
            {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={localLogin}
              onChange={(e) => setLocalLogin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль (мин. 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button 
              className='formButtLogin' 
              onClick={handleRegisterClick}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Зарегистрироваться"}
            </button>
            <button 
              onClick={() => {
                openModel();
                closeRegistr();
              }}
              className="link-btn"
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;