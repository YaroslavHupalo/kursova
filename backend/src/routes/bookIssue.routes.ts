import { Router } from 'express';
import {
  createBookIssue,
  getAllBookIssues,
  getBookIssueById,
  updateBookIssue,
  returnBook,
  deleteBookIssue,
  getActiveIssues,
  getOverdueIssues,
  getHistory,
  getStatistics,
  searchBookIssues
} from '../controllers/bookIssue.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/book-issues - Create new book issue
router.post('/', createBookIssue);

// GET /api/book-issues - Get all book issues
router.get('/', getAllBookIssues);

// GET /api/book-issues/active - Get active issues
router.get('/active', getActiveIssues);

// GET /api/book-issues/overdue - Get overdue issues
router.get('/overdue', getOverdueIssues);

// GET /api/book-issues/history - Get returned books history
router.get('/history', getHistory);

// GET /api/book-issues/statistics - Get statistics
router.get('/statistics', getStatistics);

// GET /api/book-issues/search - Search book issues
router.get('/search', searchBookIssues);

// GET /api/book-issues/:id - Get single book issue
router.get('/:id', getBookIssueById);

// PUT /api/book-issues/:id - Update book issue
router.put('/:id', updateBookIssue);

// PUT /api/book-issues/:id/return - Return book
router.put('/:id/return', returnBook);

// DELETE /api/book-issues/:id - Delete book issue
router.delete('/:id', deleteBookIssue);

export default router;
