from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.rental_log import RentalLog
from app.schemas.rental_log import RentalLogOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/rental-history", tags=["rental-history"])


@router.get("", response_model=List[RentalLogOut])
def list_rentals(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return db.query(RentalLog).order_by(RentalLog.id.desc()).all()
