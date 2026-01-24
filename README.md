# AI-Powered Resume Optimization and Job Description Alignment SaaS Application

A comprehensive SaaS platform that uses artificial intelligence to optimize resumes and align them with job descriptions. The application provides resume parsing, job description analysis, ATS (Applicant Tracking System) scoring, skill matching, and personalized recommendations to help job seekers improve their applications.

## 🏗️ Project Architecture

### Overview
This is a full-stack web application built with modern technologies:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ - User Interface│    │ - API Endpoints │    │ - User Data     │
│ - File Upload   │    │ - ML Processing │    │ - Resumes       │
│ - Results Display│   │ - Authentication│    │ - Job Descriptions│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Components

#### Backend (FastAPI)
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with Argon2 password hashing
- **File Processing**: PDF and DOCX parsing with PyMuPDF and python-docx
- **AI/ML**: spaCy for NLP, scikit-learn for similarity matching, TF-IDF vectorization
- **Resume Validation**: Strict resume validation to ensure only real resumes are accepted
- **ATS Scoring**: Comprehensive scoring engine with skills, keywords, achievements, and format analysis
- **Optional AI**: OpenAI and Google Generative AI integration for enhanced parsing
- **API Documentation**: Automatic OpenAPI/Swagger docs

#### Frontend (React)
- **Framework**: React 18 with Vite build tool
- **Styling**: Tailwind CSS for responsive design
- **HTTP Client**: Axios for API communication
- **Charts**: Recharts for data visualization
- **Routing**: React Router for navigation
- **Icons**: Lucide React for icons

#### ML Components
```
backend/app/ml/
├── resume_parser.py      # Extract text & parse resumes from PDF/DOCX
├── resume_validator.py   # STRICT validation - only accepts real resumes
├── jd_parser.py          # Parse job descriptions & extract requirements
├── scorer.py             # ATS scoring engine with TF-IDF + cosine similarity
├── recommender.py        # Generate personalized recommendations
└── skills_database.py    # Comprehensive skills database for matching
```

#### Database Schema
```
users
├── id (Primary Key)
├── email (Unique)
├── hashed_password (Argon2)
├── full_name
├── is_active
├── is_verified
└── last_login

resumes
├── id (Primary Key)
├── user_id (Foreign Key)
├── filename
├── file_content
├── parsed_text
├── skills_extracted
└── upload_date

job_descriptions
├── id (Primary Key)
├── user_id (Foreign Key)
├── title
├── company
├── description
├── requirements
├── skills_required
└── created_date

analyses
├── id (Primary Key)
├── user_id (Foreign Key)
├── resume_id (Foreign Key)
├── job_id (Foreign Key)
├── ats_score
├── score_breakdown
├── matching_skills
├── missing_skills
├── recommendations
└── created_date
```

## 🚀 Quick Start

### Prerequisites

#### For All Platforms
- **Docker & Docker Compose**: Latest versions
- **Git**: For cloning the repository

#### For Local Development (Windows/Linux)
- **Python**: 3.11 or higher
- **Node.js**: 18.x or higher
- **PostgreSQL**: 15.x or higher (if not using Docker)

### Option 1: Docker Deployment (Recommended)

#### Windows/Linux Setup
```bash
# Clone the repository
git clone https://github.com/LAIBAASIM555/AI-powered-Resume-Optimization-and-Job-Description-Alignment-SaaS-Application.git
cd AI-powered-Resume-Optimization-and-Job-Description-Alignment-SaaS-Application

# Start the application
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Access Points
- **Frontend (Dev)**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📦 Dependencies

### Backend Dependencies
```
# Core
fastapi==0.110.0
uvicorn[standard]==0.27.1
pydantic==2.6.1

# Database
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1

# Authentication
python-jose[cryptography]==3.3.0
passlib[argon2,bcrypt]==1.7.4

# File Processing
pymupdf==1.23.26
python-docx==1.1.0

# AI/NLP
spacy==3.7.4
scikit-learn==1.4.0
numpy==1.26.4

# Optional AI APIs
openai>=1.0.0
google-generativeai>=0.3.0
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "axios": "^1.6.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

## 🐳 Docker Configuration

### Services
- **db**: PostgreSQL 15 Alpine
- **backend**: Python FastAPI application
- **frontend**: React application served by Nginx

### Volumes
- `postgres_data`: Persistent database storage
- `backend_uploads`: File upload storage

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key
- `DEBUG`: Debug mode flag
- `ALLOWED_ORIGINS`: CORS allowed origins

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints
- `POST /api/v1/auth/register`: User registration
- `POST /api/v1/auth/login/json`: User login (JSON)
- `POST /api/v1/resume/upload`: Upload resume (multipart/form-data)
- `POST /api/v1/job/`: Create job description
- `POST /api/v1/analysis/analyze`: Run analysis
- `GET /api/v1/dashboard/stats`: Get dashboard statistics

## 🔐 Security Features

- **Password Hashing**: Argon2 algorithm (industry standard)
- **JWT Authentication**: Secure token-based auth (HS256)
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Pydantic schemas
- **File Validation**: Only PDF/DOCX accepted (max 5MB)
- **Resume Validation**: Strict validation ensures only real resumes are processed
- **SQL Injection Protection**: SQLAlchemy ORM

## 🎯 Key Features

1. **Resume Upload & Parsing**: Upload PDF/DOCX resumes with automatic text extraction
2. **Strict Resume Validation**: Only accepts genuine resumes, rejects random documents
3. **Job Description Analysis**: Parse job postings and extract requirements
4. **ATS Scoring**: Comprehensive scoring based on:
   - Skills match (40% weight)
   - Keywords match (25% weight)
   - Experience match (20% weight)
   - Format & structure (10% weight)
   - Achievements (5% weight)
5. **Recommendations**: Personalized suggestions to improve resume
6. **Dashboard**: Track analysis history and improvement over time

## 🆘 Troubleshooting

### Common Issues

- **Docker Issues**: Run `docker system prune` to clear cache
- **Port in use**: Change ports in docker-compose.yml
- **Database connection fails**: Check DATABASE_URL
- **spaCy model not found**: Run `python -m spacy download en_core_web_sm`
- **Resume rejected**: Ensure the document is a real resume with contact info and work experience

## 📄 License

This project is licensed under the MIT License.

---

**Note**: For API access, use `http://localhost:8000` instead of `http://0.0.0.0:8000`.
