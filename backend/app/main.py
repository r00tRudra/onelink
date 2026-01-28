from fastapi import FastAPI

from app.api import auth, users, projects, portfolio, resume
from app.db.database import engine
from app.models import user, project, experience, media  # import so tables are created

app = FastAPI(
    title="OneLink Portfolio API",
    description="Portfolio builder using GitHub data",
    version="0.1.0"
)

# Include API routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
app.include_router(resume.router, prefix="/resume", tags=["resume"])


@app.get("/")
def read_root():
    return {"message": "OneLink Portfolio API"}