from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ForecastBase(BaseModel):
    equipment_type: str
    site_id: Optional[str] = None
    predicted_demand_date: Optional[date] = None
    predicted_units_needed: Optional[int] = None
    confidence: Optional[float] = None
    recommended_action: Optional[str] = None

class ForecastCreate(ForecastBase):
    pass

class ForecastResponse(ForecastBase):
    id: int
    generated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # updated for pydantic v2 (orm_mode in v1)
