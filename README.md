# 🛍️ GrabDesk - Personalized Online Store

**GrabDesk** is a MERN-stack web application that provides users with a personalized online shopping experience.  
The platform recommends products based on user preferences, browsing history, and purchase behavior — giving every user a unique shopping journey.

---

## Features

### 👤 User Module
- Sign up, log in, and manage profile  
- View order history and wishlist  
- Secure JWT-based authentication  

### 🛒 Shopping Module
- Browse products by category  
- Advanced search and filtering  
- Add to cart and checkout  
- Real-time cart updates  

### 💡 Recommendation Engine
- Personalized recommendations based on:
  - Browsing and purchase history  
  - Product similarity  
  - Trending and popular items  

### ⚙️ Admin Module
- Add, update, or delete products  
- Manage orders and users  
- View sales and traffic analytics  

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Redux/Context API, Tailwind CSS / Material UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT / Google OAuth |
| **Hosting** | Vercel (Frontend), Render / Node Server (Backend), MongoDB Atlas |

---

## Folder Structure

├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── App.js
│ └── package.json
├── server/ # Express Backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── server.js
├── .env
├── package.json
└── README.md


---

## ⚡ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/grabdesk.git
   cd grabdesk
   ```

2. **Install Dependencies**
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Set up environment variables**
Create a `.env` file in ./server folder and add:
    ```bash
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    PORT=5000
    ```

4. **Run Development Server**
# In one terminal for backend
cd server
npm run dev

# In another terminal for frontend
cd client
npm start

## Future Enhancements

AI-driven recommendation engine (TensorFlow.js / ML model)
Voice-based product search
Advanced analytics dashboard for admins
Real-time order tracking

