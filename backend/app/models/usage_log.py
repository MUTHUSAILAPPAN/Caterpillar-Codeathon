from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Float, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, nullable=False, index=True)
    log_date = Column(Date, nullable=False, index=True)
    engine_hours = Column(Float, nullable=False, default=0.0)
    idle_hours = Column(Float, nullable=False, default=0.0)
    fuel_usage = Column(Float, nullable=False, default=0.0)
    location = Column(String, nullable=False)
    dealer_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"UsageLog(id={self.id}, equipment_id={self.equipment_id!r}, log_date={self.log_date!r})"
    equipment_id = Column(String, ForeignKey("equipment.id"), nullable=False)
    log_date = Column(String, nullable=False)
    engine_hours = Column(Float, nullable=True)
    idle_hours = Column(Float, nullable=True)
    fuel_usage = Column(Float, nullable=True)
    location = Column(String, nullable=True)

    equipment = relationship("Equipment", back_populates="usage_logs")
