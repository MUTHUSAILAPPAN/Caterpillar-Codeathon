from sqlalchemy import Column, String, Float
from app.db.session import Base


class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    center_lat = Column(Float, nullable=True)
    center_lng = Column(Float, nullable=True)
    geofence_radius_m = Column(Float, nullable=True)
