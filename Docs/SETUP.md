# 🚀 Setup Guide

This guide explains how to set up the AI Resume Optimizer project on Windows. Two options are available: Docker (recommended for simplicity) or Local Development (recommended for active development).

---

## 📋 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Git | Any | Clone/manage repository |
| Docker Desktop | Latest | Run services in containers |
| Python | 3.11+ | Backend development |
| Node.js | 18+ | Frontend development |
| PostgreSQL | 15+ | Database (skip if using Docker) |

---

## 💻 Option 1: Docker Setup (Recommended)

### Step 1: Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop

**Verify:**
```powershell
docker --version
docker-compose --version
```

### Step 2: Clone the Repository
```powershell
git clone https://github.com/anmol-ibrar-edu/AI-Based-Resume-Optimization-and-Job-Description-Alignment-SaaS-Product.git
cd AI-Based-Resume-Optimization-and-Job-Description-Alignment-SaaS-Product
```

### Step 3: Start All Services
```powershell
# Build and start (first time or after changes)
docker-compose up -d --build

# Or just start (if already built)
docker-compose up -d
```

### Step 4: Access the Application
| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

### Stop Application
```powershell
docker-compose down
```

---

## 💻 Option 2: Local Development Setup (Windows)

### Step 1: Install Python 3.11+
Download from: https://python.org

```powershell
python --version
```

### Step 2: Install Node.js 18+
Download from: https://nodejs.org

```powershell
node --version
npm --version
```

### Step 3: Backend Setup

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### Step 4: Frontend Setup

```powershell
cd ..\frontend
npm install
```

### Step 5: Start the Database

If you don't have PostgreSQL installed locally, use Docker just for the database:

```powershell
docker run -d `
  --name resume_db `
  -p 5432:5432 `
  -e POSTGRES_DB=resume_optimizer `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=password123 `
  postgres:15-alpine
```

### Step 6: Configure Environment

The `backend/.env` file should already exist. If not, copy from `.env.example`:

```powershell
copy backend\.env.example backend\.env
```

For local development, update `DATABASE_URL` to use `localhost` instead of `db`:
```env
DATABASE_URL=postgresql://postgres:password123@localhost:5432/resume_optimizer
```

### Step 7: Start Both Servers

**Terminal 1 — Backend:**
```powershell
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm run dev
```

### Access Points (Local Dev)
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

---

## 🔧 Environment Configuration

The `backend/.env` file controls all backend settings:

```env
# Database
DATABASE_URL=postgresql://postgres:password123@localhost:5432/resume_optimizer

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Application
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:80
FRONTEND_URL=http://localhost:5173

# Email & SMTP (e.g., Hostinger, SendGrid)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=your_email@domain.com
MAIL_PASSWORD=your_email_password
MAIL_FROM=your_email@domain.com
MAIL_FROM_NAME=ResumeAI
MAIL_USE_TLS=True
MAIL_USE_STARTTLS=False

# File Upload
UPLOAD_DIR=uploads/resumes
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=pdf,docx

# Optional: AI APIs for enhanced parsing
# Leave empty to use local spaCy-based parsing (default)
OPENAI_API_KEY=
GOOGLE_API_KEY=
AI_SERVICE_PREFERRED=local
USE_AI_PARSING=False
ENABLE_OCR=False
```

> **⚠️ Important**: Never commit the actual `.env` file to version control. The `.env.example` file is committed as a template.

---

## 🐛 Troubleshooting

### Docker Issues

```powershell
# Port already in use
docker-compose down
docker-compose up -d

# Build cache issues
docker system prune -a
docker-compose up -d --build
```

### Python Issues

```powershell
# Virtual environment not activated
venv\Scripts\activate

# Missing dependencies
pip install -r requirements.txt --force-reinstall

# spaCy model missing
python -m spacy download en_core_web_sm
```

### Database Issues

```powershell
# Check if database container is running
docker ps | findstr postgres

# Connect directly to database
docker exec -it resume_db psql -U postgres -d resume_optimizer

# Test connection
curl http://localhost:8000/health
```

### Resume Rejected

The resume validator (`resume_validator.py`) strictly checks for:
- Contact information (email or phone)
- Work experience section
- Education section
- Professional language and structure

**Solution**: Ensure you are uploading a real resume, not a random document.

---

## 🎯 Quick Verification

After setup, verify the system is working:

```powershell
# Check backend health
curl http://localhost:8000/health

# Check API docs accessible
start http://localhost:8000/docs
```

Expected response from `/health`:
```json
{
    "status": "healthy",
    "database": "PostgreSQL connected"
}
```

---

## 📦 Key Dependencies

### Backend (`requirements.txt`)
```
fastapi==0.110.0
uvicorn[standard]==0.27.1
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1
python-jose[cryptography]==3.3.0
passlib[argon2,bcrypt]==1.7.4
pydantic==2.6.1
pydantic-settings==2.1.0
pymupdf==1.23.26
python-docx==1.1.0
spacy==3.7.4
scikit-learn==1.4.0
numpy==1.26.4
openai>=1.0.0
google-generativeai>=0.3.0
```

### Frontend (`package.json`)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0",
  "recharts": "^2.10.3",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.8"
}
```

---

**Note**: Docker setup is strongly recommended for first-time setup as it handles all dependencies, database creation, and service connectivity automatically.