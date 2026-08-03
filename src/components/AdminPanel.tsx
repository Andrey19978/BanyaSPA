import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

type User = {
  name: string;
};

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

type AdminPanelUseProps = {
  user: User;
  photos: Photo[];
  onAddPhoto: (newPhoto: Omit<Photo, 'id'>) => void;
  onDeletePhoto: (id: number) => void;
  onUpdatePhoto: (id: number, newSrc: string, newAlt: string) => void;
  cards: Card[];
  onAddCard: (newCard: Omit<Card, 'id'>) => void;
  onDeleteCard: (id: number) => void;
  onUpdateCard: (id: number, newTitle: string, newDescription: string, newPrice: number, newPriceType: 'hour' | 'day', newMinHours?: number) => void;
  reviews: Review[];
  onAddReview: (newReview: Omit<Review, 'id'>) => void;
  onDeleteReview: (id: number) => void;
  onUpdateReview: (id: number, newName: string, newText: string, newRating: number) => void;
  bookings: any[];
  onDeleteBooking: (id: number) => Promise<void>;
  onUpdateBookingStatus: (id: number, status: string) => Promise<void>;
  onAddBookingByAdmin: (bookingData: any) => Promise<boolean>;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminPanelUse({ 
  user, 
  photos, 
  onAddPhoto,
  onDeletePhoto,
  onUpdatePhoto,
  cards,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  reviews,          
  onAddReview,         
  onDeleteReview,       
  onUpdateReview,
  bookings,
  onDeleteBooking,
  onUpdateBookingStatus,
  onAddBookingByAdmin
}: AdminPanelUseProps) {
  
  const [activeTab, setActiveTab] = useState<string>("главная");

  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newImageAlt, setNewImageAlt] = useState<string>("");

  const [newCardTitle, setNewCardTitle] = useState<string>("");
  const [newCardDescription, setNewCardDescription] = useState<string>("");
  const [newCardPrice, setNewCardPrice] = useState<string>("");
  const [newCardPriceType, setNewCardPriceType] = useState<'hour' | 'day'>('day');
  const [newCardMinHours, setNewCardMinHours] = useState<string>("");

  const [newReviewName, setNewReviewName] = useState<string>("");
  const [newReviewText, setNewReviewText] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<string>("5");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e: ProgressEvent<FileReader>) {
        if (e.target && typeof e.target.result === 'string') {
          setNewImageUrl(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleAdd(): void {
    if (!newImageUrl || !newImageAlt) {
      alert('Выберите фото и напишите описание!');
      return;
    }

    const newPhoto: Omit<Photo, 'id'> = {
      src: newImageUrl,
      alt: newImageAlt
    };
    
    onAddPhoto(newPhoto);
    setNewImageUrl("");
    setNewImageAlt("");
    
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  function handleDelete(id: number): void {
    if (confirm('Точно удалить это фото?')) {
      onDeletePhoto(id);
    }
  }

  function handleUpdate(id: number): void {
    const newAlt = prompt('Введите новое описание:');
    if (newAlt && newAlt.trim() !== '') {
      const currentPhoto = photos.find(function(p) { return p.id === id; });
      if (currentPhoto) {
        onUpdatePhoto(id, currentPhoto.src, newAlt);
      }
    }
  }

  function handleAddCard(): void {
    if (!newCardTitle || !newCardDescription || !newCardPrice) {
      alert('Заполните название, описание и цену!');
      return;
    }

    const price = Number(newCardPrice);
    if (isNaN(price) || price <= 0) {
      alert('Введите корректную цену!');
      return;
    }

    if (newCardPriceType === 'hour') {
      const minHours = Number(newCardMinHours);
      if (isNaN(minHours) || minHours <= 0) {
        alert('Для почасовой оплаты укажите минимальное количество часов!');
        return;
      }
    }

    const newCard: Omit<Card, 'id'> = {
      title: newCardTitle,
      description: newCardDescription,
      price: price,
      priceType: newCardPriceType,
      minHours: newCardPriceType === 'hour' ? Number(newCardMinHours) : undefined
    };
    
    onAddCard(newCard);
    setNewCardTitle("");
    setNewCardDescription("");
    setNewCardPrice("");
    setNewCardMinHours("");
  }

  function handleDeleteCard(id: number): void {
    if (confirm('Точно удалить эту карточку?')) {
      onDeleteCard(id);
    }
  }

  function handleUpdateCard(id: number): void {
    const cardToUpdate = cards.find(c => c.id === id);
    if (!cardToUpdate) return;

    const newTitle = prompt('Введите новое название:', cardToUpdate.title);
    if (newTitle === null) return;
    
    const newDescription = prompt('Введите новое описание:', cardToUpdate.description);
    if (newDescription === null) return;
    
    const newPriceStr = prompt('Введите новую цену:', String(cardToUpdate.price));
    if (newPriceStr === null) return;
    const newPrice = Number(newPriceStr);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Введите корректную цену!');
      return;
    }

    const newPriceType = confirm('Использовать почасовую оплату? (OK - час, Отмена - день)') 
      ? 'hour' as const 
      : 'day' as const;

    let newMinHours = undefined;
    if (newPriceType === 'hour') {
      const minHoursStr = prompt('Минимальное количество часов:', String(cardToUpdate.minHours || 1));
      if (minHoursStr === null) return;
      const minHours = Number(minHoursStr);
      if (isNaN(minHours) || minHours <= 0) {
        alert('Введите корректное количество часов!');
        return;
      }
      newMinHours = minHours;
    }
    
    onUpdateCard(id, newTitle, newDescription, newPrice, newPriceType, newMinHours);
  }

  function handleAddReview(): void {
    if (!newReviewName || !newReviewText) {
      alert('Заполните имя и текст отзыва!');
      return;
    }

    const rating = Number(newReviewRating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert('Рейтинг должен быть от 1 до 5!');
      return;
    }

    const newReview: Omit<Review, 'id'> = {
      name: newReviewName,
      text: newReviewText,
      rating: rating
    };
    
    onAddReview(newReview);
    setNewReviewName("");
    setNewReviewText("");
    setNewReviewRating("5");
  }

  function handleDeleteReview(id: number): void {
    if (confirm('Точно удалить этот отзыв?')) {
      onDeleteReview(id);
    }
  }

  function handleUpdateReview(id: number): void {
    const reviewToUpdate = reviews.find(r => r.id === id);
    if (!reviewToUpdate) return;

    const newName = prompt('Введите новое имя:', reviewToUpdate.name);
    if (newName === null) return;
    
    const newText = prompt('Введите новый текст:', reviewToUpdate.text);
    if (newText === null) return;
    
    const newRatingStr = prompt('Введите новый рейтинг (1-5):', String(reviewToUpdate.rating));
    if (newRatingStr === null) return;
    const newRating = Number(newRatingStr);
    if (isNaN(newRating) || newRating < 1 || newRating > 5) {
      alert('Рейтинг должен быть от 1 до 5!');
      return;
    }
    
    onUpdateReview(id, newName, newText, newRating);
  }

  function renderContent() {
    if (activeTab === "главная") {
      return (
        <div>
          <h2>Управление фотогалереей</h2>
          
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h3>Добавить новое фото</h3>
            
            <input 
              id="fileInput"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              style={{ display: 'block', marginBottom: '10px' }}
            />
            
            <input 
              type="text" 
              placeholder="Описание фото" 
              value={newImageAlt}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewImageAlt(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            {newImageUrl && (
              <div style={{ marginBottom: '10px' }}>
                <img src={newImageUrl} alt="Превью" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              </div>
            )}
            
            <button onClick={handleAdd}>Добавить фото</button>
          </div>

          <h3>Все фото ({photos.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                <img src={photo.src} alt={photo.alt} style={{ width: '150px', height: '100px', objectFit: 'cover' }} />
                <p>{photo.alt}</p>
                <button onClick={() => handleDelete(photo.id)}>
                  Удалить
                </button>
                <button onClick={() => handleUpdate(photo.id)}>
                  Изменить
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "карточки") {
      return (
        <div>
          <h2>Управление карточками услуг</h2>
          
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h3>Добавить новую карточку</h3>
            
            <input 
              type="text" 
              placeholder="Название (например: 👥 До 20 человек)" 
              value={newCardTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCardTitle(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            <input 
              type="text" 
              placeholder="Описание" 
              value={newCardDescription}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCardDescription(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            <input 
              type="number" 
              placeholder="Цена (например: 12000)" 
              value={newCardPrice}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCardPrice(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />

            <div style={{ marginBottom: '10px' }}>
              <label>
                <input 
                  type="radio" 
                  value="day"
                  checked={newCardPriceType === 'day'}
                  onChange={() => setNewCardPriceType('day')}
                /> Посуточная
              </label>
              <label style={{ marginLeft: '15px' }}>
                <input 
                  type="radio" 
                  value="hour"
                  checked={newCardPriceType === 'hour'}
                  onChange={() => setNewCardPriceType('hour')}
                /> Почасовая
              </label>
            </div>

            {newCardPriceType === 'hour' && (
              <input 
                type="number" 
                placeholder="Минимальное количество часов (например: 3)" 
                value={newCardMinHours}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCardMinHours(e.target.value)}
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
            )}
            
            <button onClick={handleAddCard}>Добавить карточку</button>
          </div>

          <h3>Все карточки ({cards.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {cards.map((card) => (
              <div key={card.id} style={{ border: '1px solid #ddd', padding: '15px', width: '280px' }}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <p><strong>Цена:</strong> {card.price}₽ {card.priceType === 'hour' ? `/час (мин. ${card.minHours}ч)` : '/сутки'}</p>
                <button onClick={() => handleDeleteCard(card.id)}>
                  Удалить
                </button>
                <button onClick={() => handleUpdateCard(card.id)}>
                  Изменить
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "цены") {
      return (
        <div>
          <h2>Управление ценами</h2>
          <p>Цены редактируются в карточках услуг</p>
          <div style={{ border: '1px solid #ddd', padding: '20px', marginTop: '20px' }}>
            {cards.map((card) => (
              <div key={card.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <p><strong>{card.title}</strong></p>
                <p>Цена: {card.price}₽ {card.priceType === 'hour' ? `/час (мин. ${card.minHours}ч)` : '/сутки'}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "отзывы") {
      return (
        <div>
          <h2>Управление отзывами</h2>
          
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h3>Добавить новый отзыв</h3>
            
            <input 
              type="text" 
              placeholder="Имя автора" 
              value={newReviewName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewReviewName(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            <input 
              type="text" 
              placeholder="Текст отзыва" 
              value={newReviewText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewReviewText(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            <input 
              type="number" 
              placeholder="Рейтинг (1-5)" 
              value={newReviewRating}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewReviewRating(e.target.value)}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              min="1"
              max="5"
            />
            
            <button onClick={handleAddReview}>Добавить отзыв</button>
          </div>

          <h3>Все отзывы ({reviews.length})</h3>
          <div>
            {reviews.map((review) => (
              <div key={review.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
                <p><strong>{review.name}</strong> - {'⭐'.repeat(review.rating)}</p>
                <p>{review.text}</p>
                <button onClick={() => handleDeleteReview(review.id)}>
                  Удалить
                </button>
                <button onClick={() => handleUpdateReview(review.id)}>
                  Изменить
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "бронь") {
      const [showAddForm, setShowAddForm] = useState(false);
      const [newBookingData, setNewBookingData] = useState({
        user_email: '',
        booking_date: '',
        hours: '',
        total_price: ''
      });
      const [localBookings, setLocalBookings] = useState<any[]>(bookings);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        loadBookings();
      }, []);

      const loadBookings = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/bookings`);
          const data = await response.json();
          if (data.success) {
            setLocalBookings(data.bookings);
          }
        } catch (error) {
          console.error('Ошибка загрузки бронирований:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const handleDeleteBookingLocal = async (id: number) => {
        if (!confirm('Точно удалить это бронирование?')) return;
        await onDeleteBooking(id);
        await loadBookings();
      };

      const handleUpdateStatusLocal = async (id: number, status: string) => {
        await onUpdateBookingStatus(id, status);
        await loadBookings();
      };

      const handleAddBookingLocal = async () => {
        if (!newBookingData.user_email || !newBookingData.booking_date || !newBookingData.total_price) {
          alert('Заполните все поля!');
          return;
        }

        const success = await onAddBookingByAdmin({
          user_email: newBookingData.user_email,
          booking_date: newBookingData.booking_date,
          hours: newBookingData.hours ? Number(newBookingData.hours) : null,
          total_price: Number(newBookingData.total_price)
        });

        if (success) {
          setNewBookingData({
            user_email: '',
            booking_date: '',
            hours: '',
            total_price: ''
          });
          setShowAddForm(false);
          await loadBookings();
        }
      };

      return (
        <div>
          <h2>Управление бронированием</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Скрыть форму' : '➕ Добавить бронирование вручную'}
            </button>
            <button onClick={loadBookings} style={{ marginLeft: '10px' }}>
              🔄 Обновить
            </button>
          </div>

          {showAddForm && (
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
              <h3>Добавить бронирование</h3>
              <input
                type="email"
                placeholder="Email пользователя"
                value={newBookingData.user_email}
                onChange={(e) => setNewBookingData({...newBookingData, user_email: e.target.value})}
                style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
              />
              <input
                type="date"
                placeholder="Дата бронирования"
                value={newBookingData.booking_date}
                onChange={(e) => setNewBookingData({...newBookingData, booking_date: e.target.value})}
                style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
              />
              <input
                type="number"
                placeholder="Количество часов (опционально)"
                value={newBookingData.hours}
                onChange={(e) => setNewBookingData({...newBookingData, hours: e.target.value})}
                style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
              />
              <input
                type="number"
                placeholder="Стоимость"
                value={newBookingData.total_price}
                onChange={(e) => setNewBookingData({...newBookingData, total_price: e.target.value})}
                style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
              />
              <button onClick={handleAddBookingLocal} style={{ padding: '10px 20px' }}>
                Добавить
              </button>
            </div>
          )}

          <h3>Все бронирования ({localBookings.length})</h3>
          
          {isLoading ? (
            <p>Загрузка...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Пользователь</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Дата</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Часы</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Стоимость</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Статус</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.id}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.user_email}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(booking.booking_date).toLocaleDateString('ru-RU')}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.hours || '-'}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.total_price}₽</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: booking.status === 'confirmed' ? '#d4edda' : 
                                         booking.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                          color: booking.status === 'confirmed' ? '#155724' : 
                                 booking.status === 'cancelled' ? '#721c24' : '#856404'
                        }}>
                          {booking.status === 'pending' ? 'Ожидание' :
                           booking.status === 'confirmed' ? 'Подтверждено' :
                           booking.status === 'cancelled' ? 'Отменено' : booking.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <button 
                          onClick={() => handleUpdateStatusLocal(booking.id, 'confirmed')}
                          style={{ marginRight: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          ✅ Подтв.
                        </button>
                        <button 
                          onClick={() => handleUpdateStatusLocal(booking.id, 'cancelled')}
                          style={{ marginRight: '5px', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          ❌ Отм.
                        </button>
                        <button 
                          onClick={() => handleDeleteBookingLocal(booking.id)}
                          style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          🗑️ Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    return <div>Страница не найдена</div>;
  }

  const adminContainerStyle = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  };

  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px 0',
    flexShrink: 0
  };

  const menuItemStyle = {
    padding: '12px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #34495e',
    transition: 'background 0.3s'
  };

  const menuItemActiveStyle = {
    ...menuItemStyle,
    backgroundColor: '#3498db',
    borderLeft: '4px solid #1abc9c'
  };

  const contentStyle = {
    flex: 1,
    padding: '30px',
    backgroundColor: '#ecf0f1'
  };

  const headerStyle = {
    marginBottom: '30px',
    borderBottom: '2px solid #bdc3c7',
    paddingBottom: '15px'
  };

  return (
    <div style={adminContainerStyle}>
      <div style={sidebarStyle}>
        <div style={{ padding: '20px', borderBottom: '1px solid #34495e' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>⚙️ Админка</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#bdc3c7' }}>
            Привет, {user.name}!
          </p>
        </div>
        
        <div 
          style={activeTab === "главная" ? menuItemActiveStyle : menuItemStyle}
          onClick={() => setActiveTab("главная")}
        >
          🏠 Главная (фото)
        </div>
        
        <div 
          style={activeTab === "карточки" ? menuItemActiveStyle : menuItemStyle}
          onClick={() => setActiveTab("карточки")}
        >
          📋 Карточки услуг
        </div>
        
        <div 
          style={activeTab === "цены" ? menuItemActiveStyle : menuItemStyle}
          onClick={() => setActiveTab("цены")}
        >
          💰 Цены
        </div>
        
        <div 
          style={activeTab === "отзывы" ? menuItemActiveStyle : menuItemStyle}
          onClick={() => setActiveTab("отзывы")}
        >
          ⭐ Отзывы
        </div>
        
        <div 
          style={activeTab === "бронь" ? menuItemActiveStyle : menuItemStyle}
          onClick={() => setActiveTab("бронь")}
        >
          📅 Бронирование
        </div>
      </div>

      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>
            {activeTab === "главная" && "🏠 Управление фотогалереей"}
            {activeTab === "карточки" && "📋 Управление карточками услуг"}
            {activeTab === "цены" && "💰 Управление ценами"}
            {activeTab === "отзывы" && "⭐ Управление отзывами"}
            {activeTab === "бронь" && "📅 Управление бронированием"}
          </h1>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanelUse;