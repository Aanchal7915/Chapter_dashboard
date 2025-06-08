# Chapter Dashboard API

This is a RESTful API built using Node.js, Express.js, MongoDB, and Redis. It is designed to serve a Chapter Performance Dashboard with features like filtering, pagination, file upload, caching, and rate limiting.

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Caching & Rate Limiting**: Redis
- **File Upload**: Multer

---

## 📁 Features

### ✅ RESTful API Endpoints

#### `GET /api/v1/chapters`
- Returns all chapters.
- Supports the following filters:
  - `class`
  - `unit`
  - `subject`
  - `status`
  - `weakChapters` (boolean)
- Supports pagination:
  - `page`
  - `limit`
- Returns total number of chapters.

#### `GET /api/v1/chapters/:id`
- Returns a specific chapter by ID.

#### `POST /api/v1/chapters`
- Admin-only route.
- Allows uploading chapters from a `.json` file.
- Parses the file and validates each chapter against the schema.
- Saves all valid chapters to the database.
- Returns any chapters that failed schema validation.

---

## 📂 Chapter Upload Logic

- Upload a JSON file containing an array of chapters.
- Uses Multer to handle file uploads.
- Validates each chapter individually.
- Partially valid uploads are allowed — invalid entries are reported in the response.
- Cache is invalidated on successful upload.

---

## ⚙️ Redis Integration

### Caching
- The results of `GET /api/v1/chapters` are cached for **1 hour**.
- Cache is invalidated when a new chapter is uploaded.

### Rate Limiting
- Each IP is limited to **30 requests per minute**.
- Rate limiting is implemented using Redis.

---

## 🚀 Deployment

- The app deployed to:
  - Render
  - AWS EC2
- GitHub Actions workflow file added for CI/CD (bonus)

---

## 🧪 Postman Collection

A public Postman collection is available and includes:
- All API routes
- Sample request bodies
- Pre-populated data for testing

> 📌 [Postman Collection Link](#) — *Add your link here*

---

## 📁 Mock Data

> A mock JSON file containing sample chapters is provided for testing purposes. You can upload this via Postman or any frontend form using `multipart/form-data`.

---

## ✨ Author

Created with ❤️ by [Aanchal](https://github.com/Aanchal7915)
