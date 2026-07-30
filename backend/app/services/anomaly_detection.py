from sqlalchemy.orm import Session
from sqlalchemy import text
from app.services.geofence import check_geofence_violation

def check_overdue(db: Session):
    """
    Rule 1: Equipment checkout date has passed today and status is still 'rented'.
    """
    query = """
        SELECT id, check_out_date, status 
        FROM equipment 
        WHERE status = 'rented' AND check_out_date < CURRENT_DATE
    """
    result = db.execute(text(query)).fetchall()
    
    alerts = []
    for row in result:
        message = f"Equipment {row.id} is overdue for return (checked out until {row.check_out_date})"
        alerts.append((row.id, "overdue", message, "high"))
    return alerts

def check_idle_excess(db: Session):
    """
    Rule 2: Equipment has excessive idle hours relative to engine usage.
    engine_hours_per_day > 0 AND idle_hours_per_day > 0.6 * engine_hours_per_day
    """
    query = """
        SELECT id, engine_hours_per_day, idle_hours_per_day
        FROM equipment
        WHERE engine_hours_per_day > 0 
        AND idle_hours_per_day > (0.6 * engine_hours_per_day)
    """
    result = db.execute(text(query)).fetchall()
    
    alerts = []
    for row in result:
        message = f"Equipment {row.id} has excessive idle hours relative to engine usage"
        alerts.append((row.id, "idle_excess", message, "medium"))
    return alerts

def check_unassigned(db: Session):
    """
    Rule 3: Equipment is missing a site assignment or operator.
    """
    query = """
        SELECT id
        FROM equipment
        WHERE site_id IS NULL OR last_operator_id IS NULL
    """
    result = db.execute(text(query)).fetchall()
    
    alerts = []
    for row in result:
        message = f"Equipment {row.id} is missing a site assignment or operator"
        alerts.append((row.id, "unassigned", message, "medium"))
    return alerts

def check_geofence(db: Session):
    """
    Rule 4: Equipment is outside its assigned site's geofence radius.
    """
    query = """
        SELECT e.id, e.current_lat, e.current_lng, 
               s.center_lat, s.center_lng, s.geofence_radius_m
        FROM equipment e
        JOIN sites s ON e.site_id = s.id
        WHERE e.current_lat IS NOT NULL AND e.current_lng IS NOT NULL
    """
    result = db.execute(text(query)).fetchall()
    
    alerts = []
    for row in result:
        # Mock objects for the geofence checker
        class Eq: current_lat, current_lng = row.current_lat, row.current_lng
        class St: center_lat, center_lng, geofence_radius_m = row.center_lat, row.center_lng, row.geofence_radius_m
        
        if check_geofence_violation(Eq, St):
            message = f"Equipment {row.id} is outside its assigned site's geofence radius"
            alerts.append((row.id, "geofence", message, "high"))
    return alerts

def check_unauthorized_access(db: Session):
    """
    Rule 5: Equipment was checked in without a valid operator or authorized user.
    """
    query = """
        SELECT DISTINCT equipment_id
        FROM rental_logs
        WHERE action = 'check_in' 
        AND (operator_id IS NULL OR checked_by_user_id IS NULL)
    """
    result = db.execute(text(query)).fetchall()
    
    alerts = []
    for row in result:
        message = f"Equipment {row.equipment_id} was checked in without a valid operator or authorized user"
        alerts.append((row.equipment_id, "unauthorized_access", message, "high"))
    return alerts
