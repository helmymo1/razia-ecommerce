# TECHNICAL REPORT

## 1. System Architecture

### Overview
This e-commerce solution is a multi-tier application consisting of three distinct components:
1.  **User Website (Frontend)**: A modern, responsive React application built with Vite and Shadcn UI.
2.  **Admin Panel**: A static HTML/JavaScript dashboard using Tailwind CSS and Alpine.js, interacting with the backend via a unified API adapter.
3.  **Backend API**: A Node.js/Express RESTful API connecting to a MySQL database, handling business logic, authentication, and data persistence.

### User Website (Frontend)
Located in: `razia user site/razia-chic-builder-main`

**Core User Flows:**
*   **Landing Page (`Index.tsx`)**: Showcases latest arrivals and featured products. 
*   **Shop (`Shop.tsx`)**: Displays product catalog with filtering capabilities (Category, Price). It fetches data via the `products` API context.
*   **Product Details (`ProductPage.tsx`)**: Shows single product information.
*   **Checkout (`Checkout.tsx`)**: Handles the order placement process, integrating with the `CartContext` to manage selected items.
*   **Authentication (`Auth.tsx`)**: Manages user login/registration, leveraging `AuthContext` to maintain session state.

**Data Binding:**
*   **Context API**: Used extensively for global state management (`AuthContext`, `CartContext`, `LanguageContext`).
*   **React Query**: Utilized for efficient server-side state management, caching, and synchronization (configured in `App.tsx`).

### Admin Panel
Located in: `eBazer/`

**Architecture:**
*   **Static Serving**: Designed to be served statically (e.g., via `http-server` or Nginx).
*   **API Layer (`assets/js/api.js`)**: A custom Axios-based adapter that unifies API calls. It supports legacy script compatibility via a global `window.api` object.
*   **Security**: implented in `assets/js/auth.js`. It uses optimisitic client-side checks (checking `localStorage`) and validates sessions with the backend (`/auth/me`).
*   **Dashboard**: `dashboard.js` fetches statistics (Sales, Orders, Revenue) and visualizes them using ApexCharts.

### Database Logic (MySQL)
Reverse-engineered from `backend/database_schema.sql` and `models/`.

**Core Schema & Relationships:**
*   **`users`**: Stores admin and customer accounts.
    *   `role`: ENUM('admin', 'customer')
*   **`products`**: Central catalog table.
    *   **FK**: `category_id` -> `categories(id)`
*   **`orders`**: Header table for transactions.
    *   **FK**: `user_id` -> `users(id)`
    *   **FK**: `coupon_id` -> `coupons(id)`
*   **`order_items`**: Line items for orders.
    *   **FK**: `order_id` -> `orders(id)`
    *   **FK**: `product_id` -> `products(id)`
*   **`categories`**: Hierarchical category structure (supports `parent_id`).

**Key Data Models:**
*   **Soft Deletes**: Implemented via `is_deleted` flag in `users`, `products`, and `coupons`.
*   **JSON Fields**: `products` table uses JSON columns for `colors` and `sizes` to store variants without a separate table.

---

## 2. Component & Logic Analysis

### Entry Points
*   **Backend**: `backend/server.js`
    *   Initializes Express app.
    *   Configures security middleware (`helmet`, `cors`).
    *   Connects to MySQL database.
    *   Mounts API routes (e.g., `/api/auth`, `/api/products`).
*   **User Site**: `razia user site/razia-chic-builder-main/src/main.tsx` (boots `App.tsx`)
    *   Sets up the React Root.
    *   Wraps app in Providers (`QueryClientProvider`, `BrowserRouter`).
*   **Admin Panel**: `eBazer/index.html` (and other `.html` files)
    *   Loads `assets/js/main.js` (UI logic) and `assets/js/api.js` (Data logic).

### State Management & Logic
*   **"Anti-Gravity" / Data Logic**:
    *   **Backend**: Uses a Controller-Service pattern. Controllers (e.g., `productController.js`) handle HTTP requests, while Models (`models/productModel.js`, inferred) or direct SQL queries in controllers manage data retrieval.
    *   **Frontend (User)**: State is split between **Client State** (Context API for Auth/Cart) and **Server State** (React Query for fetching products/orders).
    *   **Frontend (Admin)**: Uses lightweight `Alpine.js` for reactive UI components (e.g., dropdowns, modals) and raw JavaScript (Axios) for data fetching.

---

## 3. Complete File Manifest

| File Path | Primary Function | Dependencies | Status |
| :--- | :--- | :--- | :--- |
| `backend/server.js` | Backend Entry Point | Express, CORS, DB | Complete |
| `backend/config/db.js` | Database Connection | mysql2, dotenv | Complete |
| `backend/routes/*.js` | API Route Definitions | Express Router | Complete |
| `backend/controllers/*.js` | Business Logic | Models | Complete |
| `backend/database_schema.sql`| DB Schema Definition | MySQL | Complete |
| `eBazer/index.html` | Admin Dashboard UI | HTML, Alpine.js | Complete |
| `eBazer/assets/js/api.js` | Admin API Adapter | Axios | Complete |
| `eBazer/assets/js/auth.js` | Admin Auth Logic | api.js | Complete |
| `razia.../src/App.tsx` | User Site Entry | React, React Router | Complete |
| `razia.../src/pages/Shop.tsx`| Shop Page Logic | React Query | Complete |
| `razia.../src/contexts/*.tsx`| Global State | React Context | Complete |
| `run_project.ps1` | Startup Script | PowerShell | Complete |
| `backend/.env` | Environment Config | - | Complete |

*(Note: This is a high-level summary. The project contains hundreds of component and utility files.)*

---

## 4. Deployment & Env

### Environment Variables
Based on `backend/.env` and code usage:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Environment mode (development/production) |
| `PORT` | API Server Port (Default: 5000) |
| `DB_HOST` | Database Host (e.g., 127.0.0.1) |
| `DB_USER` | Database User (e.g., root) |
| `DB_PASSWORD`| Database Password |
| `DB_NAME` | Database Name (ebazer_shop) |
| `JWT_SECRET` | Secret key for signing Auth Tokens |
| `AWS_*` | AWS Credentials for S3 uploads (Placeholders found) |

### Start Scripts
Defined in `package.json`:

**Backend (`backend/`):**
*   `npm start`: Runs `node server.js` (Production start)
*   `npm run dev`: Runs `nodemon server.js` (Development with hot-reload)
*   `npm test`: Runs `jest` test suite

**User Site (`razia.../`):**
*   `npm run dev`: Starts Vite development server
*   `npm run build`: Builds the project for production

**Project Runner:**
*   `./run_project.ps1`: Orchestrates the startup of Backend and User Site.
