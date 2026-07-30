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
