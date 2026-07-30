from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.equipment import Equipment
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentOut
from app.api.deps import get_current_user, require_admin

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("", response_model=List[EquipmentOut])
def list_equipment(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return db.query(Equipment).all()


@router.get("/{eq_id}", response_model=EquipmentOut)
def get_equipment(eq_id: str, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    eq = db.query(Equipment).filter(Equipment.id == eq_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return eq


@router.post("", response_model=EquipmentOut, status_code=201)
def create_equipment(payload: EquipmentCreate, db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    if db.query(Equipment).filter(Equipment.id == payload.id).first():
        raise HTTPException(status_code=400, detail="Equipment ID already exists")
    eq = Equipment(**payload.model_dump())
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return eq


@router.patch("/{eq_id}", response_model=EquipmentOut)
def update_equipment(eq_id: str, payload: EquipmentUpdate, db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    eq = db.query(Equipment).filter(Equipment.id == eq_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(eq, k, v)
    db.commit()
    db.refresh(eq)
    return eq


@router.delete("/{eq_id}", status_code=204)
def delete_equipment(eq_id: str, db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    eq = db.query(Equipment).filter(Equipment.id == eq_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    db.delete(eq)
    db.commit()
