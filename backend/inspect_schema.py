from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    for t in ['usage_logs', 'rental_logs', 'alerts', 'operators', 'sites', 'forecasts']:
        result = conn.execute(text(
            f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name='{t}' ORDER BY ordinal_position"
        ))
        rows = result.fetchall()
        print(f"\n{t}:")
        for row in rows:
            print(f"  {row[0]}: {row[1]}")
