from pydantic import BaseModel
from typing import Optional


class UsageLogCreate(BaseModel):
    equipment_id: str
    log_date: str
    engine_hours: Optional[float] = None
    idle_hours: Optional[float] = None
    fuel_usage: Optional[float] = None
    location: Optional[str] = None


class UsageLogOut(UsageLogCreate):
    id: int

    class Config:
        from_attributes = True
