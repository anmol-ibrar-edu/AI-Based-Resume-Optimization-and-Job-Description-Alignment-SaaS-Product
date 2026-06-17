# 💻 Terminal Commands Guide

Quick reference for all terminal commands used in this project.

> **Note**: Commands shown use both PowerShell (Windows) and Bash (Linux/macOS) syntax where applicable.

---

## ⚡ Quick Reference

### Docker (Fastest Way to Start)
```powershell
docker-compose up -d --build    # First time
docker-compose up -d            # Subsequent starts
docker-compose down             # Stop all services
docker-compose logs -f          # Live logs
```

### Local Development
```powershell
# Backend (Terminal 1)
cd backend; venv\Scripts\activate; uvicorn app.main:app --reload

# Frontend (Terminal 2)
cd frontend; npm run dev
```

---

## 🐳 Docker Commands

### Service Management
```powershell
# Start all services in background
docker-compose up -d

# Start with rebuild (after code changes)
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and delete volumes (full reset)
docker-compose down -v

# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Container Operations
```powershell
# List running containers
docker ps

# Enter backend container shell
docker exec -it resume_backend bash

# Enter database container shell
docker exec -it resume_db bash

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend

# Full cleanup (removes all images, containers, volumes)
docker system prune -a
```

### Database Operations via Docker
```powershell
# Backup database
docker exec resume_db pg_dump -U postgres resume_optimizer > backup.sql

# Restore database
docker exec -i resume_db psql -U postgres resume_optimizer < backup.sql

# Open database CLI
docker exec -it resume_db psql -U postgres -d resume_optimizer

# Run a quick query
docker exec resume_db psql -U postgres -d resume_optimizer -c "SELECT COUNT(*) FROM users;"
```

---

## 🐍 Python Backend Commands

### Virtual Environment (Windows)
```powershell
# Create venv
python -m venv venv

# Activate
venv\Scripts\activate

# Deactivate
deactivate
```

### Virtual Environment (Linux/macOS)
```bash
python3 -m venv venv
source venv/bin/activate
deactivate
```

### Dependencies
```powershell
# Install all dependencies
pip install -r requirements.txt

# Install and freeze new dependency
pip install package-name
pip freeze > requirements.txt

# Force reinstall everything
pip install -r requirements.txt --force-reinstall

# List installed packages
pip list
```

### NLP Model
```powershell
# Download required spaCy model (one-time setup)
python -m spacy download en_core_web_sm
```

### Run Backend Server
```powershell
# Development (auto-reload on file changes)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production (multi-worker)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Test Backend
```powershell
# Run all tests
pytest

# Verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py

# With coverage report
pytest --cov=app --cov-report=html
```

---

## ⚛️ Frontend Commands

### Package Management
```powershell
# Install all dependencies (from package.json)
npm install

# Install a specific package
npm install axios

# Remove a package
npm uninstall package-name

# Update all packages
npm update
```

### Development & Build
```powershell
# Start dev server (hot reload at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🗄️ PostgreSQL Commands

### Connect (Local)
```powershell
psql -U postgres -d resume_optimizer
```

### Useful psql Commands
```sql
-- List all tables
\dt

-- Describe table structure
\d users
\d resumes
\d analyses

-- View data
SELECT * FROM users LIMIT 5;
SELECT id, ats_score, created_at FROM analyses ORDER BY created_at DESC LIMIT 10;

-- Check counts
SELECT
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM resumes) AS resumes,
    (SELECT COUNT(*) FROM job_descriptions) AS jobs,
    (SELECT COUNT(*) FROM analyses) AS analyses;

-- Exit psql
\q
```

---

## 🔧 Git Commands

```powershell
# Clone the repository
git clone https://github.com/anmol-ibrar-edu/AI-Based-Resume-Optimization-and-Job-Description-Alignment-SaaS-Product.git

# Check current status
git status

# Stage and commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create a new feature branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
```

---

## 🚀 Deployment (Google Cloud VPS)

When deploying to a VPS like Google Cloud, use these commands to manage your production environment.

### Connect to Server
```bash
# SSH into your VPS
ssh root@your-server-ip
```

### Docker Management
Manage your production Docker containers directly via CLI:
```bash
# List all running production containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View production backend logs
docker logs -f your-project-name-backend-1

# Restart production backend
docker restart your-project-name-backend-1
```

---

## 📊 Monitoring & Diagnostics

### Resource Monitoring
```powershell
# Docker container resource usage
docker stats

# Disk usage by Docker
docker system df
```

### Network & Port Checks
```powershell
# Check what's running on port 8000 (Windows)
netstat -ano | findstr :8000

# Check what's running on port 5432 (Windows)
netstat -ano | findstr :5432

# Test backend health
curl http://localhost:8000/health

# Test frontend
curl http://localhost:5173
```

### API Quick Tests
```powershell
# Register a user
curl -X POST http://localhost:8000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","full_name":"Test User","password":"Test123456"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login/json `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test123456"}'
```

---

## ⚡ PowerShell Aliases (Optional)

Add to your PowerShell profile (`$PROFILE`) for convenience:

```powershell
# Docker shortcuts
function dcu { docker-compose up -d }
function dcd { docker-compose down }
function dcl { docker-compose logs -f }
function dcr { docker-compose restart }
function dcub { docker-compose up -d --build }

# Git shortcuts
function gs { git status }
function ga { git add . }
function gp { git push origin main }
function gl { git log --oneline -10 }
```

---

**Tip**: Always activate the virtual environment (`venv\Scripts\activate`) before running any Python backend commands.