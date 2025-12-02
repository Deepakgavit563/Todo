from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Body
from .database import init_db, get_session
from .models import User, Task
from .schemas import UserCreate, UserRead, Token, TaskCreate, TaskRead
from .auth import hash_password, verify_password, create_access_token, get_current_user
from app import models, database, schemas
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/auth/signup", response_model=UserRead)
def signup(user_in: UserCreate, session: Session = Depends(get_session)):
    statement = select(User).where((User.username == user_in.username) | (User.email == user_in.email))
    existing = session.exec(statement).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with that username or email already exists")
    user = User(username=user_in.username, email=user_in.email, hashed_password=hash_password(user_in.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@app.post("/auth/login", response_model=Token)
def login_json(
    credentials: dict = Body(...),  # Expect JSON like { "username": "...", "password": "..." }
    session: Session = Depends(get_session)
):
    username_or_email = credentials.get("username")
    password = credentials.get("password")

    if not username_or_email or not password:
        raise HTTPException(status_code=400, detail="Username and password required")

    statement = select(User).where(
        (User.username == username_or_email) | (User.email == username_or_email)
    )
    user = session.exec(statement).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/profile", response_model=UserRead)
def profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/tasks", response_model=list[TaskRead])
def list_tasks(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Task).where(Task.owner_id == current_user.id).order_by(Task.created_at.desc())
    tasks = session.exec(statement).all()
    return tasks

@app.post("/tasks", response_model=TaskRead)
def create_task(task_in: TaskCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    task = Task(title=task_in.title, description=task_in.description, owner_id=current_user.id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@app.patch("/tasks/{task_id}/toggle", response_model=TaskRead)
def toggle_task(task_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    task = session.get(Task, task_id)
    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = not task.completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    task = session.get(Task, task_id)

    if not task or task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"detail": "Task deleted"}