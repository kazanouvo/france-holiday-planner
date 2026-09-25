import React from "react";

const Login: React.FC = () => (
  <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{background:"#fff",borderRadius:16,boxShadow:"0 10px 40px rgba(0,0,0,.1)",padding:40,maxWidth:400,width:"100%",margin:24}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <h1 style={{fontSize:32,fontWeight:700,color:"#1e293b",marginBottom:8}}>Welcome Back</h1>
        <p style={{color:"#64748b",fontSize:16}}>Sign in to your France Holiday Planner account</p>
      </div>

      <form style={{display:"flex",flexDirection:"column",gap:20}}>
        <div>
          <label style={{display:"block",marginBottom:8,fontSize:14,fontWeight:500,color:"#475569"}}>Email Address</label>
          <input type="email" placeholder="you@example.com" style={{width:"100%",padding:"12px 16px",border:"1px solid #d1d5db",borderRadius:8,fontSize:16,outline:"none",transition:"border-color .2s"}} />
        </div>

        <div>
          <label style={{display:"block",marginBottom:8,fontSize:14,fontWeight:500,color:"#475569"}}>Password</label>
          <input type="password" placeholder="Enter your password" style={{width:"100%",padding:"12px 16px",border:"1px solid #d1d5db",borderRadius:8,fontSize:16,outline:"none",transition:"border-color .2s"}} />
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:14,color:"#475569"}}>
            <input type="checkbox" style={{width:16,height:16}} /> Remember me
          </label>
          <a href="#" style={{color:"#3b82f6",fontSize:14,textDecoration:"none",fontWeight:500}}>Forgot password?</a>
        </div>

        <button type="submit" style={{background:"#3b82f6",color:"#fff",padding:"12px",borderRadius:8,fontSize:16,fontWeight:600,border:"none",cursor:"pointer",transition:"background .2s",marginTop:8}}>Sign In</button>
      </form>

      <div style={{marginTop:32,textAlign:"center",borderTop:"1px solid #e2e8f0",paddingTop:32}}>
        <p style={{color:"#64748b",fontSize:14}}>
          Don't have an account? <a href="#" style={{color:"#3b82f6",fontWeight:600,textDecoration:"none"}}>Sign up for free</a>
        </p>
      </div>
    </div>
  </main>
);

export default Login;