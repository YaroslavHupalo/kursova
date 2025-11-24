# 📚 Бібліотека Військового Інституту

Веб-додаток для управління бібліотекою військового інституту.

## Технології

### Frontend
- React.js 18
- TypeScript
- SCSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- JWT Authentication
- Mongoose

## Встановлення та запуск

### 1. Клонування проекту
```bash
git clone <repository-url>
cd kursova_lib
```

### 2. Backend

#### Встановлення залежностей
```bash
cd backend
npm install
```

#### Налаштування MongoDB Atlas
1. Створіть обліковий запис на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Створіть новий кластер
3. Отримайте connection string
4. Створіть файл `.env` у папці `backend`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

#### Створення першого користувача (бібліотекаря)
Використайте POST запит до `/api/auth/register`:
```json
{
  "username": "librarian",
  "password": "password123",
  "fullName": "Іван Петрович Сидоренко"
}
```

Або використайте цей curl команду:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"librarian\",\"password\":\"password123\",\"fullName\":\"Іван Петрович Сидоренко\"}"
```

#### Запуск backend сервера
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Сервер буде доступний на `http://localhost:5000`

### 3. Frontend

#### Встановлення залежностей
```bash
cd frontend
npm install
```

#### Налаштування
Файл `.env` вже створений з правильними налаштуваннями:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Запуск frontend додатку
```bash
npm start
```

Додаток буде доступний на `http://localhost:3000`

## Функціонал

### Авторизація
- Вхід бібліотекаря в систему
- JWT токени для безпеки

### Головна панель (Dashboard)
- Загальна статистика видач
- Найближчі терміни повернення
- Швидкі дії
- Топ популярних книг

### Видача книги
- Форма з полями:
  - Прізвище, Ім'я, По батькові
  - Звання
  - Підрозділ
  - Назва книги
  - Дата видачі та повернення
  - Примітки
- Автоматична генерація 8-значного унікального ID

### Активні видачі
- Таблиця всіх виданих книг
- Пошук за різними полями
- Статуси (активна, прострочено)
- Кнопка повернення книги

### Прострочені книги
- Список книг з простроченим терміном повернення
- Кількість днів прострочення
- Можливість повернути книгу

### Історія
- Архів усіх повернутих книг
- Пошук
- Статуси (вчасно/прострочено)

### Статистика
- Загальна статистика
- Топ-10 популярних книг
- Статистика по підрозділах
- Графіки та прогрес-бари

## Структура проекту

```
kursova_lib/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── bookIssue.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.model.ts
│   │   │   └── BookIssue.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── bookIssue.routes.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.tsx
    │   │   ├── Layout.scss
    │   │   └── ProtectedRoute.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── IssueBook.tsx
    │   │   ├── ActiveIssues.tsx
    │   │   ├── OverdueIssues.tsx
    │   │   ├── History.tsx
    │   │   └── Statistics.tsx
    │   ├── services/
    │   │   ├── api.ts
    │   │   ├── auth.service.ts
    │   │   └── bookIssue.service.ts
    │   ├── App.tsx
    │   └── index.tsx
    ├── package.json
    └── .env
```

## API Endpoints

### Авторизація
- `POST /api/auth/register` - Реєстрація бібліотекаря
- `POST /api/auth/login` - Вхід
- `GET /api/auth/profile` - Профіль користувача (захищено)

### Видачі книг
- `POST /api/book-issues` - Створити нову видачу
- `GET /api/book-issues` - Отримати всі видачі
- `GET /api/book-issues/active` - Активні видачі
- `GET /api/book-issues/overdue` - Прострочені видачі
- `GET /api/book-issues/history` - Історія
- `GET /api/book-issues/statistics` - Статистика
- `GET /api/book-issues/search?query=...` - Пошук
- `GET /api/book-issues/:id` - Отримати видачу за ID
- `PUT /api/book-issues/:id` - Оновити видачу
- `PUT /api/book-issues/:id/return` - Повернути книгу
- `DELETE /api/book-issues/:id` - Видалити видачу

## Деплой на хостинг

### Backend (Render / Railway)

#### Render.com
1. Зареєструйтеся на [Render](https://render.com)
2. Створіть новий Web Service
3. Підключіть GitHub репозиторій
4. Налаштування:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment Variables: додайте всі змінні з `.env`

#### Railway.app
1. Зареєструйтеся на [Railway](https://railway.app)
2. Створіть новий проект
3. Додайте MongoDB plugin або використайте Atlas
4. Додайте environment variables
5. Deploy з GitHub

### Frontend (Vercel / Netlify)

#### Vercel
1. Зареєструйтеся на [Vercel](https://vercel.com)
2. Import Git Repository
3. Налаштування:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Environment Variables:
   - `REACT_APP_API_URL` - URL вашого backend

#### Netlify
1. Зареєструйтеся на [Netlify](https://netlify.com)
2. New site from Git
3. Налаштування:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
4. Environment variables: `REACT_APP_API_URL`

## Тестування

### Тестовий користувач
```
Username: librarian
Password: password123
```

### Тестові дані
Після входу створіть кілька тестових видач для демонстрації функціоналу.

## Автор
Курсова робота з дисципліни «Веб-технології та веб-дизайн»

## Ліцензія
ISC
