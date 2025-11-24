import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.scss';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <h1>📚 Бібліотека Військового інституту телекомунікацій та інформатизації імені Героїв Крут</h1>
        </div>
        <div className="header-right">
          <span className="user-info">
            {user?.fullName} ({user?.username})
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Вийти
          </button>
        </div>
      </header>

      <div className="main-container">
        <nav className="sidebar">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            🏠 Головна
          </NavLink>
          <NavLink to="/issue-book" className={({ isActive }) => isActive ? 'active' : ''}>
            ➕ Видати книгу
          </NavLink>
          <NavLink to="/active-issues" className={({ isActive }) => isActive ? 'active' : ''}>
            📖 Активні видачі
          </NavLink>
          <NavLink to="/overdue" className={({ isActive }) => isActive ? 'active' : ''}>
            ⚠️ Прострочені книги
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
            📜 Історія
          </NavLink>
          <NavLink to="/statistics" className={({ isActive }) => isActive ? 'active' : ''}>
            📊 Статистика
          </NavLink>
        </nav>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
