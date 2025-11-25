import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.scss';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка входу. Перевірте дані.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📚 Бібліотека Військового інституту телекомунікацій та інформатизації імені Героїв Крут</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Вхід для бібліотекаря</h3>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Логін</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введіть логін"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введіть пароль"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 Бібліотека Військового інституту телекомунікацій та інформатизації імені Героїв Крут</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
