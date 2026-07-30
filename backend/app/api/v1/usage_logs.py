from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.usage_log import UsageLog
from app.schemas.usage_log import UsageLogCreate, UsageLogOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/usage-logs", tags=["usage-logs"])


@router.get("", response_model=List[UsageLogOut])
def list_usage_logs(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return db.query(UsageLog).order_by(UsageLog.id.desc()).all()


@router.post("", response_model=UsageLogOut, status_code=201)
def create_usage_log(payload: UsageLogCreate, db: Session = Depends(get_db), _: dict = Depends(get_current_user)):
    log = UsageLog(**payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
