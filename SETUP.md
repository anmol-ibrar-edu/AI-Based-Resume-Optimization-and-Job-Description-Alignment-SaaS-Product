# 🚀 Setup Guide

This guide explains how to set up the AI Resume Optimizer project on Windows and Linux.

## 📋 Prerequisites

### Required Software
- **Git**: For cloning the repository
- **Docker Desktop**: Recommended for easy setup
- **Python 3.11+**: For local development
- **Node.js 18+**: For frontend development
- **PostgreSQL 15+**: If not using Docker

---

## 💻 Docker Setup (Recommended)

### Step 1: Install Docker
```bash
# Windows: Download from https://www.docker.com/products/docker-desktop
# Linux:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Step 2: Clone Project
```bash
git clone https://github.com/LAIBAASIM555/AI-powered-Resume-Optimization-and-Job-Description-Alignment-SaaS-Application.git
cd AI-powered-Resume-Optimization-and-Job-Description-Alignment-SaaS-Application
```

### Step 3: Start Application
```bash
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Step 4: Access Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Stop Application
```bash
docker-compose down
```

---

## 💻 Local Development Setup

### Windows Setup

#### Step 1: Install Python
```powershell
# Download Python 3.11+ from https://python.org
python --version
```

#### Step 2: Install Node.js
```powershell
# Download Node.js 18+ from https://nodejs.org
node --version
```

#### Step 3: Backend Setup
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

#### Step 4: Frontend Setup
```powershell
cd ..\frontend
npm install
```

#### Step 5: Start Database (Docker)
```powershell
docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=resume_optimizer -e POSTGRES_PASSWORD=password123 postgres:15-alpine
```

#### Step 6: Start Services
```powershell
# Terminal 1: Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Linux Setup

#### Step 1: Install Python
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

#### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 3: Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

#### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
```

#### Step 5: Start Services
```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Access Points
- **Frontend (Dev)**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔧 Environment Configuration

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password123@localhost:5432/resume_optimizer

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Application
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Optional: AI APIs for enhanced parsing
OPENAI_API_KEY=your-openai-key
GOOGLE_API_KEY=your-google-key
```

---

## 🐛 Troubleshooting

### Docker Issues
```bash
# Permission error
sudo usermod -aG docker $USER
# Logout and login

# Port in use
docker-compose down
docker-compose up -d

# Build cache issues
docker system prune -a
```

### Python Issues
```bash
# Virtual environment
# Windows: venv\Scripts\activate
# Linux: source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Database Issues
```bash
# Check PostgreSQL status
docker ps | grep postgres

# Connect to database
docker exec -it postgres psql -U postgres -d resume_optimizer
```

---

## 🎯 Quick Verification

After setup, verify everything works:

```bash
# Check services
docker ps

# Test API
curl http://localhost:8000/health

# Test frontend
curl http://localhost
```

---

**Note**: Docker setup is recommended as it handles all dependencies automatically.