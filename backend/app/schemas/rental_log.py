from pydantic import BaseModel
from typing import Optional


class RentalLogOut(BaseModel):
    id: int
    equipment_id: str
    site_id: Optional[str] = None
    operator_id: Optional[str] = None
    checked_by_user_id: Optional[int] = None
    check_in_date: Optional[str] = None
    check_out_date: Optional[str] = None
    action: Optional[str] = None

    class Config:
        from_attributes = True
