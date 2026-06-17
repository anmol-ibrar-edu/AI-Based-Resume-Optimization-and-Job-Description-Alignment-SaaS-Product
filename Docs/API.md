# 🔌 API Documentation

Complete API reference for the AI Resume Optimizer application.

## API Overview

**Base URL:** `http://localhost:8000/api/v1`

**Authentication:** Bearer Token (JWT)

**Content-Type:** `application/json` (unless uploading files)

**Interactive Docs:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /auth/login/json
    Backend->>Database: Verify user + password (Argon2)
    Database-->>Backend: User record
    Backend->>Backend: Generate JWT (HS256, 24h)
    Backend-->>Frontend: {access_token, token_type}
    Frontend->>Frontend: Store in localStorage
    Frontend-->>User: Redirect to /upload
```

---

## 🔐 Authentication Endpoints

### Register User
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "full_name": "John Doe",
    "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "is_verified": false,
    "created_at": "2026-01-01T00:00:00"
}
```

**Errors:**
- `400` - Email already registered
- `422` - Validation error

---

### Login (JSON) — Used by Frontend
```
POST /api/v1/auth/login/json
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
}
```

**Errors:**
- `401` - Incorrect email or password
- `400` - Account is inactive

---

### Login (Form Data) — OAuth2 Compatible
```
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```
username=user@example.com&password=SecurePassword123
```

**Response (200):** Same as Login (JSON)

---

### Verify Email
```
GET /api/v1/auth/verify-email?token=<token>
```

**Response (200):**
```json
{
    "message": "Email verified successfully"
}
```

---

### Resend Verification
```
POST /api/v1/auth/resend-verification
```

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

---

### Forgot Password
```
POST /api/v1/auth/forgot-password
```

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

---

### Reset Password
```
POST /api/v1/auth/reset-password
```

**Request Body:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "new_password": "NewSecurePassword123"
}
```

---

## 👤 User Endpoints

All user endpoints require: `Authorization: Bearer <token>`

### Get Current User
```
GET /api/v1/users/me
```

**Response (200):**
```json
{
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "is_verified": false,
    "last_login": "2026-01-01T12:00:00",
    "created_at": "2026-01-01T00:00:00"
}
```

---

### Update User
```
PUT /api/v1/users/me
```

**Request Body:**
```json
{
    "full_name": "John Updated"
}
```

---

### Get User Statistics
```
GET /api/v1/users/me/stats
```

**Response (200):**
```json
{
    "total_resumes": 5,
    "total_analyses": 12,
    "average_score": 78.5
}
```

---

## 📄 Resume Endpoints

### Upload Resume
```
POST /api/v1/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
- `file`: PDF or DOCX file (max 5MB)

**Response (200):**
```json
{
    "id": 1,
    "filename": "my_resume.pdf",
    "file_type": "pdf",
    "file_size": 245678,
    "skills": ["Python", "React", "PostgreSQL"],
    "upload_date": "2026-01-01T12:00:00",
    "is_valid": true,
    "validation_message": "Valid resume"
}
```

**Errors:**
- `400` - Invalid file type (only PDF/DOCX accepted)
- `400` - File too large (max 5MB)
- `400` - Not a valid resume (rejected by resume_validator.py — must have contact info, work experience)
- `422` - File processing error

---

### Get All Resumes
```
GET /api/v1/resume/
Authorization: Bearer <token>
```

**Response (200):**
```json
[
    {
        "id": 1,
        "filename": "resume_v1.pdf",
        "file_type": "pdf",
        "upload_date": "2026-01-01T12:00:00"
    }
]
```

---

### Get Resume by ID
```
GET /api/v1/resume/{id}
Authorization: Bearer <token>
```

---

### Delete Resume
```
DELETE /api/v1/resume/{id}
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## 💼 Job Description Endpoints

### Create Job Description
```
POST /api/v1/job/
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "Remote",
    "raw_text": "We are looking for an experienced software engineer with Python, React, and PostgreSQL skills..."
}
```

**Response (200):**
```json
{
    "id": 1,
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "Remote",
    "required_skills": ["Python", "React", "PostgreSQL"],
    "keywords": ["agile", "CI/CD", "microservices"],
    "created_date": "2026-01-01T12:00:00"
}
```

---

### Get All Job Descriptions
```
GET /api/v1/job/
Authorization: Bearer <token>
```

---

### Get Job by ID
```
GET /api/v1/job/{id}
Authorization: Bearer <token>
```

---

### Delete Job Description
```
DELETE /api/v1/job/{id}
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## 📊 Analysis Endpoints

### Run ATS Analysis
```
POST /api/v1/analysis/analyze
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "resume_id": 1,
    "job_id": 1
}
```

**Response (201):**
```json
{
    "id": 1,
    "ats_score": 82.5,
    "score_breakdown": {
        "skills_score": 85,
        "keywords_score": 78,
        "experience_score": 82,
        "format_score": 90,
        "achievements_score": 75
    },
    "matched_skills": ["Python", "React", "PostgreSQL"],
    "missing_skills": ["Docker", "Kubernetes"],
    "extra_skills": ["MongoDB", "Vue.js"],
    "matched_keywords": ["agile", "CI/CD"],
    "missing_keywords": ["microservices"],
    "recommendations": [
        {
            "priority": "high",
            "category": "skills",
            "message": "Add Docker experience",
            "details": "Docker is listed as a required skill"
        }
    ],
    "original_summary": "Experienced developer with 5 years...",
    "improved_summary": null,
    "created_at": "2026-01-01T12:00:00"
}
```

---

### Get Analysis History
```
GET /api/v1/analysis/?limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
[
    {
        "id": 1,
        "resume_filename": "my_resume.pdf",
        "job_title": "Senior Software Engineer",
        "ats_score": 82.5,
        "created_at": "2026-01-01T12:00:00"
    }
]
```

---

### Get Analysis by ID
```
GET /api/v1/analysis/{id}
Authorization: Bearer <token>
```

---

### Delete Analysis
```
DELETE /api/v1/analysis/{id}
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## 📈 Dashboard Endpoints

### Get Dashboard Statistics
```
GET /api/v1/dashboard/stats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "total_analyses": 12,
    "average_score": 78.5,
    "best_score": 92.0,
    "improvement": 15.5,
    "recent_analyses": [
        {
            "id": 12,
            "ats_score": 85.0,
            "job_title": "Senior Developer",
            "created_date": "2026-01-01T12:00:00"
        }
    ]
}
```

---

## 🎯 Career Analysis Endpoints

### Analyze Career Fit
```
POST /api/v1/career/analyze
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "resume_id": 1
}
```

**Response (200):**
```json
{
    "best_fit": {
        "career_title": "Backend Developer",
        "match_percentage": 91.5,
        "field": "Software Engineering",
        "alternate_titles": ["API Developer", "Server-side Engineer"],
        "matched_skills": ["Python", "FastAPI", "PostgreSQL"],
        "missing_skills": ["Go", "gRPC"],
        "experience_level": "Mid-Senior",
        "salary_range": "$80,000 - $130,000",
        "market_demand": "Very High",
        "growth_rate": "25%",
        "description": "Develops server-side logic and APIs",
        "match_category": "Excellent Match",
        "recommendations": ["Add system design experience", "Learn containerization"]
    },
    "eligible_careers": [...],
    "eligible_fields": [
        {
            "field": "Software Engineering",
            "description": "...",
            "matching_careers": ["Backend Developer", "Full Stack Developer"],
            "total_careers_in_field": 8
        }
    ],
    "future_careers": [...],
    "skills_summary": {},
    "market_insights": {},
    "overall_profile": {}
}
```

**Errors:**
- `404` - Resume not found
- `400` - Resume has no extracted text (re-upload required)

---

### Get All Career Fields
```
GET /api/v1/career/fields
```

**Response (200):** List of all career field names

---

### Get All Career Titles
```
GET /api/v1/career/careers
```

**Response (200):**
```json
[
    {
        "title": "Backend Developer",
        "field": "Software Engineering",
        "market_demand": "Very High",
        "required_skills_count": 8
    }
]
```

---

## ⭐ Reviews Endpoints

### Create a Review
```
POST /api/v1/reviews/
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "content": "This app helped me get a job!",
    "rating": 5
}
```

**Response (201):**
```json
{
    "id": 1,
    "user_id": 1,
    "user_name": "John Doe",
    "content": "This app helped me get a job!",
    "rating": 5,
    "is_visible": false,
    "created_at": "2026-01-01T12:00:00"
}
```

---

### Get Public Reviews
```
GET /api/v1/reviews/public
```

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "user_name": "John Doe",
        "content": "This app helped me get a job!",
        "rating": 5,
        "is_visible": true,
        "created_at": "2026-01-01T12:00:00"
    }
]
```

---

## 🛡️ Admin Endpoints

All Admin endpoints require an Admin-level `Authorization: Bearer <token>`.

### Get All Users
```
GET /api/v1/admin/users
Authorization: Bearer <token>
```

### Get All Reviews
```
GET /api/v1/admin/reviews
Authorization: Bearer <token>
```

### Approve/Reject Review
```
PATCH /api/v1/admin/reviews/{review_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "is_visible": true
}
```

---

## 🔧 System Endpoints

### Health Check
```
GET /health
```

**Response (200):**
```json
{
    "status": "healthy",
    "database": "PostgreSQL connected"
}
```

---

### Root Endpoint
```
GET /
```

**Response (200):**
```json
{
    "app": "AI Resume Optimizer",
    "version": "1.0.0",
    "status": "running",
    "database": "PostgreSQL",
    "docs": "/docs"
}
```

---

## 🔐 Authentication Headers

All protected endpoints require the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Details:**
- Algorithm: `HS256`
- Expiry: `24 hours (1440 minutes)`
- Stored in: `localStorage` on the frontend

---

## 📋 Error Responses

### Common Error Format
```json
{
    "detail": "Error message here"
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (Delete success) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error (Pydantic) |
| 500 | Server Error |

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","full_name":"Test User","password":"Test123456"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

### Upload Resume
```bash
curl -X POST http://localhost:8000/api/v1/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/resume.pdf"
```

### Run Analysis
```bash
curl -X POST http://localhost:8000/api/v1/analysis/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resume_id":1,"job_id":1}'
```

### Analyze Career
```bash
curl -X POST http://localhost:8000/api/v1/career/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resume_id":1}'
```

---

## 🔄 API Flow Diagram

```mermaid
flowchart TD
    A[User] --> B[Register/Login]
    B --> C{Authenticated?}
    C -->|No| B
    C -->|Yes| D[Upload Resume]
    D --> E{Valid Resume?}
    E -->|No| F[Error: Not a valid resume]
    E -->|Yes| G[Create Job Description]
    G --> H[Run ATS Analysis]
    H --> I[View Results Page]
    I --> J[Dashboard History]
    D --> K[Run Career Analysis]
    K --> L[View Career Recommendations]
```

---

**Note:** All protected endpoints return `401 Unauthorized` if the token is missing or invalid. The frontend automatically redirects to `/login` on `401` responses.
