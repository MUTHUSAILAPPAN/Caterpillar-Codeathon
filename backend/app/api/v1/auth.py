from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import ADMIN_EMAIL, ADMIN_PASSWORD

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if payload.email == ADMIN_EMAIL:
        raise HTTPException(status_code=400, detail="Email already in use")

    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="customer",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "role": user.role, "name": user.name})
    return TokenResponse(access_token=token, role=user.role, name=user.name)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Hardcoded admin check
    if payload.email == ADMIN_EMAIL:
        if payload.password != ADMIN_PASSWORD:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token({"sub": ADMIN_EMAIL, "role": "admin", "name": "Admin"})
        return TokenResponse(access_token=token, role="admin", name="Admin")

    # DB customer check
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email, "role": user.role, "name": user.name})
    return TokenResponse(access_token=token, role=user.role, name=user.name)
