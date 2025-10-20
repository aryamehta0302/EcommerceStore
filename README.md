# 🛍️ TrendMart — Full MERN Stack E-Commerce Platform

![Node](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-Vite-blue?logo=react)
![Express](https://img.shields.io/badge/Express.js-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-featured e-commerce store built using the **MERN Stack** (MongoDB, Express, React, Node.js) with modern responsive UI, admin dashboard, dark mode, live search, and more.

---

## 🚀 Features

### 🧾 General
- Responsive design (mobile + tablet + desktop)
- Light/Dark mode toggle with persistent preference
- Product catalog with search, pagination & filters
- User authentication & JWT-based sessions
- Add to cart, checkout, and order summary system
- Review & rating system per product
- Payment options: **UPI / Card / Cash on Delivery**
- Admin Dashboard: manage users, products, orders

### 🧠 Tech Stack
**Frontend:** React (Vite), Bootstrap 5, Axios, Toastify  
**Backend:** Node.js, Express.js, Mongoose, JWT, bcrypt  
**Database:** MongoDB Atlas  
**Deployment:** Render (backend), Vercel (frontend)

---

## 🧩 Folder Structure

```
EcommerceStore/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── uploads/
│   ├── package.json
│   └── .env (not committed)
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── .env (not committed)
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend `.env`
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=<your_secret>
NODE_ENV=production
PORT=5000
```

### Frontend `.env`
```
VITE_API_BASE_URL=https://ecommerce-backend.onrender.com
```

---

## 🧱 Installation (Local Setup)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/aryamehta0302/EcommerceStore.git
cd EcommerceStore
```

### 2️⃣ Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Run Development Servers
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

### 4️⃣ Build Frontend (Production)
```bash
cd frontend
npm run build
```

---

## ☁️ Deployment

### 🔹 Backend (Render)
- Root Directory → `backend`
- Start Command → `npm start`
- Environment Variables → `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`

### 🔹 Frontend (Vercel)
- Root Directory → `frontend`
- Build Command → `npm run build`
- Output Directory → `dist`
- Environment Variable → `VITE_API_BASE_URL`

---

## 👨‍💻 Author

**Arya Mehta**  
[GitHub](https://github.com/aryamehta0302)

---

## 📜 License
This project is licensed under the MIT License.
