from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.github import router as github_router
from app.api.analytics import router as analytics_router
from app.api.reviews import router as reviews_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(github_router)
app.include_router(analytics_router)
app.include_router(reviews_router)

@app.get("/")
def home():
    return {"message": "AI Code Review Backend Running"}