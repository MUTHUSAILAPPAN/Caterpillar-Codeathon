from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    for t in ['equipment', 'usage_logs', 'rental_logs', 'alerts', 'operators', 'sites', 'forecasts']:
        count = conn.execute(text(f"SELECT COUNT(*) FROM {t}")).scalar()
        print(f"{t}: {count} rows")
        if count > 0 and count <= 5:
            rows = conn.execute(text(f"SELECT * FROM {t} LIMIT 2")).fetchall()
            for r in rows:
                print(" ", dict(r._mapping))
