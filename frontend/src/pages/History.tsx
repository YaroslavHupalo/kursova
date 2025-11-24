import React, { useCallback, useEffect, useState } from 'react';
import { bookIssueService, BookIssue } from '../services/bookIssue.service';
import './History.scss';

const History: React.FC = () => {
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState<BookIssue[]>([]);

  useEffect(() => {
    loadHistory();
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
      issue.bookTitle.toLowerCase().includes(term)
    );
    setFilteredIssues(filtered);
  }, [searchTerm, issues]);

  useEffect(() => {
    filterIssues();
  }, [filterIssues]);

  const loadHistory = async () => {
    try {
      const response = await bookIssueService.getHistory();
      setIssues(response.bookIssues);
      setFilteredIssues(response.bookIssues);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  };

  const wasOverdue = (issue: BookIssue) => {
    if (!issue.actualReturnDate) return false;
    const returnDate = new Date(issue.returnDate);
    const actualDate = new Date(issue.actualReturnDate);
    return actualDate > returnDate;
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  return (
    <div className="history">
      <div className="page-header">
        <h1>Історія видач</h1>
        <div className="header-info">
          <span className="total-count">Всього: {filteredIssues.length}</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Пошук за ID, ПІБ або книгою..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredIssues.length === 0 ? (
        <div className="no-data">
          {searchTerm ? 'Нічого не знайдено' : 'Історія порожня'}
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
                <th>Планова дата повернення</th>
                <th>Фактична дата повернення</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue._id}>
                  <td className="id-cell">{issue.issueId}</td>
                  <td className="reader-cell">
                    {issue.lastName} {issue.firstName} {issue.middleName}
                  </td>
                  <td>{issue.rank}</td>
                  <td>{issue.department}</td>
                  <td className="book-cell">{issue.bookTitle}</td>
                  <td>{formatDate(issue.issueDate)}</td>
                  <td>{formatDate(issue.returnDate)}</td>
                  <td className={wasOverdue(issue) ? 'overdue-return' : ''}>
                    {issue.actualReturnDate ? formatDate(issue.actualReturnDate) : '-'}
                  </td>
                  <td>
                    {wasOverdue(issue) ? (
                      <span className="badge overdue">Прострочено</span>
                    ) : (
                      <span className="badge on-time">Вчасно</span>
                    )}
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

export default History;
