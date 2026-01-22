# eBazer Project Documentation

## 1. Project Overview
**eBazer** is a comprehensive e-commerce platform featuring a modern user-facing storefront, a robust backend API, and an administrative dashboard.

### Core Architecture
- **Frontend (User Site):** React 18, Vite, TypeScript, TailwindCSS, Shadcn UI.
- **Frontend (Admin Panel):** Static HTML, Vanilla CSS/JS (Alpine.js), TailwindCSS.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL 8.0.
- **Caching:** Redis (Optional/Configured).

---

## 2. Technology Stack & Paths

| Component | Technology | Local Path | Port / Access |
|Or |Or |Or |Or |
| **User Frontend** | React + Vite | `razia user site/razia-chic-builder-main` | `http://localhost:5173` |
| **Admin Panel** | HTML + Tailwind | `eBazer` (Static Files) | Served via Backend URL or file open |
| **Backend API** | Node.js + Express | `backend` | `http://localhost:5000` |
| **Database** | MySQL | N/A | `localhost:3306` (Db: `ebazer_shop`) |

---

## 3. Deployment & Setup

### Prerequisites
- Node.js (v18+)
- MySQL Server
- Redis (Optional)

### Quick Start
Run the unified PowerShell script from the root directory to start all services:
```powershell
./run_project.ps1
```

### Manual Startup
1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **User Frontend:**
    ```bash
    cd "razia user site/razia-chic-builder-main"
    npm install
    npm run dev
    ```

---

## 4. Test Accounts & Credentials

Use these accounts to log in to both the User Site and Admin Panel/API.

| Role | Email | Password | Google/Apple |
|Or |Or |Or |Or |
| **Admin** | `admin@ebazer.com` | `123456` | N/A |
| **Customer** | `customer@example.com` | `123456` | N/A |

> **Note:** Passwords are hashed in the database using bcrypt (`$2a$10$...`).

---

## 5. Database & Seeding

### Schema Overview
The database `ebazer_shop` contains the following core tables:
- `users`: Stores user profiles and roles (`admin`, `customer`).
- `products`: Product catalog with multilingual fields (`name_en`, `name_ar`) and JSON attributes (`colors`, `sizes`).
- `categories`: Product categories hierarchy.
- `orders` & `order_items`: Transactional data.
- `product_images`: Multi-image support for products.

### Seeding Data
To populate the database with test data (Users, Categories, Products), run:
```bash
cd backend
npm run data:import
```
**Seeded Data Includes:**
- **Users:** 1 Admin, 1 Customer.
- **Categories:** Electronics, Fashion, Home & Garden.
- **Products:**
    - Classic White T-Shirt ($29.99)
    - Denim Jacket ($89.99)
    - Summer Dress ($49.99)
    - Wireless Earbuds ($129.99)
    - Smart Coffee Maker ($199.99)

---

## 6. API Documentation
**Base URL:** `http://localhost:5000/api`

### Key Endpoints
- **Auth:**
    - `POST /auth/login`: Login user.
    - `POST /auth/register`: Register new user.
    - `GET /auth/me`: Get current user profile.
- **Products:**
    - `GET /products`: List all products (supports `?search=`, `?limit=`, `?page=`).
    - `GET /products/:id`: Get single product details.
    - `POST /products`: Create product (Admin only).
- **Orders:**
    - `POST /orders`: Create new order.
    - `GET /orders`: List user orders.
- **Dashboard:**
    - `GET /dashboard/stats`: Get admin statistics.

---

## 7. Known Issues / Notes
- **Admin Panel URL:** The Admin Panel is currently a set of static HTML files in the `eBazer` folder. It is not currently served by the React frontend's router. You may need to open `eBazer/index.html` directly or configure the backend to serve it on a specific route (e.g., `/admin-panel`).
- **Auth Headers:** The API accepts both `Bearer <token>` and raw `<token>` in the `Authorization` header to support various test clients.
