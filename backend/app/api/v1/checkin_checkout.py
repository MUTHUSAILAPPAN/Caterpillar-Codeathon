from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from app.db.session import get_db
from app.models.equipment import Equipment
from app.models.rental_log import RentalLog
from app.api.deps import get_current_user

router = APIRouter(prefix="/checkinout", tags=["checkinout"])


class CheckInPayload(BaseModel):
    equipment_id: str
    operator_id: str
    site_id: str


class CheckOutPayload(BaseModel):
    equipment_id: str


@router.post("/checkin")
def check_in(payload: CheckInPayload, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    eq = db.query(Equipment).filter(Equipment.id == payload.equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    if eq.status == "rented":
        raise HTTPException(status_code=400, detail="Equipment already checked in")

    today = str(date.today())
    eq.status = "rented"
    eq.last_operator_id = payload.operator_id
    eq.site_id = payload.site_id
    eq.check_in_date = today
    eq.check_out_date = None

    rental = RentalLog(
        equipment_id=eq.id,
        site_id=payload.site_id,
        operator_id=payload.operator_id,
        checked_by_user_id=None,
        check_in_date=today,
        action="checkin",
    )
    db.add(rental)
    db.commit()
    return {"message": f"{payload.equipment_id} checked in at {payload.site_id}"}


@router.post("/checkout")
def check_out(payload: CheckOutPayload, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    eq = db.query(Equipment).filter(Equipment.id == payload.equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")

    today = str(date.today())
    eq.status = "available"
    eq.check_out_date = today

    rental = RentalLog(
        equipment_id=eq.id,
        site_id=eq.site_id,
        operator_id=eq.last_operator_id,
        check_out_date=today,
        action="checkout",
    )
    db.add(rental)
    db.commit()
    return {"message": f"{payload.equipment_id} checked out"}
