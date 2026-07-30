from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class UsageLogBase(BaseModel):
    equipment_id: str
    log_date: date
    engine_hours: float
    idle_hours: float
    fuel_usage: float
    location: str
    dealer_name: Optional[str] = None


class UsageLogCreate(UsageLogBase):
    pass


class UsageLogResponse(UsageLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
