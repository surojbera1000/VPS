/* ========================================
   Kaizen VPS Server - Plans Data
   
   HOW TO UPDATE PLANS FOR ALL VISITORS:
   1. Add/edit plans in Admin Panel
   2. Click "Export JSON" button
   3. Paste the exported array below in LIVE_PLANS
   4. Commit to GitHub → everyone sees your plans
   ======================================== */

// ✅ PUT YOUR REAL PLANS HERE (replace this empty array)
// After adding plans in admin panel, export and paste here
const LIVE_PLANS = [];

// Get plans - shows LIVE_PLANS to all visitors
// Admin panel overrides locally for preview
function getPlans() {
    const stored = localStorage.getItem('kaizen_vps_plans');
    if (stored) {
        try {
            const plans = JSON.parse(stored);
            if (plans.length > 0) {
                return plans;
            }
        } catch (e) {
            // Fall through
        }
    }
    return LIVE_PLANS;
}

// Save plans to localStorage (admin panel)
function savePlans(plans) {
    localStorage.setItem('kaizen_vps_plans', JSON.stringify(plans));
}

// Clear localStorage overrides
function resetPlans() {
    localStorage.removeItem('kaizen_vps_plans');
}
