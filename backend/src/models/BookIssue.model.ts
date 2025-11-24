import mongoose, { Document, Schema } from 'mongoose';

export interface IBookIssue extends Document {
  issueId: string; // 8-значний унікальний ID
  lastName: string;
  firstName: string;
  middleName: string;
  rank: string; // звання
  department: string; // підрозділ
  bookTitle: string;
  issueDate: Date;
  returnDate: Date;
  actualReturnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookIssueSchema = new Schema<IBookIssue>(
  {
    issueId: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 8
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    middleName: {
      type: String,
      required: [true, 'Middle name is required'],
      trim: true
    },
    rank: {
      type: String,
      required: [true, 'Rank is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    bookTitle: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
      default: Date.now
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required']
    },
    actualReturnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue'],
      default: 'active'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries (issueId already has a unique index above)
BookIssueSchema.index({ status: 1 });
BookIssueSchema.index({ lastName: 1, firstName: 1 });
BookIssueSchema.index({ returnDate: 1 });

export default mongoose.model<IBookIssue>('BookIssue', BookIssueSchema);
