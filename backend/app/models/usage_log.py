from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, ForeignKey("equipment.id"), nullable=False)
    log_date = Column(String, nullable=False)
    engine_hours = Column(Float, nullable=True)
    idle_hours = Column(Float, nullable=True)
    fuel_usage = Column(Float, nullable=True)
    location = Column(String, nullable=True)

    equipment = relationship("Equipment", back_populates="usage_logs")
