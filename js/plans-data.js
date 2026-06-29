/* ========================================
   Kaizen VPS Server - Plans Data
   Plans are stored permanently in localStorage.
   Only plans YOU add via admin panel will appear.
   They will NEVER be auto-removed or reset.
   ======================================== */

// Get plans from localStorage (starts empty until you add plans)
function getPlans() {
    const stored = localStorage.getItem('kaizen_vps_plans');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Save plans to localStorage (permanent until you manually delete)
function savePlans(plans) {
    localStorage.setItem('kaizen_vps_plans', JSON.stringify(plans));
}
