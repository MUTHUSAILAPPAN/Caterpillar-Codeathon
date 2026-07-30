from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import router
import app.models.user
import app.models.equipment
import app.models.usage_log
import app.models.rental_log
import app.models.alert
import app.models.operator
import app.models.site

app = FastAPI(title="FleetWatch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
