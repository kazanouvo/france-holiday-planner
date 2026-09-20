import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="France Holiday Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
)

@app.get("/health")
def health():
    return {"status":"healthy","service":"france-holiday-planner"}

@app.get("/")
def root():
    return {"service":"france-holiday-planner","message":"Frontend at port 3000"}
