from datetime import datetime
from pydantic import BaseModel, EmailStr


# -----------------------------
# USER SCHEMAS
# -----------------------------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# -----------------------------
# TOKEN SCHEMA
# -----------------------------
class Token(BaseModel):
    access_token: str
    token_type: str


# -----------------------------
# TASK SCHEMAS
# -----------------------------
class TaskCreate(BaseModel):
    title: str
    description: str | None = None


class TaskRead(BaseModel):
    id: int
    title: str
    description: str | None
    created_at: datetime
    completed: bool

    model_config = {
        "from_attributes": True
    }
