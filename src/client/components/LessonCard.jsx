import React from 'react';
import './../styles/lesson-card.css';

const LessonCard = ({ title, description, color }) => {
  return (
    <div className={`lesson-card ${color}`}>
      <div className="lesson-info">
        <h2>{title}</h2>
        <p>{description}</p>
        <button>Start Lesson</button>
      </div>
    </div>
  );
};

export default LessonCard;
