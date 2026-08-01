import { useState } from 'react';

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
  onAddPhoto: (newPhoto: Photo) => void;
  onDeletePhoto: (id: number) => void;
  onUpdatePhoto: (id: number, newSrc: string, newAlt: string) => void;
  cards: Card[];
  onAddCard: (newCard: Card) => void;
  onDeleteCard: (id: number) => void;
  onUpdateCard: (id: number, newTitle: string, newDescription: string, newPrice: number, newPriceType: 'hour' | 'day', newMinHours?: number) => void;
  priceValue: (id: number) => void;
  reviews: Review[];                    // ← добавить
  onAddReview: (newReview: Review) => void;      // ← добавить
  onDeleteReview: (id: number) => void;          // ← добавить
  onUpdateReview: (id: number, newName: string, newText: string, newRating: number) => void; // ← добавить

};

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
  priceValue,
    reviews,          
  onAddReview,         
  onDeleteReview,       
  onUpdateReview,
}: AdminPanelUseProps) {
  
  const [activeTab, setActiveTab] = useState("главная");

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [newCardPrice, setNewCardPrice] = useState("");
  const [newCardPriceType, setNewCardPriceType] = useState<'hour' | 'day'>('day');
  const [newCardMinHours, setNewCardMinHours] = useState("");

  const [newReviewName, setNewReviewName] = useState("");
const [newReviewText, setNewReviewText] = useState("");
const [newReviewRating, setNewReviewRating] = useState("5");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        if (e.target && typeof e.target.result === 'string') {
          setNewImageUrl(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleAdd() {
    if (!newImageUrl || !newImageAlt) {
      alert('Выберите фото и напишите описание!');
      return;
    }

    const newPhoto: Photo = {
      id: Date.now(),
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

  function handleDelete(id: number) {
    if (confirm('Точно удалить это фото?')) {
      onDeletePhoto(id);
    }
  }

  function handleUpdate(id: number) {
    const newAlt = prompt('Введите новое описание:');
    if (newAlt && newAlt.trim() !== '') {
      const currentPhoto = photos.find(function(p) { return p.id === id; });
      if (currentPhoto) {
        onUpdatePhoto(id, currentPhoto.src, newAlt);
      }
    }
  }

  function handleAddCard() {
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

    const newCard: Card = {
      id: Date.now(),
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

  function handleDeleteCard(id: number) {
    if (confirm('Точно удалить эту карточку?')) {
      onDeleteCard(id);
    }
  }

  function handleUpdateCard(id: number) {
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

  function handleAddReview() {
  if (!newReviewName || !newReviewText) {
    alert('Заполните имя и текст отзыва!');
    return;
  }

  const rating = Number(newReviewRating);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    alert('Рейтинг должен быть от 1 до 5!');
    return;
  }

  const newReview: Review = {
    id: Date.now(),
    name: newReviewName,
    text: newReviewText,
    rating: rating
  };
  
  onAddReview(newReview);
  setNewReviewName("");
  setNewReviewText("");
  setNewReviewRating("5");
}

function handleDeleteReview(id: number) {
  if (confirm('Точно удалить этот отзыв?')) {
    onDeleteReview(id);
  }
}

function handleUpdateReview(id: number) {
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
              onChange={function(e) { setNewImageAlt(e.target.value); }}
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
            {photos.map(function(photo) {
              return (
                <div key={photo.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <img src={photo.src} alt={photo.alt} style={{ width: '150px', height: '100px', objectFit: 'cover' }} />
                  <p>{photo.alt}</p>
                  <button onClick={function() { handleDelete(photo.id); }}>
                    Удалить
                  </button>
                  <button onClick={function() { handleUpdate(photo.id); }}>
                    Изменить
                  </button>
                </div>
              );
            })}
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
              onChange={function(e) { setNewCardTitle(e.target.value); }}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            <input 
              type="text" 
              placeholder="Описание" 
              value={newCardDescription}
              onChange={function(e) { setNewCardDescription(e.target.value); }}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            <input 
              type="number" 
              placeholder="Цена (например: 12000)" 
              value={newCardPrice}
              onChange={function(e) { setNewCardPrice(e.target.value); }}
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />

            <div style={{ marginBottom: '10px' }}>
              <label>
                <input 
                  type="radio" 
                  value="day"
                  checked={newCardPriceType === 'day'}
                  onChange={function(e) { setNewCardPriceType('day'); }}
                /> Посуточная
              </label>
              <label style={{ marginLeft: '15px' }}>
                <input 
                  type="radio" 
                  value="hour"
                  checked={newCardPriceType === 'hour'}
                  onChange={function(e) { setNewCardPriceType('hour'); }}
                /> Почасовая
              </label>
            </div>

            {newCardPriceType === 'hour' && (
              <input 
                type="number" 
                placeholder="Минимальное количество часов (например: 3)" 
                value={newCardMinHours}
                onChange={function(e) { setNewCardMinHours(e.target.value); }}
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
            )}
            
            <button onClick={handleAddCard}>Добавить карточку</button>
          </div>

          <h3>Все карточки ({cards.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {cards.map(function(card) {
              return (
                <div key={card.id} style={{ border: '1px solid #ddd', padding: '15px', width: '280px' }}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <p><strong>Цена:</strong> {card.price}₽ {card.priceType === 'hour' ? `/час (мин. ${card.minHours}ч)` : '/сутки'}</p>
                  <button onClick={function() { handleDeleteCard(card.id); }}>
                    Удалить
                  </button>
                  <button onClick={function() { handleUpdateCard(card.id); }}>
                    Изменить
                  </button>
                </div>
              );
            })}
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
            {cards.map(card => (
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
      
      {/* Форма добавления */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>Добавить новый отзыв</h3>
        
        <input 
          type="text" 
          placeholder="Имя автора" 
          value={newReviewName}
          onChange={function(e) { setNewReviewName(e.target.value); }}
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        
        <input 
          type="text" 
          placeholder="Текст отзыва" 
          value={newReviewText}
          onChange={function(e) { setNewReviewText(e.target.value); }}
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        
        <input 
          type="number" 
          placeholder="Рейтинг (1-5)" 
          value={newReviewRating}
          onChange={function(e) { setNewReviewRating(e.target.value); }}
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          min="1"
          max="5"
        />
        
        <button onClick={handleAddReview}>Добавить отзыв</button>
      </div>

      <h3>Все отзывы ({reviews.length})</h3>
      <div>
        {reviews.map(function(review) {
          return (
            <div key={review.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
              <p><strong>{review.name}</strong> - {'⭐'.repeat(review.rating)}</p>
              <p>{review.text}</p>
              <button onClick={function() { handleDeleteReview(review.id); }}>
                Удалить
              </button>
              <button onClick={function() { handleUpdateReview(review.id); }}>
                Изменить
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

    if (activeTab === "бронь") {
      return (
        <div>
          <h2>Управление бронированием</h2>
          <p>Здесь будут настройки календаря и бронирования</p>
          <div style={{ border: '1px solid #ddd', padding: '20px', marginTop: '20px' }}>
            <p>📅 Календарь бронирований</p>
            <p>⏰ Доступное время: 10:00 - 22:00</p>
          </div>
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
          onClick={function() { setActiveTab("главная"); }}
          onMouseEnter={function(e) { 
            if (activeTab !== "главная") {
              e.currentTarget.style.backgroundColor = '#34495e';
            }
          }}
          onMouseLeave={function(e) { 
            if (activeTab !== "главная") {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          🏠 Главная (фото)
        </div>
        
        <div 
          style={activeTab === "карточки" ? menuItemActiveStyle : menuItemStyle}
          onClick={function() { setActiveTab("карточки"); }}
          onMouseEnter={function(e) { 
            if (activeTab !== "карточки") {
              e.currentTarget.style.backgroundColor = '#34495e';
            }
          }}
          onMouseLeave={function(e) { 
            if (activeTab !== "карточки") {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          📋 Карточки услуг
        </div>
        
        <div 
          style={activeTab === "цены" ? menuItemActiveStyle : menuItemStyle}
          onClick={function() { setActiveTab("цены"); }}
          onMouseEnter={function(e) { 
            if (activeTab !== "цены") {
              e.currentTarget.style.backgroundColor = '#34495e';
            }
          }}
          onMouseLeave={function(e) { 
            if (activeTab !== "цены") {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          💰 Цены
        </div>
        
        <div 
          style={activeTab === "отзывы" ? menuItemActiveStyle : menuItemStyle}
          onClick={function() { setActiveTab("отзывы"); }}
          onMouseEnter={function(e) { 
            if (activeTab !== "отзывы") {
              e.currentTarget.style.backgroundColor = '#34495e';
            }
          }}
          onMouseLeave={function(e) { 
            if (activeTab !== "отзывы") {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          ⭐ Отзывы
        </div>
        
        <div 
          style={activeTab === "бронь" ? menuItemActiveStyle : menuItemStyle}
          onClick={function() { setActiveTab("бронь"); }}
          onMouseEnter={function(e) { 
            if (activeTab !== "бронь") {
              e.currentTarget.style.backgroundColor = '#34495e';
            }
          }}
          onMouseLeave={function(e) { 
            if (activeTab !== "бронь") {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
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
