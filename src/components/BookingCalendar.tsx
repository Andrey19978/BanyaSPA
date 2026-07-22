import * as React from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import './BookingCalendar.css';

const PRICE_PER_DAY = 1000;
const BOOKED_DATES = ['2026-07-20', '2026-07-21', '2026-07-25'];

export default function BookingCalendar() {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [isSelectingStart, setIsSelectingStart] = React.useState(true);

  const handleDateChange = (newDate: Dayjs | null) => {
     if (!newDate?.isValid) return;
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
    if (!startDate || !endDate) return 0;
    const days = endDate.diff(startDate, 'day');
    return days * PRICE_PER_DAY;
  };

  const getDayClassName = (date: Dayjs) => {
    const rangeStatus = isStartOrEnd(date);
    const inRange = isInRange(date);
    const isBooked = BOOKED_DATES.includes(date.format('YYYY-MM-DD'));

    let className = 'dayDefault'; // 👈 Простая строка

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

    return className;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <div className="container"> {/* 👈 Простая строка */}
        <div className="bookingInfo"> {/* 👈 Простая строка */}
          <h3>Бронирование бассейна</h3>
          <p>
            <strong>📅 Дата заезда:</strong>{' '}
            {startDate?.format('DD.MM.YYYY') || 'Выберите дату'}
          </p>
          <p>
            <strong>📅 Дата выезда:</strong>{' '}
            {endDate?.format('DD.MM.YYYY') || 'Выберите дату'}
          </p>
          <p>
            <strong>🏊 Количество дней:</strong>{' '}
            {startDate && endDate ? endDate.diff(startDate, 'day') : 0}
          </p>
          <p>
            <strong>💰 Стоимость:</strong> {calculatePrice()} ₽
          </p>
          <p className="hint"> {/* 👈 Простая строка */}
            {isSelectingStart ? 'Выберите дату заезда' : 'Выберите дату выезда'}
          </p>
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