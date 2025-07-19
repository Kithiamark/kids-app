import React, { useState } from 'react';
import dayjs from 'dayjs';
import './../styles/calendar.css'; // Optional for styling

const Calendar = ({ onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const daysInMonth = currentDate.daysInMonth();
  const startDay = startOfMonth.day();

  const daysArray = [];

  for (let i = 0; i < startDay; i++) {
    daysArray.push(null); // Empty cells before the 1st
  }

  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(dayjs(currentDate).date(i));
  }

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h4>{currentDate.format('MMMM YYYY')}</h4>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}

        {daysArray.map((date, idx) => (
          <div
            key={idx}
            className={`calendar-day ${date ? 'active' : 'empty'}`}
            onClick={() => date && onDateClick?.(date.format('YYYY-MM-DD'))}
          >
            {date?.date()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
