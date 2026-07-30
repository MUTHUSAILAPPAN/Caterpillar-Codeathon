import os
from typing import Generator, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.models.usage_log import Base, UsageLog
from app.schemas.usage_log import UsageLogCreate, UsageLogResponse

router = APIRouter()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smart_rental.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/usage-logs", response_model=UsageLogResponse, status_code=status.HTTP_201_CREATED)
def create_usage_log(payload: UsageLogCreate, db: Session = Depends(get_db)) -> UsageLogResponse:
    usage_log = UsageLog(**payload.dict())
    db.add(usage_log)
    db.commit()
    db.refresh(usage_log)
    return usage_log


@router.get("/usage-logs", response_model=list[UsageLogResponse])
def list_usage_logs(
    equipment_id: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
) -> list[UsageLogResponse]:
    query = db.query(UsageLog)
    if equipment_id:
        query = query.filter(UsageLog.equipment_id == equipment_id)

    usage_logs = query.order_by(UsageLog.log_date.desc(), UsageLog.created_at.desc()).all()
    return usage_logs
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
