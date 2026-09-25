import React from "react";

const Contact: React.FC = () => (
  <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
    <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
      <div style={{maxWidth:1100,margin:"auto"}}><h1 style={{margin:0,fontSize:32}}>🇫🇷 France Holiday Planner</h1><p>Contact Us</p></div>
    </header>
    <div style={{maxWidth:1100,margin:"auto",padding:"50px 18px"}}>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:32,marginBottom:40}}>
        <div style={{background:"#fff",border:"1px solid #e5e9f0",borderRadius:16,padding:28,boxShadow:"0 5px 20px rgba(20,30,50,.05)"}}>
          <h2 style={{color:"#315efb",marginBottom:14,fontSize:20}}>Get in Touch</h2>
          <p style={{lineHeight:1.6,fontSize:15,color:"#657184",marginBottom:16}}>Have a question, a suggestion, or need help with your trip? We'd love to hear from you. We typically reply within 48 hours.</p>
          <div style={{marginBottom:10}}><strong>📧 Email</strong><br/><span style={{color:"#657184"}}>hello@franceholidayplanner.com</span></div>
          <div style={{marginBottom:10}}><strong>✉️ Privacy</strong><br/><span style={{color:"#657184"}}>privacy@franceholidayplanner.com</span></div>
          <div style={{marginBottom:10}}><strong>💬 Response Time</strong><br/><span style={{color:"#657184"}}>Within 48 hours</span></div>
        </div>

        <div style={{background:"#fff",border:"1px solid #e5e9f0",borderRadius:16,padding:28,boxShadow:"0 5px 20px rgba(20,30,50,.05)"}}>
          <h2 style={{color:"#315efb",marginBottom:14,fontSize:20}}>Send Us a Message</h2>
          <form style={{display:"flex",flexDirection:"column",gap:14}} onSubmit={(e)=>{e.preventDefault();alert("Message noted — we'll reply at hello@franceholidayplanner.com.");}}>
            <input type="text" placeholder="Your name" style={{width:"100%",border:"1px solid #d8dee9",borderRadius:8,padding:10,background:"#fff",color:"inherit",boxSizing:"border-box"}} required/>
            <input type="email" placeholder="Your email" style={{width:"100%",border:"1px solid #d8dee9",borderRadius:8,padding:10,background:"#fff",color:"inherit",boxSizing:"border-box"}} required/>
            <textarea placeholder="How can we help?" rows={5} style={{width:"100%",border:"1px solid #d8dee9",borderRadius:8,padding:10,background:"#fff",color:"inherit",boxSizing:"border-box",resize:"vertical"}} required/>
            <button type="submit" style={{border:0,borderRadius:10,padding:"11px 18px",background:"#315efb",color:"#fff",cursor:"pointer",fontWeight:650,fontSize:15}}>Send Message</button>
          </form>
        </div>
      </div>

      <div style={{background:"#f8f9fc",border:"1px solid #e5e9f0",borderRadius:16,padding:28,maxWidth:700,margin:"0 auto",textAlign:"center"}} >
        <h2 style={{color:"#315efb",marginBottom:12,fontSize:20}}>Prefer Email?</h2>
        <p style={{lineHeight:1.6,fontSize:15,color:"#657184"}}>For faster help, email us directly at <strong>hello@franceholidayplanner.com</strong>. Include your trip dates and any relevant details — we'll get back to you quickly.</p>
      </div>
    </div>
  </main>
);

export default Contact;