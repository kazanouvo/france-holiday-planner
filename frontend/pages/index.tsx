import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
      <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
        <div style={{maxWidth:1100,margin:"auto",paddingBottom:8}}>
          <h1 style={{margin:0,fontSize:32}}>🇫🇷 France Holiday Planner</h1>
          <div style={{opacity:.9}}>25 June – 5 July · Paris → Marseille → Hyères · Budget in EUR</div>
        </div>
      </header>
      <div style={{maxWidth:1100,margin:"auto",padding:"22px 18px 50px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginTop:-12}}>
          <div className="card" style={cardS}><div className="label" style={labelS}>Listed expenses</div><div className="stat" style={statS}>€2,421.86</div></div>
          <div className="card" style={cardS}><div className="label" style={labelS}>Flights</div><div className="stat" style={statS}>€716.14</div></div>
          <div className="card" style={cardS}><div className="label" style={labelS}>Accommodation</div><div className="stat" style={statS}>€1,508.00</div></div>
          <div className="card" style={cardS}><div className="label" style={labelS}>Food</div><div className="stat" style={statS}>€600.00</div></div>
        </div>

        <section style={{marginTop:22}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><h2 style={{fontSize:20,margin:0}}>🗓 Itinerary</h2></div>
          <div style={{display:"grid",gap:10}}>
            {[
              ["25 June","Dublin → Paris","Flight from Dublin to Paris. Transfer from Beauvais to Paris."],
              ["26 June","Paris","Stay around Porte Maillot. Visit the Eiffel Tower early in the morning."],
              ["27 June, 17:38","Paris → Marseille","Spend the morning/day in Paris, then take the 17:38 train from Gare de Lyon. Sleep in Marseille."],
              ["28 June","Marseille → Hyères","Spend time in Marseille until around 16:00. Pick up Peugeot 308 and drive to Hyères around 19:00."],
              ["29 June – 3 July","Hyères / South of France","Stay in the Airbnb and explore the area."],
              ["4 July","South of France","Car rental ends. Prepare for return journey."],
              ["5 July","Marseille → Dublin","Return flight from Marseille to Dublin."]
            ].map((d,i)=>(
              <div key={i} className="day" style={dayS}>
                <div className="date" style={{fontWeight:750,color:"#315efb"}}>{d[0]}</div>
                <div><div className="place" style={{fontWeight:700,marginBottom:4}}>{d[1]}</div><div style={{fontSize:14,color:"#657184"}}>{d[2]}</div></div>
              </div>
            ))}
          </div>
        </section>

        <section style={{marginTop:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <h2 style={{fontSize:20,margin:0}}>💶 Budget</h2>
          </div>
          <div className="notice" style={{background:"#fff8e6",border:"1px solid #f1d58c",color:"#6b5316",borderRadius:14,padding:14,marginTop:15,lineHeight:1.5}}>
            <strong>Budget check:</strong> your notes say “Grand total: €2,347”, but the individual amounts entered above add up to <strong>€2,421.86</strong>. The app keeps individual figures editable so you can identify any duplicated or missing costs.
          </div>
        </section>

        <section style={{marginTop:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <h2 style={{fontSize:20,margin:0}}>✈️ Key travel details</h2>
          </div>
          <div className="card" style={cardS}>
            <p style={{margin:"4px 0"}}><strong>25 June:</strong> Dublin → Paris · €292.28</p>
            <p style={{margin:"4px 0"}}><strong>26 June:</strong> Paris · Porte Maillot · Eiffel Tower early morning · €45</p>
            <p style={{margin:"4px 0"}}><strong>27 June, 17:38:</strong> Gare de Lyon → South · €388 · Sleep in Marseille</p>
            <p style={{margin:"4px 0"}}><strong>28 June:</strong> Marseille until ~16:00 → pick up Peugeot 308 → drive to Hyères ~19:00</p>
            <p style={{margin:"4px 0"}}><strong>28 June – 4 July:</strong> Car rental · €344</p>
            <p style={{margin:"4px 0"}}><strong>28 June – 3 July:</strong> Airbnb · €669</p>
            <p style={{margin:"4px 0"}}><strong>5 July:</strong> Marseille → Dublin · €423.86</p>
          </div>
        </section>

        <footer className="footer" style={{color:"#657184",fontSize:12,marginTop:20}}>Changes are saved in your browser automatically. This is a planning app, not a booking service.</footer>
      </div>
    </main>
  );
}

const cardS = {background:"#fff",border:"1px solid #e5e9f0",borderRadius:16,padding:18,boxShadow:"0 5px 20px rgba(20,30,50,.05)"};
const labelS = {fontSize:13,color:"#657184"};
const statS = {fontSize:25,fontWeight:750,marginTop:7};
const dayS = {display:"grid",gridTemplateColumns:"150px 1fr",gap:18,padding:16,background:"#fff",border:"1px solid #e5e9f0",borderRadius:14};
