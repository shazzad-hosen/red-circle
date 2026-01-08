# 🔴 Red Circle – Backend API

Red Circle is a blood donation management backend built with **Node.js**, **Express**, and **MongoDB**.
It provides **secure authentication**, **donor availability tracking**, **donar searching** based on **location** and **blood group**, **donation timing rules**, and **rate-limited APIs** to prevent abuse.

## This repository contains backend only (frontend is handled separately).

## 🚀 Features

### 🔐 JWT Authentication

- Register / Login

- Access & refresh token support

### 👤 User Management

- Profile fetch

- Profile Update

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

### 📦 Scalable Project Structure

- Controllers, routes, middlewares, utils, config

## 🧱 Tech Stack

- Node.js

- Express.js

- MongoDB + Mongoose

- JWT (jsonwebtoken)

- bcrypt

- express-rate-limit

- CORS (For Client Side)

- dotenv

## 📂 Project Structure
```
Red-Circle
├─ LICENSE
├─ README.md
└─ backend
   ├─ package-lock.json
   ├─ package.json
   ├─ server.js
   └─ src
      ├─ app.js
      ├─ config
      │  ├─ db.js
      │  └─ env.js
      ├─ controllers
      │  ├─ auth.controller.js
      │  └─ user.controller.js
      ├─ middlewares
      │  ├─ auth.middleware.js
      │  ├─ error.middleware.js
      │  ├─ rateLimit.middleware.js
      │  ├─ validateLogin.middleware.js
      │  └─ validateRegister.middleware.js
      ├─ models
      │  └─ user.model.js
      ├─ routes
      │  ├─ auth.routes.js
      │  └─ user.routes.js
      └─ utils
         ├─ ExpressError.js
         ├─ asyncHandler.js
         └─ jwt.js

```

## ⚙️ Environment Variables

**Create a .env file inside the backend folder:**
```
PORT=3000
DB_URL=add_your_mongo_db_url
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
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
### Donar Search Route
| **Method** | **Endpoint** | **Description** |
|----------|-------------|-----------------|
| **GET**  | `/api/users/donors?`  | Search For a Donar |

### Auth Routes
| **Method** | **Endpoint** | **Description** |
|----------|-------------|-----------------|
| **POST** | `/api/auth/register` | Register new user |
| **POST** | `/api/auth/login` | Login user |
| **POST** | `/api/auth/logout` | Logout user |
| **POST** | `/api/auth/refresh` | Refresh access token |

### User/Donar Routes (Protected)
#### 🔒 Requires Authorization: Bearer (token)

| **Method** | **Endpoint** | **Description** |
|----------|-------------|-----------------|
| **GET**   | `/api/users/me`              | Get Profile |
| **PATCH** | `/api/users/me`              | Update Profile | 
| **PATCH** | `/api/users/availability` | Toggle donor availability |
| **PATCH** | `/api/users/donation` | Update donation date |


## 🛡 Security Notes

- Passwords are hashed using bcrypt

- JWT stored client-side (recommended: HTTP-only cookies in production)

- Rate limiting prevents brute-force and spam attacks

- Centralized error handling using custom **ExpressError**

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