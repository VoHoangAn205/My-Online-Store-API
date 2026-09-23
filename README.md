# Full-Stack E-Commerce API (Node.js, Express, Redis, MongoDB)

A production-grade RESTful API featuring dual-token JWT authentication, Redis-backed token revocation, Multer image handling with Cloudinary, and strict API-as-the-source-of-truth architecture.

> **Frontend Repository:** [Link to frontend](https://github.com/VoHoangAn205/My-Store-Website_Frontend)  
> **Live API URL:** `https://hoangan-online-store.onrender.com`

## 🔐 Key Features & Technical Highlights
* **Dual-Token Authentication Strategy:** Uses short-lived Access Tokens stored in memory and HTTP-Only Refresh Tokens in cookies for high security against XSS.
* **Redis Token Revocation:** Implements unique JWT identifier (`jti`) stored in Redis to instantly revoke all session upon logout or reuse detection.
* **Centralized API Validation:** Express backend serve as the single source of truth for file upload, validating Multer buffers before streaming to Cloudinary.
* **Resilient Interceptor Support:** Designed to handle multi-request silent refreshes cleanly alongside client-side queuing.

---

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:**  MongoDB (Mongoose ORM)
* **In-Memory Stored:** Redis
* **File Processing:** Multer & Cloudinary
* **Hosting:** Render Web Service
---
## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=[https://your-app.vercel.app](https://your-app.vercel.app)
//These variables is used for automation send email features
EMAIL_HOST=your_host
EMAIL_PORT=your_port
EMAIL_USER=your_email
EMAIL_PASS=your_password (abcd dcba bacd cadb)
