from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.usage_log import UsageLog
from app.api.deps import get_current_user
from collections import defaultdict

router = APIRouter(prefix="/forecasting", tags=["forecasting"])


@router.get("/usage-trend")
def usage_trend(
    equipment_id: str = Query(None),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    q = db.query(UsageLog)
    if equipment_id:
        q = q.filter(UsageLog.equipment_id == equipment_id)

    logs = q.order_by(UsageLog.log_date).all()

    by_month = defaultdict(float)
    for log in logs:
        month = str(log.log_date)[:7]
        by_month[month] += log.engine_hours or 0

    history = [{"month": k, "hours": round(v, 1)} for k, v in sorted(by_month.items())]

    if len(history) >= 2:
        recent = [h["hours"] for h in history[-3:]]
        avg = sum(recent) / len(recent)
        last_month = history[-1]["month"]
        year, month = map(int, last_month.split("-"))
        forecast = []
        for i in range(1, 4):
            m = month + i
            y = year + (m - 1) // 12
            m = ((m - 1) % 12) + 1
            forecast.append({"month": f"{y}-{m:02d}", "hours": round(avg * (1 + 0.05 * i), 1)})
    else:
        forecast = []

    return {"history": history, "forecast": forecast}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.forecast import Forecast
from app.schemas.forecast import ForecastResponse
from app.services.forecasting import generate_forecasts, get_underutilized_equipment

router = APIRouter(prefix="/forecast", tags=["forecasting"])

@router.post("/generate", response_model=List[ForecastResponse])
def trigger_forecast_generation(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to generate forecasts")
    
    try:
        forecasts = generate_forecasts(db)
        # bulk_save_objects doesn't populate generated IDs automatically, 
        # so for the response we can either re-fetch or return them as they are
        # (pydantic will ignore missing IDs if schema allows, but id is required in Response).
        # We'll re-fetch the latest ones or just fetch all for simplicity.
        return db.query(Forecast).order_by(Forecast.id.desc()).limit(len(forecasts)).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ForecastResponse])
def get_forecasts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(Forecast).all()
        
    elif current_user.role == "customer":
        # Customers can only see forecasts for equipment types they have rented
        res = db.execute(
            text("SELECT DISTINCT type FROM equipment WHERE customer_id = :cust_id"), 
            {"cust_id": current_user.id}
        )
        customer_equipment_types = [row[0] for row in res]
        
        if not customer_equipment_types:
            return []
            
        forecasts = db.query(Forecast).filter(
            Forecast.equipment_type.in_(customer_equipment_types)
        ).all()
        return forecasts
    else:
        raise HTTPException(status_code=403, detail="Invalid role")

@router.get("/underutilized")
def get_underutilized(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role == "admin":
        data = get_underutilized_equipment(db, customer_id=None)
    elif current_user.role == "customer":
        data = get_underutilized_equipment(db, customer_id=current_user.id)
    else:
        raise HTTPException(status_code=403, detail="Invalid role")
    return data
