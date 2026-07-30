from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.alert import Alert
from app.services.anomaly_detection import (
    check_overdue, 
    check_idle_excess, 
    check_unassigned, 
    check_geofence, 
    check_unauthorized_access
)

def run_all_checks_and_save(db: Session):
    """
    Orchestrates running all anomaly checks and writing resulting Alert rows.
    Avoids creating duplicate open alerts.
    """
    # 1. Gather all potential new alerts
    potential_alerts = []
    potential_alerts.extend(check_overdue(db))
    potential_alerts.extend(check_idle_excess(db))
    potential_alerts.extend(check_unassigned(db))
    potential_alerts.extend(check_geofence(db))
    potential_alerts.extend(check_unauthorized_access(db))
    
    if not potential_alerts:
        return []

    # 2. Find existing unresolved alerts to avoid duplicates
    existing_query = "SELECT equipment_id, alert_type FROM alerts WHERE is_resolved = false"
    existing_result = db.execute(text(existing_query)).fetchall()
    existing_open = {(str(row.equipment_id), row.alert_type) for row in existing_result}
    
    # 3. Filter and insert new alerts
    new_alerts_to_create = []
    for eq_id, a_type, msg, sev in potential_alerts:
        eq_id_str = str(eq_id)
        if (eq_id_str, a_type) not in existing_open:
            new_alert = Alert(
                equipment_id=eq_id_str,
                alert_type=a_type,
                message=msg,
                severity=sev,
                is_resolved=False
            )
            new_alerts_to_create.append(new_alert)
            # Add to set so we don't duplicate within the same run 
            existing_open.add((eq_id_str, a_type))
            
    if new_alerts_to_create:
        db.bulk_save_objects(new_alerts_to_create)
        db.commit()
        
    return new_alerts_to_create
