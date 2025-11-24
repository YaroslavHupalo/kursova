import api from './api';

export interface BookIssue {
  _id: string;
  issueId: string;
  lastName: string;
  firstName: string;
  middleName: string;
  rank: string;
  department: string;
  bookTitle: string;
  issueDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  daysOverdue?: number;
}

export interface CreateBookIssueData {
  lastName: string;
  firstName: string;
  middleName: string;
  rank: string;
  department: string;
  bookTitle: string;
  issueDate?: string;
  returnDate: string;
  notes?: string;
}

export interface Statistics {
  totalIssues: number;
  activeIssues: number;
  returnedIssues: number;
  overdueIssues: number;
  popularBooks: { _id: string; count: number }[];
  byDepartment: { _id: string; count: number }[];
}

export const bookIssueService = {
  async createIssue(data: CreateBookIssueData): Promise<{ message: string; bookIssue: BookIssue }> {
    const response = await api.post('/book-issues', data);
    return response.data;
  },

  async getAllIssues(): Promise<{ bookIssues: BookIssue[]; total: number }> {
    const response = await api.get('/book-issues');
    return response.data;
  },

  async getActiveIssues(): Promise<{ bookIssues: BookIssue[]; total: number }> {
    const response = await api.get('/book-issues/active');
    return response.data;
  },

  async getOverdueIssues(): Promise<{ bookIssues: BookIssue[]; total: number }> {
    const response = await api.get('/book-issues/overdue');
    return response.data;
  },

  async getHistory(): Promise<{ bookIssues: BookIssue[]; total: number }> {
    const response = await api.get('/book-issues/history');
    return response.data;
  },

  async getStatistics(): Promise<{ statistics: Statistics }> {
    const response = await api.get('/book-issues/statistics');
    return response.data;
  },

  async searchIssues(query: string, field?: string): Promise<{ bookIssues: BookIssue[]; total: number }> {
    const params = field ? { query, field } : { query };
    const response = await api.get('/book-issues/search', { params });
    return response.data;
  },

  async getIssueById(id: string): Promise<{ bookIssue: BookIssue }> {
    const response = await api.get(`/book-issues/${id}`);
    return response.data;
  },

  async updateIssue(id: string, data: Partial<CreateBookIssueData>): Promise<{ message: string; bookIssue: BookIssue }> {
    const response = await api.put(`/book-issues/${id}`, data);
    return response.data;
  },

  async returnBook(id: string, notes?: string): Promise<{ message: string; bookIssue: BookIssue }> {
    const response = await api.put(`/book-issues/${id}/return`, { notes });
    return response.data;
  },

  async deleteIssue(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/book-issues/${id}`);
    return response.data;
  }
};
