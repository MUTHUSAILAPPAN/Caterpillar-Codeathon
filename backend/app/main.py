from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import reports, usage_logs

app = FastAPI(title="Smart Rental Tracking System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usage_logs.router)
app.include_router(reports.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
