# 🛡️ User Management API

A secure and scalable **Node.js + Express** backend for managing user profiles, including:

- ✅ JWT-based Authentication
- ✅ Role-Based Authorization (Admin/User)
- ✅ Profile Picture Upload (Multer)
- ✅ Input Validations using Joi
- ✅ Centralized Logging using Winston
- ✅ API Documentation via Swagger
- ✅ Pagination for listing users
- ✅ Postman Collection for testing
- ✅ MongoDB Integration with Mongoose

---

## 🧰 Technologies Used

| Tech              | Purpose                          |
|------------------|----------------------------------|
| **Express**       | Web server and routing           |
| **MongoDB + Mongoose** | Data storage & schema modeling   |
| **JWT**           | Authentication & Authorization  |
| **Multer**        | File upload middleware           |
| **Joi**           | Schema-based request validation  |
| **Winston**       | Logging of errors and events     |
| **Swagger**       | API documentation (via `/api-docs`) |
| **dotenv**        | Environment variable management  |
| **helmet, cors, express-rate-limit** | Security & request protection |
| **bcryptjs**      | Password hashing                 |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Manikanta1413/user-profile-management.git
cd user-profile-management
# 🛡️ User Profile Management

A secure and scalable **Node.js + Express** backend for managing user profiles, including:

- ✅ JWT-based Authentication
- ✅ Role-Based Authorization (Admin/User)
- ✅ Profile Picture Upload (Multer)
- ✅ Input Validations using Joi
- ✅ Centralized Logging using Winston
- ✅ API Documentation via Swagger
- ✅ Pagination for listing users
- ✅ Postman Collection for testing
- ✅ MongoDB Integration with Mongoose

---

## 🧰 Technologies Used

| Tech              | Purpose                          |
|------------------|----------------------------------|
| **Express**       | Web server and routing           |
| **MongoDB + Mongoose** | Data storage & schema modeling   |
| **JWT**           | Authentication & Authorization  |
| **Multer**        | File upload middleware           |
| **Joi**           | Schema-based request validation  |
| **Winston**       | Logging of errors and events     |
| **Swagger**       | API documentation (via `/api-docs`) |
| **dotenv**        | Environment variable management  |
| **helmet, cors, express-rate-limit** | Security & request protection |
| **bcryptjs**      | Password hashing                 |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Manikanta1413/user-profile-management.git
cd user-profile-management
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a .env file at the root with the following values:
PORT=3000
MONGO_URI=mongodb://localhost:27017/userdb
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
NODE_ENV=development
ROOT_USER=admin
ROOT_USER_EMAIL=admin@example.com
ROOT_USER_PASSWORD=securepassword

### 4️⃣ Start the Server
```bash
# For development
npm run dev

# For production
npm start
```
Server runs at: http://localhost:3000


### 🧾 Swagger API Docs
📍 Access Swagger at: http://localhost:3000/api-docs

Describes all routes, request/response formats, and headers
Helpful for front-end integration and testing


### 🧾 Logging with Winston
All errors, request failures, and server events are logged using Winston
Logs are written to logs/error.log and logs/combined.log
Different log levels: info, error, warn, etc.


### 📂 File Uploads
Uses Multer to handle image uploads
Stored locally in /uploads/
File can be previewed or accessed via:
http://localhost:3000/uploads/<filename>


### 📦 Postman Collection
🔗 You can import the collection file postman_collection.json located in the root folder into Postman to test all routes easily.
Includes:
Auth routes
User management
Headers pre-filled for JWT access


### 📁 API Endpoints Overview
### 🔐 Auth Routes
| Method | Endpoint             | Description                  | Access             |
| ------ | -------------------- | ---------------------------- | ------------------ |
| POST   | `/api/auth/register` | Register a new user          | Public             |
| POST   | `/api/auth/login`    | Login and receive token      | Public             |
| POST   | `/api/auth/logout`   | Logout (clears token/cookie) | Public/Client-side |


### 👤 User Routes
| Method | Endpoint                         | Description                     | Access      |
| ------ | -------------------------------- | ------------------------------- | ----------- |
| GET    | `/api/users/`                    | Get all users (with pagination) | Admin       |
| GET    | `/api/users/:id`                 | Get user by ID                  | Admin, Self |
| POST   | `/api/users/`                    | Create new user                 | Admin       |
| PUT    | `/api/users/:id`                 | Update user info                | Admin, Self |
| PUT    | `/api/users/:id/profile-picture` | Upload/update profile picture   | Admin, Self |
| DELETE | `/api/users/:id`                 | Delete a user                   | Admin       |





