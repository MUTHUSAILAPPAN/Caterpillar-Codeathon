from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertOut, AlertResolve
from app.api.deps import get_current_user, require_admin

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", response_model=List[AlertOut])
def list_alerts(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return db.query(Alert).order_by(Alert.id.desc()).all()


@router.patch("/{alert_id}/resolve", response_model=AlertOut)
def resolve_alert(alert_id: int, payload: AlertResolve, db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_resolved = payload.is_resolved
    db.commit()
    db.refresh(alert)
    return alert
