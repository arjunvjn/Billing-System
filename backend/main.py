from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from database import Base, engine
from product.routes import router as product_router
from order.routes import router as order_router

load_dotenv()

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(product_router)
app.include_router(order_router)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in allowed_origins.split(",") if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
