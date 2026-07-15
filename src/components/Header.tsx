import './Header.css';
import { useState } from 'react';

function Header() {

  let [login, setLogin] = useState("")
  
  let [password, setPassword] = useState("")

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

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">🏊 БаняSPA</div>

        <button onClick={openModel} className="login-btn">Войти</button>

      </div>
      {isVisible && (

        <div className='modal_okno' onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <button onClick={closeModal}>close</button>

            <input type="text"
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

            <button onClick={openRegistr}>Регистрация</button>

            <button className='formButtLogin'>Войти</button>

            {registr &&
              <div>

                <button onClick={closeRegistr}>X</button>

                <p>
                  Helloy
                </p>

              </div>

            }
          </div>
        </div>

      )


      }
    </header>
  );
}

export default Header;