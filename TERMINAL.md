# 💻 Terminal Commands Guide

Quick reference for all terminal commands used in this project.

## 📋 Quick Reference

### Docker Commands
```bash
# Start project
docker-compose up -d

# Stop project
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild after changes
docker-compose up -d --build
```

### Development Commands
```bash
# Backend server
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Frontend server
cd frontend && npm run dev

# Run tests
cd backend && python -m pytest
```

---

## 🐳 Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# Start with build
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

### Container Management
```bash
# List running containers
docker ps

# Enter container shell
docker exec -it resume_backend bash

# Restart specific service
docker-compose restart backend

# Full cleanup
docker system prune -a
```

### Database Operations
```bash
# Backup database
docker exec resume_db pg_dump -U postgres resume_optimizer > backup.sql

# Restore database
docker exec -i resume_db psql -U postgres resume_optimizer < backup.sql

# Database shell
docker exec -it resume_db psql -U postgres -d resume_optimizer
```

---

## 🐍 Python Backend Commands

### Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate
deactivate

# Linux
python3 -m venv venv
source venv/bin/activate
deactivate
```

### Dependencies
```bash
pip install -r requirements.txt
pip install --upgrade fastapi
pip list
pip freeze > requirements.txt
```

### Server
```bash
# Development
uvicorn app.main:app --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Testing
```bash
pytest
pytest -v
pytest tests/test_auth.py
pytest --cov=app --cov-report=html
```

---

## ⚛️ Frontend Commands

### Package Management
```bash
npm install
npm install axios
npm uninstall package-name
```

### Development
```bash
npm run dev
npm run build
npm run preview
```

---

## 🗄️ Database Commands

### PostgreSQL
```bash
# Connect
psql -U postgres -d resume_optimizer

# List tables
\dt

# Table structure
\d users

# Query
SELECT * FROM users LIMIT 5;
```

---

## 🔧 Git Commands

```bash
# Clone
git clone <repository-url>

# Status
git status

# Add and commit
git add .
git commit -m "message"

# Push
git push origin main

# Pull
git pull origin main

# New branch
git checkout -b feature/new-feature
```

---

## 📊 Monitoring

### Docker Stats
```bash
docker stats
docker system df
```

### Network
```bash
# Check ports
netstat -tlnp  # Linux
netstat -ano | findstr :8000  # Windows

# Test connection
curl http://localhost:8000/health
```

---

## ⚡ Common Aliases

Add to `.bashrc` or `.zshrc`:

```bash
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose restart'
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push origin main'
```

---

**Tip**: Use these commands to manage your development workflow efficiently!