// Updated with string ID type
import React from "react";

const About = () => {
  const cardS = { background: "#fff", border: "1px solid #e5e9f0", borderRadius: 16, padding: 24, boxShadow: "0 5px 20px rgba(20,30,50,.05)" };
  const labelS = { fontSize: 15, color: "#657184", marginBottom: 8 };
  const statS = { fontSize: 28, fontWeight: 700, marginTop: 8 };
  const eur = (n: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

  return (
    <main className="min-h-screen" style={{ fontFamily: "Inter,system-ui,sans-serif", background: "#f5f7fb", color: "#18212f" }}>
      <header style={{ background: "linear-gradient(135deg,#315efb,#6d4aff)", color: "#fff", padding: "34px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "auto", paddingBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 32 }}>🇫🇷 France Holiday Planner</h1>
          <div style={{ opacity: 0.9 }}>About Us</div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "auto", padding: "40px 18px 60px" }}>
        <div style={cardS}>
          <h2 style={{ margin: "0 0 20px 0", color: "#315efb", fontSize: 28 }}>Our Story</h2>
          
          <p style={{ lineHeight: 1.7, marginBottom: 20, fontSize: 16 }}>
            France Holiday Planner was born from a simple idea: making European travel planning easier, more transparent, and more affordable for everyone. Our founders, passionate travelers themselves, experienced firsthand the headaches of coordinating flights, accommodations, routes, and budgets across multiple countries.
          </p>

          <p style={{ lineHeight: 1.7, marginBottom: 20, fontSize: 16 }}>
            What started as a weekend project to help friends plan their French vacations has evolved into a comprehensive travel planning platform trusted by thousands of travelers. We combine cutting-edge route optimization technology with a user-friendly interface that puts you in control of every aspect of your European adventure.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginTop: 30 }}>
            <div>
              <h3 style={{ color: "#315efb", marginBottom: 12, fontSize: 20 }}>Our Mission</h3>
              <p style={{ lineHeight: 1.6, fontSize: 15 }}>
                To democratize European travel planning by providing intelligent route optimization, real-time budget tracking, and seamless expense management all in one place.
              </p>
            </div>

            <div>
              <h3 style={{ color: "#315efb", marginBottom: 12, fontSize: 20 }}>Our Values</h3>
              <ul style={{ paddingLeft: 20, lineHeight: 1.6, fontSize: 15 }}>
                <li style={{ marginBottom: 8 }}>Transparency in pricing</li>
                <li style={{ marginBottom: 8 }}>Continuous learning from user feedback</li>
                <li style={{ marginBottom: 8 }}>Commitment to sustainable travel choices</li>
                <li style={{ marginBottom: 8 }}>Innovation in route optimization</li>
              </ul>
            </div>
          </div>

          <div style={{ ...cardS, background: "#f8f9fc", marginTop: 30, padding: 20 }}>
            <h3 style={{ color: "#315efb", marginBottom: 15, fontSize: 20 }}>Join Our Journey</h3>
            <p style={{ lineHeight: 1.6, fontSize: 15 }}>
              We're constantly evolving and looking for passionate travelers to join our community. Have questions, suggestions, or want to contribute? We'd love to hear from you at hello@franceholidayplanner.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;