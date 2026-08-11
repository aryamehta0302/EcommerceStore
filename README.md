# TrendMart — Premium Fashion E-Commerce Platform

TrendMart is a full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). It features a complete shopping experience — from browsing and wishlisting products to secure checkout and order tracking — wrapped in a custom "Or Noir" luxury boutique theme.

> Built as part of the **Dezai Learners Internship Program**.

---

## ✨ Features

### Customer Experience
- **Product Browsing** — Category-based navigation (New In, Women, Men, Sale, etc.) with keyword search
- **Product Details** — Image display, size selection (clothing sizes, footwear sizes, or "One Size" for accessories), customer reviews & ratings
- **Wishlist** — Save products for later, persisted per logged-in user
- **Shopping Cart** — Add/update/remove items with size and quantity tracking, persisted per logged-in user
- **Guest Cart Merge** — Items added while browsing as a guest automatically merge into the user's account on login/signup
- **Checkout Flow** — Shipping address (auto-filled from profile), order summary, and payment
- **Razorpay Integration** — Secure payment gateway with signature verification, plus Cash on Delivery option
- **Order Tracking** — Order history and detailed order status tracker (Pending → Processing → Shipped → Out for Delivery → Delivered)
- **Product Reviews** — Authenticated users can rate and review products (persisted to the database)
- **Authentication** — JWT-based login/register with per-user session handling

### Admin Experience
- Simplified navbar (no storefront distractions) for admin accounts
- Dashboard access for managing products and orders

### Design
- Custom **dark/light theme toggle** with a cohesive gold-accented "Or Noir" visual identity
- Fully responsive layouts across cart, wishlist, checkout, and product pages
- Smooth animations via Framer Motion (page transitions, cart updates, review submissions)

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Framer Motion (animations)
- Axios
- React Toastify (notifications)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (jsonwebtoken)
- bcryptjs (password hashing)
- Razorpay (payment gateway)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Razorpay account (test keys for payment integration)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/<your-username>/trendmart.git
   cd trendmart
```

2. **Backend setup**
```bash
   cd backend
   npm install
```

   Create a `.env` file in `backend/`:
```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=admin@example.com
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

```bash
   npm run dev
```

3. **Frontend setup**
```bash
   cd frontend
   npm install
   npm run dev
```

4. Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure
trendmart/
├── backend/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── utils/
│ │ └── api.js
│ └── index.html
└── README.md


---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `ADMIN_EMAIL` | Email used to auto-assign admin role on registration |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (backend only) |


## 🎓 Acknowledgment

This project was developed as part of the **Dezai Learners Internship Program**, focused on building practical, production-style full-stack applications using the MERN stack.

---

## 📄 License

This project is for educational purposes as part of an internship assignment.
git add .