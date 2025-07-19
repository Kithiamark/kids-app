import React from 'react';
import './styles/global.css';
import { ThemeProvider } from './theme-context';

// Components (to be added)
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LessonGrid from './components/LessonGrid';
import ProfileCard from './components/ProfileCard';
import Calendar from './components/Calendar';
import OnlineFriends from './components/OnlineFriends';

const App = () => {
  return (
    <ThemeProvider>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Header />
          <LessonGrid />
        </main>

        <aside className="right-panel">
          <ProfileCard />
          <Calendar />
          <OnlineFriends />
        </aside>
      </div>
    </ThemeProvider>
  );
};

export default App;
