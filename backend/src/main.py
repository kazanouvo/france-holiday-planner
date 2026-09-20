import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

DB_FILE = os.environ.get("TRIP_DB", "trips.json")

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"trips": []}

def save_db(db):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

app = FastAPI(title="Trip Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
)

class Stop(BaseModel):
    date: str
    place: str
    note: Optional[str] = ""

class Trip(BaseModel):
    title: str
    dates: str
    currency: str
    budget: Optional[float] = None
    stops: List[Stop] = []

class TripCreate(Trip):
    pass

@app.get("/health")
def health():
    return {"status": "healthy", "service": "trip-planner"}

@app.get("/api/trips")
def list_trips():
    db = load_db()
    return {"trips": db["trips"]}

@app.get("/api/trips/{trip_id}")
def get_trip(trip_id: str):
    db = load_db()
    for t in db["trips"]:
        if str(t["id"]) == str(trip_id):
            return t
    return {"error": "Trip not found"}, 404

@app.post("/api/trips")
def create_trip(trip: TripCreate):
    db = load_db()
    trip_id = len(db["trips"]) + 1
    t = {"id": trip_id, **trip.dict()}
    db["trips"].append(t)
    save_db(db)
    return t

@app.put("/api/trips/{trip_id}")
def update_trip(trip_id: str, trip: Trip):
    db = load_db()
    for i, t in enumerate(db["trips"]):
        if str(t["id"]) == str(trip_id):
            db["trips"][i] = {"id": int(trip_id), **trip.dict()}
            save_db(db)
            return db["trips"][i]
    return {"error": "Trip not found"}, 404

@app.delete("/api/trips/{trip_id}")
def delete_trip(trip_id: str):
    db = load_db()
    db["trips"] = [t for t in db["trips"] if str(t["id"]) != str(trip_id)]
    save_db(db)
    return {"ok": True}
