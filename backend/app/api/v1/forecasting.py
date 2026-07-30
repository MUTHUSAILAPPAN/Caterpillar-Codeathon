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
