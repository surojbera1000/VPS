"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [token, setToken] = useState("");
  const [err, setErr] = useState("");
  const [plans, setPlans] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const empty = {name:"",category:"bandwidth",price:"",currency:"₹",badge:"",locations:"",ram:"",cpu:"",storage:"",bandwidth:"",latency:"",speed:"",validity:"30 Days",warranty:"15 Days"};
  const [form, setForm] = useState(empty);

  useEffect(() => { const t=sessionStorage.getItem("kt"); if(t){setToken(t);setLoggedIn(true);} }, []);
  useEffect(() => { if(loggedIn) load(); }, [loggedIn]);

  async function load() { const r=await fetch("/api/plans"); const d=await r.json(); setPlans(Array.isArray(d)?d:[]); }

  async function login(e) {
    e.preventDefault(); setErr("");
    const r=await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
    const d=await r.json();
    if(d.success){setToken(d.token);sessionStorage.setItem("kt",d.token);setLoggedIn(true);}
    else setErr("Wrong password");
  }

  function logout(){sessionStorage.removeItem("kt");setLoggedIn(false);setToken("");}
  function msg(m){setToast(m);setTimeout(()=>setToast(""),2500);}
  function up(k,v){setForm(p=>({...p,[k]:v}));}

  function addNew(){setEditing(null);setForm(empty);setModal(true);}
  function edit(p){setEditing(p);setForm({name:p.name,category:p.category,price:String(p.price),currency:p.currency||"₹",badge:p.badge||"",locations:(p.locations||[]).join(", "),ram:p.specs?.ram||"",cpu:p.specs?.cpu||"",storage:p.specs?.storage||"",bandwidth:p.specs?.bandwidth||"",latency:p.specs?.latency||"",speed:p.specs?.speed||"",validity:p.validity||"30 Days",warranty:p.warranty||"15 Days"});setModal(true);}

  async function save(e) {
    e.preventDefault();
    const data={name:form.name,category:form.category,price:Number(form.price),currency:form.currency,badge:form.badge||null,locations:form.locations.split(",").map(s=>s.trim()).filter(Boolean),specs:{ram:form.ram,cpu:form.cpu,storage:form.storage,bandwidth:form.bandwidth,latency:form.latency,speed:form.speed},validity:form.validity,warranty:form.warranty};
    const url=editing?`/api/plans/${editing._id}`:"/api/plans";
    const method=editing?"PUT":"POST";
    const r=await fetch(url,{method,headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(data)});
    if(r.ok){msg(editing?"Updated!":"Added!");setModal(false);load();}else msg("Failed!");
  }

  async function del(id){if(!confirm("Delete?"))return;const r=await fetch(`/api/plans/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});if(r.ok){msg("Deleted!");load();}}

  const S={bg:{background:"#0a0e1a",minHeight:"100vh",padding:"1rem"},card:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"1rem",padding:"2rem",maxWidth:"400px",margin:"15vh auto",textAlign:"center"},inp:{width:"100%",padding:"0.7rem",borderRadius:"0.5rem",border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#fff",marginBottom:"1rem",fontSize:"0.9rem"},btn:{padding:"0.7rem 1.5rem",borderRadius:"0.7rem",background:"linear-gradient(135deg,#00a3ff,#0077cc)",color:"#fff",border:"none",fontWeight:600,cursor:"pointer",width:"100%"},header:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem",borderBottom:"1px solid rgba(255,255,255,0.08)",marginBottom:"1.5rem"},tbl:{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"},td:{padding:"0.6rem",borderBottom:"1px solid rgba(255,255,255,0.05)"},overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"1rem"},mCard:{background:"#0f1629",borderRadius:"1rem",padding:"1.5rem",width:"100%",maxWidth:"550px",maxHeight:"90vh",overflowY:"auto",border:"1px solid rgba(255,255,255,0.1)"},row:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"0.75rem"},lbl:{fontSize:"0.75rem",color:"#94a3b8",marginBottom:"0.2rem"},toastS:{position:"fixed",top:"1rem",right:"1rem",background:"rgba(45,212,191,0.15)",border:"1px solid rgba(45,212,191,0.4)",color:"#2dd4bf",padding:"0.6rem 1rem",borderRadius:"0.7rem",fontSize:"0.85rem",zIndex:200}};

  if(!loggedIn) return (
    <div style={S.bg}>
      <div style={S.card}>
        <h2 style={{marginBottom:"0.5rem"}}>Admin Panel</h2>
        <p style={{color:"#94a3b8",fontSize:"0.85rem",marginBottom:"1.5rem"}}>Kaizen VPS Server</p>
        <form onSubmit={login}>
          <input style={S.inp} type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} required />
          {err&&<p style={{color:"#ef4444",fontSize:"0.8rem",marginBottom:"0.5rem"}}>{err}</p>}
          <button style={S.btn} type="submit">Login</button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={S.bg}>
      {toast&&<div style={S.toastS}>{toast}</div>}
      <div style={S.header}>
        <b>Kaizen Admin</b>
        <div><a href="/" style={{color:"#00a3ff",marginRight:"1rem",fontSize:"0.85rem"}}>View Site</a><button onClick={logout} style={{background:"none",border:"1px solid rgba(239,68,68,0.4)",color:"#ef4444",padding:"0.4rem 0.8rem",borderRadius:"0.5rem",cursor:"pointer",fontSize:"0.8rem"}}>Logout</button></div>
      </div>

      <div style={{maxWidth:"1000px",margin:"0 auto"}}>
        <div style={{marginBottom:"1.5rem"}}><button onClick={addNew} style={{...S.btn,width:"auto",padding:"0.6rem 1.5rem"}}>+ Add Plan</button></div>

        <div style={{overflowX:"auto",background:"rgba(255,255,255,0.02)",borderRadius:"0.75rem",border:"1px solid rgba(255,255,255,0.06)"}}>
          <table style={S.tbl}>
            <thead><tr style={{color:"#94a3b8"}}>
              <th style={S.td}>Name</th><th style={S.td}>Category</th><th style={S.td}>Price</th><th style={S.td}>RAM</th><th style={S.td}>BW</th><th style={S.td}>Actions</th>
            </tr></thead>
            <tbody>
              {plans.map(p=>(
                <tr key={p._id}><td style={S.td}><b>{p.name}</b></td><td style={S.td}>{p.category}</td><td style={S.td}>{p.currency}{p.price}</td><td style={S.td}>{p.specs?.ram}</td><td style={S.td}>{p.specs?.bandwidth}</td>
                <td style={S.td}><button onClick={()=>edit(p)} style={{background:"rgba(0,163,255,0.15)",color:"#00a3ff",border:"1px solid rgba(0,163,255,0.3)",padding:"0.3rem 0.6rem",borderRadius:"0.4rem",cursor:"pointer",marginRight:"0.4rem",fontSize:"0.75rem"}}>Edit</button><button onClick={()=>del(p._id)} style={{background:"rgba(239,68,68,0.15)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.3)",padding:"0.3rem 0.6rem",borderRadius:"0.4rem",cursor:"pointer",fontSize:"0.75rem"}}>Del</button></td></tr>
              ))}
              {plans.length===0&&<tr><td colSpan="6" style={{...S.td,textAlign:"center",color:"#64748b",padding:"2rem"}}>No plans. Click + Add Plan</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal&&<div style={S.overlay} onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
        <div style={S.mCard}>
          <h3 style={{marginBottom:"1rem"}}>{editing?"Edit Plan":"Add Plan"}</h3>
          <form onSubmit={save}>
            <div style={S.row}><div><div style={S.lbl}>Name</div><input style={S.inp} value={form.name} onChange={e=>up("name",e.target.value)} required/></div><div><div style={S.lbl}>Category</div><select style={S.inp} value={form.category} onChange={e=>up("category",e.target.value)}><option value="bandwidth">Bandwidth</option><option value="unlimited">Unlimited</option><option value="renewal">Renewal</option></select></div></div>
            <div style={S.row}><div><div style={S.lbl}>Price</div><input style={S.inp} type="number" value={form.price} onChange={e=>up("price",e.target.value)} required/></div><div><div style={S.lbl}>Badge</div><select style={S.inp} value={form.badge} onChange={e=>up("badge",e.target.value)}><option value="">None</option><option value="popular">Popular</option><option value="best">Best Offer</option></select></div></div>
            <div><div style={S.lbl}>Locations (comma separated)</div><input style={S.inp} value={form.locations} onChange={e=>up("locations",e.target.value)} placeholder="🇺🇸 USA, 🇮🇳 India" required/></div>
            <div style={S.row}><div><div style={S.lbl}>RAM</div><input style={S.inp} value={form.ram} onChange={e=>up("ram",e.target.value)} required/></div><div><div style={S.lbl}>CPU</div><input style={S.inp} value={form.cpu} onChange={e=>up("cpu",e.target.value)} required/></div></div>
            <div style={S.row}><div><div style={S.lbl}>Storage</div><input style={S.inp} value={form.storage} onChange={e=>up("storage",e.target.value)} required/></div><div><div style={S.lbl}>Bandwidth</div><input style={S.inp} value={form.bandwidth} onChange={e=>up("bandwidth",e.target.value)} required/></div></div>
            <div style={S.row}><div><div style={S.lbl}>Latency</div><input style={S.inp} value={form.latency} onChange={e=>up("latency",e.target.value)} required/></div><div><div style={S.lbl}>Speed</div><input style={S.inp} value={form.speed} onChange={e=>up("speed",e.target.value)} required/></div></div>
            <div style={S.row}><div><div style={S.lbl}>Validity</div><input style={S.inp} value={form.validity} onChange={e=>up("validity",e.target.value)} required/></div><div><div style={S.lbl}>Warranty</div><input style={S.inp} value={form.warranty} onChange={e=>up("warranty",e.target.value)} required/></div></div>
            <div style={{display:"flex",gap:"0.75rem",marginTop:"0.5rem"}}><button type="submit" style={{...S.btn,flex:1}}>Save</button><button type="button" onClick={()=>setModal(false)} style={{flex:1,padding:"0.7rem",borderRadius:"0.7rem",background:"none",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",cursor:"pointer"}}>Cancel</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
}
