import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookIssueService, BookIssue, Statistics } from '../services/bookIssue.service';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [upcomingReturns, setUpcomingReturns] = useState<BookIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, activeResponse] = await Promise.all([
        bookIssueService.getStatistics(),
        bookIssueService.getActiveIssues()
      ]);

      setStats(statsResponse.statistics);

      // Get issues with return date in next 7 days
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcoming = activeResponse.bookIssues
        .filter(issue => {
          const returnDate = new Date(issue.returnDate);
          return returnDate >= today && returnDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime())
        .slice(0, 5);

      setUpcomingReturns(upcoming);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // helper intentionally omitted as date formatting is handled inline where needed

  const getDaysUntilReturn = (returnDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ret = new Date(returnDate);
    ret.setHours(0, 0, 0, 0);
    const diff = Math.ceil((ret.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Головна панель</h1>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Всього видач</h3>
            <p className="stat-number">{stats?.totalIssues || 0}</p>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>Активні</h3>
            <p className="stat-number">{stats?.activeIssues || 0}</p>
          </div>
        </div>

        <div className="stat-card returned">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Повернуті</h3>
            <p className="stat-number">{stats?.returnedIssues || 0}</p>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Прострочені</h3>
            <p className="stat-number">{stats?.overdueIssues || 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section upcoming-section">
          <h2>Найближчі повернення (7 днів)</h2>
          {upcomingReturns.length > 0 ? (
            <div className="upcoming-list">
              {upcomingReturns.map(issue => {
                const daysLeft = getDaysUntilReturn(issue.returnDate);
                return (
                  <div key={issue._id} className="upcoming-item">
                    <div className="upcoming-info">
                      <p className="reader-name">
                        {issue.lastName} {issue.firstName} {issue.middleName}
                      </p>
                      <p className="book-title">{issue.bookTitle}</p>
                    </div>
                    <div className={`days-badge ${daysLeft <= 2 ? 'urgent' : ''}`}>
                      {daysLeft === 0 ? 'Сьогодні' : daysLeft === 1 ? 'Завтра' : `${daysLeft} днів`}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">Немає найближчих повернень</p>
          )}
        </div>

        <div className="section quick-actions">
          <h2>Швидкі дії</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/issue-book')} className="action-btn primary">
              ➕ Видати книгу
            </button>
            <button onClick={() => navigate('/active-issues')} className="action-btn">
              📖 Активні видачі
            </button>
            <button onClick={() => navigate('/overdue')} className="action-btn warning">
              ⚠️ Прострочені
            </button>
            <button onClick={() => navigate('/statistics')} className="action-btn">
              📊 Статистика
            </button>
          </div>
        </div>
      </div>

      {stats && stats.popularBooks.length > 0 && (
        <div className="section popular-books">
          <h2>Топ-5 популярних книг</h2>
          <div className="popular-list">
            {stats.popularBooks.slice(0, 5).map((book, index) => (
              <div key={index} className="popular-item">
                <div className="rank">#{index + 1}</div>
                <div className="book-info">
                  <p className="book-name">{book._id}</p>
                  <p className="issue-count">{book.count} видач</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
