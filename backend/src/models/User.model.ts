import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  fullName: string;
  role: 'librarian';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    role: {
      type: String,
      enum: ['librarian'],
      default: 'librarian'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>('User', UserSchema);
