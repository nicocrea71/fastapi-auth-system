from pymongo import MongoClient
import os, dotenv
from passlib.context import CryptContext

dotenv.load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MONGODB_URL = os.getenv("MONGODB_URL")
client = MongoClient(MONGODB_URL)
db = client["fastapi_login_logout"]
users = db["users"]

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(email: str):
    return users.find_one({"email": email.lower()})

def create_user(email: str, password: str):
    hashed_pw = hash_password(password)
    user_data = {"email": email.lower(), "password": hashed_pw}
    users.insert_one(user_data)
    return user_data