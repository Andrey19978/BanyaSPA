import './Footer.css';

type Review = {
  id: number;
  name: string;
  text: string;
  rating: number;
};

function Footer({ reviews }: { reviews: Review[] }) {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>⭐ Отзывы</h3>
<div className="reviews">
  {reviews.map(review => (
    <p key={review.id}>
      {'⭐'.repeat(review.rating)} "{review.text}" - {review.name}
    </p>
  ))}
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