# 🏗️ Architecture Documentation

## 🌟 How the System Works (In Plain English)

Think of this system as a highly organized factory with three main departments:
1. **The Storefront (Frontend):** This is the website the user sees. It's built with React. It collects the resume and job description and shows the beautiful graphs and tips at the end.
2. **The Processing Plant (Backend):** Built with Python and FastAPI. It does all the heavy lifting. When a user uploads a resume, the backend receives it, extracts the text, scores it, and generates tips.
3. **The Storage Vault (Database):** A PostgreSQL database that remembers users, their past resumes, and their previous scores so they can log back in and see their history.

## 🛠️ High-Level System Architecture

```mermaid
flowchart LR
    subgraph Frontend["💻 Frontend (React + Vite)"]
        A1[User Interface]
        A2[File Upload]
        A3[Results Display]
        A4[Career Analysis]
    end

    subgraph Backend["⚙️ Backend (FastAPI + Python)"]
        B1[API Endpoints]
        B2[ML Extraction & Scoring]
        B3[Authentication]
    end

    subgraph Database["🗄️ Database (PostgreSQL)"]
        C1[Users]
        C2[Resumes]
        C3[Job Descriptions]
        C4[Analyses History]
    end

    Frontend <-->|Sends Files & Requests| Backend
    Backend <-->|Saves & Retrieves Data| Database
```

## 🔄 The User Journey (Request Flow)

Here is exactly what happens behind the scenes when you click "Analyze":

```mermaid
sequenceDiagram
    participant U as You (User)
    participant F as Frontend
    participant B as Backend
    participant ML as ML Engine
    participant DB as Database

    U->>F: 1. Upload Resume
    F->>B: 2. Send File
    B->>ML: 3. Is it a real resume?
    ML-->>B: Yes, it's valid!
    B->>ML: 4. Extract text & skills
    ML-->>B: Found [Python, React]
    B->>DB: 5. Save Resume to Vault
    
    U->>F: 6. Paste Job Description
    F->>B: 7. Send Job Text
    B->>ML: 8. Extract job requirements
    ML-->>B: Needs [Python, AWS]
    
    U->>F: 9. Click "Analyze"
    F->>B: 10. Run Match
    B->>ML: 11. Calculate Score
    Note over ML: Strict Scoring:<br/>Matches: Python.<br/>Missing: AWS.
    ML-->>B: Score: 75%
    B->>DB: 12. Save Analysis
    B-->>F: 13. Send final data
    F-->>U: 14. Show Beautiful Dashboard!
```

## Technology Stack

### Backend Technologies
- **Python 3.11+**
- **FastAPI** (async web framework)
- **PostgreSQL** (database)
- **SQLAlchemy 2.0** (ORM)
- **Alembic** (migrations)
- **spaCy** (NLP processing)
- **scikit-learn** (TF-IDF + cosine similarity)
- **Argon2** (password hashing via passlib)
- **JWT** (authentication via python-jose)
- **PyMuPDF** (PDF parsing)
- **python-docx** (DOCX parsing)
- **Optional**: OpenAI, Google Generative AI (for enhanced parsing)

### Frontend Technologies
- **React 18+**
- **Vite 5** (build tool)
- **Tailwind CSS 3** (utility-first styling with Dark Mode support)
- **React Context API** (Theme + Auth state management)
- **Axios** (HTTP client)
- **React Router v6** (client-side routing)
- **Lucide React** (icon library)
- **Framer Motion** (high-fidelity animations)
- **Recharts** (data visualization)

### DevOps & Tools
- **Docker & Docker Compose**
- **Nginx** (reverse proxy for production)
- **Alembic** (database migrations)
- **Pytest** (backend testing)

---

## Backend Architecture

### Directory Structure

```
backend/
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Docker configuration
├── .env                         # Environment variables (not committed)
├── .env.example                 # Example env file
│
└── app/
    ├── __init__.py
    ├── main.py                  # FastAPI application entry point
    ├── config.py                # Settings via pydantic-settings
    │
    ├── api/                     # API Routes & Dependencies
    │   ├── __init__.py
    │   ├── deps.py              # Dependency injection (auth, db session)
    │   └── v1/                  # API Version 1
    │       ├── __init__.py
    │       ├── router.py        # Main API router (aggregates all routes)
    │       ├── auth.py          # /auth/register, /auth/login, /auth/verify-email
    │       ├── users.py         # GET/PUT /users/me, GET /users/me/stats
    │       ├── resume.py        # POST /resume/upload, GET/DELETE /resume/{id}
    │       ├── job.py           # POST/GET/DELETE /job/
    │       ├── analysis.py      # POST /analysis/analyze, GET /analysis/
    │       ├── dashboard.py     # GET /dashboard/stats
    │       ├── career.py        # POST /career/analyze, GET /career/fields, /career/careers
    │       ├── reviews.py       # POST /reviews/, GET /reviews/public
    │       └── admin.py         # GET /admin/users, GET /admin/reviews, PATCH /admin/reviews/{id}
    │
    ├── core/                    # Core functionality
    │   ├── __init__.py
    │   └── security.py          # JWT tokens, Argon2 password hashing/verification
    │
    ├── db/                      # Database configuration
    │   ├── __init__.py
    │   ├── base.py              # SQLAlchemy Base class + TimestampMixin
    │   └── database.py          # Engine creation + get_db session factory
    │
    ├── models/                  # SQLAlchemy ORM Models
    │   ├── __init__.py          # Exports all models
    │   ├── user.py              # User (id, email, hashed_password, role, is_verified)
    │   ├── resume.py            # Resume (id, user_id, filename, raw_text, skills)
    │   ├── job.py               # JobDescription (id, user_id, title, required_skills)
    │   ├── analysis.py          # Analysis (id, ats_score, recommendations)
    │   └── review.py            # Review (id, user_id, content, rating, is_visible)
    │
    ├── schemas/                 # Pydantic Schemas (Request/Response validation)
    │   ├── __init__.py          # Exports all schemas
    │   ├── user.py              # UserCreate, UserResponse, UserUpdate
    │   ├── token.py             # Token, LoginRequest
    │   ├── resume.py            # ResumeResponse
    │   ├── job.py               # JobCreate, JobResponse
    │   ├── analysis.py          # AnalysisRequest, AnalysisResponse, AnalysisHistory
    │   ├── dashboard.py         # DashboardStats
    │   └── career.py            # CareerAnalyzeRequest, CareerAnalysisResponse, CareerMatchSchema, FieldMatch
    │
    ├── ml/                      # Machine Learning Components
    │   ├── __init__.py
    │   ├── resume_parser.py     # Extract text & parse resumes from PDF/DOCX using PyMuPDF & python-docx
    │   ├── resume_validator.py  # STRICT validation — rejects non-resumes
    │   ├── jd_parser.py         # Parse job descriptions & extract requirements
    │   ├── jd_validator.py      # Validate job description content
    │   ├── scorer.py            # ATS scoring engine (TF-IDF + cosine similarity)
    │   ├── recommender.py       # Generate personalized resume recommendations
    │   ├── skills_database.py   # Comprehensive skills database + find_skills_in_text()
    │   ├── career_analyzer.py   # Career path analysis & best-fit matching
    │   ├── career_database.py   # CAREER_DATABASE & CAREER_FIELDS constant data
    │   └── ai_generator.py      # Optional AI-enhanced text generation (OpenAI/Gemini)
    │
    └── utils/                   # Utility functions
        ├── __init__.py
        └── file_handler.py      # File I/O helpers
```

### ML Components Detail

#### Resume Validator (`resume_validator.py`)
- **Purpose**: Strict validation to ensure only real resumes are processed
- **Checks**: Email presence, phone number, work experience section, education section, professional titles, action verbs
- **Returns**: Confidence score, is_valid boolean, and list of issues

#### ATS Scorer (`scorer.py`)
- **Purpose**: Calculate ATS compatibility scores between resume and job description
- **Algorithm**: TF-IDF vectorization + cosine similarity for semantic matching
- **Score Components**:

| Component | Weight |
|-----------|--------|
| Skills Match | 40% |
| Keywords Match | 25% |
| Experience Match | 20% |
| Format & Structure | 10% |
| Achievements | 5% |

> **v2.0 Refinement**: The engine now performs **Semantic Merging** between 'Missing Skills' and 'Missing Keywords' on the frontend to ensure 100% data transparency and prevent empty states in the analysis report.

#### Career Analyzer (`career_analyzer.py`)
- **Purpose**: Match resume against a database of career paths
- **Features**: Best-fit career, eligible careers list, field-level grouping, future career suggestions
- **Data Source**: `career_database.py` — 100+ careers across multiple fields

#### Skills Database (`skills_database.py`)
- **Purpose**: Comprehensive database of technical and soft skills
- **Features**: `find_skills_in_text()` — extracts known skills from any text block

#### JD Validator (`jd_validator.py`)
- **Purpose**: Validate that submitted text is actually a job description
- **Returns**: Validation result and parsed JD structure

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── index.jsx                   # React entry point
├── index.css                   # Global styles & Tailwind CSS imports
├── App.jsx                     # Root component — BrowserRouter, AuthProvider, all Routes
│
├── pages/                      # Page-level Components
│   ├── HomePage.jsx            # Landing page with hero, features, stats
│   ├── LoginPage.jsx           # User login form
│   ├── SignupPage.jsx          # User registration form
│   ├── UploadPage.jsx          # Resume upload + job description input + analyze
│   ├── ResultsPage.jsx         # Full analysis results display
│   ├── DashboardPage.jsx       # Analysis history & user dashboard
│   └── CareerAnalysisPage.jsx  # Career path analysis & recommendations
│
├── components/
│   ├── common/
│   │   ├── Navbar.jsx          # Top navigation with dark/light toggle
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── AnimatedCounter.jsx
│   │   └── CustomerReviews.jsx
│   ├── upload/                 # Upload-related sub-components
│   └── results/                # Results display sub-components
│
├── context/
│   ├── AuthContext.jsx         # Auth state (user, token, login/logout)
│   └── ThemeContext.jsx        # Dark/Light mode toggle
│
└── services/
    └── api.jsx                 # Axios instance + all API call methods
```

### App Routing (`App.jsx`)

| Path | Component | Protected |
|------|-----------|-----------|
| `/` | HomePage | No |
| `/login` | LoginPage | No |
| `/signup` | SignupPage | No |
| `/upload` | UploadPage | Yes |
| `/results/:id` | ResultsPage | Yes |
| `/dashboard` | DashboardPage | Yes |

> **Note**: The `CareerAnalysisPage` is fully integrated and accessible via the `/career` route.

---

## API Endpoints Summary

### Base URL: `http://localhost:8000/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login (form data) |
| POST | `/auth/login/json` | No | Login (JSON) |
| GET | `/users/me` | Yes | Get current user profile |
| PUT | `/users/me` | Yes | Update user info |
| GET | `/users/me/stats` | Yes | Get user statistics |
| POST | `/resume/upload` | Yes | Upload resume (PDF/DOCX, max 5MB) |
| GET | `/resume/` | Yes | Get all resumes |
| GET | `/resume/{id}` | Yes | Get resume by ID |
| DELETE | `/resume/{id}` | Yes | Delete resume |
| POST | `/job/` | Yes | Create job description |
| GET | `/job/` | Yes | Get all job descriptions |
| GET | `/job/{id}` | Yes | Get job by ID |
| DELETE | `/job/{id}` | Yes | Delete job description |
| POST | `/analysis/analyze` | Yes | Run ATS analysis |
| GET | `/analysis/` | Yes | Get analysis history |
| GET | `/analysis/{id}` | Yes | Get analysis by ID |
| DELETE | `/analysis/{id}` | Yes | Delete analysis |
| GET | `/dashboard/stats` | Yes | Get dashboard statistics |
| POST | `/career/analyze` | Yes | Analyze career fit from resume |
| GET | `/career/fields` | No | List all career fields |
| GET | `/career/careers` | No | List all career titles |
| GET | `/health` | No | Health check |
| GET | `/` | No | API info |

---

## Security Features

- **Password Hashing**: Argon2 algorithm (via `passlib`)
- **JWT Authentication**: HS256, 24-hour expiry
- **CORS Protection**: Configurable allowed origins via `.env`
- **Input Validation**: Pydantic schemas on all endpoints
- **File Validation**: PDF/DOCX only, max 5MB enforced
- **Resume Validation**: Strict content validation via `resume_validator.py`
- **SQL Injection Protection**: SQLAlchemy ORM prevents raw SQL injection

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://postgres:password123@localhost:5432/resume_optimizer
SECRET_KEY=your-super-secret-key-change-this-in-production-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:80
UPLOAD_DIR=uploads/resumes
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=pdf,docx

# Optional AI APIs
OPENAI_API_KEY=
GOOGLE_API_KEY=
AI_SERVICE_PREFERRED=local
USE_AI_PARSING=False
ENABLE_OCR=False
```

---

## Deployment & Production Architecture

The application is fully containerized and ready for modern deployment platforms.

### 🐳 Google Cloud VPS (Production)
- **Backend & Database**: Designed to be deployed on a VPS like **Google Cloud**.
  - The `docker-compose.yml` spins up the PostgreSQL database and FastAPI backend.
  - The backend communicates with the database over the Docker network.
- **Frontend & Domain**: A custom domain (`www.ai-resume-optimizer.store`) is managed via **Hostinger**, pointing to the Google Cloud server.

*(Live App: https://www.ai-resume-optimizer.store/)*

### 💻 Development Mode
- **Backend**: `uvicorn app.main:app --reload` → `http://localhost:8000`
- **Frontend**: `npm run dev` → `http://localhost:5173`
- **Database**: Local PostgreSQL or Docker container

**This document reflects the exact state of the codebase and is kept up-to-date with all features.**
