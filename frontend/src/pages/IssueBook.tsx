import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookIssueService, CreateBookIssueData } from '../services/bookIssue.service';
import './IssueBook.scss';

const IssueBook: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateBookIssueData>({
    lastName: '',
    firstName: '',
    middleName: '',
    rank: '',
    department: '',
    bookTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await bookIssueService.createIssue(formData);
      setSuccess(`Книгу успішно видано! ID видачі: ${response.bookIssue.issueId}`);
      
      // Reset form
      setFormData({
        lastName: '',
        firstName: '',
        middleName: '',
        rank: '',
        department: '',
        bookTitle: '',
        issueDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        notes: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/active-issues');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка при видачі книги');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultReturnDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData(prev => ({
      ...prev,
      returnDate: date.toISOString().split('T')[0]
    }));
  };

  return (
    <div className="issue-book">
      <h1>Видати книгу</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="issue-form">
        <div className="form-section">
          <h2>Дані читача</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName">Прізвище *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">Ім'я *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="middleName">По батькові *</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rank">Звання *</label>
              <input
                type="text"
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                placeholder="Введіть військове звання"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Підрозділ *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Введіть підрозділ"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Інформація про книгу</h2>

          <div className="form-group">
            <label htmlFor="bookTitle">Назва книги *</label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="issueDate">Дата видачі *</label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="returnDate">Дата повернення *</label>
              <div className="date-input-group">
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                />
                <div className="date-quick-buttons">
                  <button type="button" onClick={() => handleSetDefaultReturnDate(14)}>
                    +14 днів
                  </button>
                  <button type="button" onClick={() => handleSetDefaultReturnDate(30)}>
                    +30 днів
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Примітки</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Додаткова інформація (необов'язково)"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Скасувати
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Обробка...' : 'Видати книгу'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueBook;
