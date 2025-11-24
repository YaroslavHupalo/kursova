import { Response } from 'express';
import BookIssue from '../models/BookIssue.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Generate unique 8-digit ID
const generateIssueId = async (): Promise<string> => {
  let issueId: string;
  let exists = true;

  while (exists) {
    // Generate 8-digit number
    issueId = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    // Check if it already exists
    const existingIssue = await BookIssue.findOne({ issueId });
    exists = !!existingIssue;
  }

  return issueId!;
};

// Update status based on return date
const updateStatus = (issue: any) => {
  if (issue.actualReturnDate) {
    return 'returned';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const returnDate = new Date(issue.returnDate);
  returnDate.setHours(0, 0, 0, 0);
  
  return returnDate < today ? 'overdue' : 'active';
};

// Create new book issue
export const createBookIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      lastName,
      firstName,
      middleName,
      rank,
      department,
      bookTitle,
      issueDate,
      returnDate,
      notes
    } = req.body;

    // Generate unique issue ID
    const issueId = await generateIssueId();

    // Create book issue
    const bookIssue = await BookIssue.create({
      issueId,
      lastName,
      firstName,
      middleName,
      rank,
      department,
      bookTitle,
      issueDate: issueDate || new Date(),
      returnDate,
      notes,
      createdBy: req.user!.id,
      status: 'active'
    });

    res.status(201).json({
      message: 'Book issued successfully',
      bookIssue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get all book issues
export const getAllBookIssues = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const issues = await BookIssue.find().sort({ createdAt: -1 });
    
    // Update statuses
    const updatedIssues = issues.map((issue: any) => {
      const issueObj = issue.toObject();
      (issueObj as any).status = updateStatus(issueObj);
      return issueObj;
    });

    res.json({ bookIssues: updatedIssues, total: updatedIssues.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get active issues
export const getActiveIssues = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const issues = await BookIssue.find({ 
      actualReturnDate: null 
    }).sort({ returnDate: 1 });

    const updatedIssues = issues.map((issue: any) => {
      const issueObj = issue.toObject();
      (issueObj as any).status = updateStatus(issueObj);
      return issueObj;
    });

    res.json({ bookIssues: updatedIssues, total: updatedIssues.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get overdue issues
export const getOverdueIssues = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const issues = await BookIssue.find({
      actualReturnDate: null,
      returnDate: { $lt: today }
    }).sort({ returnDate: 1 });

    const overdueIssues = issues.map((issue: any) => {
      const issueObj = issue.toObject();
      (issueObj as any).status = 'overdue';
      
      // Calculate days overdue
      const daysOverdue = Math.floor(
        (today.getTime() - new Date(issue.returnDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      (issueObj as any).daysOverdue = daysOverdue;
      
      return issueObj;
    });

    res.json({ bookIssues: overdueIssues, total: overdueIssues.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get history (returned books)
export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const issues = await BookIssue.find({
      actualReturnDate: { $ne: null }
    }).sort({ actualReturnDate: -1 });

    res.json({ bookIssues: issues, total: issues.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get single book issue
export const getBookIssueById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const issue = await BookIssue.findById(id);
    
    if (!issue) {
      res.status(404).json({ message: 'Book issue not found' });
      return;
    }

    const issueObj = issue.toObject();
    (issueObj as any).status = updateStatus(issueObj);

    res.json({ bookIssue: issueObj });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update book issue
export const updateBookIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const issue = await BookIssue.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!issue) {
      res.status(404).json({ message: 'Book issue not found' });
      return;
    }

    res.json({ message: 'Book issue updated successfully', bookIssue: issue });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Return book
export const returnBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const issue = await BookIssue.findByIdAndUpdate(
      id,
      {
        actualReturnDate: new Date(),
        status: 'returned',
        notes: notes || ''
      },
      { new: true }
    );

    if (!issue) {
      res.status(404).json({ message: 'Book issue not found' });
      return;
    }

    res.json({ message: 'Book returned successfully', bookIssue: issue });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete book issue
export const deleteBookIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const issue = await BookIssue.findByIdAndDelete(id);

    if (!issue) {
      res.status(404).json({ message: 'Book issue not found' });
      return;
    }

    res.json({ message: 'Book issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Search book issues
export const searchBookIssues = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, field } = req.query;

    if (!query) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    let searchCriteria: any = {};

    if (field && typeof field === 'string') {
      searchCriteria[field] = { $regex: query, $options: 'i' };
    } else {
      searchCriteria = {
        $or: [
          { issueId: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { firstName: { $regex: query, $options: 'i' } },
          { middleName: { $regex: query, $options: 'i' } },
          { bookTitle: { $regex: query, $options: 'i' } },
          { department: { $regex: query, $options: 'i' } }
        ]
      };
    }

    const issues = await BookIssue.find(searchCriteria).sort({ createdAt: -1 });

    const updatedIssues = issues.map((issue: any) => {
      const issueObj = issue.toObject();
      (issueObj as any).status = updateStatus(issueObj);
      return issueObj;
    });

    res.json({ bookIssues: updatedIssues, total: updatedIssues.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get statistics
export const getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalIssues = await BookIssue.countDocuments();
    const activeIssues = await BookIssue.countDocuments({ actualReturnDate: null });
    const returnedIssues = await BookIssue.countDocuments({ actualReturnDate: { $ne: null } });
    const overdueIssues = await BookIssue.countDocuments({
      actualReturnDate: null,
      returnDate: { $lt: today }
    });

    // Popular books
    const popularBooks = await BookIssue.aggregate([
      {
        $group: {
          _id: '$bookTitle',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // By department
    const byDepartment = await BookIssue.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      statistics: {
        totalIssues,
        activeIssues,
        returnedIssues,
        overdueIssues,
        popularBooks,
        byDepartment
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
