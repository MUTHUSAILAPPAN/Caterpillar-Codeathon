from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.equipment import Equipment
from app.models.usage_log import UsageLog
from app.models.rental_log import RentalLog
from app.models.alert import Alert
from app.api.deps import require_admin

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary")
def fleet_summary(db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    equipment = db.query(Equipment).all()
    status_counts = {}
    for eq in equipment:
        s = eq.status or "unknown"
        status_counts[s] = status_counts.get(s, 0) + 1

    logs = db.query(UsageLog).all()
    total_engine_hours = round(sum(u.engine_hours or 0 for u in logs), 1)

    active_rentals = db.query(RentalLog).filter(RentalLog.action == "checkin").count()
    unresolved_alerts = db.query(Alert).filter(Alert.is_resolved == False).count()

    usage_by_eq = {}
    for u in logs:
        usage_by_eq[u.equipment_id] = usage_by_eq.get(u.equipment_id, 0) + (u.engine_hours or 0)

    top_equipment = sorted(usage_by_eq.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "total_equipment": len(equipment),
        "status_breakdown": status_counts,
        "total_hours_logged": total_engine_hours,
        "active_rentals": active_rentals,
        "unresolved_alerts": unresolved_alerts,
        "top_equipment_by_hours": [{"id": k, "hours": round(v, 1)} for k, v in top_equipment],
    }
