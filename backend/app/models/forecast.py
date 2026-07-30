from sqlalchemy import Column, Integer, String, Date, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    equipment_type = Column(String, nullable=False)
    site_id = Column(String) # REFERENCES sites(id)
    predicted_demand_date = Column(Date)
    predicted_units_needed = Column(Integer)
    confidence = Column(Float)
    recommended_action = Column(String)
    generated_at = Column(DateTime, server_default=func.now())
