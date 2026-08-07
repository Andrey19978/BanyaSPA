import * as React from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import './BookingCalendar.css';

type Card = {
  id: number;
  title: string;
  description: string;
  price: number;
  priceType: 'hour' | 'day';
  minHours?: number;
  buttonText?: string;
};

type BookingCalendarProps = {
  priceValue: number;
  card: Card | null;
  userEmail?: string;
  onBookingSuccess?: () => void;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BookingCalendar({ 
  priceValue, 
  card, 
  userEmail,
  onBookingSuccess 
}: BookingCalendarProps) {
  const PRICE_PER_DAY = priceValue;
  
  const getDailyPrice = (date: Dayjs): number => {
    const dayOfWeek = date.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 5000;
    }
    return PRICE_PER_DAY;
  };

  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [isSelectingStart, setIsSelectingStart] = React.useState<boolean>(true);
  const [selectedHours, setSelectedHours] = React.useState<number>(3);
  const [isBooking, setIsBooking] = React.useState<boolean>(false);
  const [bookingMessage, setBookingMessage] = React.useState<string>('');
  const [bookedDates, setBookedDates] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const isHourly: boolean = card?.priceType === 'hour';

  const fetchBookings = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/bookings`);
      const data = await response.json();
      if (data.success && data.bookings) {
        const dates = data.bookings.map((b: any) => b.booking_date);
        setBookedDates(dates);
      }
    } catch (error) {
      console.error('Ошибка загрузки бронирований:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDateChange = (newDate: Dayjs | null): void => {
    if (!newDate?.isValid) return;
    
    const dateString = newDate.format('YYYY-MM-DD');
    if (bookedDates.includes(dateString)) {
      alert('❌ Эта дата уже забронирована!');
      return;
    }
    
    if (isHourly) {
      setStartDate(newDate);
      setEndDate(null);
    } else {
      if (isSelectingStart) {
        setStartDate(newDate);
        setEndDate(null);
        setIsSelectingStart(false);
      } else {
        if (newDate.isBefore(startDate)) {
          setStartDate(newDate);
          setIsSelectingStart(false);
        } else {
          setEndDate(newDate);
          setIsSelectingStart(true);
        }
      }
    }
  };

  const isInRange = (date: Dayjs): boolean => {
    if (!startDate || !endDate) return false;
    return date.isAfter(startDate) && date.isBefore(endDate);
  };

  const isStartOrEnd = (date: Dayjs): 'start' | 'end' | null => {
    if (startDate && date.isSame(startDate, 'day')) return 'start';
    if (endDate && date.isSame(endDate, 'day')) return 'end';
    return null;
  };

  const calculatePrice = (): number => {
    if (!startDate) return 0;
    
    if (isHourly) {
      const minHours = card?.minHours || 1;
      const hours = Math.max(selectedHours, minHours);
      return hours * PRICE_PER_DAY;
    }
    
    if (!endDate) return 0;
    
    let totalPrice = 0;
    let currentDate = startDate;
    
    while (currentDate.isBefore(endDate)) {
      totalPrice += getDailyPrice(currentDate);
      currentDate = currentDate.add(1, 'day');
    }
    
    return totalPrice;
  };

  const getDayClassName = (date: Dayjs): string => {
    const rangeStatus = isStartOrEnd(date);
    const inRange = isInRange(date);
    const isBooked = bookedDates.includes(date.format('YYYY-MM-DD'));
    const isWeekend = date.day() === 0 || date.day() === 6;

    let className = 'dayDefault';

    if (rangeStatus === 'start') {
      className = 'dayStart';
    } else if (rangeStatus === 'end') {
      className = 'dayEnd';
    } else if (inRange && !isBooked) {
      className = 'dayInRange';
    }

    if (isBooked) {
      className += ' dayBooked';
    } else {
      className += ' dayHover';
    }

    if (isWeekend && !isBooked) {
      className += ' dayWeekend';
    }

    return className;
  };

  const daysCount: number = startDate && endDate ? endDate.diff(startDate, 'day') : 0;
  const totalPrice: number = calculatePrice();

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedHours(Number(e.target.value));
  };

  const handleBooking = async () => {
    if (!userEmail) {
      alert('⚠️ Пожалуйста, войдите в систему для бронирования');
      return;
    }

    if (!startDate) {
      alert('⚠️ Выберите дату бронирования');
      return;
    }

    setIsBooking(true);
    setBookingMessage('');

    try {
      if (!isHourly && endDate) {
        let currentDate = startDate;
        let allBookings = [];
        let totalPriceTemp = 0;
        
        while (currentDate.isBefore(endDate)) {
          const dateStr = currentDate.format('YYYY-MM-DD');
          const dayPrice = getDailyPrice(currentDate);
          totalPriceTemp += dayPrice;
          
          allBookings.push({
            user_email: userEmail,
            booking_date: dateStr,
            hours: null,
            total_price: dayPrice
          });
          
          currentDate = currentDate.add(1, 'day');
        }

        for (const booking of allBookings) {
          const response = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Ошибка бронирования');
          }
        }

        setBookingMessage(`✅ Бронирование на ${allBookings.length} дней успешно создано! Стоимость: ${totalPriceTemp}₽`);
        await fetchBookings();
        
      } else {
        const bookingDate = startDate.format('YYYY-MM-DD');
        const bookingData = {
          user_email: userEmail,
          booking_date: bookingDate,
          hours: selectedHours,
          total_price: totalPrice
        };

        const response = await fetch(`${API_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка бронирования');
        }

        setBookingMessage(`✅ Бронирование успешно создано! Стоимость: ${totalPrice}₽`);
        await fetchBookings();
      }

      if (onBookingSuccess) {
        onBookingSuccess();
      }

      setStartDate(null);
      setEndDate(null);
      setIsSelectingStart(true);

    } catch (error: any) {
      console.error('Ошибка бронирования:', error);
      setBookingMessage(`❌ ${error.message || 'Произошла ошибка при бронировании'}`);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка доступных дат...</p>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <div className="container">
        <div className="bookingInfo">
          <h3>Бронирование бассейна</h3>
          {!userEmail && (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              ⚠️ Для бронирования необходимо войти в систему
            </p>
          )}
          <p><strong>Тип тарифа:</strong> {isHourly ? 'Почасовой' : 'Посуточный'}</p>
          {isHourly && (
            <>
              <p><strong>Минимум:</strong> {card?.minHours || 1} часа</p>
              <div style={{ margin: '10px 0' }}>
                <label>
                  <strong>Количество часов:</strong>
                  <input 
                    type="number" 
                    min={card?.minHours || 1}
                    max={12}
                    value={selectedHours}
                    onChange={handleHoursChange}
                    style={{ 
                      marginLeft: '10px', 
                      padding: '5px 10px', 
                      width: '60px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </label>
              </div>
            </>
          )}
          <p>
            <strong>📅 Дата заезда:</strong>{' '}
            {startDate?.format('DD.MM.YYYY') || 'Выберите дату'}
          </p>
          {!isHourly && (
            <p>
              <strong>📅 Дата выезда:</strong>{' '}
              {endDate?.format('DD.MM.YYYY') || 'Выберите дату'}
            </p>
          )}
          {!isHourly && (
            <p>
              <strong>🏊 Количество дней:</strong> {daysCount}
            </p>
          )}
          <p>
            <strong>💰 Стоимость:</strong> {totalPrice} ₽
          </p>
          <p className="hint">
            {isHourly 
              ? 'Выберите дату бронирования' 
              : isSelectingStart ? 'Выберите дату заезда' : 'Выберите дату выезда'}
          </p>
          {!isHourly && (
            <p style={{ fontSize: '12px', color: '#666' }}>
              💡 В выходные дни цена выше
            </p>
          )}
          
          {bookingMessage && (
            <div style={{ 
              margin: '10px 0', 
              padding: '10px', 
              backgroundColor: bookingMessage.includes('✅') ? '#d4edda' : '#f8d7da',
              borderRadius: '4px',
              color: bookingMessage.includes('✅') ? '#155724' : '#721c24'
            }}>
              {bookingMessage}
            </div>
          )}
          
          <button 
            onClick={handleBooking}
            disabled={!userEmail || !startDate || isBooking}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: (!userEmail || !startDate || isBooking) ? 0.6 : 1,
              marginTop: '10px'
            }}
          >
            {isBooking ? 'Бронирование...' : 'Забронировать'}
          </button>
        </div>

        <DateCalendar 
          value={startDate || undefined}
          onChange={handleDateChange}
          disablePast
          shouldDisableDate={(date: Dayjs): boolean => {
            const dateString = date.format('YYYY-MM-DD');
            return bookedDates.includes(dateString);
          }}
          slotProps={{
            day: (ownerState: { day: Dayjs }) => {
              const date = ownerState.day;
              const className = getDayClassName(date);
              
              return {
                className,
              };
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}