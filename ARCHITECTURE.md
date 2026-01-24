# 🏗️ Architecture Documentation

## Project Overview

This is an AI-powered Resume Optimization and Job Description Alignment SaaS application that uses machine learning to optimize resumes, calculate ATS scores, and provide personalized recommendations.

## System Architecture

```mermaid
flowchart LR
    subgraph Frontend["Frontend (React)"]
        A1[User Interface]
        A2[File Upload]
        A3[Results Display]
    end

    subgraph Backend["Backend (FastAPI)"]
        B1[API Endpoints]
        B2[ML Processing]
        B3[Authentication]
    end

    subgraph Database["Database (PostgreSQL)"]
        C1[Users]
        C2[Resumes]
        C3[Job Descriptions]
        C4[Analyses]
    end

    Frontend <-->|HTTP/REST| Backend
    Backend <-->|SQLAlchemy| Database
```

## Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant ML as ML Engine
    participant DB as Database

    U->>F: Upload Resume
    F->>B: POST /resume/upload
    B->>ML: Validate Resume
    ML-->>B: Validation Result
    B->>DB: Save Resume
    DB-->>B: Resume ID
    B-->>F: Success Response
    
    U->>F: Enter Job Description
    F->>B: POST /job/
    B->>ML: Parse JD & Extract Skills
    ML-->>B: Parsed Data
    B->>DB: Save Job Description
    DB-->>B: Job ID
    B-->>F: Success Response
    
    U->>F: Click Analyze
    F->>B: POST /analysis/analyze
    B->>DB: Get Resume & Job Data
    DB-->>B: Data
    B->>ML: Calculate ATS Score
    ML-->>B: Score & Recommendations
    B->>DB: Save Analysis
    B-->>F: Analysis Results
    F-->>U: Display Results
```

## Technology Stack

### Backend Technologies
- Python 3.11+
- FastAPI (async web framework)
- PostgreSQL (database)
- SQLAlchemy (ORM)
- spaCy (NLP processing)
- scikit-learn (TF-IDF + cosine similarity)
- Argon2 (password hashing)
- JWT (authentication)
- Optional: OpenAI, Google Generative AI

### Frontend Technologies
- React.js 18+
- Vite (build tool)
- Tailwind CSS 3+
- Axios (HTTP client)
- React Router v6
- Lucide React (icons)
- Recharts (charts)

### DevOps & Tools
- Docker & Docker Compose
- Nginx (reverse proxy)
- Alembic (database migrations)
- Pytest (testing)

---

## Backend Architecture

### Directory Structure

```
backend/app/
├── __init__.py
├── main.py                 # FastAPI application entry point
├── config.py               # Application configuration & settings
│
├── api/                    # API Routes & Dependencies
│   ├── __init__.py
│   ├── deps.py             # Dependency injection (auth, database)
│   └── v1/                 # API Version 1
│       ├── __init__.py
│       ├── router.py       # Main API router
│       ├── auth.py         # Authentication endpoints
│       ├── users.py        # User management endpoints
│       ├── resume.py       # Resume upload & management
│       ├── job.py          # Job description endpoints
│       ├── analysis.py     # Analysis endpoints
│       └── dashboard.py    # Dashboard statistics
│
├── core/                   # Core functionality
│   ├── __init__.py
│   └── security.py         # JWT tokens, Argon2 password hashing
│
├── db/                     # Database configuration
│   ├── __init__.py
│   ├── base.py             # SQLAlchemy Base & mixins
│   └── database.py         # Database session & engine
│
├── models/                 # SQLAlchemy ORM Models
│   ├── __init__.py
│   ├── user.py             # User model
│   ├── resume.py           # Resume model
│   ├── job.py              # JobDescription model
│   └── analysis.py         # Analysis model
│
├── schemas/                # Pydantic Schemas (Request/Response)
│   ├── __init__.py
│   ├── user.py             # User schemas
│   ├── token.py            # Token schemas
│   ├── resume.py           # Resume schemas
│   ├── job.py              # Job schemas
│   ├── analysis.py         # Analysis schemas
│   └── dashboard.py        # Dashboard schemas
│
├── ml/                     # Machine Learning Components
│   ├── __init__.py
│   ├── resume_parser.py    # Extract text & parse resumes (PDF/DOCX)
│   ├── resume_validator.py # STRICT validation - rejects non-resumes
│   ├── jd_parser.py        # Parse job descriptions
│   ├── scorer.py           # ATS scoring engine (TF-IDF + cosine similarity)
│   ├── recommender.py      # Generate personalized recommendations
│   └── skills_database.py  # Comprehensive skills database
│
└── utils/                  # Utility functions
    ├── __init__.py
    └── file_handler.py     # File operations
```

### ML Components Detail

#### Resume Validator (`resume_validator.py`)
- **Purpose**: Strict validation to ensure only real resumes are processed
- **Features**:
  - Checks for email, phone, work experience sections
  - Validates professional titles and action verbs
  - Returns confidence score and detailed issues
  - Rejects random documents, images, or non-resume content

#### ATS Scorer (`scorer.py`)
- **Purpose**: Calculate ATS compatibility scores
- **Algorithm**:
  - TF-IDF vectorization for semantic similarity
  - Cosine similarity for text comparison
  - Skills matching (exact + partial)
  - Keywords analysis
  - Format and achievements scoring
- **Score Components**:
  - Skills Score (40% weight)
  - Keywords Score (25% weight)
  - Experience Score (20% weight)
  - Format Score (10% weight)
  - Achievements Score (5% weight)

#### Skills Database (`skills_database.py`)
- **Purpose**: Comprehensive database of technical and soft skills
- **Categories**: Programming, frameworks, databases, cloud, DevOps, etc.
- **Features**: Skill normalization, synonym mapping

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── index.jsx               # React application entry point
├── index.css               # Global styles & Tailwind imports
├── App.jsx                 # Main app component with routing
│
├── pages/                  # Page Components
│   ├── HomePage.jsx        # Landing page
│   ├── LoginPage.jsx       # User login
│   ├── SignupPage.jsx      # User registration
│   ├── UploadPage.jsx      # Resume upload & job input
│   ├── ResultsPage.jsx     # Analysis results display
│   └── DashboardPage.jsx   # User dashboard with history
│
├── components/             # Reusable Components (14 components)
│   ├── common/             # Common UI components
│   ├── upload/             # Upload-related components
│   └── results/            # Results display components
│
├── context/                # React Context
│   └── AuthContext.jsx     # Authentication state management
│
└── services/               # API Services
    └── api.jsx             # Axios instance & API methods
```

---

## API Endpoints

### Base URL: `http://localhost:8000/api/v1`

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login (form data) |
| POST | `/auth/login/json` | No | Login (JSON) |

### User Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | Yes | Get current user |
| PUT | `/users/me` | Yes | Update user info |

### Resume Operations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/resume/upload` | Yes | Upload resume (PDF/DOCX) |
| GET | `/resume/` | Yes | Get all user resumes |
| GET | `/resume/{id}` | Yes | Get resume by ID |
| DELETE | `/resume/{id}` | Yes | Delete resume |

### Job Descriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/job/` | Yes | Create job description |
| GET | `/job/` | Yes | Get all job descriptions |
| GET | `/job/{id}` | Yes | Get job by ID |
| DELETE | `/job/{id}` | Yes | Delete job |

### Analysis
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/analysis/analyze` | Yes | Run ATS analysis |
| GET | `/analysis/` | Yes | Get analysis history |
| GET | `/analysis/{id}` | Yes | Get analysis by ID |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/stats` | Yes | Get dashboard statistics |

---

## Data Flow

### Resume Analysis Flow

```
1. User uploads resume (UploadPage)
   → POST /resume/upload
   → ResumeValidator.validate() - STRICT check
   → If invalid: Return error with issues
   → If valid: resume_parser.py extracts text
   → Returns resume_id

2. User enters job description (UploadPage)
   → POST /job/
   → jd_parser.py extracts skills & keywords
   → Returns job_id

3. User clicks "Analyze" (UploadPage)
   → POST /analysis/analyze (resume_id, job_id)
   → Backend:
     a. Loads resume & job data
     b. ATSScorer.calculate_score()
     c. Recommender.generate_recommendations()
     d. Saves analysis to database
   → Returns analysis_id
   → Frontend redirects to /results/{id}

4. Results displayed (ResultsPage)
   → GET /analysis/{id}
   → Display score, skills, recommendations
```

---

## Security Features

- **Password Hashing**: Argon2 algorithm
- **JWT Authentication**: HS256, 24-hour expiry
- **CORS Protection**: Configured origins
- **Input Validation**: Pydantic schemas
- **File Validation**: PDF/DOCX only, max 5MB
- **Resume Validation**: Strict content validation
- **SQL Injection Protection**: SQLAlchemy ORM

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password123@localhost:5432/resume_optimizer
SECRET_KEY=your-super-secret-key
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Optional AI APIs
```env
OPENAI_API_KEY=your-openai-key
GOOGLE_API_KEY=your-google-key
```

---

## Deployment Architecture

### Development
- Backend: `uvicorn app.main:app --reload` (port 8000)
- Frontend: `npm run dev` (port 5173)
- Database: Local PostgreSQL

### Production (Docker)
- Backend container: FastAPI + Uvicorn
- Frontend container: Nginx serving built React app
- Database container: PostgreSQL
- All connected via Docker network

---

## Key Dependencies

### Backend (`requirements.txt`)
```
# Core
fastapi==0.110.0
uvicorn[standard]==0.27.1

# Database
sqlalchemy==2.0.25
psycopg2-binary==2.9.9

# Authentication
python-jose[cryptography]==3.3.0
passlib[argon2,bcrypt]==1.7.4

# AI/NLP
spacy==3.7.4
scikit-learn==1.4.0
numpy==1.26.4

# Optional
openai>=1.0.0
google-generativeai>=0.3.0
```

### Frontend (`package.json`)
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0",
  "recharts": "^2.10.3",
  "tailwindcss": "^3.3.6"
}
```

---

**This document provides complete architecture understanding for developers and AI agents working on this project.**
