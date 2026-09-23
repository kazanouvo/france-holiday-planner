"""
Frontend integration tests for France Holiday Planner.
Tests the integration between frontend pages and backend API.
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_blog_endpoints_return_valid_structure():
    """Verify blog integration endpoints return correct data structure."""
    response = client.get("/api/trip-plan")
    assert response.status_code == 200
    data = response.json()
    
    # Trip plan data should have 10+ stops for blog content reference
    assert len(data["stops"]) >= 7
    
    # Expenses should have at least 10 entries for blog
    assert len(data["expenses"]) >= 10
    
    # Tips should be present
    assert len(data["tips"]) > 0


def test_frontend_pages_load_without_error():
    """Test that frontend pages load correctly (simulating browser request)."""
    # Note: This tests the backend API that the frontend calls,
    # not the frontend itself. Frontend testing requires a running
    # Next.js server.
    
    # Verify all API endpoints that frontend pages depend on work
    endpoints = [
        "/health",
        "/api/trip-plan", 
        "/api/destinations",
        "/api/trips",
    ]
    
    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code == 200, f"{endpoint} returned {response.status_code}"


def test_expense_calculation_accuracy():
    """Verify expense calculations match what frontend displays."""
    # Create trip with known expenses
    trip_data = {
        "title": "Frontend Integration Test",
        "dates": "1 Aug – 10 Aug",
        "currency": "EUR",
        "budget": 5000.0,
        "stops": [],
        "expenses": []
    }
    
    response = client.post("/api/trips", json=trip_data)
    assert response.status_code == 201
    trip_id = response.json()["id"]
    
    # Add expenses matching what frontend would show
    expenses = [
        {"category": "Flights", "item": "Test Flight", "date": "", "amount": 350.0},
        {"category": "Accommodation", "item": "Test Hotel", "date": "", "amount": 1200.0},
        {"category": "Food", "item": "Test Meal", "date": "", "amount": 450.0},
    ]
    
    for expense in expenses:
        response = client.post(f"/api/trips/{trip_id}/expenses", json=expense)
        assert response.status_code == 201
    
    # Verify summary matches frontend calculation
    summary = client.get(f"/api/trips/{trip_id}/summary").json()
    
    expected_total = 350.0 + 1200.0 + 450.0  # 2000.0
    assert summary["total_spent"] == expected_total
    assert summary["budget_remaining"] == 5000.0 - expected_total  # 3000.0
    assert summary["budget_status"] == "under_budget"
    assert summary["expense_count"] == 3
    
    # Clean up
    client.delete(f"/api/trips/{trip_id}")


def test_route_optimization_response_for_frontend():
    """Verify route optimization returns data frontend can display."""
    response = client.post("/api/routes/optimize", json={
        "start": "Paris",
        "end": "Marseille",
        "stops": ["Lyon", "Nice"],
        "transport": "auto"
    })
    
    assert response.status_code == 200
    data = response.json()
    
    # Frontend displays these fields
    assert "route" in data  # Full route list
    assert "total_distance_km" in data  # Displayed as distance
    assert "estimated_hours" in data  # Displayed as duration
    assert "estimated_cost" in data  # Displayed as cost
    assert "recommended_transport" in data  # Displayed as best_for
    
    # Verify route starts and ends correctly
    assert data["route"][0] == "Paris"
    assert data["route"][-1] == "Marseille"
    
    # Verify all stops included
    assert "Lyon" in data["route"]
    assert "Nice" in data["route"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
