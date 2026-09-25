from __future__ import annotations

import json
import math
import os
import unicodedata
from itertools import permutations
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="France Holiday Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_DB_PATH = Path(__file__).resolve().parents[1] / "trips.json"
TRIPS_FILE = Path(os.environ.get("TRIPS_FILE", str(DEFAULT_DB_PATH))).expanduser()
DB_LOCK = Lock()


class Stop(BaseModel):
    date: str = ""
    place: str = Field(min_length=1)
    note: str = ""


class Expense(BaseModel):
    category: str = Field(min_length=1)
    item: str = Field(min_length=1)
    date: str = ""
    amount: float = Field(ge=0)


class Trip(BaseModel):
    title: str = Field(min_length=1)
    dates: str = ""
    currency: str = "EUR"
    budget: Optional[float] = Field(default=None, ge=0)
    stops: List[Stop] = Field(default_factory=list)
    expenses: List[Expense] = Field(default_factory=list)


class RouteRequest(BaseModel):
    start: str = Field(min_length=1)
    end: str = Field(min_length=1)
    stops: List[str] = Field(default_factory=list)
    budget: Optional[float] = Field(default=None, ge=0)
    transport: Literal["auto", "car", "train", "flight"] = "auto"


class QuoteRequest(BaseModel):
    origin: str = Field(min_length=1)
    destination: str = Field(min_length=1)
    date: str = ""
    duration_days: int = Field(default=7, ge=1, le=30)


# Canonical destinations and coordinates used by the deterministic planner.
# This avoids depending on a third-party geocoder while still supporting the
# common French holiday route shown in the product.
DESTINATIONS: Dict[str, tuple[float, float, str]] = {
    "paris": (48.8566, 2.3522, "Paris"),
    "lyon": (45.7640, 4.8357, "Lyon"),
    "marseille": (43.2965, 5.3698, "Marseille"),
    "nice": (43.7102, 7.2620, "Nice"),
    "bordeaux": (44.8378, -0.5792, "Bordeaux"),
    "nantes": (47.2184, -1.5536, "Nantes"),
    "strasbourg": (48.5734, 7.7521, "Strasbourg"),
    "lille": (50.6292, 3.0573, "Lille"),
    "rennes": (48.1173, -1.6778, "Rennes"),
    "toulouse": (43.6047, 1.4443, "Toulouse"),
    "montpellier": (43.6108, 3.8767, "Montpellier"),
    "avignon": (43.9493, 4.8055, "Avignon"),
    "hyeres": (43.1209, 6.2397, "Hyères"),
    "dublin": (53.3498, -6.2603, "Dublin"),
}

_transport_aliases = {
    "drive": "car",
    "bus": "train",
}


def load_trips() -> Dict[str, Any]:
    with DB_LOCK:
        if not TRIPS_FILE.exists():
            return {"trips": []}
        try:
            with TRIPS_FILE.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
        except (OSError, json.JSONDecodeError):
            return {"trips": []}
        if not isinstance(data.get("trips"), list):
            return {"trips": []}
        return data


def save_trips(data: Dict[str, Any]) -> None:
    with DB_LOCK:
        TRIPS_FILE.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = TRIPS_FILE.with_suffix(f"{TRIPS_FILE.suffix}.tmp")
        with temporary_path.open("w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2, ensure_ascii=False)
        os.replace(temporary_path, TRIPS_FILE)


def normalize_place(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii").lower()
    return value.replace("&", "and").replace(" ", "_")


def resolve_place(value: str) -> str:
    key = normalize_place(value)
    if not key:
        raise HTTPException(status_code=422, detail="A place name is required")
    destination = DESTINATIONS.get(key)
    if destination is None:
        supported = ", ".join(item[2] for item in DESTINATIONS.values())
        raise HTTPException(
            status_code=400,
            detail=f"Unknown destination '{value}'. Supported places: {supported}",
        )
    return destination[2]


def haversine_km(origin: tuple[float, float], destination: tuple[float, float]) -> float:
    latitude_1, longitude_1 = origin
    latitude_2, longitude_2 = destination
    radius_km = 6371.0
    latitude_1_rad = math.radians(latitude_1)
    latitude_2_rad = math.radians(latitude_2)
    delta_latitude = math.radians(latitude_2 - latitude_1)
    delta_longitude = math.radians(longitude_2 - longitude_1)
    value = (
        math.sin(delta_latitude / 2) ** 2
        + math.cos(latitude_1_rad)
        * math.cos(latitude_2_rad)
        * math.sin(delta_longitude / 2) ** 2
    )
    return radius_km * 2 * math.atan2(math.sqrt(value), math.sqrt(1 - value))


def transport_options(distance_km: float) -> List[Dict[str, Any]]:
    options: List[Dict[str, Any]] = []
    if distance_km <= 900:
        options.append(
            {
                "transport": "train",
                "duration_hours": round(distance_km / 105 + 0.5, 1),
                "estimated_cost": round(max(18.0, distance_km * 0.11), 2),
            }
        )
    if distance_km <= 1200:
        options.append(
            {
                "transport": "car",
                "duration_hours": round(distance_km / 90 + 0.5, 1),
                "estimated_cost": round(max(12.0, distance_km * 0.18), 2),
            }
        )
    if distance_km >= 250:
        options.append(
            {
                "transport": "flight",
                "duration_hours": round(distance_km / 550 + 1.5, 1),
                "estimated_cost": round(max(45.0, distance_km * 0.13), 2),
            }
        )
    return options


def choose_transport(options: List[Dict[str, Any]], requested: str) -> Dict[str, Any]:
    normalized = _transport_aliases.get(requested, requested)
    available = [option for option in options if option["transport"] == normalized]
    if available:
        return available[0]
    if not options:
        return {"transport": "car", "duration_hours": 0.0, "estimated_cost": 0.0}
    if normalized in {"car", "train", "flight"}:
        # The API validates this value, but keep a safe fallback for callers
        # that use an older client.
        return min(options, key=lambda option: option["estimated_cost"])
    if len(options) == 1:
        return options[0]
    if options[0]["transport"] == "flight":
        return options[0]
    return min(options, key=lambda option: option["estimated_cost"])


def optimize_stop_order(stops: List[str]) -> List[str]:
    if not stops:
        return []
    if len(stops) <= 8:
        best_order: Optional[List[str]] = None
        best_distance = float("inf")
        for candidate in permutations(stops):
            distance = sum(
                haversine_km(
                    DESTINATIONS[normalize_place(a)][:2],
                    DESTINATIONS[normalize_place(b)][:2],
                )
                for a, b in zip([stops[0], *candidate], [*candidate, stops[-1]])
            )
            if distance < best_distance:
                best_distance = distance
                best_order = list(candidate)
        return best_order or []

    # Deterministic nearest-neighbour fallback for larger stop lists.
    remaining = list(stops)
    ordered: List[str] = []
    while remaining:
        current = remaining[0]
        nearest = min(
            remaining,
            key=lambda place: haversine_km(
                DESTINATIONS[normalize_place(current)][:2],
                DESTINATIONS[normalize_place(place)][:2],
            ),
        )
        ordered.append(nearest)
        remaining.remove(nearest)
        current = nearest
    return ordered


@app.get("/health")
def health() -> Dict[str, Any]:
    return {"status": "healthy", "service": "france-holiday-planner"}


@app.get("/api/destinations")
def destinations() -> Dict[str, Any]:
    return {"destinations": [{"name": value[2], "latitude": value[0], "longitude": value[1]} for value in DESTINATIONS.values()]}


@app.get("/api/trips")
def list_trips() -> Dict[str, Any]:
    return {"trips": load_trips()["trips"]}


@app.get("/api/trips/{trip_id}")
def get_trip(trip_id: str) -> Dict[str, Any]:
    for trip in load_trips()["trips"]:
        if str(trip["id"]) == str(trip_id):
            return trip
    raise HTTPException(status_code=404, detail="Trip not found")


@app.post("/api/trips", status_code=201)
def create_trip(trip: Trip) -> Dict[str, Any]:
    data = load_trips()
    trip_id = max((int(item["id"]) for item in data["trips"]), default=0) + 1
    result = {"id": trip_id, **trip.model_dump()}
    data["trips"].append(result)
    save_trips(data)
    return result


@app.put("/api/trips/{trip_id}")
def update_trip(trip_id: str, trip: Trip) -> Dict[str, Any]:
    data = load_trips()
    for index, existing_trip in enumerate(data["trips"]):
        if str(existing_trip["id"]) == str(trip_id):
            updated = {"id": int(trip_id), **trip.model_dump()}
            data["trips"][index] = updated
            save_trips(data)
            return updated
    raise HTTPException(status_code=404, detail="Trip not found")


@app.patch("/api/trips/{trip_id}")
def patch_trip(trip_id: str, changes: Dict[str, Any]) -> Dict[str, Any]:
    data = load_trips()
    for index, existing_trip in enumerate(data["trips"]):
        if str(existing_trip["id"]) == str(trip_id):
            updated = {**existing_trip, **changes, "id": int(trip_id)}
            data["trips"][index] = updated
            save_trips(data)
            return updated
    raise HTTPException(status_code=404, detail="Trip not found")


@app.delete("/api/trips/{trip_id}")
def delete_trip(trip_id: str) -> Dict[str, Any]:
    data = load_trips()
    before = len(data["trips"])
    data["trips"] = [trip for trip in data["trips"] if str(trip["id"]) != str(trip_id)]
    if len(data["trips"]) == before:
        raise HTTPException(status_code=404, detail="Trip not found")
    save_trips(data)
    return {"ok": True, "message": "Trip deleted"}


@app.post("/api/trips/{trip_id}/expenses", status_code=201)
def add_expense(trip_id: str, expense: Expense) -> Dict[str, Any]:
    data = load_trips()
    for trip in data["trips"]:
        if str(trip["id"]) == str(trip_id):
            existing_expenses = trip.get("expenses", [])
            next_id = max((int(e.get("id", 0)) for e in existing_expenses), default=0) + 1
            result = {"id": next_id, **expense.model_dump()}
            trip.setdefault("expenses", []).append(result)
            save_trips(data)
            return result
    raise HTTPException(status_code=404, detail="Trip not found")


@app.delete("/api/trips/{trip_id}/expenses/{expense_id}")
def delete_expense(trip_id: str, expense_id: str) -> Dict[str, Any]:
    data = load_trips()
    for trip in data["trips"]:
        if str(trip["id"]) == str(trip_id):
            before = len(trip.get("expenses", []))
            trip["expenses"] = [
                expense
                for expense in trip.get("expenses", [])
                if str(expense.get("id")) != str(expense_id)
            ]
            if len(trip["expenses"]) == before:
                raise HTTPException(status_code=404, detail="Expense not found")
            save_trips(data)
            return {"ok": True, "message": "Expense deleted"}
    raise HTTPException(status_code=404, detail="Trip not found")


@app.get("/api/trips/{trip_id}/summary")
def get_trip_summary(trip_id: str) -> Dict[str, Any]:
    for trip in load_trips()["trips"]:
        if str(trip["id"]) == str(trip_id):
            expenses = trip.get("expenses", [])
            total_spent = sum(float(expense.get("amount", 0)) for expense in expenses)
            budget = trip.get("budget")
            remaining = float(budget) - total_spent if budget is not None else None
            if remaining is None:
                status = "no_budget"
            elif remaining < 0:
                status = "over_budget"
            elif remaining == 0:
                status = "on_budget"
            else:
                status = "under_budget"
            return {
                "trip_id": trip_id,
                "title": trip["title"],
                "total_budget": budget,
                "total_spent": round(total_spent, 2),
                "budget_remaining": round(remaining, 2) if remaining is not None else None,
                "expense_count": len(expenses),
                "budget_status": status,
            }
    raise HTTPException(status_code=404, detail="Trip not found")


def route_response(
    start: str,
    end: str,
    stops: List[str],
    requested_transport: str,
) -> Dict[str, Any]:
    resolved_stops = [resolve_place(place) for place in stops]
    resolved_start = resolve_place(start)
    resolved_end = resolve_place(end)
    ordered_stops = optimize_stop_order(resolved_stops)
    full_route = [resolved_start, *ordered_stops, resolved_end]
    legs: List[Dict[str, Any]] = []
    total_distance = 0.0
    total_hours = 0.0
    total_cost = 0.0

    for origin, destination in zip(full_route, full_route[1:]):
        distance = haversine_km(DESTINATIONS[normalize_place(origin)][:2], DESTINATIONS[normalize_place(destination)][:2])
        options = transport_options(distance)
        selected = choose_transport(options, requested_transport)
        total_distance += distance
        total_hours += selected["duration_hours"]
        total_cost += selected["estimated_cost"]
        legs.append(
            {
                "from": origin,
                "to": destination,
                "distance_km": round(distance, 1),
                **selected,
            }
        )

    transports = {leg["transport"] for leg in legs}
    recommended = next(iter(transports)) if len(transports) == 1 else "mixed"
    return {
        "route": full_route,
        "legs": legs,
        "total_distance_km": round(total_distance, 1),
        "estimated_hours": round(total_hours, 1),
        "estimated_cost": round(total_cost, 2),
        "recommended_transport": recommended,
        "best_for": requested_transport if requested_transport != "auto" else recommended,
    }


@app.post("/api/routes/optimize")
def optimize_route(request: RouteRequest) -> Dict[str, Any]:
    return route_response(request.start, request.end, request.stops, request.transport)


@app.post("/api/optimize-route", include_in_schema=False)
def optimize_route_legacy(
    start: str,
    end: str,
    stops: Optional[List[str]] = None,
    budget: Optional[float] = None,
    transport: Literal["auto", "car", "train", "flight"] = "auto",
) -> Dict[str, Any]:
    return route_response(start, end, stops or [], transport)


# Deterministic cheapest-quote API gateway (flight, insurance, car rental).
# Uses the same request model for consistent client-side consumption.

def cheapest_flight_quote(origin: str, destination: str, date: str) -> List[Dict[str, Any]]:
    distance = haversine_km(
        DESTINATIONS.get(normalize_place(origin), (0, 0))[:2],
        DESTINATIONS.get(normalize_place(destination), (0, 0))[:2],
    )
    base = max(18.0, distance * 0.12)
    return [
        {"provider": "SkyScan", "price_eur": round(base, 2), "duration_hours": round(distance / 550 + 1.5, 1)},
        {"provider": "AirQuick", "price_eur": round(base * 0.92, 2), "duration_hours": round(distance / 550 + 2.0, 1)},
    ]

def cheapest_insurance_quote(destination: str, date: str, duration_days: int = 7) -> List[Dict[str, Any]]:
    base = max(12.0, duration_days * 3.8)
    return [
        {"provider": "SafeTrip", "price_eur": round(base, 2), "coverage_eur": 50000},
        {"provider": "CoverAll", "price_eur": round(base * 1.08, 2), "coverage_eur": 75000},
    ]

def cheapest_car_rental_quote(destination: str, date: str, duration_days: int = 7) -> List[Dict[str, Any]]:
    base = max(24.0, duration_days * 11.5)
    return [
        {"provider": "EuroDrive", "price_eur": round(base, 2), "car_type": "Compact (Peugeot 308)"},
        {"provider": "RentFast", "price_eur": round(base * 0.85, 2), "car_type": "Economy"},
    ]


@app.get("/api/flights")
def get_flight_quotes(origin: str, destination: str, date: str = "") -> Dict[str, Any]:
    return {"quotes": cheapest_flight_quote(origin, destination, date)}


@app.get("/api/insurance")
def get_insurance_quotes(destination: str, date: str = "", duration_days: int = 7) -> Dict[str, Any]:
    return {"quotes": cheapest_insurance_quote(destination, date, duration_days)}


@app.get("/api/cars")
def get_car_rental_quotes(destination: str, date: str = "", duration_days: int = 7) -> Dict[str, Any]:
    return {"quotes": cheapest_car_rental_quote(destination, date, duration_days)}


@app.get("/api/trip-plan")
def trip_plan() -> Dict[str, Any]:
    return {
        "title": "France Holiday 2026",
        "dates": "25 June – 5 July",
        "currency": "EUR",
        "budget": 2347.0,
        "stops": [
            {"date": "25 June", "place": "Dublin → Paris", "note": "Flight from Dublin to Paris. Transfer from Beauvais to Paris."},
            {"date": "26 June", "place": "Paris", "note": "Stay around Porte Maillot. Visit the Eiffel Tower early in the morning."},
            {"date": "27 June", "place": "Paris → Marseille", "note": "Take the 17:38 train from Gare de Lyon. Sleep in Marseille."},
            {"date": "28 June", "place": "Marseille → Hyères", "note": "Pick up the car around 19:00 and drive to Hyères."},
            {"date": "29 June – 3 July", "place": "Hyères / South of France", "note": "Stay in the Airbnb and explore the area."},
            {"date": "4 July", "place": "South of France", "note": "Car rental ends. Prepare for the return journey."},
            {"date": "5 July", "place": "Marseille → Dublin", "note": "Return flight from Marseille to Dublin."},
        ],
        "expenses": [
            {"category": "Insurance", "item": "Health travel insurance", "date": "", "amount": 34.12},
            {"category": "Flights", "item": "Dublin → Paris", "date": "25 June", "amount": 292.28},
            {"category": "Flights", "item": "Marseille → Dublin", "date": "5 July", "amount": 423.86},
            {"category": "Paris", "item": "Bus Beauvais → Paris", "date": "25 June", "amount": 63.60},
            {"category": "Paris", "item": "Eiffel Tower", "date": "26 June", "amount": 45.00},
            {"category": "Train", "item": "Paris Gare de Lyon → South", "date": "27 June", "amount": 388.00},
            {"category": "Car", "item": "Peugeot 308 rental", "date": "28 June – 4 July", "amount": 344.00},
            {"category": "Accommodation", "item": "Accommodation", "date": "", "amount": 839.00},
            {"category": "Accommodation", "item": "Airbnb", "date": "28 June – 3 July", "amount": 669.00},
            {"category": "Food", "item": "Food budget", "date": "", "amount": 600.00},
        ],
        "tips": [
            "Book the Paris to Marseille train before departure.",
            "Use the car only for the Marseille to Hyères section.",
            "Car rental ends on 4 July.",
        ],
    }
