"use client";

import React, { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type Expense = {
  id?: number;
  category: string;
  item: string;
  date: string;
  amount: number;
};

type Stop = {
  date: string;
  place: string;
  note: string;
};

type TripPlan = {
  title: string;
  dates: string;
  currency: string;
  budget: number;
  stops: Stop[];
  expenses: Expense[];
  tips: string[];
};

export default function Home() {
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eur = (n: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

  useEffect(() => {
    loadTrip();
    loadExpenses();
  }, []);

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

  const loadExpenses = async () => {
    try {
      const stored = localStorage.getItem("franceHolidayExpenses");
      if (stored) {
        setExpenses(JSON.parse(stored));
      } else if (trip) {
        const initialExpenses = trip.expenses.map((e, i) => ({ ...e, id: i + 1 }));
        setExpenses(initialExpenses);
        localStorage.setItem("franceHolidayExpenses", JSON.stringify(initialExpenses));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem("franceHolidayExpenses", JSON.stringify(newExpenses));
  };

  const updateExpense = (index: number, key: keyof Expense, value: string | number) => {
    const newExpenses = [...expenses];
    newExpenses[index] = { ...newExpenses[index], [key]: key === "amount" ? parseFloat(String(value)) || 0 : value };
    saveExpenses(newExpenses);
  };

  const addExpense = () => {
    const newExpenses = [...expenses, { category: "Other", item: "New expense", date: "", amount: 0, id: Date.now() }];
    saveExpenses(newExpenses);
  };

  const removeExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    saveExpenses(newExpenses);
  };

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const flights = expenses.filter(e => e.category === "Flights").reduce((s, e) => s + (e.amount || 0), 0);
  const accom = expenses.filter(e => e.category === "Accommodation").reduce((s, e) => s + (e.amount || 0), 0);
  const food = expenses.filter(e => e.category === "Food").reduce((s, e) => s + (e.amount || 0), 0);

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
        <div>Failed to load trip</div>
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

  return (
    <main className="min-h-screen" style={{ fontFamily: "Inter,system-ui,sans-serif", background: "#f5f7fb", color: "#18212f" }}>
      <header style={{ background: "linear-gradient(135deg,#315efb,#6d4aff)", color: "#fff", padding: "34px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "auto", paddingBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 32 }}>🇫🇷 France Holiday Planner</h1>
          <div style={{ opacity: 0.9 }}>{trip.dates} · Budget in {trip.currency}</div>
        </div>
      </header>
      <div style={{ maxWidth: 1100, margin: "auto", padding: "22px 18px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginTop: -12 }}>
          <div style={cardS}><div style={labelS}>Listed expenses</div><div style={statS}>{eur(total)}</div></div>
          <div style={cardS}><div style={labelS}>Flights</div><div style={statS}>{eur(flights)}</div></div>
          <div style={cardS}><div style={labelS}>Accommodation</div><div style={statS}>{eur(accom)}</div></div>
          <div style={cardS}><div style={labelS}>Food</div><div style={statS}>{eur(food)}</div></div>
        </div>

        <section style={{ marginTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>🗓 Itinerary</h2>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {trip.stops.map((d, i) => (
              <div key={i} style={dayS}>
                <div style={{ fontWeight: 750, color: "#315efb" }}>{d.date}</div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.place}</div>
                  <div style={{ fontSize: 14, color: "#657184" }}>{d.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>💶 Budget</h2>
            <button onClick={addExpense} style={btnS}>+ Add expense</button>
          </div>
          <table style={tableS}>
            <thead>
              <tr>
                <th style={thS}>Category</th>
                <th style={thS}>Item</th>
                <th style={thS}>Date</th>
                <th style={{ ...thS, textAlign: "right" }}>Amount</th>
                <th style={thS}><span style={{ width: 80 }}> </span></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={e.id ?? i}>
                  <td style={tdS}><input value={e.category} onChange={e => updateExpense(i, "category", e.target.value)} style={inputS} /></td>
                  <td style={tdS}><input value={e.item} onChange={e => updateExpense(i, "item", e.target.value)} style={inputS} /></td>
                  <td style={tdS}><input value={e.date} onChange={e => updateExpense(i, "date", e.target.value)} style={inputS} /></td>
                  <td style={{ ...tdS, textAlign: "right" }}>
                    <input type="number" step="0.01" value={e.amount} onChange={e => updateExpense(i, "amount", e.target.value)} style={{ ...inputS, width: "100px" }} />
                  </td>
                  <td style={tdS}><button onClick={() => removeExpense(i)} style={btnDangerS}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ background: "#fff8e6", border: "1px solid #f1d58c", color: "#6b5316", borderRadius: 14, padding: 14, marginTop: 15, lineHeight: 1.5 }}>
            <strong>Budget check:</strong> your notes say "Grand total: €2,347", but the individual amounts entered above add up to <strong>{eur(total)}</strong>. The app keeps the individual figures editable so you can identify any duplicated or missing costs.
          </div>
        </section>

        <section style={{ marginTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>✈️ Key travel details</h2>
          </div>
          <div style={cardS}>
            {trip.tips.map((tip, i) => (
              <p key={i} style={{ margin: "4px 0" }}>{tip}</p>
            ))}
          </div>
        </section>

        <footer style={{ color: "#657184", fontSize: 12, marginTop: 20, textAlign: "center" }}>
          Changes are saved in your browser automatically. This is a planning app, not a booking service.
        </footer>
      </div>
    </main>
  );
}