import * as React from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import './BookingCalendar.css';

export default function BookingCalendar({ priceValue, card }) {
  const PRICE_PER_DAY = priceValue;
  
  const getDailyPrice = (date: Dayjs) => {
    const dayOfWeek = date.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 5000;
    }
    return PRICE_PER_DAY;
  };

  const BOOKED_DATES = ['2026-07-20', '2026-07-21', '2026-07-25'];

  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [isSelectingStart, setIsSelectingStart] = React.useState(true);
  const [selectedHours, setSelectedHours] = React.useState(3); // для почасовой

  const isHourly = card?.priceType === 'hour';

  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate?.isValid) return;
    
    if (isHourly) {
      // Для почасовой - выбираем только дату начала
      setStartDate(newDate);
      setEndDate(null);
    } else {
      // Для посуточной - как обычно
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

  const isInRange = (date: Dayjs) => {
    if (!startDate || !endDate) return false;
    return date.isAfter(startDate) && date.isBefore(endDate);
  };

  const isStartOrEnd = (date: Dayjs) => {
    if (startDate && date.isSame(startDate, 'day')) return 'start';
    if (endDate && date.isSame(endDate, 'day')) return 'end';
    return null;
  };

  const calculatePrice = () => {
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

  const getDayClassName = (date: Dayjs) => {
    const rangeStatus = isStartOrEnd(date);
    const inRange = isInRange(date);
    const isBooked = BOOKED_DATES.includes(date.format('YYYY-MM-DD'));
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

  const daysCount = startDate && endDate ? endDate.diff(startDate, 'day') : 0;
  const totalPrice = calculatePrice();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <div className="container">
        <div className="bookingInfo">
          <h3>Бронирование бассейна</h3>
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
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
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
        </div>

        <DateCalendar 
          value={startDate || undefined}
          onChange={handleDateChange}
          disablePast
          shouldDisableDate={(date) => {
            const dateString = date.format('YYYY-MM-DD');
            return BOOKED_DATES.includes(dateString);
          }}
          slotProps={{
            day: (ownerState) => {
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