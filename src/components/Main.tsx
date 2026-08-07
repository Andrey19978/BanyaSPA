import './Main.css';
import { useState } from 'react';
import BookingCalendar from "./BookingCalendar.tsx"

type Photo = {
  id: number;
  src: string;
  alt: string;
};

type Card = {
  id: number;
  title: string;
  description: string;
  price: number;
  priceType: 'hour' | 'day';
  minHours?: number;
  buttonText: string;
};

type MainProps = {
  photos: Photo[];
  cards: Card[];
  priceValue: number;
  userEmail?: string;
};

function Main({ photos, cards, priceValue, userEmail }: MainProps) {
  const [bookingModel, setbookingModel] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  function openBookingModel(card: Card) {
    setSelectedCard(card);
    setbookingModel(true);
  }

  function closeBookingModel() {
    setbookingModel(false);
    setSelectedCard(null);
  }

  function getCalendarPrice() {
    if (!selectedCard) return priceValue;
    return selectedCard.price;
  }

  return (
    <main className="main">
      <div className="container">
        <section className="gallery-section">
          <h2 className="section-title">Фотогалерея</h2>
          <div className="gallery-scroll">
            {photos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                Нет добавленных фото
              </p>
            ) : (
              photos.map((photo: Photo) => (
                <div key={photo.id} className="gallery-item">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    style={{ width: '300px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="description-section">
          <h2 className="section-title">О нашем бассейне</h2>
          <p>
            Просторный бассейн с кристально чистой водой, комфортная температура 26-28°C,
            современное оборудование. На территории есть: сауна, зона отдыха с шезлонгами,
            уютное кафе, бесплатная парковка.
          </p>
        </section>

        <section className="services-section">
          <h2 className="section-title">Наши услуги</h2>
          <div className="cards-grid">
            {cards.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px', width: '100%' }}>
                Нет добавленных услуг
              </p>
            ) : (
              cards.map((card: Card) => (
                <div key={card.id} className="card">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {card.price}₽ {card.priceType === 'hour' ? `/час (мин. ${card.minHours}ч)` : '/сутки'}
                  </p>
                  <button onClick={() => openBookingModel(card)} className="book-btn">
                    {card.buttonText}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {bookingModel && selectedCard && (
        <div className='bookingModel'>
          <div className='booking-content'>
            <BookingCalendar 
              priceValue={getCalendarPrice()} 
              card={selectedCard}
              userEmail={userEmail}
            />
            <button onClick={closeBookingModel} className="close-booking-btn">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Main;