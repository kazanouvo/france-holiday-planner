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
    assert data["total_distance_km"] > 0
    assert data["best_for"] in ("car", "train")

def test_route_optimization_with_stops():
    r = client.post(
        "/api/routes/optimize",
        json={"start": "Paris", "end": "Marseille", "stops": ["Lyon", "Nice"], "transport": "auto"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["route"][0] == "Paris"
    assert data["route"][-1] == "Marseille"
    assert "Lyon" in data["route"] and "Nice" in data["route"]
    assert len(data["legs"]) == 3

def test_trip_crud_and_expense():
    # Create
    r = client.post("/api/trips", json={"title":"Test Trip","dates":"1 Jan","currency":"EUR","budget":100,"stops":[],"expenses":[]})
    assert r.status_code == 201
    tid = r.json()["id"]
    # Get
    r = client.get(f"/api/trips/{tid}")
    assert r.status_code == 200
    assert r.json()["title"] == "Test Trip"
    # List
    r = client.get("/api/trips")
    assert r.status_code == 200
    assert any(t["id"] == tid for t in r.json()["trips"])
    # Add expense
    r = client.post(f"/api/trips/{tid}/expenses", json={"category":"Food","item":"Lunch","date":"","amount":15.00})
    assert r.status_code == 201
    expense_id = r.json()["id"]
    # Get summary (under budget)
    r = client.get(f"/api/trips/{tid}/summary")
    assert r.status_code == 200
    assert r.json()["budget_status"] == "under_budget"
    # Delete expense
    r = client.delete(f"/api/trips/{tid}/expenses/{expense_id}")
    assert r.status_code == 200
    # Delete trip
    r = client.delete(f"/api/trips/{tid}")
    assert r.status_code == 200
    assert r.json()["ok"] is True

def test_budget_status_on_budget():
    # Create trip with budget 100
    r = client.post("/api/trips", json={"title":"Budget Trip","dates":"1-2","currency":"EUR","budget":100,"stops":[]})
    assert r.status_code == 201
    tid = r.json()["id"]
    # Add exact-budget expense
    r = client.post(f"/api/trips/{tid}/expenses", json={"category":"Food","item":"Meal","date":"","amount":100.00})
    assert r.status_code == 201
    # Summary must show on_budget
    r = client.get(f"/api/trips/{tid}/summary")
    assert r.status_code == 200
    summary = r.json()
    assert summary["budget_status"] == "on_budget"
    assert summary["budget_remaining"] == 0.0
    # Cleanup
    client.delete(f"/api/trips/{tid}")
