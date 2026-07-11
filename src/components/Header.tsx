import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">🏊 БаняSPA</div>
        <button className="login-btn">Войти</button>
      </div>
    </header>
  );
}

export default Header;