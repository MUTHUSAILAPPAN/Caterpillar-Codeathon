from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.usage_log import UsageLog
from app.api.deps import get_current_user
from collections import defaultdict

router = APIRouter(prefix="/forecasting", tags=["forecasting"])


@router.get("/usage-trend")
def usage_trend(
    equipment_id: str = Query(None),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    q = db.query(UsageLog)
    if equipment_id:
        q = q.filter(UsageLog.equipment_id == equipment_id)

    logs = q.order_by(UsageLog.log_date).all()

    by_month = defaultdict(float)
    for log in logs:
        month = str(log.log_date)[:7]
        by_month[month] += log.engine_hours or 0

    history = [{"month": k, "hours": round(v, 1)} for k, v in sorted(by_month.items())]

    if len(history) >= 2:
        recent = [h["hours"] for h in history[-3:]]
        avg = sum(recent) / len(recent)
        last_month = history[-1]["month"]
        year, month = map(int, last_month.split("-"))
        forecast = []
        for i in range(1, 4):
            m = month + i
            y = year + (m - 1) // 12
            m = ((m - 1) % 12) + 1
            forecast.append({"month": f"{y}-{m:02d}", "hours": round(avg * (1 + 0.05 * i), 1)})
    else:
        forecast = []

    return {"history": history, "forecast": forecast}
