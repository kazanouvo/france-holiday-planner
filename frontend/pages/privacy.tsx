import React from "react";

const Page: React.FC = () => (
  <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
    <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
      <div style={{maxWidth:1100,margin:"auto"}}>
        <h1 style={{margin:0,fontSize:32}}>🇫🇷 France Holiday Planner</h1>
        <p>Privacy Policy</p>
      </div>
    </header>
    <div style={{maxWidth:1100,margin:"auto",padding:"50px 18px"}}>
      <h2>Privacy Policy</h2>
      <p>Effective: 1 January 2026</p>
      <h3>1. Information We Collect</h3>
      <p>We collect trip data you enter (destinations, budgets, expenses). No personal data stored.</p>
      <h3>2. Cookies</h3>
      <p>We use no cookies or tracking. localStorage is client-side only.</p>
      <h3>3. Third Parties</h3>
      <p>No data is sold or shared. No analytics, no ads.</p>
      <h3>4. Data Retention</h3>
      <p>trips.json stored locally. Deleted when you remove it.</p>
      <h3>5. Your Rights</h3>
      <p>You may request export/deletion of your trip data.</p>
      <h3>6. Contact</h3>
      <p>privacy@franceholidayplanner.com</p>
    </div>
  </main>
);

export default Page;