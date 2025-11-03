from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
from database import get_user_by_email, create_user, verify_password
import os
from pathlib import Path


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # devlopment only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# frontend_dir = os.path.join(os.path.dirname(__file__), "../frontend/dist")
frontend_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
app.mount("/assets", StaticFiles(directory=frontend_dir / "assets"), name="assets")


# JWT Config
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")




class UserData(BaseModel):
    email: str
    password: str


def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    """Create a JWT access token with expiry."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(401, "Invalid token payload")
        is_user = get_user_by_email(email)
        if is_user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.post("/api/signup")
async def signup(user: UserData):
    email = user.email.lower()

    is_user = get_user_by_email(email)
    if is_user:
        return {"ok": False, "message": "User already exists"}

    create_user(email, user.password)
    return {"ok": True, "message": "User created successfully, please log in."}


@app.post("/api/login")
async def login(user: UserData):
    email = user.email.lower()
    password = user.password

    is_user = get_user_by_email(email)
    if not is_user:
        return {"ok": False, "message": "Invalid email or password"}
    
    if not verify_password(password, is_user["password"]):
        return {"ok": False, "message": "Invalid email or password"}


    access_token = create_access_token(data={"sub": email.lower()})
    return {"ok": True, "access_token": access_token, "token_type": "bearer"}


@app.get("/api/user")
async def get_user(token: str = Depends(oauth2_scheme)):
    email = verify_access_token(token)
    return {"ok": True, "email": email, "message": "User authenticated successfully"}


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    index_path = os.path.join(frontend_dir, "index.html")
    return FileResponse(index_path)