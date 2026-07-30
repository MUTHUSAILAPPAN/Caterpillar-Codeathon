import os
from typing import Any, Dict, Generator, List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import create_engine, func
from sqlalchemy.orm import Session, sessionmaker

from app.models.usage_log import Base, UsageLog

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


@router.get("/reports/summary")
def get_summary(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_engine_hours = float(
        db.query(func.coalesce(func.sum(UsageLog.engine_hours), 0)).scalar() or 0.0
    )
    total_idle_hours = float(
        db.query(func.coalesce(func.sum(UsageLog.idle_hours), 0)).scalar() or 0.0
    )
    total_fuel_usage = float(
        db.query(func.coalesce(func.sum(UsageLog.fuel_usage), 0)).scalar() or 0.0
    )

    total_rented_hours = round(total_engine_hours + total_idle_hours, 2)
    total_active_hours = total_engine_hours + total_idle_hours
    downtime_percentage = round((total_idle_hours / total_active_hours * 100) if total_active_hours else 0.0, 2)

    usage_per_site = [
        {
            "site": row.site,
            "engine_hours": round(float(row.engine_hours or 0), 2),
            "idle_hours": round(float(row.idle_hours or 0), 2),
            "fuel_usage": round(float(row.fuel_usage or 0), 2),
        }
        for row in db.query(
            UsageLog.location.label("site"),
            func.sum(UsageLog.engine_hours).label("engine_hours"),
            func.sum(UsageLog.idle_hours).label("idle_hours"),
            func.sum(UsageLog.fuel_usage).label("fuel_usage"),
        )
        .group_by(UsageLog.location)
        .order_by(UsageLog.location)
        .all()
    ]

    site_usage_trend = [
        {
            "site": item["site"],
            "usage": round(item["engine_hours"] + item["idle_hours"], 2),
        }
        for item in usage_per_site
    ]

    downtime_breakdown = [
        {"name": "Operational", "value": round(total_engine_hours, 2)},
        {"name": "Downtime", "value": round(total_idle_hours, 2)},
    ]

    return {
        "total_rented_hours": total_rented_hours,
        "total_engine_hours": round(total_engine_hours, 2),
        "total_idle_hours": round(total_idle_hours, 2),
        "total_fuel_usage": round(total_fuel_usage, 2),
        "downtime_percentage": downtime_percentage,
        "usage_per_site": usage_per_site,
        "site_usage_trend": site_usage_trend,
        "downtime_breakdown": downtime_breakdown,
    }


@router.get("/reports/dealer-comparison")
def get_dealer_comparison(request: Request, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    role = (request.headers.get("x-role") or request.query_params.get("role") or "").lower()
    if role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    rows = db.query(
        func.coalesce(UsageLog.dealer_name, "Unassigned").label("dealer_name"),
        func.avg(UsageLog.fuel_usage).label("average_fuel_usage"),
        func.avg(UsageLog.idle_hours).label("average_idle_hours"),
        func.count(func.distinct(UsageLog.equipment_id)).label("equipment_count"),
    ).group_by(func.coalesce(UsageLog.dealer_name, "Unassigned"))

    return [
        {
            "dealer_name": row.dealer_name,
            "average_fuel_usage": round(float(row.average_fuel_usage or 0), 2),
            "average_idle_hours": round(float(row.average_idle_hours or 0), 2),
            "equipment_count": int(row.equipment_count or 0),
        }
        for row in rows.order_by("dealer_name").all()
    ]
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
