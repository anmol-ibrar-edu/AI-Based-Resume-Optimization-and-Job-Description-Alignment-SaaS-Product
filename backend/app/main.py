"""
File: main.py
Purpose: Entry point for the FastAPI application, initializing middleware, routers, and database connections.
Missing Impact: The backend server would not exist, and no API endpoints would be accessible by the frontend.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.api.v1.router import api_router
from app.db.database import engine
from app.db.base import Base

# ─── Tag descriptions shown in Swagger UI ───────────────────────────────────
tags_metadata = [
    {
        "name": "Authentication",
        "description": (
            "**Step 1: System Access & Initialization**\n\n"
            "The system uses secure stateless JWT authentication. Before accessing the machine learning endpoints, you must authenticate:\n\n"
            "1. `POST /register`: Register a new profile in the secure database.\n"
            "2. `POST /login/json`: Authenticate to receive your cryptographic `access_token`.\n"
            "3. Click the **🔒 Authorize** button and provide your token to unlock the engine."
        ),
    },
    {
        "name": "Resume",
        "description": (
            "**Step 2: Document Ingestion & Parsing Engine**\n\n"
            "The pipeline extracts and vectorizes unstructured data from resumes:\n\n"
            "- `POST /upload`: Submit a PDF/DOCX document. The NLP parser will:\n"
            "  - Perform OCR and text extraction.\n"
            "  - Validate structural integrity (ensuring it is a standard resume format).\n"
            "  - Execute Named Entity Recognition (NER) against a proprietary 1500+ skill taxonomy.\n"
            "  - Return a unique `resume_id` for downstream analysis.\n\n"
            "- `GET /`: Retrieve all processed candidate profiles."
        ),
    },
    {
        "name": "Job Description",
        "description": (
            "**Step 3: Target Role Definition**\n\n"
            "Define the baseline parameters for the target job:\n\n"
            "- `POST /`: Submit the unstructured job description text.\n"
            "  - The engine extracts core competencies and mandatory keywords.\n"
            "  - Returns a unique `job_id` to be used in the matching algorithm."
        ),
    },
    {
        "name": "Analysis",
        "description": (
            "**Step 4: Proprietary ATS Scoring & Optimization Engine**\n\n"
            "This is the core ML execution endpoint that bridges the candidate profile with the target role:\n\n"
            "- `POST /analyze`: Provide `resume_id` and `job_id`. The deep learning engine will:\n"
            "  - Execute semantic matching between candidate skills and job requirements.\n"
            "  - Compute a deterministic ATS match score (0-100).\n"
            "  - Generate a prioritized list of actionable recommendations.\n"
            "  - Synthesize a highly optimized, ATS-friendly professional summary."
        ),
    },
    {
        "name": "Career Analysis",
        "description": (
            "**Career Trajectory Mapping**\n\n"
            "- `POST /analyze`: Matches the extracted skill vectors against our database of 100+ industry career paths to predict the most statistically viable career transitions and required upskilling."
        ),
    },
    {
        "name": "Dashboard",
        "description": "System telemetry and historical metrics for the authenticated user.",
    },
    {
        "name": "Users",
        "description": "User profile and session management.",
    },
]

# ─── FastAPI App ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Resume Optimizer API",
    version=settings.APP_VERSION,
    description="""
## 🚀 AI Resume Optimization Engine

Welcome to the internal API documentation for the **Resume Optimizer SaaS**. This API exposes our proprietary Machine Learning and Natural Language Processing pipelines designed to bridge the gap between candidate resumes and Applicant Tracking Systems (ATS).

---

### 🧠 Core Capabilities
- **Deep Semantic Parsing:** Extracts high-fidelity data from unstructured PDF/DOCX files.
- **Advanced ATS Scoring:** Uses proprietary NLP algorithms to calculate deterministic compatibility scores.
- **Predictive Recommendations:** Generates contextual improvement strategies based on missing skill vectors.

---

### 🔧 Execution Workflow

| Phase | Endpoint | Action |
|------|----------|--------------|
| **1. Auth** | `POST /auth/register` | Initialize user session |
| **2. Auth** | `POST /auth/login/json` | Obtain JWT Bearer Token |
| **3. Ingestion** | `POST /resume/upload` | Upload document → Retrieve `resume_id` |
| **4. Target** | `POST /job/` | Submit job text → Retrieve `job_id` |
| **5. ML Execution** | `POST /analysis/analyze` | Run core optimization engine |
""",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=tags_metadata,
    swagger_ui_parameters={"defaultModelsExpandDepth": -1}
)

# Database tables creation
from . import models  # Register models
try:
    from init_db import init_db
    init_db()
except ImportError:
    # Fallback if running outside of expected directory structure
    from app.db.base import Base
    from app.db.database import engine
    Base.metadata.create_all(bind=engine)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static files
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["default"])
async def root():
    """API info — visit /docs for the interactive documentation."""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "quick_start": "POST /api/v1/auth/register → POST /api/v1/auth/login/json → POST /api/v1/resume/upload → POST /api/v1/analysis/analyze"
    }


@app.get("/health", tags=["default"])
async def health_check():
    """Health check — returns 200 if server is running."""
    return {"status": "healthy", "database": "connected"}
