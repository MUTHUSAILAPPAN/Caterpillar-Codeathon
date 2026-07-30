from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class RentalLog(Base):
    __tablename__ = "rental_logs"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, ForeignKey("equipment.id"), nullable=False)
    site_id = Column(String, nullable=True)
    operator_id = Column(String, nullable=True)
    checked_by_user_id = Column(Integer, nullable=True)
    check_in_date = Column(String, nullable=True)
    check_out_date = Column(String, nullable=True)
    action = Column(String, nullable=True)  # 'checkin' or 'checkout'

    equipment = relationship("Equipment", back_populates="rental_logs")
