"""
Main API router that aggregates all v1 endpoints.
"""
from fastapi import APIRouter

# Create main API router
api_router = APIRouter()

# Import and include all route modules
from app.api.v1 import auth, users, resume, job, analysis, dashboard, career, reviews, admin

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(resume.router, prefix="/resume", tags=["Resume"])
api_router.include_router(job.router, prefix="/job", tags=["Job Description"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(career.router, tags=["Career Analysis"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])

# Temporary root endpoint for testing
@api_router.get("/")
async def api_root():
    """API root endpoint."""
    return {"message": "API v1 is running"}

