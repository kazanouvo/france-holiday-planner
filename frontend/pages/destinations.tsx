import React from "react";

const regions = [
  { name: "Paris & Île-de-France", desc: "The capital's iconic sights, day-trip châteaux, and the best Beauvais airport transfer hacks.", tags: ["Eiffel Tower", "Versailles", "Disney", "Beauvais shuttle"] },
  { name: "Provence & the South", desc: "Lavender fields, hilltop villages, and the Mediterranean coast — perfect for a car trip.", tags: ["Avignon", "Aix-en-Provence", "Cassis", "Lavender"] },
  { name: "French Riviera", desc: "Glittering coast, cliffside drives, and the best-value Riviera stays.", tags: ["Nice", "Cannes", "Saint-Tropez", "Monaco"] },
  { name: "Alsace & the Vosges", desc: "Fairytale half-timbered villages, wine routes, and easy train access from Paris.", tags: ["Colmar", "Strasbourg", "Riquewihr", "Wine route"] },
  { name: "Loire Valley", desc: "The castle country — châteaux, wine tastings, and gentle cycling along the river.", tags: ["Chambord", "Chenonceau", "Tours", "Saumur"] },
  { name: "Normandy & Brittany", desc: "Coastal charm, cider, and the D-Day beaches — an easy loop from Paris.", tags: ["Mont-Saint-Michel", "Honfleur", "D-Day", "Saint-Malo"] },
  { name: "The Alps", desc: "Skiing in winter, hiking in summer, and the best-value mountain stays.", tags: ["Chamonix", "Annecy", "Avoriaz", "Zermatt side"] },
  { name: "Occitanie & the Pyrenees", desc: "Sun-drenched south, Cathar castles, and the Spanish border — quieter and cheaper.", tags: ["Toulouse", "Carcassonne", "Collioure", "Canigou"] },
];

const Destinations: React.FC = () => (
  <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
    <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
      <div style={{maxWidth:1100,margin:"auto"}}><h1 style={{margin:0,fontSize:32}}>🇫🇷 France Holiday Planner</h1><p>Destinations — Plan Your French Adventure</p></div>
    </header>
    <div style={{maxWidth:1100,margin:"auto",padding:"50px 18px"}}>

      <div style={{background:"#fff",border:"1px solid #e5e9f0",borderRadius:16,padding:28,boxShadow:"0 5px 20px rgba(20,30,50,.05)",marginBottom:36,textAlign:"center",maxWidth:760,marginInline:"auto"}} >
        <h2 style={{color:"#315efb",marginBottom:10,fontSize:22}}>Explore France</h2>
        <p style={{lineHeight:1.6,fontSize:15,color:"#657184"}}>From the capital to the coast, France has something for every traveler. Pick a region and start planning your trip with our budget tracker and route optimizer.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,marginBottom:36}}>
        {regions.map((r, i) => (
          <div key={i} style={{background:"#fff",border:"1px solid #e5e9f0",borderRadius:16,padding:24,boxShadow:"0 5px 20px rgba(20,30,50,.05)",display:"flex",flexDirection:"column",gap:10,transition:"transform .15s,boxShadow .15s"}} >
            <h3 style={{color:"#315efb",margin:0,fontSize:19}}>{r.name}</h3>
            <p style={{lineHeight:1.6,fontSize:14,color:"#657184",margin:0}}>{r.desc}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
              {r.tags.map((t, j) => (
                <span key={j} style={{background:"#edf1ff",color:"#2947bb",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600}}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{background:"#f8f9fc",border:"1px solid #e5e9f0",borderRadius:16,padding:28,maxWidth:700,margin:"0 auto",textAlign:"center"}} >
        <h2 style={{color:"#315efb",marginBottom:12,fontSize:20}}>Start Planning Your Trip</h2>
        <p style={{lineHeight:1.6,fontSize:15,color:"#657184",marginBottom:18}}>Use our budget tracker and route optimizer to plan your French getaway — all free, no sign-up required.</p>
        <a href="/" style={{display:"inline-block",background:"#315efb",color:"#fff",padding:"12px 26px",borderRadius:10,fontWeight:650,fontSize:15,textDecoration:"none"}}>Open Trip Planner</a>
      </div>
    </div>
  </main>
);

export default Destinations;