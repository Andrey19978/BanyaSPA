import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Profile from './components/UserProfile';
import AdminPanelUse from './components/AdminPanel';
import { useState, useEffect } from 'react';

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [login, setLogin] = useState<string>(() => localStorage.getItem("login") || "");
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const stored = localStorage.getItem("isAdmin");
    return stored ? JSON.parse(stored) : false;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Проверка прав администратора
  const checkAdminStatus = async (email: string) => {
    if (!email) {
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/check-admin/${email}`);
      const data = await response.json();
      
      if (data.success) {
        const adminStatus = data.isAdmin || false;
        setIsAdmin(adminStatus);
        localStorage.setItem("isAdmin", JSON.stringify(adminStatus));
      } else {
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
      }
    } catch (error) {
      console.error('Ошибка проверки прав:', error);
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
    }
  };

  // --- СОСТОЯНИЯ ---
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [priceValue] = useState<number>(5000);

  // --- ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ---
  const loadPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/photos`);
      const data = await response.json();
      if (data.success) {
        setGalleryPhotos(data.photos);
      }
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
    }
  };

  const loadCards = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cards`);
      const data = await response.json();
      if (data.success) {
        setCards(data.cards);
      }
    } catch (error) {
      console.error('Ошибка загрузки карточек:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Ошибка загрузки бронирований:', error);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      loadPhotos(),
      loadCards(),
      loadReviews(),
      loadBookings()
    ]);
    setIsLoading(false);
  };

  // Загружаем данные при старте
  useEffect(() => {
    loadAllData();
  }, []);

  // АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ КАЖДЫЕ 10 СЕКУНД
  useEffect(() => {
    const interval = setInterval(() => {
      loadAllData();
      console.log('🔄 Данные автоматически обновлены');
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ОБНОВЛЕНИЕ ПРИ ВОЗВРАЩЕНИИ НА ВКЛАДКУ
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadAllData();
        console.log('🔄 Данные обновлены при возвращении на вкладку');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Проверяем права при загрузке, если пользователь уже авторизован
  useEffect(() => {
    if (login) {
      checkAdminStatus(login);
    }
  }, []);

  const handleLogin = async (username: string) => {
    setLogin(username);
    localStorage.setItem("login", username);
    await checkAdminStatus(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("isAdmin");
    setLogin("");
    setIsAdmin(false);
  };

  const user = { name: login };

  // --- ФУНКЦИИ ДЛЯ ФОТО ---
  const addPhoto = async (newPhoto: Omit<Photo, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/api/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto)
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Фото добавлено!');
      } else {
        alert('Ошибка добавления фото');
      }
    } catch (error) {
      console.error('Ошибка добавления фото:', error);
      alert('Ошибка добавления фото');
    }
  };

  const deletePhoto = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/photos/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Фото удалено!');
      } else {
        alert('Ошибка удаления фото');
      }
    } catch (error) {
      console.error('Ошибка удаления фото:', error);
      alert('Ошибка удаления фото');
    }
  };

  const updatePhoto = async (id: number, newSrc: string, newAlt: string) => {
    try {
      const response = await fetch(`${API_URL}/api/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src: newSrc, alt: newAlt })
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Фото обновлено!');
      } else {
        alert('Ошибка обновления фото');
      }
    } catch (error) {
      console.error('Ошибка обновления фото:', error);
      alert('Ошибка обновления фото');
    }
  };

  // --- ФУНКЦИИ ДЛЯ КАРТОЧЕК ---
  const addCard = async (newCard: Omit<Card, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/api/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard)
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Карточка добавлена!');
      } else {
        alert('Ошибка добавления карточки');
      }
    } catch (error) {
      console.error('Ошибка добавления карточки:', error);
      alert('Ошибка добавления карточки');
    }
  };

  const deleteCard = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/cards/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Карточка удалена!');
      } else {
        alert('Ошибка удаления карточки');
      }
    } catch (error) {
      console.error('Ошибка удаления карточки:', error);
      alert('Ошибка удаления карточки');
    }
  };

  const updateCard = async (
    id: number,
    newTitle: string,
    newDescription: string,
    newPrice: number,
    newPriceType: 'hour' | 'day',
    newMinHours?: number
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTitle, 
          description: newDescription, 
          price: newPrice, 
          priceType: newPriceType, 
          minHours: newMinHours 
        })
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Карточка обновлена!');
      } else {
        alert('Ошибка обновления карточки');
      }
    } catch (error) {
      console.error('Ошибка обновления карточки:', error);
      alert('Ошибка обновления карточки');
    }
  };

  // --- ФУНКЦИИ ДЛЯ ОТЗЫВОВ ---
  const addReview = async (newReview: Omit<Review, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newReview, user_email: login || 'anonymous' })
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Отзыв добавлен!');
      } else {
        alert('Ошибка добавления отзыва');
      }
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      alert('Ошибка добавления отзыва');
    }
  };

  const deleteReview = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Отзыв удален!');
      } else {
        alert('Ошибка удаления отзыва');
      }
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      alert('Ошибка удаления отзыва');
    }
  };

  const updateReview = async (id: number, newName: string, newText: string, newRating: number) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, text: newText, rating: newRating })
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Отзыв обновлен!');
      } else {
        alert('Ошибка обновления отзыва');
      }
    } catch (error) {
      console.error('Ошибка обновления отзыва:', error);
      alert('Ошибка обновления отзыва');
    }
  };

  // --- ФУНКЦИИ ДЛЯ БРОНИРОВАНИЙ ---
  const handleDeleteBooking = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Бронирование удалено!');
      } else {
        alert('Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления');
    }
  };

  const handleUpdateBookingStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert(`Статус обновлен на "${status}"`);
      } else {
        alert('Ошибка обновления');
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка обновления');
    }
  };

  const handleAddBookingByAdmin = async (bookingData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        alert('Бронирование добавлено!');
        return true;
      } else {
        alert('Ошибка добавления: ' + (data.error || ''));
        return false;
      }
    } catch (error) {
      console.error('Ошибка добавления:', error);
      alert('Ошибка добавления');
      return false;
    }
  };

  const cardsForMain: CardWithButton[] = cards.map(card => ({
    ...card,
    buttonText: 'Забронировать'
  }));

  // Компонент для защиты админ-маршрута
  const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!login) {
      return <Navigate to="/" replace />;
    }
    
    if (!isAdmin) {
      return (
        <div style={{ 
          padding: '50px', 
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#e74c3c' }}>⛔ Доступ запрещен</h2>
          <p style={{ fontSize: '18px', margin: '20px 0' }}>
            У вас нет прав администратора для просмотра этой страницы
          </p>
          <Link to="/" style={{ 
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Вернуться на главную
          </Link>
        </div>
      );
    }
    
    return <>{children}</>;
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '20px'
      }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        login={login}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onAdminCheck={checkAdminStatus}
      >
        <Link to="/">Главная</Link>
        <Link to="/profile">Профиль</Link>
      </Header>
      <Routes>
        <Route path="/" element={<Main photos={galleryPhotos} cards={cardsForMain} priceValue={priceValue} userEmail={login} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route
          path="/adminPanelUse"
          element={
            <ProtectedAdminRoute>
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
                reviews={reviews}
                onAddReview={addReview}
                onDeleteReview={deleteReview}
                onUpdateReview={updateReview}
                bookings={bookings}
                onDeleteBooking={handleDeleteBooking}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onAddBookingByAdmin={handleAddBookingByAdmin}
              />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <Footer reviews={reviews} />
    </div>
  );
}

export default App;