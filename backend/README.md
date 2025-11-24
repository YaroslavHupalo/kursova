# Military Institute Library Backend

Backend API for the Military Institute Library management system.

## Technologies
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- JWT Authentication

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new librarian
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile (protected)

### Book Issues
- `POST /api/book-issues` - Create new book issue
- `GET /api/book-issues` - Get all book issues
- `GET /api/book-issues/active` - Get active issues
- `GET /api/book-issues/overdue` - Get overdue issues
- `GET /api/book-issues/history` - Get history
- `GET /api/book-issues/statistics` - Get statistics
- `GET /api/book-issues/search?query=...` - Search issues
- `GET /api/book-issues/:id` - Get single issue
- `PUT /api/book-issues/:id` - Update issue
- `PUT /api/book-issues/:id/return` - Return book
- `DELETE /api/book-issues/:id` - Delete issue

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── bookIssue.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.model.ts
│   │   └── BookIssue.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── bookIssue.routes.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```
