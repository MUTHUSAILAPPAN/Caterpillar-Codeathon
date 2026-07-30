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
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional

from app.api.deps import get_db, get_current_user
from app.models.alert import Alert
from app.schemas.alert import AlertResponse
from app.services.alert_engine import run_all_checks_and_save

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    alert_type: Optional[str] = None,
    severity: Optional[str] = None,
    is_resolved: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Alert)
    
    if current_user.role == "customer":
        # Filter alerts to only those for equipment owned by this customer
        res = db.execute(
            text("SELECT id FROM equipment WHERE customer_id = :cust_id"), 
            {"cust_id": str(current_user.id)}
        )
        customer_equipment_ids = [str(row[0]) for row in res]
        
        if not customer_equipment_ids:
            return []
            
        query = query.filter(Alert.equipment_id.in_(customer_equipment_ids))
        
    # Optional filtering
    if alert_type:
        query = query.filter(Alert.alert_type == alert_type)
    if severity:
        query = query.filter(Alert.severity == severity)
    if is_resolved is not None:
        query = query.filter(Alert.is_resolved == is_resolved)
        
    # Order by newest first
    return query.order_by(Alert.id.desc()).all()

@router.post("/generate", response_model=List[AlertResponse])
def generate_alerts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can generate alerts")
        
    try:
        new_alerts = run_all_checks_and_save(db)
        if not new_alerts:
            return []
        
        # Simple way to return latest alerts that match the count of newly created ones
        created = db.query(Alert).order_by(Alert.id.desc()).limit(len(new_alerts)).all()
        return created
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if current_user.role == "customer":
        # Verify ownership
        res = db.execute(
            text("SELECT customer_id FROM equipment WHERE id = :eq_id"),
            {"eq_id": str(alert.equipment_id)}
        ).fetchone()
        
        if not res or str(res[0]) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Not authorized to resolve this alert")
            
    alert.is_resolved = True
    db.commit()
    db.refresh(alert)
    return alert
