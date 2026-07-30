from pydantic import BaseModel
from typing import Optional
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
