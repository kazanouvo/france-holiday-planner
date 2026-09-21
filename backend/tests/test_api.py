import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"

def test_route_optimization():
    r = client.post("/api/optimize-route?start=Paris&end=Marseille&budget=500")
    assert r.status_code == 200
    data = r.json()
    assert data["route"] == ["Paris", "Marseille"]
    assert data["distance_km"] > 0
    assert data["best_for"] in ("car", "train")

def test_trip_crud():
    # Create
    r = client.post("/api/trips", json={"title":"Test Trip","dates":"1 Jan","currency":"EUR","budget":100,"stops":[]})
    assert r.status_code == 200
    tid = r.json()["id"]
    # Get
    r = client.get(f"/api/trips/{tid}")
    assert r.status_code == 200
    assert r.json()["title"] == "Test Trip"
    # List
    r = client.get("/api/trips")
    assert r.status_code == 200
    assert any(t["id"] == tid for t in r.json()["trips"])
    # Delete
    r = client.delete(f"/api/trips/{tid}")
    assert r.status_code == 200
    assert r.json()["ok"] is True