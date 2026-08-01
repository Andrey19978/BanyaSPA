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
};

export default function BookingCalendar({ priceValue, card }: BookingCalendarProps) {
  const PRICE_PER_DAY = priceValue;
  
  const getDailyPrice = (date: Dayjs): number => {
    const dayOfWeek = date.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 5000;
    }
    return PRICE_PER_DAY;
  };

  const BOOKED_DATES: string[] = ['2026-07-20', '2026-07-21', '2026-07-25'];

  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [isSelectingStart, setIsSelectingStart] = React.useState<boolean>(true);
  const [selectedHours, setSelectedHours] = React.useState<number>(3);

  const isHourly: boolean = card?.priceType === 'hour';

  const handleDateChange = (newDate: Dayjs | null): void => {
    if (!newDate?.isValid) return;
    
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

  const daysCount: number = startDate && endDate ? endDate.diff(startDate, 'day') : 0;
  const totalPrice: number = calculatePrice();

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedHours(Number(e.target.value));
  };

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
        </div>

        <DateCalendar 
          value={startDate || undefined}
          onChange={handleDateChange}
          disablePast
          shouldDisableDate={(date: Dayjs): boolean => {
            const dateString = date.format('YYYY-MM-DD');
            return BOOKED_DATES.includes(dateString);
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