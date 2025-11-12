# GrabDesk – Personalized Online Store

GrabDesk is a full-stack e-commerce web application built using the MERN stack.  
It offers a personalized shopping experience by recommending products based on user preferences, browsing history, and purchase patterns.  
The platform integrates standard e-commerce functionalities such as authentication, product management, cart operations, and checkout flow, along with a recommendation engine for improved user engagement.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Installation and Setup](#installation-and-setup)
6. [Future Enhancements](#future-enhancements)
7. [License](#license)

---

## Overview

GrabDesk enables users to browse, search, and purchase products through an intuitive and responsive interface.  
The platform includes both user-facing and administrative functionalities.  
Users receive dynamic product recommendations generated from interaction data, enhancing the overall shopping experience.

---

## Features

### User Module
- User registration and authentication (JWT-based security)
- Profile management and order history tracking
- Wishlist and saved items functionality

### Shopping Module
- Product listing with advanced search and filtering options
- Product details view with reviews and related items
- Cart management and secure checkout
- Real-time cart updates and order confirmation

### Recommendation Engine
- Personalized product suggestions based on:
  - Browsing and purchase history
  - Product similarity and category tags
  - Trending and popular items among users

### Admin Module
- Add, update, or remove products from the catalog
- Manage user accounts and orders
- Access analytical dashboards for sales and activity tracking

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js, Tailwind CSS or Material UI, Motion, Framer |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose), Supabase |
| **Authentication** | JSON Web Token (JWT), bcrypt |
| **Hosting / Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## Folder Structure

```bash
├── client/ # React Frontend
│ ├── src/
│ │ ├── admin/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.js
│ └── package.json
├── server/ # Express Backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Installation and Setup

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
   ```bash
   cd server
   node server.js
   cd ../client
   npm run dev
   ```

## Future Enhancements

- AI-driven recommendation engine (TensorFlow.js / ML model)
- Voice-based product search
- Advanced analytics dashboard for admins
- Real-time order tracking

## License

This project is licensed under the <b>MIT License</b>.
You are free to use, modify, and distribute this project for both personal and commercial purposes.

---

Author: Sagar, Harshit, Banisha</br>
Project: GrabDesk - Personalized Online Shopping Platform.</br>
Stack: MERN (MongoDB, Express.js, React.js, Node.js) , Tailwind CSS.</br>

