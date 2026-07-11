import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>⭐ Отзывы</h3>
          <div className="reviews">
            <p>⭐ "Отличное место!" - Анна</p>
            <p>⭐ "Будем приходить еще!" - Иван</p>
            <p>⭐ "Всё супер!" - Мария</p>
          </div>
          <button className="review-btn">Оставить отзыв</button>
        </div>

        <div className="footer-section">
          <h3>📞 Контакты</h3>
          <p>📱 +7 (999) 123-45-67</p>
          <p>✉️ banya@spa.ru</p>
          <p>📍 ул. Банная, д. 1</p>
        </div>
      </div>

      <div className="copyright">
        <p>© 2026 БаняSPA. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;