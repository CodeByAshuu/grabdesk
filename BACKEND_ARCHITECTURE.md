# 🔍 Backend Architecture Overview

## 1. File-by-File Explanation
### Core System
- **`server.js`**: The **entry point** of the application. It initializes the Express app, connects to the database (`connectDB`), configures middleware (CORS, JSON parsing), sets up real-time communication (Socket.IO), and mounts route handlers. It listens on a port (default 5000) to accept incoming requests.
- **`config/db.js`**: Handles the **database connection**. It uses Mongoose to connect to the MongoDB URI specified in `.env`. It allows the app to crash gracefully (`process.exit(1)`) if the connection fails.
- **`package.json`**: The **project manifest**. It lists all dependencies (like `express`, `mongoose`, `bcryptjs`) and defines scripts (`npm run server`) to start the application.

### Models (The Content Structure)
- **`User.model.js`**: Defines what a "User" looks like in the database. Stores name, email, hashed password, role (customer/admin), and shopping data (cart, wishlist).
- **`Product.model.js`**: Defines the "Product" structure. Includes name, price, stock, SKU, category, and images. It has logic to automatically calculate `finalPrice` based on discounts before saving.
- **`AdminNotification.model.js`**: Stores logs of important actions (like "New User Registered") so admins can see them later in a notification center.

### Routes (The API Endpoints)
- **`auth.routes.js`**: Defines URLs for authentication (e.g., `/api/auth/login`, `/api/auth/signup`). It maps these URLs to specific functions in the controller.
- **`product.routes.js`**: Defines URLs for product operations. It separates public routes (viewing products) from protected admin routes (adding/deleting products).
- **`admin.routes.js`**: Likely groups other admin-specific actions.

### Controllers (The Logic Layer)
- **`auth.controller.js`**: Contains the **business logic** for users.
    - `signup`: Checks if user exists -> Hashes password -> Creates user -> Generates token.
    - `login`: Finds user -> Compares password -> Returns token.
- **`product.controller.js`**: Contains logic for products.
    - `getProducts`: Fetches products with pagination and filtering.
    - `addProduct`: Validates inputs -> Uploads images (Cloudinary) -> Saves to DB -> Notifies admins.
    - `bulkCreateProducts`: optimistically processes a large array of products for mass import.

### Middleware (The Gatekeepers)
- **`auth.middleware.js`**: A function that runs **before** protected routes. It checks for a valid JWT token in the request header. If valid, it attaches the user to the request object; otherwise, it blocks access (401 Unauthorized).

### Utilities & Shared Code
- **`utils/cloudinary.js`**: A specialized utility file that wraps the Cloudinary NodeJS SDK. It handles authentication, image optimization (resizing, format conversion), and uploads base64 strings to cloud storage.
- **`shared/constants/productConstants.js`**: A **Single Source of Truth** file. It exports arrays like `ALLOWED_CATEGORIES` and `ALLOWED_BRANDS`. By keeping these here, both the Backend (for validation) and Frontend (for dropdown menus) can theoretically share the same list, ensuring consistency.

---

## 2. Backend Dependencies (Installs)

Here is a breakdown of every package installed in the backend (`server/package.json`) and why we use it:

| Package | Purpose | Why we need it |
| :--- | :--- | :--- |
| **`express`** | Web Framework | The backbone of the server. It handles routing (`app.get`), middleware, and HTTP requests/responses. |
| **`mongoose`** | MongoDB ODM | "Object Data Modeling". It lets us define Schemas (`UserSchema`, `ProductSchema`) so we can talk to the database using structured objects instead of raw queries. |
| **`dotenv`** | Config Management | Loads variables from `.env` file into `process.env`. essential for keeping passwords and API keys secure. |
| **`cors`** | Security | "Cross-Origin Resource Sharing". Allows our Frontend (running on port 5173 or Vercel) to talk to this Backend (running on port 5000) without the browser blocking it. |
| **`bcryptjs`** | Security | Hashes passwords. It turns `secret123` into `$2a$10$Xy...` so even if the DB is stolen, user passwords are safe. |
| **`jsonwebtoken`** | Authentication | Generates "Bearer Tokens". When a user logs in, we give them a signed token. They verify their identity by sending this token in headers. |
| **`cloudinary`** | Image Storage | SDK for talking to Cloudinary service. Used to upload product images and profile pictures to the cloud instead of checking binary files into the server. |
| **`socket.io`** | Real-time | Enables two-way communication. Used for Admin Dashboards to update *instantly* when a new order comes in, without refreshing the page. |
| **`axios`** | HTTP Client | A library to make requests *from* the server *to* other servers (e.g., calling an external payment gateway or verifying a captcha). |
| **`passport`** | Auth Strategy | Middleware for handling authentication strategies. Often used as a framework for checking logins. |
| **`passport-google-oauth20`** | Social Login | Specific plugin for Passport to allow "Login with Google". |
| **`nodemon`** (dev) | Developer Tool | Restart the server automatically whenever you save a file, so you don't have to stop/start manually. |

---

## 3. Function-Level Breakdown

### `auth.controller.js` -> `signup`
- **Purpose**: Create a new user account.
- **Input**: `name`, `email`, `password`, `phone`.
- **Process**:
    1.  Validate all fields are present.
    2.  Check DB: Does email already exist? (If yes, error).
    3.  **Security**: Hash the password using `bcrypt` (adds salt so it's unreadable).
    4.  Create User in DB.
    5.  **Event**: Emit `newLog` via Socket.IO to alert admins of a new signup.
    6.  **Token**: Generate a JWT so the user is immediately logged in.
- **Output**: JSON object with user info and the JWT token.

### `product.controller.js` -> `getProducts`
- **Purpose**: Show a list of products to the user.
- **Input**: Query parameters (`pageNumber`, `keyword`).
- **Process**:
    1.  Build a **search query** (`$or` logic) to match the keyword against Name, Brand, Category, or Tags.
    2.  Count total matching documents (for pagination).
    3.  Query DB with `limit(28)` and `skip(...)` to get only the current page's data.
    4.  **Enrichment**: Adds "resolved" category paths to the data (runtime calculation).
- **Output**: JSON object with `products`, `page`, and `pages` (total pages).

### `product.controller.js` -> `addProduct` (Admin)
- **Purpose**: Add a single improved item to the store.
- **Input**: Huge object (name, price, stock, images, tags, etc.).
- **Process**:
    1.  **Strict Validation**: Checks basic fields (name, price > 0). checks Category against a rigid `ALLOWED_CATEGORIES` list.
    2.  **Normalization**: Fixes Brand casing (e.g., "apple" -> "Apple").
    3.  **SKU Generation**: Creates a unique ID like `IPH-EL-123456`.
    4.  **Image Processing**: Uploads base64 images to Cloudinary.
    5.  **Save**: Writes to MongoDB.
    6.  **Notify**: Tells all connected clients "Product Created".
- **Output**: The saved product object.

---

## 4. Data Flow Explanation

**Scenario: A User Searches for "iPhone"**
1.  **Frontend**: Sends GET request to `myserver.com/api/products?keyword=iPhone`.
2.  **Server (`server.js`)**: Receives request, passes it to `app`.
3.  **Router (`product.routes.js`)**: Matches `/api/products` and calls `product.controller.getProducts`.
4.  **Controller**:
    -   Constructs MongoDB query: `Find products where Name OR Brand OR Tags contains 'iPhone'`.
    -   Executes query via Mongoose Model (`Product.find()`).
5.  **Database**: MongoDB scans the collection (using indexes if available) and returns matching documents.
6.  **Controller**: Formats the list and sends JSON response.
7.  **Frontend**: Receives JSON and renders the product cards.

**Scenario: Admin Adds a Product**
1.  **Frontend**: Sends POST `.../api/admin/products` with Header `Authorization: Bearer <token>`.
2.  **Middleware (`auth.middleware.js`)**:
    -   Intercepts request.
    -   Decodes `<token>` -> finds User ID.
    -   Checks DB: Is this user an Admin? -> YES -> `next()`.
3.  **Controller**: Validates data, processes images, saves to DB.
4.  **Socket.IO**: Emits event `product:created`.
5.  **Real-time Clients**: Admin dashboard automatically updates existing lists without refresh.

---

## 5. Database Behavior

### Schema Concept
You are using **MongoDB (NoSQL)** with **Mongoose**. This means data is stored in flexible JSON-like documents, but Mongoose enforces a structure (Schema) at the application level to ensure data quality.

### Key Field Design
-   **`email` (User)**: `unique: true`. prevents two users from having the same email. `lowercase: true` ensures `Bob@mail.com` and `bob@mail.com` are treated as the same user.
-   **`passwordHash`**: We **never** store plain passwords. We store the result of a one-way mathematical function.
-   **`sku` (Product)**: `sparse: true`. This is clever. It means "User inputs must be unique, BUT if the field is missing (null), don't complain that null is a duplicate of another null".
-   **`tags` (Product)**: Stored as an array of objects `{type, value, weight}`. This allows complex filtering (e.g., weighing "Gaming" heavier than "Black" for recommendations).

### Queries
-   Use of `$or`: Allows flexible search across multiple fields.
-   Use of `ActivityLog.create(...)`: This is "Fire and Forget" logging. It writes history without blocking the main user action significantly.

---

## 6. Execution Flow

### Server Startup
1.  `node server.js` runs.
2.  `dotenv` loads secrets (DB URL, API Keys).
3.  `connectDB()` initiates the connection to MongoDB Cluster.
4.  `express` application is created.
5.  `socket.io` server attaches to the HTTP server.
6.  `server.listen(5000)` starts waiting.

### API Call Lifecycle (Standard)
1.  **Request**: Enters server.
2.  **Cors**: Validates origin (Development: `*` allows all).
3.  **BodyParser**: Converts JSON string body into `req.body` object (Max size 50MB for images).
4.  **Route Match**: Finds the underlying function.
5.  **Logic**: Executes controller code.
6.  **Response**: Sends JSON back.

---

## 7. Error Handling Logic

### Where do errors go?
-   **Try/Catch Blocks**: Almost every controller function is wrapped in `try { ... } catch (error) { ... }`.
-   **Catch Block**:
    -   Logs the error to the server console (for the developer).
    -   Sends a standard JSON response: `{ success: false, message: 'Server Error' }` (often 500 status).
    -   **Specific Handling**:
        -   `error.code === 11000`: Duplicate Key Error (e.g., Email already taken, SKU exists). Returns 409 Conflict.
        -   `ValidationError`: Returns 400 Bad Request with details of what field failed.

### Recovery
The server is stateless. If one request crashes (throws an exception inside a route), Express catches it (mostly), or node might restart (if using PM2, though here it might crash development process). The try/catch ensures the *process* doesn't die, just that specific request fails, letting the server stay alive for other users.

---

## 8. Performance & Safety Reasoning

### Safety
-   **Bcrypt**: Hashing passwords prevents data breaches from leaking user credentials.
-   **JWT (JSON Web Tokens)**: Stateless authentication. The server doesn't need to store "sessions" in RAM. This scales infinitely.
-   **Input Validation**: Checking `price > 0`, `allowedCategories`, etc., prevents "Garbage In, Garbage Out".

### Performance
-   **Pagination**: `pageSize = 28`. We never return *all* 1000 products at once. This protects the server memory and client bandwidth.
-   **Socket.IO Namespaces**: `/activity` is separate. This segments traffic so chat/logs don't clog up the main connection channel.
-   **Separate Image Processing**: Images are processed and sent to Cloudinary. The database only stores a text URL (string), keeping the DB light and fast.
-   **Async/Await**: Used rigorously. This ensures that while Node is waiting for MongoDB (I/O operation), it can still handle other incoming requests (Non-blocking I/O).

---

## 9. Real-World Mapping

### Scenario: "Marketing Manager launches a Summer Sale"
1.  **Login**: Manager logs in. `auth` system verifies role is 'admin'.
2.  **Bulk Upload**: Manager uploads a CSV of 50 new swimwear items.
3.  **System**:
    -   Iterates through rows.
    -   Validates data.
    -   Generates SKUs automatically `SWIM-SU-123...`.
    -   Saves to DB.
    -   **Real-time**: The inventory dashboards of the Warehouse team (also logged as admin) update *instantly* via Socket.IO events.
4.  **Activity Log**: System records "Admin Jane added 50 items".
5.  **Customer View**: A customer browsing "Fashion" sees the new items immediately because the `getProducts` query sorts by `createdAt: -1`.

---

## 10. Viva / Interview Readiness

### Q1: Why did you use `req.user = await User.findById(...)` in the middleware instead of just trusting the token?
**Answer**: "Security. A token is valid until it expires. If I ban a user *right now*, their token is still valid for 24 hours. By checking the DB in the middleware, I ensure that if a user is deleted or banned, their access is revoked immediately, not tomorrow."

### Q2: What is the purpose of the `sparse: true` index on SKU?
**Answer**: "In MongoDB, unique indexes usually treat `null` as a value. If I have two products without an SKU, a standard unique index would fail. `sparse` tells the index to only enforce uniqueness on documents that *actually have* the field, ignoring those that don't."

### Q3: Explain how your system handles concurrent product updates.
**Answer**: "Currently, it uses 'Last Write Wins'. However, `Product.findByIdAndUpdate` is atomic. If two admins hit save at the exact same millisecond, MongoDB processes them sequentially. We don't use optimistic locking (version keys) broadly yet, but the atomic nature of Mongo operations prevents database corruption, even if one user overwrites another's specific change."

### Q4: Why `createdAt: -1` in sorting?
**Answer**: "To show the freshest content first. In e-commerce, newness drives engagement. `-1` denotes Descending order (Newest to Oldest)."

### Q5: How does the system scale?
**Answer**: "Verticals are decoupled. Images are on Cloudinary (CDN), Frontend is static (React), Backend is stateless (JWT). The bottleneck is the Database, which can be clustered. The Node server can be horizontally scaled behind a load balancer because it holds no session state."

---

## 11. Detailed Code Syntax Breakdown

### 11.1. `server.js` (The Setup)
```javascript
const express = require('express');
const dotenv = require('dotenv');
```
-   **`require('...')`**: This is CommonJS syntax. It loads external libraries (installed via npm) or local files so we can use them.
-   **`dotenv.config()`**: Reads the `.env` file (where secrets like passwords live) and puts them into `process.env`. This keeps secrets out of the code.

```javascript
app.use(cors({ origin: '*', ... }));
app.use(express.json({ limit: '50mb' }));
```
-   **`app.use(...)`**: This mounts "Middleware". Think of middleware as a tunnel. Every request *must* go through `cors` (security check) and `json` (data parser) before hitting your logic.
-   **`express.json()`**: Automatically turns a raw text request body into a JavaScript object (`req.body`). Without this, you couldn't read POST data.

### 11.2. Models (e.g., `User.model.js`)
```javascript
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    // ...
}, { timestamps: true });
```
-   **`new mongoose.Schema({...})`**: This defines the "Blueprint". It tells MongoDB: "A user *must* have an email, and it must be a string."
-   **`unique: true`**: Creates a database index to prevent duplicates.
-   **`timestamps: true`**: Automatically adds `createdAt` and `updatedAt` fields. You don't have to manage dates manually.

```javascript
module.exports = User;
```
-   **`module.exports`**: This exposes what we created (`User` model) so other files (like controllers) can use it by saying `require('../models/User.model')`.

### 11.3. Controllers (e.g., `user.controller.js`)
```javascript
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) { ... }
};
```
-   **`exports.funcName = ...`**: A way to export multiple functions from one file.
-   **`async` function**: Marks this function as one that will perform slow operations (like asking the database).
-   **`await`**: Pauses this function *only* (not the whole server) until the database replies. This is critical for performance.
-   **`req` (Request)**: Contains info from the user (data sent, URL params, tokens).
-   **`res` (Response)**: The tool we use to talk back. `res.json(...)` converts our object to JSON format and sends it over the internet.
-   **Destructuring**: `const { street, city } = req.body;`. Instead of typing `req.body.street`, `req.body.city`, we extract variables directly. It's cleaner.

### 11.4. Routes (e.g., `product.routes.js`)
```javascript
const router = express.Router();
router.get('/', getProducts);
router.post('/admin/products', protect, addProduct);
```
-   **`express.Router()`**: Creates a mini-app that only handles routes. We use this to keep `server.js` clean.
-   **`router.get/post(...)`**: Tells the server: "If a user goes to this path with this HTTP method, run this function."
-   **Chaining Arguments**: notice `protect, addProduct`. This is a chain.
    1.  Run `protect` (Middleware: is user logged in?).
    2.  If `protect` says OK, run `addProduct`.
    3.  If `protect` fails, `addProduct` never runs.

### 11.5. Constants & Cloudinary Syntax

#### `shared/constants/productConstants.js`
```javascript
export const ALLOWED_CATEGORIES = ['Electronics', ...];
```
-   **`export const`**: Makes this array key available as an ES Module export.
-   **Purpose**: Single source of truth for categories.

#### `server/utils/cloudinary.js`
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    // ...
});

const result = await cloudinary.uploader.upload(base64Image, {
    folder: 'products',
    transformation: [{ width: 800, crop: 'limit' }]
});
```
-   **`uploader.upload`**: The function to send files to the cloud.
-   **`transformation`**: Optimization settings (auto-resize).
