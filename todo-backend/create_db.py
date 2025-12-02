from sqlmodel import SQLModel, create_engine
from app.models import User, Task  # adjust import if needed

# Create SQLite engine
engine = create_engine("sqlite:///todo.db", echo=True)

# Create all tables based on your current models
SQLModel.metadata.create_all(engine)

print("Database and tables created successfully!")
