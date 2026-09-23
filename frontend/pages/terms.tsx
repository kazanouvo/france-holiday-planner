import React from "react";

const Page: React.FC = () => (
  <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
    <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
      <div style={{maxWidth:1100,margin:"auto"}}>
        <h1 style={{margin:0,fontSize:32}}>🇫🇷 France Holiday Planner</h1>
        <p>Terms and Conditions</p>
      </div>
    </header>
    <div style={{maxWidth:1100,margin:"auto",padding:"50px 18px"}}>
      <h2>Terms of Service</h2>
      <p>Effective: 1 January 2026</p>
      <h3>1. Acceptance</h3>
      <p>By accessing France Holiday Planner, you agree to these Terms.</p>
      <h3>2. Use</h3>
      <p>Allowed for personal trip planning only. Not for resale.</p>
      <h3>3. Data</h3>
      <p>We store trip data in trips.json. We don't claim ownership.</p>
      <h3>4. Disclaimer</h3>
      <p>Route estimates are indicative. Verify before travel.</p>
      <h3>5. Liability</h3>
      <p>Max liability: amount paid (0 if free). No indirect damages.</p>
      <h3>6. Governing Law</h3>
      <p>EU law applies. Disputes in Dublin courts.</p>
    </div>
  </main>
);

export default Page;