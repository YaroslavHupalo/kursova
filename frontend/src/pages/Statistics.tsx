import React, { useEffect, useState } from 'react';
import { bookIssueService, Statistics } from '../services/bookIssue.service';
import './Statistics.scss';

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await bookIssueService.getStatistics();
      setStats(response.statistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  if (!stats) {
    return <div className="no-data">Немає даних для відображення</div>;
  }

  return (
    <div className="statistics-page">
      <h1>📊 Статистика</h1>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Загальна кількість видач</h3>
          <p className="stat-number">{stats.totalIssues}</p>
        </div>
        <div className="stat-card">
          <h3>Активні видачі</h3>
          <p className="stat-number active">{stats.activeIssues}</p>
        </div>
        <div className="stat-card">
          <h3>Повернуті книги</h3>
          <p className="stat-number returned">{stats.returnedIssues}</p>
        </div>
        <div className="stat-card">
          <h3>Прострочені</h3>
          <p className="stat-number overdue">{stats.overdueIssues}</p>
        </div>
      </div>

      <div className="stats-sections">
        <div className="stats-section">
          <h2>Топ-10 найпопулярніших книг</h2>
          {stats.popularBooks.length > 0 ? (
            <div className="popular-books-list">
              {stats.popularBooks.map((book, index) => (
                <div key={index} className="popular-book-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="book-info">
                    <p className="book-title">{book._id}</p>
                    <p className="book-count">{book.count} видач</p>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(book.count / stats.popularBooks[0].count) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-text">Немає даних</p>
          )}
        </div>

        <div className="stats-section">
          <h2>Статистика по підрозділах</h2>
          {stats.byDepartment.length > 0 ? (
            <div className="department-list">
              {stats.byDepartment.map((dept, index) => (
                <div key={index} className="department-item">
                  <div className="dept-info">
                    <p className="dept-name">{dept._id}</p>
                    <p className="dept-count">{dept.count} видач</p>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill dept"
                      style={{
                        width: `${(dept.count / stats.byDepartment[0].count) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-text">Немає даних</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
