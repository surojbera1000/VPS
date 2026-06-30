import Head from 'next/head';
import clientPromise from '../lib/mongodb';

const FILTER_SCRIPT = `document.addEventListener('DOMContentLoaded',function(){var tabs=document.querySelectorAll('.filter-tab');tabs.forEach(function(tab){tab.addEventListener('click',function(){var filter=this.dataset.filter;tabs.forEach(function(t){t.classList.remove('active')});this.classList.add('active');var cards=document.querySelectorAll('.plan-card');cards.forEach(function(card){if(filter==='all'||card.dataset.category===filter){card.style.display='block'}else{card.style.display='none'}})})})})`;

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db('kaizen_vps');
    const plans = await db.collection('plans').find({}).sort({ createdAt: -1 }).toArray();
    return { props: { plans: JSON.parse(JSON.stringify(plans)) } };
  } catch (e) {
    return { props: { plans: [] } };
  }
}


function PlanCard({ plan }) {
  const isUnlimited = (plan.specs?.bandwidth || '').toLowerCase().includes('unlimited');
  const specsText = [plan.specs?.ram, plan.specs?.cpu, plan.specs?.storage, plan.specs?.bandwidth, plan.specs?.latency, plan.specs?.speed].join(', ');
  const badgeClass = plan.badge === 'popular' ? 'plan-badge plan-badge-popular' : plan.badge === 'best' ? 'plan-badge plan-badge-best' : '';
  const badgeText = plan.badge === 'popular' ? 'POPULAR' : plan.badge === 'best' ? 'BEST OFFER' : '';
  const flags = (plan.locations || []).map(function(loc) { var p = loc.split(' '); return { flag: p[0], name: p.slice(1).join(' ') }; });
  return (
    <div className="plan-card glass-card" data-category={plan.category}>
      {badgeText ? <div className={badgeClass}>{badgeText}</div> : null}
      <div style={{marginTop: badgeText ? '0.75rem' : '0'}}><h3 className="plan-name">{plan.name}</h3><div><span className="plan-price">{plan.currency}{plan.price}</span><span className="plan-price-period">/month</span></div></div>
      <div className="plan-locations"><span className="plan-locations-label">Locations:</span><div className="plan-locations-flags">{flags.map(function(l,i){return <span key={i} title={l.name}>{l.flag}</span>})}</div></div>
      <div className="plan-specs">
        <div className="plan-spec-row"><span className="plan-spec-label">RAM</span><span className="plan-spec-value">{plan.specs?.ram}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">CPU</span><span className="plan-spec-value">{plan.specs?.cpu}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Storage</span><span className="plan-spec-value">{plan.specs?.storage}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Bandwidth</span><span className={'plan-spec-value' + (isUnlimited?' highlight':'')}>{plan.specs?.bandwidth}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Latency</span><span className="plan-spec-value">{plan.specs?.latency}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Speed</span><span className="plan-spec-value">{plan.specs?.speed}</span></div>
      </div>
      <div className="plan-meta"><div className="plan-meta-item"><div className="plan-meta-label">Validity</div><div className="plan-meta-value">{plan.validity}</div></div><div className="plan-meta-item"><div className="plan-meta-label">Warranty</div><div className="plan-meta-value">{plan.warranty}</div></div></div>
      <div className="plan-actions">
        <button className="btn btn-outline" onClick={function(){navigator.clipboard.writeText(plan.name+' - Kaizen VPS\n'+specsText+'\nOrder: https://t.me/Senkaizen')}}>Copy Specs</button>
        <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="btn btn-green">DM to Buy</a>
      </div>
    </div>
  );
}


export default function Home({ plans }) {
  return (
    <>
      <Head>
        <title>Kaizen VPS Server - Premium VPS and RDP Hosting</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/landing.css" />
        <link rel="stylesheet" href="/css/plans.css" />
        <link rel="stylesheet" href="/css/floating.css" />
      </Head>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-logo"><div className="hero-logo-icon"><svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg></div><span style={{fontSize:'1.5rem',fontWeight:700}}>Kaizen VPS Server</span></div>
          <div className="hero-badge"><span>⭐</span><span>Trusted by 5000+ Customers Worldwide</span></div>
          <h1 className="hero-headline gradient-text">Premium VPS and RDP Hosting</h1>
          <p className="hero-subtext">Trusted by developers, traders, and businesses worldwide.</p>
          <div className="hero-buttons">
            <a href="#plans" className="btn btn-cyan" style={{padding:'1rem 2rem',fontSize:'1rem'}}>View Server Plans</a>
            <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="btn btn-outline" style={{padding:'1rem 2rem',fontSize:'1rem'}}>Contact on Telegram</a>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">4+</div><div className="stat-label">Years Experience</div></div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">5000+</div><div className="stat-label">Servers Sold</div></div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">99.9%</div><div className="stat-label">Uptime</div></div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">24/7</div><div className="stat-label">Support</div></div>
      </section>

      <section className="plans-section" id="plans">
        <div className="plans-header"><h2 className="plans-title"><span style={{color:'var(--accent-cyan)'}}>Server</span> Plans</h2><p style={{color:'var(--text-secondary)'}}>Choose the perfect plan for your needs</p></div>
        <div className="filter-tabs">
          <button className="filter-tab active" data-filter="all">All Plans</button>
          <button className="filter-tab" data-filter="bandwidth">Bandwidth Limit</button>
          <button className="filter-tab" data-filter="renewal">Renewal Servers</button>
          <button className="filter-tab" data-filter="unlimited">Unlimited Bandwidth</button>
        </div>
        <div className="plans-grid">
          {plans.length === 0 ? <div className="empty-state" style={{gridColumn:'1/-1'}}><p>Coming soon! Contact us on Telegram.</p></div> : plans.map(function(plan){return <PlanCard key={plan._id} plan={plan} />})}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand"><div className="footer-logo"><svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg></div><span style={{fontSize:'1.125rem',fontWeight:700}}>Kaizen VPS Server</span></div>
        <p style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>2024 Kaizen VPS Server. All rights reserved.</p>
      </footer>

      <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="floating-telegram">Chat on Telegram</a>

      <script dangerouslySetInnerHTML={{__html: FILTER_SCRIPT}} />
    </>
  );
}


function PlanCard({ plan }) {
  const isUnlimited = (plan.specs?.bandwidth || '').toLowerCase().includes('unlimited');
  const specsText = [plan.specs?.ram, plan.specs?.cpu, plan.specs?.storage, plan.specs?.bandwidth].join(', ');
  const badgeText = plan.badge === 'popular' ? 'POPULAR' : plan.badge === 'best' ? 'BEST OFFER' : '';
  const badgeClass = plan.badge === 'popular' ? 'plan-badge plan-badge-popular' : plan.badge === 'best' ? 'plan-badge plan-badge-best' : '';
  const flags = (plan.locations || []).map(loc => { const p = loc.split(' '); return { flag: p[0], name: p.slice(1).join(' ') }; });
  return (
    <div className="plan-card glass-card" data-category={plan.category}>
      {badgeText && <div className={badgeClass}>{badgeText}</div>}
      <div style={{marginTop: badgeText ? '0.75rem' : '0'}}><h3 className="plan-name">{plan.name}</h3><div><span className="plan-price">{plan.currency}{plan.price}</span><span className="plan-price-period">/month</span></div></div>
      <div className="plan-locations"><span className="plan-locations-label">Locations:</span><div className="plan-locations-flags">{flags.map((l,i) => <span key={i} title={l.name}>{l.flag}</span>)}</div></div>
      <div className="plan-specs">
        <div className="plan-spec-row"><span className="plan-spec-label">RAM</span><span className="plan-spec-value">{plan.specs?.ram}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">CPU</span><span className="plan-spec-value">{plan.specs?.cpu}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Storage</span><span className="plan-spec-value">{plan.specs?.storage}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Bandwidth</span><span className={'plan-spec-value' + (isUnlimited ? ' highlight' : '')}>{plan.specs?.bandwidth}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Latency</span><span className="plan-spec-value">{plan.specs?.latency}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Speed</span><span className="plan-spec-value">{plan.specs?.speed}</span></div>
      </div>
      <div className="plan-meta"><div className="plan-meta-item"><div className="plan-meta-label">Validity</div><div className="plan-meta-value">{plan.validity}</div></div><div className="plan-meta-item"><div className="plan-meta-label">Warranty</div><div className="plan-meta-value">{plan.warranty}</div></div></div>
      <div className="plan-actions">
        <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(plan.name + ' - Kaizen VPS\n' + specsText + '\nOrder: https://t.me/Senkaizen')}>Copy Specs</button>
        <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="btn btn-green">DM to Buy</a>
      </div>
    </div>
  );
}

export default function Home({ plans }) {
  return (
    <>
      <Head>
        <title>Kaizen VPS Server</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/landing.css" />
        <link rel="stylesheet" href="/css/plans.css" />
        <link rel="stylesheet" href="/css/floating.css" />
      </Head>

      <section className="hero"><div className="hero-bg"></div><div className="hero-content">
        <div className="hero-logo"><div className="hero-logo-icon"><svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg></div><span style={{fontSize:'1.5rem',fontWeight:700}}>Kaizen VPS Server</span></div>
        <div className="hero-badge"><span>⭐</span><span>Trusted by 5000+ Customers Worldwide</span></div>
        <h1 className="hero-headline gradient-text">Premium VPS and RDP Hosting</h1>
        <p className="hero-subtext">Trusted by developers, traders, and businesses worldwide.</p>
        <div className="hero-buttons"><a href="#plans" className="btn btn-cyan" style={{padding:'1rem 2rem'}}>View Server Plans</a><a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="btn btn-outline" style={{padding:'1rem 2rem'}}>Contact on Telegram</a></div>
      </div></section>

      <section className="stats-grid">
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">4+</div><div className="stat-label">Years Experience</div></div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">5000+</div><div className="stat-label">Servers Sold</div></div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">99.9%</div><div className="stat-label">Uptime</div></div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}><div className="stat-number">24/7</div><div className="stat-label">Support</div></div>
      </section>

      <section className="plans-section" id="plans">
        <div className="plans-header"><h2 className="plans-title"><span style={{color:'var(--accent-cyan)'}}>Server</span> Plans</h2></div>
        <div className="filter-tabs"><button className="filter-tab active" data-filter="all">All Plans</button><button className="filter-tab" data-filter="bandwidth">Bandwidth Limit</button><button className="filter-tab" data-filter="renewal">Renewal</button><button className="filter-tab" data-filter="unlimited">Unlimited BW</button></div>
        <div className="plans-grid">{plans.length === 0 ? <div className="empty-state" style={{gridColumn:'1/-1'}}><p>Coming soon! Contact us on Telegram.</p></div> : plans.map(p => <PlanCard key={p._id} plan={p} />)}</div>
      </section>

      <footer className="footer"><p style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>2024 Kaizen VPS Server. All rights reserved.</p></footer>
      <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="floating-telegram">Chat on Telegram</a>
      <script dangerouslySetInnerHTML={{__html: FILTER_SCRIPT}} />
    </>
  );
}
