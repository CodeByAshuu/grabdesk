# 🎨 Frontend Architecture Overview - GrabDesk

This document provides a detailed breakdown of the frontend architecture for **GrabDesk**, a modern MERN stack e-commerce platform.

---

## 🚀 1. Technology Stack

The frontend is built with a focus on speed, responsiveness, and a premium editorial aesthetic.

| Technology | Purpose | Key Features Used |
| :--- | :--- | :--- |
| **React (Vite)** | Core Library | Functional Components, Hooks, Context API |
| **Tailwind CSS** | Styling | Utility-first, Responsive Design, Custom Theme |
| **React Router** | Routing | Dynamic Routing, Protected Admin Routes |
| **Axios** | API Fetching | Interceptors, Custom Instance for Backend Auth |
| **Lucide React** | Iconography | Lightweight, consistent vector icons |
| **Framer Motion** | Animations | Smooth transitions, Hover effects, Micro-animations |

---

## 📂 2. Directory Structure (`client/src`)

The project follows a modular architecture to ensure scalability and maintainability.

```bash
src/
├── admin/          # Admin-only pages and dashboard components
├── api/            # Axios configuration and API helper functions
├── assets/         # Static assets (images, fonts, global styles)
├── components/     # Reusable UI components (Buttons, Cards, Modals)
├── context/        # Global State Management (Auth, Cart, Wishlist)
├── pages/          # Main application views (Home, Product, Cart)
├── utils/          # Helper functions and business logic
├── App.jsx         # Main App component with routing setup
└── main.jsx        # Entry point of the React application
```

---

## 🛠️ 3. Core Components Breakdown

### 💎 Reusable UI Elements (`/components`)
- **`ProductCard.jsx`**: The primary data visualization for a product. Handles hover effects, quick-view transitions, and navigation to details.
- **`Navbar.jsx`**: A dynamic header that changes based on authentication state (Guest vs. Logged-in) and handles search/navigation.
- **`ProtectedRoute.jsx`**: A wrapper component used to guard admin pages, redirecting unauthorized users to login.
- **`FilterPannel.jsx`**: A complex state-driven component for filtering products by category, price, and brand.

### 🛡️ Admin Dashboard (`/admin`)
- **`Dashboard.jsx`**: Comprehensive overview using charts to visualize sales and user activity.
- **`ProductManagement.jsx`**: CRUD interface for admins to manage the catalog.
- **`Bulkupload.jsx`**: specialized utility for mass-importing products via CSV.

---

## 🔄 4. State Management (Context API)

We use React Context instead of Redux to keep the bundle size small and logic simple for this use case.

1.  **`AuthContext`**: Manages the user session, token storage (localStorage), and login/logout flows.
2.  **`CartContext`**: Handles cart operations (Add, Remove, Update) and synchronizes with the database for persists sessions.
3.  **`WishlistContext`**: Stores user-saved items and provides toggles for the heart icons across the site.

---

## 🛤️ 5. Routing & Data Flow

### Navigation Flow
1.  **User enters Site**: `App.jsx` initializes routes.
2.  **Auth Check**: `main.jsx` wraps everything in `AuthContextProvider`.
3.  **Dynamic Rendering**: Based on the URL, React Router renders the specific page from `/pages`.

### API Interaction (Example: Fetching Products)
1.  **Page (`Product.jsx`)** calls an API util function.
2.  **Axios Instance (`api/api.js`)** attaches the JWT token from `localStorage` to the header automatically.
3.  **Response Handling**: Data is saved to local component state (`useState`) or global context.
4.  **UI Updates**: The UI re-renders based on the new data.

---

## ✨ 6. Design System & Aesthetics

### Color Palette
- **Primary**: Sleek Dark Blue/Black (#12284C) for a premium feel.
- **Secondary**: Neutral warm tones and whites for editorial clarity.
- **Accent**: Subtle gold or vibrant blue for CTA buttons.

### UI Principles
- **Minimalism**: Plenty of whitespace to focus on product imagery.
- **Editorial Feel**: High-quality typography (Inter/Outfit) and large hero sections.
- **Micro-animations**: Smooth hover transitions on every interactive element.

---

## 📈 7. Performance Optimization

- **Lazy Loading**: Admin sections are loaded only when requested.
- **Component Reuse**: Buttons and Inputs are standardized to ensure consistent CSS delivery.
- **Image Optimization**: Images are served via Cloudinary URLs with auto-formatting for speed.

---

Developed by the GrabDesk Team.
