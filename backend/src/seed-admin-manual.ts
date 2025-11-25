import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.model';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Use the provided URI directly or from env
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://admin:AdminPass123@cluster0.6fpfacx.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const username = 'admin';
    const password = 'AdminPass123';
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. Updating password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ Admin password updated to:', password);
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        password: hashedPassword,
        fullName: 'Головний Бібліотекар',
        role: 'librarian'
      });
      console.log('✅ Admin user created successfully');
      console.log('Username:', username);
      console.log('Password:', password);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
