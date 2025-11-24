# Швидкий старт проекту

## Крок 1: Встановлення Backend

```powershell
cd backend
npm install
```

## Крок 2: Налаштування MongoDB Atlas

1. Перейдіть на https://www.mongodb.com/cloud/atlas
2. Створіть обліковий запис (безкоштовний)
3. Створіть новий кластер (M0 Free tier)
4. У розділі Database Access створіть користувача з правами read/write
5. У розділі Network Access додайте IP адресу `0.0.0.0/0` (дозволити всі)
6. Натисніть "Connect" → "Connect your application"
7. Скопіюйте connection string

## Крок 3: Створення .env файлу для Backend

У папці `backend` створіть файл `.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/library?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=library_secret_key_2024_military_institute
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**Замініть** `YOUR_USERNAME`, `YOUR_PASSWORD` та `cluster0.xxxxx` на ваші дані!

## Крок 4: Запуск Backend

```powershell
cd backend
npm run dev
```

Повинні побачити:
```
🚀 Server is running on port 5000
📚 Military Institute Library API
✅ MongoDB Atlas connected successfully
```

## Крок 5: Створення першого користувача (бібліотекаря)

### Варіант А: Використання PowerShell

Відкрийте нове вікно PowerShell та виконайте:

```powershell
$body = @{
    username = "librarian"
    password = "admin123"
    fullName = "Іван Петрович Коваленко"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Варіант Б: Використання Postman

1. Встановіть Postman
2. POST запит на `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "librarian",
  "password": "admin123",
  "fullName": "Іван Петрович Коваленко"
}
```

## Крок 6: Встановлення та запуск Frontend

Відкрийте нове вікно PowerShell:

```powershell
cd frontend
npm install
npm start
```

Додаток відкриється на `http://localhost:3000`

## Крок 7: Вхід в систему

```
Логін: librarian
Пароль: admin123
```

## Готово! 🎉

Тепер ви можете:
- ✅ Видавати книги
- ✅ Переглядати активні видачі
- ✅ Відслідковувати прострочені книги
- ✅ Переглядати історію
- ✅ Аналізувати статистику

## Розв'язання проблем

### Backend не запускається
- Перевірте чи правильно налаштований MONGODB_URI
- Перевірте чи дозволено ваш IP у MongoDB Atlas Network Access

### Frontend не може з'єднатися з Backend
- Переконайтеся що Backend запущений на порту 5000
- Перевірте файл `frontend/.env`

### Помилка при авторизації
- Перевірте чи створений користувач (Крок 5)
- Перевірте логін та пароль
