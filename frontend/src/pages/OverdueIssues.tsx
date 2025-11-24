import React, { useEffect, useState } from 'react';
import { bookIssueService, BookIssue } from '../services/bookIssue.service';
import './OverdueIssues.scss';

const OverdueIssues: React.FC = () => {
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverdueIssues();
  }, []);

  const loadOverdueIssues = async () => {
    try {
      const response = await bookIssueService.getOverdueIssues();
      setIssues(response.bookIssues);
    } catch (error) {
      console.error('Error loading overdue issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  };

  const handleReturnBook = async (id: string) => {
    if (!window.confirm('Підтвердити повернення книги?')) {
      return;
    }

    try {
      await bookIssueService.returnBook(id);
      await loadOverdueIssues();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Помилка при поверненні книги');
    }
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  return (
    <div className="overdue-issues">
      <div className="page-header">
        <h1>⚠️ Прострочені книги</h1>
        <div className="header-info">
          <span className="total-count danger">{issues.length}</span>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="no-data success">
          ✅ Немає прострочених книг
        </div>
      ) : (
        <>
          <div className="warning-message">
            Увага! Наступні книги не повернуті вчасно. Необхідно зв'язатися з читачами.
          </div>

          <div className="issues-table-container">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Читач</th>
                  <th>Звання</th>
                  <th>Підрозділ</th>
                  <th>Книга</th>
                  <th>Дата повернення</th>
                  <th>Днів прострочено</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue._id}>
                    <td className="id-cell">{issue.issueId}</td>
                    <td className="reader-cell">
                      {issue.lastName} {issue.firstName} {issue.middleName}
                    </td>
                    <td>{issue.rank}</td>
                    <td>{issue.department}</td>
                    <td className="book-cell">{issue.bookTitle}</td>
                    <td className="overdue-date">{formatDate(issue.returnDate)}</td>
                    <td className="days-overdue">
                      <span className="overdue-badge">{issue.daysOverdue || 0} днів</span>
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleReturnBook(issue._id)}
                        className="btn-return"
                      >
                        Повернути
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OverdueIssues;
