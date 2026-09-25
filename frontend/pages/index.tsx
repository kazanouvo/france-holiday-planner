// Updated with string ID type
import React, { useState, useEffect, useCallback } from "react";

interface TripPlan {
  title: string;
  dates: string;
  route: string;
  budget_estimate: number;
  currency: string;
  tips: string[];
  budget?: number;
  expenses?: Expense[];
}

interface Expense {
  category: string;
  item: string;
  date: string;
  amount: number;
  id?: string;
}

interface RouteResult {
  distance: number;
  duration: number;
  places: string[];
}

interface RouteOptimizeRequest {
  start: string;
  end: string;
  stops: string[];
  transport: "auto" | "car" | "train" | "flight";
}

const API_BASE = typeof window !== "undefined" ? "" : "http://localhost:8001";

export default function Home() {
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [routeOpen, setRouteOpen] = useState(false);
  const [routeStart, setRouteStart] = useState("Paris");
  const [routeEnd, setRouteEnd] = useState("Marseille");
  const [routeStops, setRouteStops] = useState("Lyon, Nice");
  const [routeTransport, setRouteTransport] = useState<"auto" | "car" | "train" | "flight">("auto");
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const eur = (n: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

  useEffect(() => {
    loadTrip();
  }, []);

  useEffect(() => {
    if (trip) {
      syncExpensesFromTrip(trip.expenses);
    }
  }, [trip]);

  const syncExpensesFromTrip = async (serverExpenses: Expense[] = []) => {
    try {
      const stored = localStorage.getItem("franceHolidayExpenses");
      if (stored) {
        setExpenses(JSON.parse(stored));
      } else if (serverExpenses.length > 0) {
        const initial = serverExpenses.map((e, i) => ({ ...e, id: String(e.id ?? i + 1) }));
        setExpenses(initial);
        localStorage.setItem("franceHolidayExpenses", JSON.stringify(initial));
      }
    } catch {
      // localStorage unavailable; keep current state
    }
  };

  const loadTrip = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/trip-plan`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTrip(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load trip plan");
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = useCallback(async () => {
    try {
      const stored = localStorage.getItem("franceHolidayExpenses");
      if (stored) {
        setExpenses(JSON.parse(stored));
      } else if (trip && (trip.expenses ?? []).length > 0) {
        const initialExpenses = trip.expenses.map((e, i) => ({ ...e, id: String(e.id ?? i + 1) }));
        setExpenses(initialExpenses);
        localStorage.setItem("franceHolidayExpenses", JSON.stringify(initialExpenses));
      }
    } catch (e) {
      console.error(e);
    }
  }, [trip]);

  // Load expenses from localStorage on mount (independent of trip state)
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const persistExpenses = async (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem("franceHolidayExpenses", JSON.stringify(newExpenses));
    if (trip) {
      try {
        // Persist to backend via trip update (merge expenses into trip)
        await fetch(`${API_BASE}/api/trips/${trip.title}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expenses: newExpenses }),
        });
      } catch {
        // Backend persistence optional; localStorage already updated
      }
    }
  };

  const updateExpense = (index: number, key: keyof Expense, value: string | number) => {
    const newExpenses = [...expenses];
    newExpenses[index] = { ...newExpenses[index], [key]: key === "amount" ? parseFloat(String(value)) || 0 : value };
    persistExpenses(newExpenses);
  };

  const addExpense = () => {
    const newExpenses = [...expenses, { category: "Other", item: "New expense", date: "", amount: 0, id: Date.now().toString() }];
    persistExpenses(newExpenses);
  };

  const removeExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    persistExpenses(newExpenses);
  };

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const flights = expenses.filter((e) => e.category === "Flights").reduce((s, e) => s + (e.amount || 0), 0);
  const accom = expenses.filter((e) => e.category === "Accommodation").reduce((s, e) => s + (e.amount || 0), 0);
  const food = expenses.filter((e) => e.category === "Food").reduce((s, e) => s + (e.amount || 0), 0);
  const budget = trip?.budget ?? null;
  const remaining = budget !== null ? budget - total : null;
  const budgetStatus = remaining === null ? "no_budget" : remaining < 0 ? "over_budget" : remaining === 0 ? "on_budget" : "under_budget";

  const handleOptimizeRoute = async () => {
    setRouteLoading(true);
    setRouteError(null);
    setRouteResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/routes/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: routeStart,
          end: routeEnd,
          stops: routeStops.split(",").map((s) => s.trim()).filter(Boolean),
          transport: routeTransport,
        } as RouteOptimizeRequest),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as RouteResult;
      setRouteResult(data);
    } catch (e) {
      console.error(e);
      setRouteError("Failed to optimize route");
    } finally {
      setRouteLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#f5f7fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading…</div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main style={{ minHeight: "100vh", background: "#f5f7fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>{error || "Failed to load trip"}</div>
      </main>
    );
  }

  const cardS = { background: "#fff", border: "1px solid #e5e9f0", borderRadius: 16, padding: 18, boxShadow: "0 5px 20px rgba(20,30,50,.05)" };
  const labelS = { fontSize: 13, color: "#657184" };
  const statS = { fontSize: 25, fontWeight: 750, marginTop: 7 };
  const dayS = { display: "grid", gridTemplateColumns: "150px 1fr", gap: 18, padding: 16, background: "#fff", border: "1px solid #e5e9f0", borderRadius: 14 };
  const inputS = { width: "100%", border: "1px solid #d8dee9", borderRadius: 8, padding: 8, background: "#fff", color: "inherit" };
  const tableS: React.CSSProperties = { width: "100%", borderCollapse: "collapse" as const, background: "#fff", border: "1px solid #e5e9f0", borderRadius: 14, overflow: "hidden" as const };
  const thS = { padding: "12px 11px", borderBottom: "1px solid #e5e9f0", background: "#f8f9fc", color: "#657184", fontSize: 12, textTransform: "uppercase" as const, letterSpacing: ".04em" };
  const tdS = { padding: "12px 11px", borderBottom: "1px solid #e5e9f0", fontSize: 14 };
  const btnS = { border: 0, borderRadius: 10, padding: "9px 13px", background: "#315efb", color: "#fff", cursor: "pointer", fontWeight: 650 };
  const btnSecondaryS = { ...btnS, background: "#edf1ff", color: "#2947bb" };
  const btnDangerS = { ...btnS, background: "#fff0f0", color: "#c73b3b" };
  const btnSmallS = { ...btnS, padding: "5px 10px", fontSize: 13, borderRadius: 8 };

  return (
    <main className="min-h-screen" style={{ fontFamily: "Inter,system-ui,sans-serif", background: "#f5f7fb", color: "#18212f" }}>
      <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
                      <div style={{maxWidth:1100,margin:"auto",paddingBottom:8}}>
                        <h1 style={{margin:0,fontSize:32}}>🇫🇷 France Holiday Planner</h1>
                        <div style={{opacity:0.9}}>{trip.dates} · Budget in {trip.currency}</div>
                        <nav style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:14,fontSize:13,fontWeight:600}}>
                          <a href="/" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>Home</a>
                          <a href="/about" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>About</a>
                          <a href="/contact" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>Contact</a>
                          <a href="/faq" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>FAQ</a>
                          <a href="/destinations" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>Destinations</a>
                          <a href="/blog" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>Blog</a>
                          <a href="/terms" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>Terms</a>
                          <a href="/privacy" style={{color:"#fff",textDecoration:"underline",opacity:0.9}}>Privacy</a>
                        </nav>
                      </div>
                    </header>
      <div style={{ maxWidth: 1100, margin: "auto", padding: "22px 18px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: -12 }}>
          <div style={cardS}><div style={labelS}>Listed expenses</div><div style={statS}>{eur(total)}</div></div>
          <div style={cardS}><div style={labelS}>Flights</div><div style={statS}>{eur(flights)}</div></div>
          <div style={cardS}><div style={labelS}>Accommodation</div><div style={statS}>{eur(accom)}</div></div>
          <div style={cardS}><div style={labelS}>Food</div><div style={statS}>{eur(food)}</div></div>
        </div>

        {budget !== null && (
          <div style={{ ...cardS, marginTop: 16, borderColor: budgetStatus === "over_budget" ? "#c73b3b" : budgetStatus === "on_budget" ? "#16a34a" : "#eab308" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={labelS}>Budget</div>
                <div style={statS}>{eur(budget)}</div>
              </div>
              <div>
                <div style={labelS}>Remaining</div>
                <div style={statS}>{eur(remaining ?? 0)}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button style={btnS} onClick={() => setRouteOpen(!routeOpen)}>
            Optimize Route
          </button>
          {routeOpen && (
            <div style={{ marginTop: 16, ...cardS }}>
              <div style={{ marginBottom: 12 }}>
                <div style={labelS}>Start</div>
                <input
                  defaultValue={routeStart}
                  onChange={(e) => setRouteStart(e.target.value)}
                  style={inputS}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={labelS}>End</div>
                <input
                  defaultValue={routeEnd}
                  onChange={(e) => setRouteEnd(e.target.value)}
                  style={inputS}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={labelS}>Stops (comma-separated)</div>
                <input
                  defaultValue={routeStops}
                  onChange={(e) => setRouteStops(e.target.value)}
                  style={inputS}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={labelS}>Transport</div>
                <select
                  value={routeTransport}
                  onChange={(e) => setRouteTransport(e.target.value as "auto" | "car" | "train" | "flight")}
                  style={{ ...inputS, padding: 6 }}
                >
                  <option value="auto">Auto</option>
                  <option value="car">Car</option>
                  <option value="train">Train</option>
                  <option value="flight">Flight</option>
                </select>
              </div>
              <button
                style={{ ...btnS, marginTop: 8 }}
                disabled={routeLoading}
                onClick={handleOptimizeRoute}
              >
                {routeLoading ? "Optimizing…" : "Find Best Route"}
              </button>
              {routeError && <div style={{ marginTop: 12, color: "#c73b3b" }}>{routeError}</div>}
              {routeResult && (
                <div style={{ marginTop: 12, ...cardS, padding: 16 }}>
                  <div style={{ fontSize: 14, marginBottom: 8 }}>
                    <strong>Optimized Route:</strong>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                    {routeResult.places.join(" → ")}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
                    <div>
                      <div style={labelS}>Distance</div>
                      <div style={statS}>{routeResult.distance.toFixed(1)} km</div>
                    </div>
                    <div>
                      <div style={labelS}>Duration</div>
                      <div style={statS}>{routeResult.duration.toFixed(1)} h</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <h2 style={{ marginBottom: 12 }}>Expenses</h2>
          <div style={{ ...cardS, marginBottom: 16 }}>
            <table style={tableS}>
              <thead>
                <tr>
                  <th style={thS}>Category</th>
                  <th style={thS}>Item</th>
                  <th style={thS}>Date</th>
                  <th style={thS}>Amount (EUR)</th>
                  <th style={thS}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, idx) => (
                  <tr key={exp.id ?? idx}>
                    <td style={tdS}>
                      <input
                        defaultValue={exp.category}
                        onChange={(e) => updateExpense(idx, "category", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={tdS}>
                      <input
                        defaultValue={exp.item}
                        onChange={(e) => updateExpense(idx, "item", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={tdS}>
                      <input
                        defaultValue={exp.date}
                        onChange={(e) => updateExpense(idx, "date", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={tdS}>
                      <input
                        defaultValue={String(exp.amount)}
                        onChange={(e) => updateExpense(idx, "amount", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{ ...btnSecondaryS, flex: 1 }}
                        onClick={() => {
                          const newVal = prompt("New amount (EUR)", String(exp.amount));
                          if (newVal !== null) updateExpense(idx, "amount", newVal);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...btnDangerS, flex: 1 }}
                        onClick={() => removeExpense(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#657184" }}>
                      No expenses yet. Add some above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              style={{ ...btnS, flex: 1 }}
              onClick={addExpense}
            >
              Add Expense
            </button>
            <button
              style={{ ...btnSecondaryS, flex: 1 }}
              onClick={() => {
                if (window.confirm("Reset all expenses to trip data?")) {
                  syncExpensesFromTrip(trip?.expenses ?? []);
                }
              }}
            >
              Reset from Trip
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}