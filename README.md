# 🔴 Red Circle – Backend API

Red Circle is a blood donation management backend built with **Node.js**, **Express**, and **MongoDB**.
It provides **secure authentication**, **donor availability tracking**, **donor searching** based on **location** and **blood group**, **donation timing rules**, and **rate-limited APIs** to prevent abuse.

## 🚀 Features

### 🔐 JWT Authentication

- Register / Login

- Access & refresh token support

### 👤 User Management

- Profile fetch

- Profile update

- Secure protected routes

### 🩸 Blood Donation Logic

- Toggle donor availability

- Prevent invalid or early donation updates

- Track last donation date

### ⏱ Rate Limiting

- Protect sensitive routes from spamming

### 🛡 Security Best Practices

- Password hashing (bcrypt)

- Centralized error handling

- SHA-256 hashed refresh tokens in database

- Multi-device Session support

### 📦 Scalable Project Structure

- controllers, services, routes, middlewares, utils, config

## 🧱 Tech Stack

- Node.js

- Express.js

- MongoDB + Mongoose

- JWT (jsonwebtoken)

- bcrypt

## 📂 Project Structure
```
Red-Circle
└─ backend
    ├── server.js
    ├── package.json  
    ├── src/
    |   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   ├── app.js
```

Separation of concerns is strictly maintained:

- Controllers → Handle HTTP layer

- Services → Contain business logic

- Middlewares → Authentication & validation

- Models → Database schema definitions

## ⚙️ Environment Variables


> Create a `.env` file inside the **backend** folder and add the following:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_URL=add_your_mongo_db_url

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# CORS (Frontend URL - optional)
# Set this if you connect a frontend from a different origin
CLIENT_URL=http://localhost:5173

```

## 📦 Installation
```
git clone https://github.com/shazzad-hosen/red-circle.git
cd red-circle/backend/
npm install
```

## ▶️ Running the Server
```
npm run dev
```


## Server will run on:
```
http://localhost:3000/
```

## 🔑 API Overview
### Donor Search Route
| **Method** | **Endpoint** | **Description** |
|----------|-------------|-----------------|
| **GET**  | `/api/users/donors?`  | Search for a donor |

### Auth Routes
| **Method** | **Endpoint** | **Description** |
|----------|-------------|-----------------|
| **POST** | `/api/auth/register` | Register new user |
| **POST** | `/api/auth/login` | Login user |
| **POST** | `/api/auth/logout` | Logout user |
| **POST** | `/api/auth/refresh` | Refresh access token |

### User/Donor Routes (Protected)
#### 🔒 Requires Authorization: Bearer (token)

| **Method** | **Endpoint** | **Description** |
|----------|-------------|-----------------|
| **GET**   | `/api/users/me`              | Get profile |
| **PATCH** | `/api/users/me`              | Update profile | 
| **PATCH** | `/api/users/availability` | Toggle donor availability |
| **PATCH** | `/api/users/donation` | Update donation date |

## 🌐 Live API (Test)

Base URL: https://red-circle-backend.onrender.com

> ⚠️ This is a **test environment**.  
> Data may be reset at any time.

### Example: Register

```http
POST https://red-circle-backend.onrender.com/api/auth/register
```
```json
{
    "name": "John Doe",
    "email": "johndoe2026@gmail.com",
    "password": "password321",
    "bloodGroup": "AB+",
    "location": { "city": "Dhaka", "area": "Gulsan" },
    "phone": "01700000000"
}
```

## 🛡 Security Notes

- Passwords are hashed using bcrypt

- JWT stored client-side (recommended: HTTP-only cookies in production)

- Rate limiting prevents brute-force and spam attacks

- Centralized error handling using custom **ExpressError**

- SHA-256 hashed refresh tokens in database

## 📈 Future Improvements

- 🧪 Unit & integration tests (Jest)

- 📊 Admin dashboard endpoints

- 🔔 Notification system

- 🐳 Docker support

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo

2. Create a new branch

3. Commit your changes

4. Open a Pull Request

## 📜 License

This project is licensed under the **MIT License**.

## ✨ Author

**Red Circle**
Built with ❤️ to help save lives through better blood donation management.