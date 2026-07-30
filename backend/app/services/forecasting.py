from sqlalchemy.orm import Session
from sqlalchemy import text
import pandas as pd
from datetime import timedelta
from app.models.forecast import Forecast

def generate_forecasts(db: Session):
    # 1. Query usage_logs joined with equipment, grouped by equipment.type and equipment.site_id
    query = """
        SELECT 
            e.type AS equipment_type,
            e.site_id,
            e.id AS equipment_id,
            e.rental_days,
            ul.log_date,
            ul.engine_hours,
            ul.idle_hours
        FROM equipment e
        JOIN usage_logs ul ON e.id = ul.equipment_id
    """
    
    # Load into pandas for simple aggregation (MVP approach)
    df = pd.read_sql(query, db.bind)
    
    if df.empty:
        return []
        
    forecasts_to_create = []
    
    # Group by equipment_type and site_id
    grouped = df.groupby(['equipment_type', 'site_id'])
    
    for (eq_type, site_id), group in grouped:
        # Sort chronologically
        group = group.sort_values('log_date')
        
        # 2 & 3. Simple moving average over available logs to predict needed units for next rental window
        # We calculate the average gap between distinct rental logs and number of unique active equipments
        # For this simple model, we assume predicted units is proportional to unique active equipment in the history
        # A simple linear logic: if it's rented often, predict a base need + 1
        unique_equipment = group['equipment_id'].nunique()
        predicted_units = max(1, int(unique_equipment * 1.2)) # simple growth factor
        
        # Predicted demand date = max(log_date) + average historical gap
        # If not enough data for gap, default to 7 days
        unique_dates = group['log_date'].sort_values().drop_duplicates()
        if len(unique_dates) > 1:
            diffs = unique_dates.diff().dt.days.dropna()
            avg_gap = diffs.mean()
        else:
            avg_gap = 7.0
            
        last_log_date = pd.to_datetime(group['log_date'].max())
        predicted_date = (last_log_date + timedelta(days=max(1, int(avg_gap)))).date()
        
        # 4. Confidence score: based on number of historical data points (min 10 points for 1.0 confidence)
        num_data_points = len(group)
        confidence = min(1.0, num_data_points / 10.0)
        
        # 5. Generate a recommended_action string
        action = f"Pre-position {predicted_units} {eq_type}(s) at Site {site_id} before {predicted_date}"
        
        forecast = Forecast(
            equipment_type=eq_type,
            site_id=site_id,
            predicted_demand_date=predicted_date,
            predicted_units_needed=predicted_units,
            confidence=confidence,
            recommended_action=action
        )
        forecasts_to_create.append(forecast)
        
    # Write results into the forecasts table
    db.bulk_save_objects(forecasts_to_create)
    db.commit()
    
    # Return the newly generated forecasts by querying them back or returning the objects
    # Note: bulk_save_objects doesn't populate IDs, so we query them or just return what we have
    return forecasts_to_create

def get_underutilized_equipment(db: Session, customer_id: str = None):
    # 6. Under-utilization rule: 
    # engine_hours_per_day < 0.3 * (engine_hours_per_day + idle_hours_per_day) relative to rental_days
    
    query = """
        SELECT 
            id, type, site_id, customer_id, rental_days, 
            engine_hours_per_day, idle_hours_per_day 
        FROM equipment
        WHERE rental_days > 0
        AND engine_hours_per_day < 0.3 * (engine_hours_per_day + idle_hours_per_day)
    """
    
    if customer_id:
        # Use parameterized query
        result = db.execute(text(query + " AND customer_id = :cust_id"), {"cust_id": customer_id}).fetchall()
    else:
        result = db.execute(text(query)).fetchall()
    
    underutilized = []
    for row in result:
        underutilized.append({
            "id": row.id,
            "type": row.type,
            "site_id": row.site_id,
            "customer_id": row.customer_id,
            "rental_days": row.rental_days,
            "engine_hours_per_day": row.engine_hours_per_day,
            "idle_hours_per_day": row.idle_hours_per_day
        })
        
    return underutilized
