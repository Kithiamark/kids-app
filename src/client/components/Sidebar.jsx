import React, { useContext } from 'react';
import { ThemeContext } from '../../theme-context';
import './../styles/sidebar.css';

const Sidebar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <aside className="sidebar">
      <h2>📖 Kids Bible App</h2>
      <nav>
        <ul>
          <li><button>Dashboard</button></li>
          <li><button>Lessons</button></li>
          <li><button>Quizzes</button></li>
          <li><button>Bookmarks</button></li>
          <li><button>Calendar</button></li>
        </ul>
      </nav>
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
    </aside>
  );
};

export default Sidebar;
