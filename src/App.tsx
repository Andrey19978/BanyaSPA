import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Profile from './components/UserProfile';
import AdminPanelUse from './components/AdminPanel';
import { useState } from 'react';
import heroImage from './assets/photo_5240452124167049405_y.jpg';
import heroImage2 from './assets/photo_5240452124167049423_y.jpg';
import heroImage3 from './assets/photo_5240452124167049424_y.jpg';

type Review = {
  id: number;
  name: string;
  text: string;
  rating: number;
};

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
};

type CardWithButton = Card & {
  buttonText: string;
};

function App() {
  const [login, setLogin] = useState<string>(() => localStorage.getItem("login") || "");

  const handleLogin = (username: string) => {
    setLogin(username);
    localStorage.setItem("login", username);
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    setLogin("");
  };

  const user = { name: login };

  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([
    { id: 1, src: heroImage, alt: 'Интерьер 1' },
    { id: 2, src: heroImage2, alt: 'Интерьер 2' },
    { id: 3, src: heroImage3, alt: 'Интерьер 3' },
  ]);

  function addPhoto(newPhoto: Omit<Photo, 'id'>) {
    const updatedPhotos = [...galleryPhotos, { ...newPhoto, id: Date.now() }];
    setGalleryPhotos(updatedPhotos);
  }

  function deletePhoto(id: number) {
    const updatedPhotos = galleryPhotos.filter(photo => photo.id !== id);
    setGalleryPhotos(updatedPhotos);
  }

  function updatePhoto(id: number, newSrc: string, newAlt: string) {
    const updatedPhotos = galleryPhotos.map(photo =>
      photo.id === id ? { ...photo, src: newSrc, alt: newAlt } : photo
    );
    setGalleryPhotos(updatedPhotos);
  }

  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      title: '👥 До 20 человек',
      description: 'Просторный зал для большой компании, отличное место для праздников',
      price: 12000,
      priceType: 'day'
    },
    {
      id: 2,
      title: '🎉 От 25 человек',
      description: 'VIP зал для мероприятий, корпоративов и дней рождения',
      price: 18000,
      priceType: 'day'
    },
    {
      id: 3,
      title: '⏰ До 4 человек почасовая',
      description: 'Уютный зал для семьи или друзей, оплата за фактическое время',
      price: 3000,
      priceType: 'hour',
      minHours: 3
    },
  ]);

  function addCard(newCard: Omit<Card, 'id'>) {
    const updatedCards = [...cards, { ...newCard, id: Date.now() }];
    setCards(updatedCards);
  }

  function deleteCard(id: number) {
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards);
  }

  function updateCard(
    id: number,
    newTitle: string,
    newDescription: string,
    newPrice: number,
    newPriceType: 'hour' | 'day',
    newMinHours?: number
  ) {
    const updatedCards = cards.map(card =>
      card.id === id
        ? {
            ...card,
            title: newTitle,
            description: newDescription,
            price: newPrice,
            priceType: newPriceType,
            minHours: newPriceType === 'hour' ? newMinHours : undefined
          }
        : card
    );
    setCards(updatedCards);
  }

  const [priceValue, setPriceValue] = useState<number>(5000);

  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, name: 'Анна', text: 'Отличное место!', rating: 5 },
    { id: 2, name: 'Иван', text: 'Будем приходить еще!', rating: 5 },
    { id: 3, name: 'Мария', text: 'Всё супер!', rating: 5 },
  ]);

  function addReview(newReview: Omit<Review, 'id'>) {
    const updatedReviews = [...reviews, { ...newReview, id: Date.now() }];
    setReviews(updatedReviews);
  }

  function deleteReview(id: number) {
    const updatedReviews = reviews.filter(review => review.id !== id);
    setReviews(updatedReviews);
  }

  function updateReview(id: number, newName: string, newText: string, newRating: number) {
    const updatedReviews = reviews.map(review =>
      review.id === id
        ? { ...review, name: newName, text: newText, rating: newRating }
        : review
    );
    setReviews(updatedReviews);
  }

  // Для Main добавляем buttonText
  const cardsForMain: CardWithButton[] = cards.map(card => ({
    ...card,
    buttonText: 'Забронировать'
  }));

  return (
    <div className="app">
      <Header
        login={login}
        onLogin={handleLogin}
        onLogout={handleLogout}
      >
        <Link to="/">Главная</Link>
        <Link to="/profile">Профиль</Link>
        <Link to="/adminPanelUse">Админ</Link>
      </Header>
      <Routes>
        <Route path="/" element={<Main photos={galleryPhotos} cards={cardsForMain} priceValue={priceValue} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route
          path="/adminPanelUse"
          element={
            <AdminPanelUse
              user={user}
              photos={galleryPhotos}
              onAddPhoto={addPhoto}
              onDeletePhoto={deletePhoto}
              onUpdatePhoto={updatePhoto}
              cards={cards}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
              onUpdateCard={updateCard}
              priceValue={setPriceValue}
              reviews={reviews}
              onAddReview={addReview}
              onDeleteReview={deleteReview}
              onUpdateReview={updateReview}
            />
          }
        />
      </Routes>
      <Footer reviews={reviews} />
    </div>
  );
}

export default App;