from fastapi import APIRouter
from app.api.v1 import auth, equipment, checkin_checkout, alerts, usage_logs, rental_history, reports, forecasting

router = APIRouter(prefix="/api/v1")
router.include_router(auth.router)
router.include_router(equipment.router)
router.include_router(checkin_checkout.router)
router.include_router(alerts.router)
router.include_router(usage_logs.router)
router.include_router(rental_history.router)
router.include_router(reports.router)
router.include_router(forecasting.router)
