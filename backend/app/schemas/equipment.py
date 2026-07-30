from pydantic import BaseModel
from typing import Optional


class EquipmentCreate(BaseModel):
    id: str
    type: str
    site_id: Optional[str] = None
    customer_id: Optional[int] = None
    engine_hours_per_day: Optional[float] = None
    idle_hours_per_day: Optional[float] = None
    rental_days: Optional[int] = None
    last_operator_id: Optional[str] = None
    status: str = "available"
    condition_status: str = "operational"
    dealer_name: Optional[str] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    outside_geofence: bool = False


class EquipmentUpdate(BaseModel):
    type: Optional[str] = None
    site_id: Optional[str] = None
    customer_id: Optional[int] = None
    last_operator_id: Optional[str] = None
    status: Optional[str] = None
    condition_status: Optional[str] = None
    dealer_name: Optional[str] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    outside_geofence: Optional[bool] = None
    check_in_date: Optional[str] = None
    check_out_date: Optional[str] = None


class EquipmentOut(BaseModel):
    id: str
    type: str
    site_id: Optional[str] = None
    customer_id: Optional[int] = None
    last_operator_id: Optional[str] = None
    status: Optional[str] = None
    condition_status: Optional[str] = None
    dealer_name: Optional[str] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    outside_geofence: Optional[bool] = None
    check_in_date: Optional[str] = None
    check_out_date: Optional[str] = None
    engine_hours_per_day: Optional[float] = None
    idle_hours_per_day: Optional[float] = None
    rental_days: Optional[int] = None

    class Config:
        from_attributes = True
