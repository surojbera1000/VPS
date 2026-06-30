import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';

/* eslint-disable react-hooks/exhaustive-deps */

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState(getEmptyForm());

  function getEmptyForm() {
    return { name:'', category:'bandwidth', price:'',
      currency:'₹', badge:'', locations:'',
      ram:'', cpu:'', storage:'', bandwidth:'',
      latency:'', speed:'', validity:'30 Days', warranty:'15 Days' };
  }

  useEffect(() => {
    const t = sessionStorage.getItem('kaizen_token');
    if (t) { setToken(t); setLoggedIn(true); }
  }, []);

  useEffect(() => {
    if (loggedIn) fetchPlans();
  }, [loggedIn]);

  async function fetchPlans() {
    const res = await fetch('/api/plans');
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
  }


  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      setToken(data.token);
      sessionStorage.setItem('kaizen_token', data.token);
      setLoggedIn(true);
    } else {
      setLoginError('❌ Incorrect password');
    }
  }

  function logout() {
    sessionStorage.removeItem('kaizen_token');
    setLoggedIn(false);
    setToken('');
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function openAddModal() {
    setEditingPlan(null);
    setForm(getEmptyForm());
    setShowModal(true);
  }

  function openEditModal(plan) {
    setEditingPlan(plan);
    setForm({
      name: plan.name || '',
      category: plan.category || 'bandwidth',
      price: String(plan.price || ''),
      currency: plan.currency || '₹',
      badge: plan.badge || '',
      locations: (plan.locations || []).join(', '),
      ram: plan.specs?.ram || '',
      cpu: plan.specs?.cpu || '',
      storage: plan.specs?.storage || '',
      bandwidth: plan.specs?.bandwidth || '',
      latency: plan.specs?.latency || '',
      speed: plan.specs?.speed || '',
      validity: plan.validity || '30 Days',
      warranty: plan.warranty || '15 Days'
    });
    setShowModal(true);
  }


  async function handleSubmit(e) {
    e.preventDefault();
    const planData = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      currency: form.currency || '₹',
      badge: form.badge || null,
      locations: form.locations.split(',').map(l => l.trim()).filter(l => l),
      specs: { ram: form.ram, cpu: form.cpu, storage: form.storage,
        bandwidth: form.bandwidth, latency: form.latency, speed: form.speed },
      validity: form.validity,
      warranty: form.warranty
    };

    if (editingPlan) {
      const res = await fetch(`/api/plans/${editingPlan._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(planData)
      });
      if (res.ok) { showToast('✅ Plan updated!'); }
      else { showToast('❌ Failed to update'); }
    } else {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(planData)
      });
      if (res.ok) { showToast('✅ Plan added!'); }
      else { showToast('❌ Failed to add'); }
    }
    setShowModal(false);
    fetchPlans();
  }

  async function deletePlan(id) {
    if (!confirm('Delete this plan?')) return;
    const res = await fetch(`/api/plans/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) { showToast('🗑️ Plan deleted'); fetchPlans(); }
    else { showToast('❌ Failed to delete'); }
  }

  function updateForm(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  const stats = {
    total: plans.length,
    bandwidth: plans.filter(p => p.category === 'bandwidth').length,
    unlimited: plans.filter(p => p.category === 'unlimited').length,
    renewal: plans.filter(p => p.category === 'renewal').length
  };


  return (
    <>
      <Head>
        <title>Admin Panel - Kaizen VPS Server</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/admin.css" />
      </Head>

      {toast && <div className="toast" style={{position:'fixed',top:'1.5rem',right:'1.5rem',zIndex:200}}>{toast}</div>}

      {!loggedIn ? (
        <div className="login-container">
          <div className="login-card glass-card">
            <div style={{marginBottom:'1.5rem'}}>
              <div style={{width:'3rem',height:'3rem',borderRadius:'0.75rem',background:'linear-gradient(135deg,var(--accent-cyan),var(--accent-green))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}>
                <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
            </div>
            <h2 className="login-title">Admin Panel</h2>
            <p className="login-subtitle">Kaizen VPS Server — Manage your plans</p>
            <form onSubmit={handleLogin}>
              <input type="password" className="login-input" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} required />
              {loginError && <div style={{color:'#ef4444',fontSize:'0.8rem',marginBottom:'1rem'}}>{loginError}</div>}
              <button type="submit" className="btn btn-cyan" style={{width:'100%',padding:'0.75rem'}}>Login</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="admin-layout" style={{display:'block'}}>
          {/* Header */}
          <header className="admin-header">
            <div className="admin-header-brand">
              <div style={{width:'2rem',height:'2rem',borderRadius:'0.5rem',background:'linear-gradient(135deg,var(--accent-cyan),var(--accent-green))',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg>
              </div>
              <span>Kaizen Admin</span>
            </div>
            <div className="admin-header-actions">
              <a href="/" className="btn btn-outline" style={{padding:'0.5rem 1rem',fontSize:'0.8rem'}}>View Site</a>
              <button onClick={logout} className="btn" style={{padding:'0.5rem 1rem',fontSize:'0.8rem',background:'rgba(239,68,68,0.15)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.3)'}}>Logout</button>
            </div>
          </header>


          {/* Main */}
          <main className="admin-main">
            {/* Stats */}
            <div className="admin-stats">
              <div className="admin-stat-card glass-card"><div className="admin-stat-value">{stats.total}</div><div className="admin-stat-label">Total Plans</div></div>
              <div className="admin-stat-card glass-card"><div className="admin-stat-value" style={{color:'var(--accent-cyan)'}}>{stats.bandwidth}</div><div className="admin-stat-label">Bandwidth Limit</div></div>
              <div className="admin-stat-card glass-card"><div className="admin-stat-value" style={{color:'var(--accent-green)'}}>{stats.unlimited}</div><div className="admin-stat-label">Unlimited BW</div></div>
              <div className="admin-stat-card glass-card"><div className="admin-stat-value" style={{color:'var(--accent-orange)'}}>{stats.renewal}</div><div className="admin-stat-label">Renewal</div></div>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
              <button onClick={openAddModal} className="btn btn-cyan" style={{padding:'0.6rem 1.25rem'}}>+ Add Plan</button>
            </div>

            {/* Table */}
            <div className="admin-section-title">All Plans</div>
            <div className="admin-table-wrapper glass-card">
              <table className="admin-table">
                <thead><tr>
                  <th>Name</th><th>Category</th><th>Price</th><th>RAM</th><th>CPU</th><th>Storage</th><th>Bandwidth</th><th>Validity</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan._id}>
                      <td><strong>{plan.name}</strong></td>
                      <td><span className={`badge badge-${plan.category}`}>{plan.category}</span></td>
                      <td>{plan.currency}{plan.price}</td>
                      <td>{plan.specs?.ram}</td>
                      <td>{plan.specs?.cpu}</td>
                      <td>{plan.specs?.storage}</td>
                      <td>{plan.specs?.bandwidth}</td>
                      <td>{plan.validity}</td>
                      <td className="actions">
                        <button className="btn-sm btn-edit" onClick={() => openEditModal(plan)}>Edit</button>
                        <button className="btn-sm btn-delete" onClick={() => deletePlan(plan._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {plans.length === 0 && <tr><td colSpan="9" style={{textAlign:'center',padding:'2rem',color:'var(--text-secondary)'}}>No plans yet. Click "Add Plan" to create one.</td></tr>}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}


      {/* Modal */}
      {showModal && (
        <div className="modal-overlay active" onClick={(e) => { if(e.target===e.currentTarget) setShowModal(false); }}>
          <div className="modal-card">
            <h3 className="modal-title">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Plan Name</label><input className="form-input" value={form.name} onChange={e=>updateForm('name',e.target.value)} placeholder="e.g. DO1" required /></div>
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e=>updateForm('category',e.target.value)}>
                    <option value="bandwidth">Bandwidth Limit</option><option value="unlimited">Unlimited Bandwidth</option><option value="renewal">Renewal</option>
                  </select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Price</label><input className="form-input" type="number" value={form.price} onChange={e=>updateForm('price',e.target.value)} placeholder="350" required /></div>
                <div className="form-group"><label className="form-label">Currency</label><input className="form-input" value={form.currency} onChange={e=>updateForm('currency',e.target.value)} placeholder="₹" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Badge</label>
                  <select className="form-select" value={form.badge} onChange={e=>updateForm('badge',e.target.value)}>
                    <option value="">None</option><option value="popular">POPULAR</option><option value="best">BEST OFFER</option>
                  </select></div>
                <div className="form-group"><label className="form-label">Locations (comma-separated)</label><input className="form-input" value={form.locations} onChange={e=>updateForm('locations',e.target.value)} placeholder="🇺🇸 USA, 🇮🇳 India" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">RAM</label><input className="form-input" value={form.ram} onChange={e=>updateForm('ram',e.target.value)} placeholder="8 GB" required /></div>
                <div className="form-group"><label className="form-label">CPU</label><input className="form-input" value={form.cpu} onChange={e=>updateForm('cpu',e.target.value)} placeholder="4 Core" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Storage</label><input className="form-input" value={form.storage} onChange={e=>updateForm('storage',e.target.value)} placeholder="160 GB NVMe" required /></div>
                <div className="form-group"><label className="form-label">Bandwidth</label><input className="form-input" value={form.bandwidth} onChange={e=>updateForm('bandwidth',e.target.value)} placeholder="5 TB" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Latency</label><input className="form-input" value={form.latency} onChange={e=>updateForm('latency',e.target.value)} placeholder="95 ms" required /></div>
                <div className="form-group"><label className="form-label">Speed</label><input className="form-input" value={form.speed} onChange={e=>updateForm('speed',e.target.value)} placeholder="Up to 2 Gbps" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Validity</label><input className="form-input" value={form.validity} onChange={e=>updateForm('validity',e.target.value)} placeholder="30 Days" required /></div>
                <div className="form-group"><label className="form-label">Warranty</label><input className="form-input" value={form.warranty} onChange={e=>updateForm('warranty',e.target.value)} placeholder="15 Days" required /></div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-cyan" style={{flex:1}}>Save Plan</button>
                <button type="button" onClick={()=>setShowModal(false)} className="btn btn-outline" style={{flex:1}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
