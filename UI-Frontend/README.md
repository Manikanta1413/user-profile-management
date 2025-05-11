# 👤 User Management Frontend (React + Vite)

This is the **frontend** for the User Management System built with **React (Vite)**. It includes:

- User authentication (Login / Logout)
- Profile update with **image upload** and **preview**
- REST API integration with backend (Node.js + Express + MongoDB)
- Clean UI using **vanilla CSS**

---

## 🛠️ Tech Stack

- ✅ React (via Vite)
- ✅ React Router DOM
- ✅ Axios for API communication
- ✅ Vanilla CSS
- ✅ Image upload using input[type="file"] + `URL.createObjectURL()` preview

---

## 🚀 Features

- Login and logout functionality
- View and edit user profile
- Upload profile image with **real-time preview**
- JWT token handling with Axios headers
- Simple and clean user interface

---

## ⚙️ Project Setup

### 🧾 1. Create the Vite project

```bash
npm create vite@latest user-management-frontend --template react
cd user-management-frontend
```

### 📦 2. Install dependencies
```bash
npm install
npm install axios react-router-dom
```

### 🌐 3. Create .env file in root
```bash
VITE_API_URL=http://localhost:3000
```

### ▶️ 4. Run the development server
```bash
npm run dev
```