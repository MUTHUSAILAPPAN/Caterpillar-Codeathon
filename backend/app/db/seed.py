"""Run: python -m app.db.seed  (from backend/)"""
from app.db.session import SessionLocal
from app.models.equipment import Equipment
from app.models.usage_log import UsageLog
from app.models.rental_log import RentalLog
from app.models.alert import Alert

EQUIPMENT = [
    {"id": "EQ-001", "type": "Excavator 320", "customer": "BuildCo Ltd", "site": "Site Alpha", "operator": "James Roe", "status": "Rented", "last_check_in": "2025-07-10 08:30"},
    {"id": "EQ-002", "type": "Bulldozer D6", "customer": "TerraWorks", "site": "Site Beta", "operator": "Maria Chen", "status": "Available", "last_check_in": "2025-07-09 14:15"},
    {"id": "EQ-003", "type": "Crane LTM 1050", "customer": "SkyBuild Inc", "site": "Site Gamma", "operator": "Raj Patel", "status": "Maintenance", "last_check_in": "2025-07-08 11:00"},
    {"id": "EQ-004", "type": "Loader 950M", "customer": "BuildCo Ltd", "site": "Site Alpha", "operator": "Sara Kim", "status": "Rented", "last_check_in": "2025-07-10 07:45"},
    {"id": "EQ-005", "type": "Compactor CS56", "customer": "RoadMasters", "site": "Site Delta", "operator": "Tom Blake", "status": "Unauthorized", "last_check_in": "2025-07-10 03:22"},
    {"id": "EQ-006", "type": "Grader 140M", "customer": "TerraWorks", "site": "Site Beta", "operator": "Lena Fox", "status": "Available", "last_check_in": "2025-07-07 16:00"},
    {"id": "EQ-007", "type": "Backhoe 420F", "customer": "SkyBuild Inc", "site": "Site Gamma", "operator": "Chris Wu", "status": "Rented", "last_check_in": "2025-07-10 09:10"},
    {"id": "EQ-008", "type": "Telehandler TH357", "customer": "RoadMasters", "site": "Site Delta", "operator": "Nina Ross", "status": "Available", "last_check_in": "2025-07-06 13:30"},
]

USAGE_LOGS = [
    {"equipment_id": "EQ-001", "operator": "James Roe", "hours": 8.5, "fuel_used": 45.0, "date": "2025-07-10", "notes": "Normal operation"},
    {"equipment_id": "EQ-001", "operator": "James Roe", "hours": 7.0, "fuel_used": 38.0, "date": "2025-07-09"},
    {"equipment_id": "EQ-002", "operator": "Maria Chen", "hours": 6.0, "fuel_used": 30.0, "date": "2025-07-09"},
    {"equipment_id": "EQ-003", "operator": "Raj Patel", "hours": 4.0, "fuel_used": 20.0, "date": "2025-07-08", "notes": "Maintenance check"},
    {"equipment_id": "EQ-004", "operator": "Sara Kim", "hours": 9.0, "fuel_used": 50.0, "date": "2025-07-10"},
    {"equipment_id": "EQ-005", "operator": "Tom Blake", "hours": 3.0, "fuel_used": 15.0, "date": "2025-07-10", "notes": "Unauthorized usage detected"},
    {"equipment_id": "EQ-007", "operator": "Chris Wu", "hours": 8.0, "fuel_used": 42.0, "date": "2025-07-10"},
    {"equipment_id": "EQ-001", "operator": "James Roe", "hours": 7.5, "fuel_used": 40.0, "date": "2025-06-30"},
    {"equipment_id": "EQ-004", "operator": "Sara Kim", "hours": 8.0, "fuel_used": 44.0, "date": "2025-06-29"},
    {"equipment_id": "EQ-007", "operator": "Chris Wu", "hours": 6.5, "fuel_used": 35.0, "date": "2025-06-28"},
]

RENTAL_LOGS = [
    {"equipment_id": "EQ-001", "customer": "BuildCo Ltd", "site": "Site Alpha", "start_date": "2025-07-01 08:00", "end_date": None, "status": "Active", "total_hours": 15.5},
    {"equipment_id": "EQ-004", "customer": "BuildCo Ltd", "site": "Site Alpha", "start_date": "2025-07-05 07:00", "end_date": None, "status": "Active", "total_hours": 17.0},
    {"equipment_id": "EQ-002", "customer": "TerraWorks", "site": "Site Beta", "start_date": "2025-06-15 09:00", "end_date": "2025-07-09 17:00", "status": "Returned", "total_hours": 120.0},
    {"equipment_id": "EQ-007", "customer": "SkyBuild Inc", "site": "Site Gamma", "start_date": "2025-07-08 09:00", "end_date": None, "status": "Active", "total_hours": 8.0},
    {"equipment_id": "EQ-005", "customer": "RoadMasters", "site": "Site Delta", "start_date": "2025-07-09 22:00", "end_date": None, "status": "Active", "total_hours": 3.0},
]

ALERTS = [
    {"equipment_id": "EQ-005", "type": "unauthorized", "message": "Unauthorized access detected on EQ-005 at 03:22", "severity": "critical", "resolved": False, "created_at": "2025-07-10 03:22"},
    {"equipment_id": "EQ-003", "type": "maintenance", "message": "EQ-003 is due for scheduled maintenance", "severity": "high", "resolved": False, "created_at": "2025-07-08 11:00"},
    {"equipment_id": "EQ-001", "type": "geofence", "message": "EQ-001 moved outside designated geofence boundary", "severity": "medium", "resolved": True, "created_at": "2025-07-09 16:45"},
    {"equipment_id": "EQ-004", "type": "anomaly", "message": "Unusual fuel consumption detected on EQ-004", "severity": "low", "resolved": False, "created_at": "2025-07-10 07:50"},
]


def seed():
    db = SessionLocal()
    try:
        if db.query(Equipment).count() > 0:
            print("DB already seeded, skipping.")
            return

        for e in EQUIPMENT:
            db.add(Equipment(**e))
        db.commit()

        for u in USAGE_LOGS:
            db.add(UsageLog(**u))
        db.commit()

        for r in RENTAL_LOGS:
            db.add(RentalLog(**r))
        db.commit()

        for a in ALERTS:
            db.add(Alert(**a))
        db.commit()

        print("Seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
