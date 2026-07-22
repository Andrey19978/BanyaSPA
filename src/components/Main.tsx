import './Main.css';
import { useState } from 'react';
import BookingCalendar from "./BookingCalendar.tsx"

function Main() {

  const [bookingModel, setbookingModel] = useState(false);

  function openBookingModel() {
    setbookingModel(true);
  }

  function closseBookingModel() {
    setbookingModel(false);
  }

  return (
    <main className="main">
      <div className="container">
        {/* Фото с прокруткой */}
        <section className="gallery-section">
          <h2 className="section-title">Фотогалерея</h2>
          <div className="gallery-scroll">
            <div className="gallery-item">📸 Фото 1</div>
            <div className="gallery-item">📸 Фото 2</div>
            <div className="gallery-item">📸 Фото 3</div>
            <div className="gallery-item">📸 Фото 4</div>
            <div className="gallery-item">📸 Фото 5</div>
          </div>
        </section>

        {/* Описание */}
        <section className="description-section">
          <h2 className="section-title">О нашем бассейне</h2>
          <p>
            Просторный бассейн с кристально чистой водой, комфортная температура 26-28°C,
            современное оборудование. На территории есть: сауна, зона отдыха с шезлонгами,
            уютное кафе, бесплатная парковка.
          </p>
        </section>

        {/* Карточки услуг */}
        <section className="services-section">
          <h2 className="section-title">Наши услуги</h2>
          <div className="cards-grid">
            <div className="card">
              <h3>👥 До 20 человек</h3>
              <p>Просторный зал для большой компании, отличное место для праздников</p>
              <button onClick={openBookingModel} className="book-btn">Забронировать</button>
            </div>

            <div className="card">
              <h3>🎉 От 25 человек</h3>
              <p>VIP зал для мероприятий, корпоративов и дней рождения</p>
              <button onClick={openBookingModel} className="book-btn">Забронировать</button>
            </div>

            <div className="card">
              <h3>⏰ До 4 человек почасовая</h3>
              <p>Уютный зал для семьи или друзей, оплата за фактическое время</p>
              <button onClick={openBookingModel} className="book-btn">Забронировать</button>
            </div>

            {bookingModel && <div className='dookingModel'>
              <div className='booking-content'>

               <BookingCalendar />
               
                <button onClick={closseBookingModel}>Закрыть</button>
              </div>
            </div>

            }

          </div>
        </section>
      </div>
    </main>
  );
}

export default Main;