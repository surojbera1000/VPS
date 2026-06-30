/* ========================================
   Kaizen VPS Server - Plans Data
   
   HOW IT WORKS:
   - DEFAULT_PLANS below are shown to ALL visitors
   - When you edit/add/delete via Admin Panel, changes
     save to localStorage on YOUR device
   - Visitors always see DEFAULT_PLANS from this file
   - To update plans for everyone: edit this file directly
     OR use Admin Panel + Export JSON to get your plan list,
     then paste it here as DEFAULT_PLANS
   ======================================== */

const DEFAULT_PLANS = [
    {
        id: "do1",
        name: "DO1",
        category: "bandwidth",
        price: 350,
        currency: "₹",
        badge: "popular",
        locations: ["🇺🇸 USA", "🇮🇳 India", "🇸🇬 Singapore", "🇪🇺 Europe"],
        specs: {
            ram: "8 GB",
            cpu: "4 Core",
            storage: "160 GB NVMe",
            bandwidth: "5 TB",
            latency: "95 ms",
            speed: "Up to 2 Gbps"
        },
        validity: "30 Days",
        warranty: "15 Days"
    },
    {
        id: "do2",
        name: "DO2",
        category: "bandwidth",
        price: 550,
        currency: "₹",
        badge: null,
        locations: ["🇺🇸 USA", "🇮🇳 India", "🇸🇬 Singapore", "🇪🇺 Europe", "🇯🇵 Japan"],
        specs: {
            ram: "16 GB",
            cpu: "6 Core",
            storage: "320 GB NVMe",
            bandwidth: "8 TB",
            latency: "60 ms",
            speed: "Up to 5 Gbps"
        },
        validity: "30 Days",
        warranty: "15 Days"
    },
    {
        id: "do3",
        name: "DO3",
        category: "unlimited",
        price: 899,
        currency: "₹",
        badge: "best",
        locations: ["🇺🇸 USA", "🇮🇳 India", "🇸🇬 Singapore", "🇪🇺 Europe", "🇯🇵 Japan", "🇬🇧 UK"],
        specs: {
            ram: "32 GB",
            cpu: "8 Core",
            storage: "640 GB NVMe",
            bandwidth: "Unlimited ∞",
            latency: "30 ms",
            speed: "Up to 10 Gbps"
        },
        validity: "30 Days",
        warranty: "30 Days"
    },
    {
        id: "rn1",
        name: "RN1",
        category: "renewal",
        price: 250,
        currency: "₹",
        badge: null,
        locations: ["🇺🇸 USA", "🇮🇳 India", "🇪🇺 Europe"],
        specs: {
            ram: "4 GB",
            cpu: "2 Core",
            storage: "80 GB NVMe",
            bandwidth: "3 TB",
            latency: "120 ms",
            speed: "Up to 1 Gbps"
        },
        validity: "30 Days",
        warranty: "7 Days"
    },
    {
        id: "ub1",
        name: "UB1",
        category: "unlimited",
        price: 699,
        currency: "₹",
        badge: null,
        locations: ["🇺🇸 USA", "🇮🇳 India", "🇸🇬 Singapore", "🇪🇺 Europe"],
        specs: {
            ram: "16 GB",
            cpu: "6 Core",
            storage: "320 GB NVMe",
            bandwidth: "Unlimited ∞",
            latency: "50 ms",
            speed: "Up to 5 Gbps"
        },
        validity: "30 Days",
        warranty: "15 Days"
    },
    {
        id: "bw1",
        name: "BW1",
        category: "bandwidth",
        price: 450,
        currency: "₹",
        badge: null,
        locations: ["🇺🇸 USA", "🇮🇳 India", "🇸🇬 Singapore"],
        specs: {
            ram: "12 GB",
            cpu: "4 Core",
            storage: "200 GB NVMe",
            bandwidth: "6 TB",
            latency: "80 ms",
            speed: "Up to 3 Gbps"
        },
        validity: "30 Days",
        warranty: "15 Days"
    }
];

// Get plans - uses localStorage if admin has made changes, otherwise shows defaults
function getPlans() {
    const stored = localStorage.getItem('kaizen_vps_plans');
    if (stored) {
        try {
            const plans = JSON.parse(stored);
            if (plans.length > 0) {
                return plans;
            }
        } catch (e) {
            // Fall through to defaults
        }
    }
    return DEFAULT_PLANS;
}

// Save plans to localStorage (admin panel changes)
function savePlans(plans) {
    localStorage.setItem('kaizen_vps_plans', JSON.stringify(plans));
}

// Clear admin overrides (show defaults again)
function resetPlans() {
    localStorage.removeItem('kaizen_vps_plans');
}
