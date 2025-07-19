import React from 'react';
import LessonCard from './LessonCard';
import './../styles/lesson-grid.css'; 

const lessons = [
  { title: "The Good Samaritan", description: "Learn to love others like Jesus taught.", color: "blue" },
  { title: "Jesus Calms the Storm", description: "Trusting Jesus when we’re afraid.", color: "purple" },
  { title: "Daniel and the Lions", description: "God protects those who trust in Him.", color: "pink" }
];

const LessonGrid = () => {
  return (
    <section className="lesson-grid">
      {lessons.map((lesson, index) => (
        <LessonCard key={index} {...lesson} />
      ))}
    </section>
  );
};

export default LessonGrid;
