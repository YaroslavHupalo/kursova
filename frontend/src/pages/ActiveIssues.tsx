import React, { useCallback, useEffect, useState } from 'react';
import { bookIssueService, BookIssue } from '../services/bookIssue.service';
import './ActiveIssues.scss';

const ActiveIssues: React.FC = () => {
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<BookIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [returnNotes, setReturnNotes] = useState<{ [key: string]: string }>({});
  const [processingReturn, setProcessingReturn] = useState<string | null>(null);

  useEffect(() => {
    loadActiveIssues();
  }, []);

  const filterIssues = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredIssues(issues);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = issues.filter(issue =>
      issue.issueId.toLowerCase().includes(term) ||
      issue.lastName.toLowerCase().includes(term) ||
      issue.firstName.toLowerCase().includes(term) ||
      issue.middleName.toLowerCase().includes(term) ||
      issue.bookTitle.toLowerCase().includes(term) ||
      issue.department.toLowerCase().includes(term)
    );
    setFilteredIssues(filtered);
  }, [searchTerm, issues]);

  useEffect(() => {
    filterIssues();
  }, [filterIssues]);

  const loadActiveIssues = async () => {
    try {
      const response = await bookIssueService.getActiveIssues();
      setIssues(response.bookIssues);
      setFilteredIssues(response.bookIssues);
    } catch (error) {
      console.error('Error loading active issues:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleReturnBook = async (id: string) => {
    if (!window.confirm('Підтвердити повернення книги?')) {
      return;
    }

    setProcessingReturn(id);
    try {
      await bookIssueService.returnBook(id, returnNotes[id] || '');
      setReturnNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[id];
        return newNotes;
      });
      await loadActiveIssues();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Помилка при поверненні книги');
    } finally {
      setProcessingReturn(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  };

  const getDaysUntilReturn = (returnDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ret = new Date(returnDate);
    ret.setHours(0, 0, 0, 0);
    const diff = Math.ceil((ret.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusBadge = (issue: BookIssue) => {
    const days = getDaysUntilReturn(issue.returnDate);
    
    if (issue.status === 'overdue') {
      return <span className="badge overdue">Прострочено</span>;
    }
    
    if (days <= 2) {
      return <span className="badge warning">Завтра / Сьогодні</span>;
    }
    
    return <span className="badge active">Активна</span>;
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  return (
    <div className="active-issues">
      <div className="page-header">
        <h1>Активні видачі</h1>
        <div className="header-info">
          <span className="total-count">Всього: {filteredIssues.length}</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Пошук за ID, ПІБ, книгою або підрозділом..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredIssues.length === 0 ? (
        <div className="no-data">
          {searchTerm ? 'Нічого не знайдено' : 'Немає активних видач'}
        </div>
      ) : (
        <div className="issues-table-container">
          <table className="issues-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Читач</th>
                <th>Звання</th>
                <th>Підрозділ</th>
                <th>Книга</th>
                <th>Дата видачі</th>
                <th>Дата повернення</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue._id} className={issue.status === 'overdue' ? 'overdue-row' : ''}>
                  <td className="id-cell">{issue.issueId}</td>
                  <td className="reader-cell">
                    <div className="reader-name">
                      {issue.lastName} {issue.firstName} {issue.middleName}
                    </div>
                  </td>
                  <td>{issue.rank}</td>
                  <td>{issue.department}</td>
                  <td className="book-cell">{issue.bookTitle}</td>
                  <td>{formatDate(issue.issueDate)}</td>
                  <td className={issue.status === 'overdue' ? 'overdue-date' : ''}>
                    {formatDate(issue.returnDate)}
                    <div className="days-info">
                      {getDaysUntilReturn(issue.returnDate) < 0
                        ? `${Math.abs(getDaysUntilReturn(issue.returnDate))} днів прострочено`
                        : `Залишилось ${getDaysUntilReturn(issue.returnDate)} дн.`}
                    </div>
                  </td>
                  <td>{getStatusBadge(issue)}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleReturnBook(issue._id)}
                      disabled={processingReturn === issue._id}
                      className="btn-return"
                    >
                      {processingReturn === issue._id ? 'Обробка...' : 'Повернути'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveIssues;
