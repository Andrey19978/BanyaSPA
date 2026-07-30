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
import BookingCalendar from './components/BookingCalendar'

function App() {

  const [login, setLogin] = useState(() => localStorage.getItem("login") || "");

  
  const handleLogin = (username: string) => {
    setLogin(username);
    localStorage.setItem("login", username);
  };


  const handleLogout = () => {
    localStorage.removeItem("login");
    setLogin("");
  };

  const user = { name: login };

  const [galleryPhotos, setGalleryPhotos] = useState( [
  { id: 1, src: heroImage, alt: 'Интерьер 1' },
  { id: 2, src: heroImage2, alt: 'Интерьер 2' },
  { id: 3, src: heroImage3, alt: 'Интерьер 3' },
]);

function addPhoto(newPhoto){
const updatedPhotos = [...galleryPhotos, newPhoto];
setGalleryPhotos(updatedPhotos);
}

  function deletePhoto(id) {
    const updatedPhotos = [];
    for (let i = 0; i < galleryPhotos.length; i++) {
      if (galleryPhotos[i].id !== id) {
        updatedPhotos.push(galleryPhotos[i]);
      }
    }
    setGalleryPhotos(updatedPhotos);
  }

    function updatePhoto(id, newSrc, newAlt) {
    const updatedPhotos = [];
    for (let i = 0; i < galleryPhotos.length; i++) {
      if (galleryPhotos[i].id === id) {
        const changedPhoto = {
          id: galleryPhotos[i].id,
          src: newSrc,
          alt: newAlt
        };
        updatedPhotos.push(changedPhoto);
      } else {
        updatedPhotos.push(galleryPhotos[i]);
      }
    }
    setGalleryPhotos(updatedPhotos);
  }



const [cards, setCards] = useState([
  { 
    id: 1, 
    title: '👥 До 20 человек', 
    description: 'Просторный зал для большой компании, отличное место для праздников',
    buttonText: 'Забронировать',
    price: 12000,
    priceType: 'day'
  },
  { 
    id: 2, 
    title: '🎉 От 25 человек', 
    description: 'VIP зал для мероприятий, корпоративов и дней рождения',
    buttonText: 'Забронировать',
    price: 18000,
    priceType: 'day'
  },
  { 
    id: 3, 
    title: '⏰ До 4 человек почасовая', 
    description: 'Уютный зал для семьи или друзей, оплата за фактическое время',
    buttonText: 'Забронировать',
    price: 3000,
    priceType: 'hour',
    minHours: 3
  },
]);

function addCard(newCard) {
  const updatedCards = [...cards, newCard];
  setCards(updatedCards);
}

function deleteCard(id) {
  const updatedCards = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id !== id) {
      updatedCards.push(cards[i]);
    }
  }
  setCards(updatedCards);
}

function updateCard(id, newTitle, newDescription, newPrice, newPriceType, newMinHours) {
  const updatedCards = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === id) {
      const changedCard = {
        id: cards[i].id,
        title: newTitle,
        description: newDescription,
        buttonText: cards[i].buttonText,
        price: Number(newPrice),
        priceType: newPriceType,
        minHours: newPriceType === 'hour' ? Number(newMinHours) : undefined
      };
      updatedCards.push(changedCard);
    } else {
      updatedCards.push(cards[i]);
    }
  }
  setCards(updatedCards);
}

const [priceValue, setPriceValue] = useState(5000);

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
        <Route path="/" element={<Main photos={galleryPhotos} cards={cards} priceValue={priceValue}  />} />
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
      priceValue={priceValue}     
    />
  } 
/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;