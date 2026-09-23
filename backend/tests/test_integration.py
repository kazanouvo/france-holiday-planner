"""
Integration tests for France Holiday Planner API.
Tests full user workflows that combine multiple endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_full_trip_planning_workflow():
    """Test a complete trip planning workflow from creation to expense tracking."""
    # 1. Create a new trip
    trip_data = {
        "title": "Integration Test Trip",
        "dates": "15 July – 25 July",
        "currency": "EUR",
        "budget": 3000.0,
        "stops": [],
        "expenses": []
    }
    
    create_response = client.post("/api/trips", json=trip_data)
    assert create_response.status_code == 201
    trip = create_response.json()
    trip_id = trip["id"]
    
    # 2. Verify trip was created correctly
    get_response = client.get(f"/api/trips/{trip_id}")
    assert get_response.status_code == 200
    retrieved_trip = get_response.json()
    assert retrieved_trip["title"] == "Integration Test Trip"
    assert retrieved_trip["budget"] == 3000.0
    
    # 3. Add several expenses
    expenses_to_add = [
        {"category": "Flights", "item": "Dublin → Paris", "date": "15 July", "amount": 350.0},
        {"category": "Accommodation", "item": "Airbnb Paris", "date": "", "amount": 1200.0},
        {"category": "Food", "item": "Restaurant meals", "date": "", "amount": 400.0},
        {"category": "Transport", "item": "Train Paris → Lyon", "date": "16 July", "amount": 80.0},
        {"category": "Activities", "item": "Louvre Museum", "date": "17 July", "amount": 45.0},
    ]
    
    for expense_data in expenses_to_add:
        expense_response = client.post(
            f"/api/trips/{trip_id}/expenses", 
            json=expense_data
        )
        assert expense_response.status_code == 201
        expense = expense_response.json()
        assert "id" in expense
        assert expense["amount"] == expense_data["amount"]
    
    # 4. Check budget status after expenses
    summary_response = client.get(f"/api/trips/{trip_id}/summary")
    assert summary_response.status_code == 200
    summary = summary_response.json()
    
    expected_total = 350.0 + 1200.0 + 400.0 + 80.0 + 45.0  # 2075.0
    assert summary["total_spent"] == expected_total
    assert summary["budget_remaining"] == 3000.0 - expected_total  # 925.0
    assert summary["budget_status"] == "under_budget"
    assert summary["expense_count"] == 5
    
    # 5. Add an expense that puts us over budget
    over_budget_expense = {
        "category": "Shopping", 
        "item": "Designer bag", 
        "date": "20 July", 
        "amount": 1500.0  # This will put us over budget
    }
    
    over_response = client.post(
        f"/api/trips/{trip_id}/expenses", 
        json=over_budget_expense
    )
    assert over_response.status_code == 201
    
    # 6. Check budget status is now over_budget
    summary_response = client.get(f"/api/trips/{trip_id}/summary")
    assert summary_response.status_code == 200
    summary = summary_response.json()
    
    expected_total_with_over = expected_total + 1500.0  # 3575.0
    assert summary["total_spent"] == expected_total_with_over
    assert summary["budget_remaining"] == 3000.0 - expected_total_with_over  # -575.0
    assert summary["budget_status"] == "over_budget"
    
    # 7. Remove the expensive item to get back under budget
    delete_response = client.delete(
        f"/api/trips/{trip_id}/expenses/{over_response.json()['id']}"
    )
    assert delete_response.status_code == 200
    
    # 8. Verify we're back under budget
    summary_response = client.get(f"/api/trips/{trip_id}/summary")
    assert summary_response.status_code == 200
    summary = summary_response.json()
    assert summary["budget_status"] == "under_budget"
    assert summary["total_spent"] == expected_total  # Back to 2075.0
    
    # 9. Clean up - delete the trip
    delete_trip_response = client.delete(f"/api/trips/{trip_id}")
    assert delete_trip_response.status_code == 200
    assert delete_trip_response.json()["ok"] is True
    
    # 10. Verify trip is gone
    final_get = client.get(f"/api/trips/{trip_id}")
    assert final_get.status_code == 404


def test_route_optimization_integration():
    """Test route optimization with multiple stops and different transport options."""
    # Test a complex route with multiple stops
    route_request = {
        "start": "Paris",
        "end": "Nice",
        "stops": ["Lyon", "Marseille", "Toulouse", "Bordeaux", "Nantes"],
        "transport": "auto",
        "budget": 500.0
    }
    
    response = client.post("/api/routes/optimize", json=route_request)
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert "route" in data
    assert "legs" in data
    assert "total_distance_km" in data
    assert "estimated_hours" in data
    assert "estimated_cost" in data
    assert "recommended_transport" in data
    assert "best_for" in data
    
    # Verify route starts and ends correctly
    assert data["route"][0] == "Paris"
    assert data["route"][-1] == "Nice"
    
    # Verify all stops are included in the route
    for stop in ["Lyon", "Marseille", "Toulouse", "Bordeaux", "Nantes"]:
        assert stop in data["route"]
    
    # Verify legs count (should be stops + 1)
    assert len(data["legs"]) == len(route_request["stops"]) + 1
    
    # Verify cost is within budget (if budget was provided and used)
    # Note: The API doesn't currently enforce budget in route optimization, 
    # but we can verify the cost is calculated
    assert data["estimated_cost"] >= 0
    assert data["estimated_hours"] >= 0
    assert data["total_distance_km"] > 0


def test_trip_plan_endpoint_integration():
    """Test that the trip-plan endpoint returns data that can be used by the frontend."""
    response = client.get("/api/trip-plan")
    assert response.status_code == 200
    data = response.json()
    
    # Verify all required fields for frontend are present
    required_fields = [
        "title", "dates", "currency", "budget", 
        "stops", "expenses", "tips"
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
    
    # Verify data types
    assert isinstance(data["title"], str)
    assert isinstance(data["dates"], str)
    assert isinstance(data["currency"], str)
    assert isinstance(data["budget"], (int, float))
    assert isinstance(data["stops"], list)
    assert isinstance(data["expenses"], list)
    assert isinstance(data["tips"], list)
    
    # Verify stops have required structure
    for stop in data["stops"]:
        assert "date" in stop
        assert "place" in stop
        assert "note" in stop
        assert isinstance(stop["date"], str)
        assert isinstance(stop["place"], str)
        assert isinstance(stop["note"], str)
    
    # Verify expenses have required structure
    for expense in data["expenses"]:
        assert "category" in expense
        assert "item" in expense
        assert "date" in expense
        assert "amount" in expense
        assert isinstance(expense["category"], str)
        assert isinstance(expense["item"], str)
        assert isinstance(expense["date"], str)
        assert isinstance(expense["amount"], (int, float))
        assert expense["amount"] >= 0  # Pydantic validation
    
    # Verify tips are strings
    for tip in data["tips"]:
        assert isinstance(tip, str)
        assert len(tip) > 0


def test_health_and_destinations_endpoints():
    """Test basic endpoints that frontend relies on for initialization."""
    # Test health endpoint
    health_response = client.get("/health")
    assert health_response.status_code == 200
    health_data = health_response.json()
    assert health_data["status"] == "healthy"
    assert health_data["service"] == "france-holiday-planner"
    
    # Test destinations endpoint
    destinations_response = client.get("/api/destinations")
    assert destinations_response.status_code == 200
    destinations_data = destinations_response.json()
    assert "destinations" in destinations_data
    assert isinstance(destinations_data["destinations"], list)
    assert len(destinations_data["destinations"]) > 0
    
    # Verify each destination has required fields
    for dest in destinations_data["destinations"]:
        assert "name" in dest
        assert "latitude" in dest
        assert "longitude" in dest
        assert isinstance(dest["name"], str)
        assert isinstance(dest["latitude"], (int, float))
        assert isinstance(dest["longitude"], (int, float))


def test_concurrent_trip_creation():
    """Test that multiple trips can be created without ID conflicts."""
    trip_ids = []
    
    # Create 5 trips in quick succession
    for i in range(5):
        trip_data = {
            "title": f"Concurrent Trip {i}",
            "dates": f"{10+i} July",
            "currency": "EUR",
            "budget": 1000.0 + i*100,
            "stops": [],
            "expenses": []
        }
        
        response = client.post("/api/trips", json=trip_data)
        assert response.status_code == 201
        trip = response.json()
        trip_ids.append(trip["id"])
    
    # Verify all trips have unique IDs
    assert len(set(trip_ids)) == len(trip_ids)
    
    # Verify each trip can be retrieved individually
    for trip_id in trip_ids:
        get_response = client.get(f"/api/trips/{trip_id}")
        assert get_response.status_code == 200
        retrieved_trip = get_response.json()
        assert retrieved_trip["id"] == trip_id
        assert f"Concurrent Trip {trip_ids.index(trip_id)}" in retrieved_trip["title"]
    
    # Clean up - delete all trips
    for trip_id in trip_ids:
        delete_response = client.delete(f"/api/trips/{trip_id}")
        assert delete_response.status_code == 200
        assert delete_response.json()["ok"] is True


def test_expense_id_sequential_per_trip():
    """Test that expense IDs are sequential within each trip."""
    # Create a trip
    trip_data = {
        "title": "Expense ID Test",
        "dates": "1 Aug",
        "currency": "EUR",
        "budget": 500.0,
        "stops": [],
        "expenses": []
    }
    
    trip_response = client.post("/api/trips", json=trip_data)
    assert trip_response.status_code == 201
    trip_id = trip_response.json()["id"]
    
    # Add three expenses and verify IDs are sequential
    expense_ids = []
    for i in range(3):
        expense_data = {
            "category": "Test",
            "item": f"Item {i}",
            "date": "",
            "amount": 10.0 * (i+1)
        }
        
        expense_response = client.post(
            f"/api/trips/{trip_id}/expenses", 
            json=expense_data
        )
        assert expense_response.status_code == 201
        expense = expense_response.json()
        expense_ids.append(expense["id"])
    
    # Verify IDs are sequential (1, 2, 3)
    assert expense_ids == [1, 2, 3]
    
    # Clean up
    client.delete(f"/api/trips/{trip_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])