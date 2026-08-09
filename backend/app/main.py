from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.interview import router as interview_router

app = FastAPI(
    title="InterviewOS Backend API",
    description="Adaptive AI Technical Interviewer API for Hackathon",
    version="1.0.0",
)

import os

# Enable CORS for localhost and production deployments
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",  # Production fallback for Vercel/Render hosting
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register interview API router
app.include_router(interview_router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": "InterviewOS API Server",
        "version": "1.0.0",
        "docs": "/docs",
    }
