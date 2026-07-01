import clientPromise from "@/lib/db";
import styles from "./page.module.css";

async function getPlans() {
  try {
    const client = await clientPromise;
    const db = client.db("kaizen_vps");
    const plans = await db.collection("plans").find({}).sort({ createdAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(plans));
  } catch (e) { return []; }
}

export default async function Home() {
  const plans = await getPlans();
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>⭐ Trusted by 5000+ Customers Worldwide</div>
          <h1 className={styles.headline}>Premium VPS & RDP Hosting</h1>
          <p className={styles.subtext}>Trusted by developers, traders, and businesses worldwide.</p>
          <div className={styles.buttons}>
            <a href="#plans" className={styles.btnCyan}>View Server Plans</a>
            <a href="https://t.me/Senkaizen" target="_blank" className={styles.btnOutline}>Contact on Telegram</a>
          </div>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}><div className={styles.statNum}>4+</div><div className={styles.statLabel}>Years Experience</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>5000+</div><div className={styles.statLabel}>Servers Sold</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>99.9%</div><div className={styles.statLabel}>Uptime</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>24/7</div><div className={styles.statLabel}>Support</div></div>
      </section>

      <section id="plans" className={styles.plansSection}>
        <h2 className={styles.plansTitle}><span style={{color:"#00a3ff"}}>Server</span> Plans</h2>
        <div className={styles.plansGrid}>
          {plans.length === 0 && <p style={{textAlign:"center",gridColumn:"1/-1",color:"#94a3b8"}}>Plans coming soon! Contact us on Telegram.</p>}
          {plans.map(plan => (
            <div key={plan._id} className={styles.planCard}>
              {plan.badge && <div className={plan.badge==="popular"?styles.badgePopular:styles.badgeBest}>{plan.badge==="popular"?"POPULAR":"BEST OFFER"}</div>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.planPrice}>{plan.currency}{plan.price}<span>/month</span></div>
              <div className={styles.planLocs}>{(plan.locations||[]).join("  ")}</div>
              <div className={styles.specs}>
                <div className={styles.specRow}><span>RAM</span><span>{plan.specs?.ram}</span></div>
                <div className={styles.specRow}><span>CPU</span><span>{plan.specs?.cpu}</span></div>
                <div className={styles.specRow}><span>Storage</span><span>{plan.specs?.storage}</span></div>
                <div className={styles.specRow}><span>Bandwidth</span><span style={{color:(plan.specs?.bandwidth||"").includes("Unlimited")?"#2dd4bf":"#fff"}}>{plan.specs?.bandwidth}</span></div>
                <div className={styles.specRow}><span>Latency</span><span>{plan.specs?.latency}</span></div>
                <div className={styles.specRow}><span>Speed</span><span>{plan.specs?.speed}</span></div>
              </div>
              <div className={styles.planMeta}>
                <div><small>Validity</small><br/>{plan.validity}</div>
                <div><small>Warranty</small><br/>{plan.warranty}</div>
              </div>
              <a href="https://t.me/Senkaizen" target="_blank" className={styles.btnGreen}>DM to Buy</a>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Kaizen VPS Server &copy; 2024</p>
      </footer>

      <a href="https://t.me/Senkaizen" target="_blank" className={styles.floatingBtn}>💬 Chat on Telegram</a>
    </main>
  );
}
