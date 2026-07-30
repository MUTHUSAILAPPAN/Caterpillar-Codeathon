from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, ForeignKey("equipment.id"), nullable=False)
    alert_type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    severity = Column(String, default="medium")
    is_resolved = Column(Boolean, default=False)
    created_at = Column(String, nullable=True)

    equipment = relationship("Equipment", back_populates="alerts")
    equipment_id = Column(String) # REFERENCES equipment(id)
    alert_type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    severity = Column(String, server_default='medium')
    is_resolved = Column(Boolean, server_default='false')
    created_at = Column(DateTime, server_default=func.now())
