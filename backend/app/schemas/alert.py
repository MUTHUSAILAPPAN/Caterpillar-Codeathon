from pydantic import BaseModel
from typing import Optional


class AlertOut(BaseModel):
    id: int
    equipment_id: str
    alert_type: str
    message: str
    severity: str
    is_resolved: bool
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class AlertResolve(BaseModel):
    is_resolved: bool = True
from datetime import datetime

class AlertBase(BaseModel):
    equipment_id: Optional[str] = None
    alert_type: str
    message: str
    severity: Optional[str] = 'medium'
    is_resolved: Optional[bool] = False

class AlertCreate(AlertBase):
    pass

class AlertResolveRequest(BaseModel):
    is_resolved: bool = True

class AlertResponse(AlertBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
