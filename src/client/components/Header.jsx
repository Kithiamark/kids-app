import React from 'react';
import './../styles/header.css'

const Header = () => {
  return (
    <header className="header">
      <h1>My Bible Lessons</h1>
      <div className="filters">
        <select>
          <option>Age</option>
          <option>3-5</option>
          <option>6-8</option>
          <option>9-12</option>
        </select>
        <select>
          <option>Topic</option>
          <option>Parables</option>
          <option>Miracles</option>
        </select>
        <select>
          <option>Book</option>
          <option>Genesis</option>
          <option>Matthew</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
