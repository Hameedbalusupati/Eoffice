"""
main.py

👉 Entry point of FastAPI application
👉 Handles:
   - Database
   - Routes
   - CORS (Frontend connection)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔥 DATABASE
from config.db import engine
from database.base import init_db

# 🔥 ROUTES
from routes.auth_routes import router as auth_router
from routes.activity_routes import router as activity_router
from routes.academics_routes import router as academics_router
from routes.correspondence_routes import router as correspondence_router
from routes.employee_routes import router as employee_router
from routes.examination_routes import router as examination_router
from routes.library_routes import router as library_router
from routes.placements_routes import router as placements_router


# =========================
# 🚀 CREATE FASTAPI APP
# =========================
app = FastAPI(
    title="E-Office Backend API",
    description="Full Backend for E-Office System with Activity Tracking ✔️❌",
    version="1.0.0"
)


# =========================
# 🌍 CORS CONFIG (FIXED 🔥)
# =========================
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # 🔥 ADD YOUR VERCEL DOMAIN HERE
    "https://your-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 TEMP FIX (for testing only)
# Uncomment this if still not working
# allow_origins=["*"]


# =========================
# 🔥 STARTUP EVENT
# =========================
@app.on_event("startup")
def startup():
    print("🚀 Starting E-Office Backend...")

    try:
        init_db(engine)
        print("✅ Database connected & tables created successfully")
    except Exception as e:
        print("❌ Database connection failed:", e)


# =========================
# 🔗 INCLUDE ROUTES
# =========================
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(activity_router, prefix="/activity", tags=["Activity"])
app.include_router(academics_router, prefix="/academics", tags=["Academics"])
app.include_router(correspondence_router, prefix="/correspondence", tags=["Correspondence"])
app.include_router(employee_router, prefix="/employee", tags=["Employee"])
app.include_router(examination_router, prefix="/examination", tags=["Examination"])
app.include_router(library_router, prefix="/library", tags=["Library"])
app.include_router(placements_router, prefix="/placements", tags=["Placements"])


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def root():
    return {
        "message": "🚀 E-Office Backend Running",
        "status": "success"
    }


# =========================
# ❤️ HEALTH CHECK
# =========================
@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "message": "Server is running successfully"
    }


# =========================
# ▶️ RUN (LOCAL ONLY)
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)