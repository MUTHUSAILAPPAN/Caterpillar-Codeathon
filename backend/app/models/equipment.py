from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    site_id = Column(String, nullable=True)
    customer_id = Column(Integer, nullable=True)
    check_in_date = Column(String, nullable=True)
    check_out_date = Column(String, nullable=True)
    engine_hours_per_day = Column(Float, nullable=True)
    idle_hours_per_day = Column(Float, nullable=True)
    rental_days = Column(Integer, nullable=True)
    last_operator_id = Column(String, nullable=True)
    status = Column(String, default="available")
    condition_status = Column(String, default="operational")
    dealer_name = Column(String, nullable=True)
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    outside_geofence = Column(Boolean, default=False)

    usage_logs = relationship("UsageLog", back_populates="equipment", cascade="all, delete-orphan")
    rental_logs = relationship("RentalLog", back_populates="equipment", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="equipment", cascade="all, delete-orphan")
