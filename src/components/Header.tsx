import './Header.css';
import { useState } from 'react';

function Header() {

  const [login, setLogin] = useState("")

  const [savedLogin, setSavedLogin] = useState<string | null>(
    localStorage.getItem("login")
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false);

  const openModel = () => {
    setIsVisible(true)
  };

  const closeModal = () => {
    setIsVisible(false);
    setLogin("");
  }

  const [registr, setRegisrt] = useState(false);

  const openRegistr = () => {
    setRegisrt(true);
  }

  const closeRegistr = () => {
    setRegisrt(false)
  }

  function logCons() {
    console.log(login);
    localStorage.setItem("login", login);
    setSavedLogin(login);
    setIsLoggedIn(true);
    closeModal();
  }

  function handleLogout() {
    localStorage.removeItem("login");
    setSavedLogin(null);
    setIsLoggedIn(false);
  }

  function handleAuthClick() {
    if (isLoggedIn) {
      handleLogout();
    } else {
      openModel();
    }
  }


  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">🏊 БаняSPA</div>
        <button onClick={handleAuthClick} className="login-btn">{isLoggedIn ? "Выйти" : "Войти"}</button>
        {isLoggedIn && savedLogin && (
          <h1>Привет, {savedLogin}!</h1>
        )}
      </div>

      <div>
        {isVisible && (
          <div className='modal_okno' onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className='buttCloseModal' onClick={closeModal}>Закрыть</button>
              <input
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
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
              <button className='formButtLogin' onClick={() => {
                logCons();
              }}>Войти</button>
            </div>
          </div>
        )}
      </div>

      {registr && (
        <div className='modal_okno'>
          <div className="modal-content">
            <button className='buttCloseModal' onClick={closeRegistr}>Закрыть</button>
            <input
              type="text"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
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