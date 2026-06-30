import Head from 'next/head';
import clientPromise from '../lib/mongodb';

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

export default function Home({ plans }) {
  return (
    <>
      <Head>
        <title>Kaizen VPS Server - Premium VPS &amp; RDP Hosting</title>
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <div className="hero-logo-icon">
              <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              </svg>
            </div>
            <span style={{fontSize:'1.5rem',fontWeight:700}}>Kaizen VPS Server</span>
          </div>
          <div className="hero-badge"><span>⭐</span><span>Trusted by 5000+ Customers Worldwide</span></div>
          <h1 className="hero-headline gradient-text">Premium VPS &amp; RDP Hosting</h1>
          <p className="hero-subtext">Trusted by developers, traders, and businesses worldwide. Lightning-fast servers with enterprise-grade reliability.</p>
          <div className="hero-buttons">
            <a href="#plans" className="btn btn-cyan" style={{padding:'1rem 2rem',fontSize:'1rem'}}>View Server Plans</a>
            <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="btn btn-outline" style={{padding:'1rem 2rem',fontSize:'1rem'}}>Contact on Telegram</a>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="stats-grid">
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}>
          <div className="stat-icon"><svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg></div>
          <div className="stat-number">4+</div>
          <div className="stat-label">Years Experience</div>
        </div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}>
          <div className="stat-icon"><svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg></div>
          <div className="stat-number">5000+</div>
          <div className="stat-label">Servers Sold</div>
        </div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}>
          <div className="stat-icon"><svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
        <div className="stat-card glass-card" style={{boxShadow:'var(--glow-cyan)'}}>
          <div className="stat-icon"><svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg></div>
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support</div>
        </div>
      </section>


      {/* Plans Section */}
      <section className="plans-section" id="plans">
        <div className="plans-header">
          <h2 className="plans-title"><span style={{color:'var(--accent-cyan)'}}>Server</span> Plans</h2>
          <p style={{color:'var(--text-secondary)'}}>Choose the perfect plan for your needs</p>
        </div>

        <div className="filter-tabs" id="filterTabs">
          <button className="filter-tab active" data-filter="all">All Plans</button>
          <button className="filter-tab" data-filter="bandwidth">Bandwidth Limit</button>
          <button className="filter-tab" data-filter="renewal">Renewal Servers</button>
          <button className="filter-tab" data-filter="unlimited">Unlimited Bandwidth</button>
        </div>

        <div className="plans-grid" id="plansGrid">
          {plans.length === 0 ? (
            <div className="empty-state" style={{gridColumn:'1/-1'}}>
              <p style={{fontSize:'1.25rem',marginBottom:'0.5rem'}}>🚀 Plans coming soon!</p>
              <p>Contact us on Telegram for current offers.</p>
            </div>
          ) : (
            plans.map(plan => <PlanCard key={plan._id} plan={plan} />)
          )}
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg>
          </div>
          <span style={{fontSize:'1.125rem',fontWeight:700}}>Kaizen VPS Server</span>
        </div>
        <p style={{color:'var(--text-muted)',fontSize:'0.875rem',marginBottom:'1rem'}}>Premium VPS &amp; RDP Hosting Solutions</p>
        <p style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>&copy; 2024 Kaizen VPS Server. All rights reserved.</p>
      </footer>

      {/* Floating Telegram */}
      <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="floating-telegram">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        Chat on Telegram
      </a>

      {/* Floating Help */}
      <div className="floating-help">
        <div className="floating-help-inner glass-card" style={{boxShadow:'var(--glow-cyan)'}}>
          <div className="floating-help-icon">
            <svg width="16" height="16" fill="none" stroke="var(--accent-cyan)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <div className="floating-help-text">Need help choosing?</div>
            <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="floating-help-link">Ask us →</a>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: filterScript}} />
    </>
  );
}


function PlanCard({ plan }) {
  const isUnlimited = plan.specs?.bandwidth?.toLowerCase().includes('unlimited');
  const specsText = `${plan.specs?.ram} RAM, ${plan.specs?.cpu} CPU, ${plan.specs?.storage}, ${plan.specs?.bandwidth} BW, ${plan.specs?.latency} Latency, ${plan.specs?.speed}`;
  const badgeClass = plan.badge === 'popular' ? 'plan-badge plan-badge-popular' : plan.badge === 'best' ? 'plan-badge plan-badge-best' : '';
  const badgeText = plan.badge === 'popular' ? 'POPULAR' : plan.badge === 'best' ? 'BEST OFFER' : '';
  const flags = (plan.locations || []).map(loc => { const parts = loc.split(' '); return { flag: parts[0], name: parts.slice(1).join(' ') }; });

  return (
    <div className="plan-card glass-card" data-category={plan.category}>
      {badgeText && <div className={badgeClass}>{badgeText}</div>}
      <div style={{marginTop: badgeText ? '0.75rem' : '0'}}>
        <h3 className="plan-name">{plan.name}</h3>
        <div><span className="plan-price">{plan.currency}{plan.price}</span><span className="plan-price-period">/month</span></div>
      </div>
      <div className="plan-locations">
        <span className="plan-locations-label">Locations:</span>
        <div className="plan-locations-flags">{flags.map((l,i) => <span key={i} title={l.name}>{l.flag}</span>)}</div>
      </div>
      <div className="plan-specs">
        <div className="plan-spec-row"><span className="plan-spec-label">RAM</span><span className="plan-spec-value">{plan.specs?.ram}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">CPU</span><span className="plan-spec-value">{plan.specs?.cpu}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Storage</span><span className="plan-spec-value">{plan.specs?.storage}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Bandwidth</span><span className={`plan-spec-value ${isUnlimited?'highlight':''}`}>{plan.specs?.bandwidth}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Latency</span><span className="plan-spec-value">{plan.specs?.latency}</span></div>
        <div className="plan-spec-row"><span className="plan-spec-label">Speed</span><span className="plan-spec-value">{plan.specs?.speed}</span></div>
      </div>
      <div className="plan-meta">
        <div className="plan-meta-item"><div className="plan-meta-label">Validity</div><div className="plan-meta-value">{plan.validity}</div></div>
        <div className="plan-meta-item"><div className="plan-meta-label">Warranty</div><div className="plan-meta-value">{plan.warranty}</div></div>
      </div>
      <div className="plan-actions">
        <button className="btn btn-outline" onClick={() => {navigator.clipboard.writeText(`📦 ${plan.name} - Kaizen VPS\n${specsText}\n💬 Order: https://t.me/Senkaizen`)}}>Copy Specs</button>
        <a href="https://t.me/Senkaizen" target="_blank" rel="noreferrer" className="btn btn-green">DM to Buy</a>
      </div>
    </div>
  );
}


const filterScript = `
  document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var filter = this.dataset.filter;
        tabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        var cards = document.querySelectorAll('.plan-card');
        cards.forEach(function(card) {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
`;
