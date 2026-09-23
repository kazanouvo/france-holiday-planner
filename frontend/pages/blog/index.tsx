import React from "react";

export default function BlogList() {
  return (
    <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
      <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
        <div style={{maxWidth:1100,margin:"auto"}}>
          <h1 style={{margin:0,fontSize:32}}>🇫🇷 Travel Blog</h1>
          <p>Planning tips, route guides &amp; corner-product deep dives</p>
        </div>
      </header>
      <div style={{maxWidth:1100,margin:"auto",padding:"40px 18px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
          <LinkCard slug="paris-marseille-train-hack" title="Paris → Marseille by Train: The 4h30 Secret" excerpt="How to shave hours off the TGV route without sacrificing comfort on France's busiest rail corridor." tags={["trains","saving-money"]} />
          <LinkCard slug="budget-breakdown-june" title="Real Budget Breakdown: 10-Day France Trip Under €2,400" excerpt="From flights to food, here's how the trip in your planner actually costs what it costs." tags={["budget","expenses"]} />
          <LinkCard slug="car-rental-south" title="Renting in the South: Peugeot 308 vs Renault Clio" excerpt="Comparing two corner products of French car rental — which fits your Hyères Airbnb parking?" tags={["car-rental","south-of-france"]} />
          <LinkCard slug="beauvais-transfer" title="Beauvais Airport Transfer Hack" excerpt="Skip the €17 bus. Walk 5 min to the direct shuttle that costs €6 and drops you at Porte Maillot." tags={["flights","paris","transport"]} />
          <LinkCard slug="airbnb-hyeres-review" title="Airbnb Hyères: What €839 Actually Buys You" excerpt="Breakdown of the 6-night South-of-France stay and whether it beats hotels on value." tags={["accommodation","airbnb","hyeres"]} />
          <LinkCard slug="phone-plan-for-travel" title="French Phone Plans: Orange vs Free Mobile vs SFR" excerpt="Corner telecom products reviewed for travelers — data, coverage, EU roaming." tags={["telecom","europe","tips"]} />
          <LinkCard slug="travel-insurance-comparison" title="Travel Insurance: WorldNomads vs SafetyWing vs Allianz" excerpt="Which corner insurance product covers your French holiday without breaking the bank?" tags={["insurance","budget","tips"]} />
          <LinkCard slug="eiffel-tower-book-hack" title="Skip the Eiffel Tower Queue: Booking Tactics Revealed" excerpt="Get same-day tickets to the tower without paying double. Here's the exact URL to bookmark." tags={["activities","paris","tips"]} />
          <LinkCard slug="parking-at-paris-airport" title="Long-Term Parking at CDG vs Orly: €69 vs €269" excerpt="We parked our rental Peugeot for 10 days. Here's which corner parking product won." tags={["paris","parking","car"]} />
          <LinkCard slug="french-fuel-app" title="Essence &amp; Gazole: The App That Saves €40/Liter" excerpt="How to use the corner app that tracks diesel vs SP95 pricing across southern France." tags={["driving","apps","south-of-france"]} />
        </div>
      </div>
    </main>
  );
}

function LinkCard({ slug, title, excerpt, tags }: { slug: string; title: string; excerpt: string; tags: string[] }) {
  return (
    <a href={`/blog/${slug}`} style={{display:"block",textDecoration:"none",color:"inherit",background:"#fff",border:"1px solid #e5e9f0",borderRadius:12,padding:18,boxShadow:"0 5px 20px rgba(20,30,50,.04)"}}>
      <h3 style={{margin:"0 0 6px 0",color:"#315efb",fontSize:19}}>{title}</h3>
      <p style={{margin:"6px 0 10px 0",color:"#657184",fontSize:14,lineHeight:1.5}}>{excerpt}</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {tags.map(t => <span key={t} style={{background:"#edf1ff",color:"#2947bb",padding:"3px 9px",borderRadius:12,fontSize:11}}>{t}</span>)}
      </div>
    </a>
  );
}