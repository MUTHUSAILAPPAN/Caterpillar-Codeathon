from sqlalchemy import Column, String
from app.db.session import Base


class Operator(Base):
    __tablename__ = "operators"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
