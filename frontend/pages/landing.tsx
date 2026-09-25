import React from "react";

const Landing: React.FC = () => (
  <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"Inter,system-ui,sans-serif"}}>
    <nav style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"16px 24px",position:"sticky",top:0,zIndex:50}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:20,fontWeight:700,color:"#1e293b"}}>🇫🇷 France Holiday Planner</div>
        <div style={{display:"flex",gap:16}}>
          <a href="/landing" style={{color:"#3b82f6",textDecoration:"none",fontWeight:500}}>Home</a>
          <a href="/about" style={{color:"#64748b",textDecoration:"none",fontWeight:500}}>About</a>
          <a href="/contact" style={{color:"#64748b",textDecoration:"none",fontWeight:500}}>Contact</a>
          <a href="/login" style={{background:"#3b82f6",color:"#fff",padding:"8px 16px",borderRadius:8,textDecoration:"none",fontWeight:600}}>Login</a>
        </div>
      </div>
    </nav>

    <section style={{background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",color:"#fff",padding:"80px 24px",textAlign:"center"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <h1 style={{fontSize:56,fontWeight:700,marginBottom:16}}>Plan Your Perfect French Adventure</h1>
        <p style={{fontSize:20,lineHeight:1.6,maxWidth:800,margin:"0 auto 32px",opacity:0.9}}>
          France Holiday Planner helps you organize every detail of your trip to France — from itinerary planning and route optimization to expense tracking and real-time budget management.
        </p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/" style={{background:"#fff",color:"#3b82f6",padding:"14px 32px",borderRadius:10,fontWeight:600,fontSize:16,textDecoration:"none",boxShadow:"0 4px 14px rgba(0,0,0,.1)"}}>Start Planning Now</a>
          <a href="#features" style={{background:"transparent",border:"2px solid #fff",color:"#fff",padding:"14px 32px",borderRadius:10,fontWeight:600,fontSize:16,textDecoration:"none"}}>View Features</a>
        </div>
      </div>
    </section>

    <section id="features" style={{padding:"80px 24px",maxWidth:1200,margin:"0 auto"}}>
      <h2 style={{fontSize:40,fontWeight:700,textAlign:"center",marginBottom:60,color:"#1e293b"}}>Our Features</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(350px,1fr))",gap:32}}>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:32,boxShadow:"0 4px 6px rgba(0,0,0,.05)"}}>
          <div style={{fontSize:48,marginBottom:16}}>🗓️</div>
          <h3 style={{fontSize:24,fontWeight:600,marginBottom:12,color:"#1e293b"}}>Smart Trip Planning</h3>
          <p style={{lineHeight:1.6,color:"#64748b",fontSize:16}}>Create comprehensive trips with dates, currencies, budgets, and multiple stops across France. Automatic route optimization based on your travel dates and preferences.</p>
        </div>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:32,boxShadow:"0 4px 6px rgba(0,0,0,.05)"}}>
          <div style={{fontSize:48,marginBottom:16}}>💰</div>
          <h3 style={{fontSize:24,fontWeight:600,marginBottom:12,color:"#1e293b"}}>Real-time Budget Tracking</h3>
          <p style={{lineHeight:1.6,color:"#64748b",fontSize:16}}>Track every expense across categories (flights, accommodation, food, activities) against your budget in real-time. Get instant alerts when you exceed your limits.</p>
        </div>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:32,boxShadow:"0 4px 6px rgba(0,0,0,.05)"}}>
          <div style={{fontSize:48,marginBottom:16}}>🗺️</div>
          <h3 style={{fontSize:24,fontWeight:600,marginBottom:12,color:"#1e293b"}}>Route Optimization</h3>
          <p style={{lineHeight:1.6,color:"#64748b",fontSize:16}}>Automatically optimize your travel route between cities with transport mode recommendations (car, train, flight) and distance/time estimates. Save time and money with intelligent routing.</p>
        </div>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:32,boxShadow:"0 4px 6px rgba(0,0,0,.05)"}}>
          <div style={{fontSize:48,marginBottom:16}}>📱</div>
          <h3 style={{fontSize:24,fontWeight:600,marginBottom:12,color:"#1e293b"}}>All-in-One Solution</h3>
          <p style={{lineHeight:1.6,color:"#64748b",fontSize:16}}>From planning to execution, manage bookings, expenses, and travel logistics — all in one free application. Access your trips from any device, anytime.</p>
        </div>
      </div>
    </section>

    <section style={{background:"#f1f5f9",padding:"80px 24px",textAlign:"center"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <h2 style={{fontSize:36,fontWeight:700,marginBottom:40,color:"#1e293b"}}>What Our Users Say</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(350px,1fr))",gap:24}}>
          <div style={{background:"#fff",borderRadius:16,padding:32,boxShadow:"0 4px 6px rgba(0,0,0,.05)",textAlign:"left"}}>
            <div style={{display:"flex",gap:12,marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👩‍💼</div>
              <div>
                <div style={{fontWeight:600,color:"#1e293b"}}>Sophie Martin</div>
                <div style={{fontSize:14,color:"#64748b"}}>Paris Trip, July 2024</div>
              </div>
            </div>
            <p style={{lineHeight:1.6,color:"#475569",fontSize:15}}>"France Holiday Planner saved me countless hours! The route optimization feature found the most efficient way to visit 4 cities while staying within budget. Highly recommended!"</p>
          </div>

          <div style={{background:"#fff",borderRadius:16,padding:32,boxShadow:"0 4px 6px rgba(0,0,0,.05)",textAlign:"left"}}>
            <div style={{display:"flex",gap:12,marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨‍💼</div>
              <div>
                <div style={{fontWeight:600,color:"#1e293b"}}>Thomas Dubois</div>
                <div style={{fontSize:14,color:"#64748b"}}>Nantes to Nice, June 2024</div>
              </div>
            </div>
            <p style={{lineHeight:1.6,color:"#475569",fontSize:15}}>"The budget tracking is incredibly accurate. I never overspend on my trips anymore. The expense categorization makes it easy to see where my money goes."</p>
          </div>

          <div style={{background:"#fff",borderRadius:16,padding:32,boxShadow:"0 4px 6px rgba(0,0,0,.05)",textAlign:"left"}}>
            <div style={{display:"flex",gap:12,marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👩‍🎓</div>
              <div>
                <div style={{fontWeight:600,color:"#1e293b"}}>Emma Laurent</div>
                <div style={{fontSize:14,color:"#64748b"}}>First-Time Visitor, August 2024</div>
              </div>
            </div>
            <p style={{lineHeight:1.6,color:"#475569",fontSize:15}}>"As someone planning my first trip to France, this app made everything so simple. The route optimizer suggested stops I would never have found on my own!"</p>
          </div>
        </div>
      </div>
    </section>

    <section style={{padding:"80px 24px",maxWidth:1200,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",borderRadius:24,padding:48,color:"#fff",textAlign:"center",boxShadow:"0 20px 40px rgba(59,130,246,.3)"}}>
        <h2 style={{fontSize:36,fontWeight:700,marginBottom:16}}>Ready to Start Your French Adventure?</h2>
        <p style={{fontSize:18,lineHeight:1.6,marginBottom:32,maxWidth:600,margin:"0 auto 32px"}}>Join thousands of travelers who trust France Holiday Planner for their French getaway planning. Get started today — completely free, no credit card required.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/" style={{background:"#fff",color:"#3b82f6",padding:"14px 32px",borderRadius:10,fontWeight:600,fontSize:16,textDecoration:"none",boxShadow:"0 4px 14px rgba(0,0,0,.1)"}}>Create Your First Trip</a>
          <a href="#features" style={{background:"transparent",border:"2px solid #fff",color:"#fff",padding:"14px 32px",borderRadius:10,fontWeight:600,fontSize:16,textDecoration:"none"}}>Learn More</a>
        </div>
      </div>
    </section>

    <footer style={{background:"#0f172a",color:"#94a3b8",padding:"60px 24px",textAlign:"center"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:32,flexWrap:"wrap"}}>
          <a href="/about" style={{color:"#94a3b8",textDecoration:"none",fontSize:14}}>About Us</a>
          <a href="/contact" style={{color:"#94a3b8",textDecoration:"none",fontSize:14}}>Contact</a>
          <a href="/terms" style={{color:"#94a3b8",textDecoration:"none",fontSize:14}}>Terms of Service</a>
          <a href="/privacy" style={{color:"#94a3b8",textDecoration:"none",fontSize:14}}>Privacy Policy</a>
          <a href="/login" style={{color:"#94a3b8",textDecoration:"none",fontSize:14}}>Login</a>
        </div>
        <div style={{borderTop:"1px solid #334155",paddingTop:32,marginTop:32,fontSize:14}}>
          © 2026 France Holiday Planner. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
);

export default Landing;