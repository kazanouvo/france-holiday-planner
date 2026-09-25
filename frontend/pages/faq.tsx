import React, { useState } from "react";

const faqs = [
  { q: "Is France Holiday Planner free to use?", a: "Yes — the core planner, budget tracker, and route optimizer are completely free. We never charge for the basics, and we don't sell your data." },
  { q: "Where is my trip data stored?", a: "Your trip data is stored locally in trips.json on your device (and synced to our backend if you enable it). We don't claim ownership of your data, and you can delete it anytime." },
  { q: "Do you use cookies or tracking?", a: "No. We use no cookies, no analytics, and no ads. Any data stored is in your browser's localStorage and stays on your device." },
  { q: "How accurate are the route estimates?", a: "Route estimates are indicative and based on publicly available road/rail data. Always verify travel times and conditions before you travel — especially for driving." },
  { q: "Can I use this for business trips?", a: "The tool is designed for personal trip planning. For commercial use, please contact us to discuss a license." },
  { q: "What's your data retention policy?", a: "Trip data is stored locally in trips.json and deleted when you remove it. If you enable backend sync, we retain only what's needed to serve your account." },
  { q: "Which payment methods do you accept?", a: "Currently the planner is free. If paid features are introduced in the future, we'll accept major credit cards and PayPal." },
  { q: "Is my data shared with third parties?", a: "No. We don't sell or share your data with third parties, and we have no analytics or ad partners." },
];

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
      <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
        <div style={{maxWidth:1100,margin:"auto"}}><h1 style={{margin:0,fontSize:32}}>🇫🇷 France Holiday Planner</h1><p>FAQ — Frequently Asked Questions</p></div>
      </header>
      <div style={{maxWidth:760,margin:"auto",padding:"50px 18px"}}>

        <div style={{background:"#fff",border:"1px solid #e5e9f0",borderRadius:16,padding:28,boxShadow:"0 5px 20px rgba(20,30,50,.05)",marginBottom:32}}>
          <h2 style={{color:"#315efb",marginBottom:10,fontSize:22}}>Welcome to the France Holiday Planner FAQ</h2>
          <p style={{lineHeight:1.6,fontSize:15,color:"#657184"}}>Find answers to common questions below. Can't find what you're looking for? Visit our <a href="/contact" style={{color:"#315efb"}}>Contact Us</a> page.</p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} style={{background:"#fff",border:"1px solid #e5e9f0",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(20,30,50,.04)"}}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{width:"100%",border:0,borderRadius:14,padding:"18px 20px",background:"#fff",color:"#18212f",cursor:"pointer",fontWeight:600,fontSize:15,textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                >
                  <span>{f.q}</span>
                  <span style={{color:"#315efb",fontSize:20,transition:"transform .2s",transform: isOpen ? "rotate(45deg)" : "0deg"}}>+</span>
                </button>
                {isOpen && (
                  <div style={{padding:"0 20px 18px",lineHeight:1.6,fontSize:15,color:"#657184"}}>{f.a}</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{background:"#f8f9fc",border:"1px solid #e5e9f0",borderRadius:16,padding:28,maxWidth:640,margin:"40px auto 0",textAlign:"center"}} >
          <h2 style={{color:"#315efb",marginBottom:10,fontSize:20}}>Still have questions?</h2>
          <p style={{lineHeight:1.6,fontSize:15,color:"#657184",marginBottom:16}}>We're here to help. Reach out anytime.</p>
          <a href="/contact" style={{display:"inline-block",background:"#315efb",color:"#fff",padding:"11px 22px",borderRadius:10,fontWeight:650,fontSize:15,textDecoration:"none"}}>Contact Us</a>
        </div>
      </div>
    </main>
  );
};

export default FAQ;