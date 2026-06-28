/* ========================================
   Kaizen VPS Server - Main App Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const plansGrid = document.getElementById('plansGrid');
    const filterTabs = document.querySelectorAll('.filter-tab');

    // Initial render
    if (plansGrid) {
        renderAllPlans(plansGrid, 'all');
    }

    // Filter tab clicks
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;

            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Re-render plans
            if (plansGrid) {
                renderAllPlans(plansGrid, filter);
            }
        });
    });
});

// Copy Specs to Clipboard
function copySpecs(planName, specs) {
    const text = `📦 ${planName} Plan - Kaizen VPS Server\n${specs}\n\n💬 Order: https://t.me/Senkaizen`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Specs copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('✅ Specs copied to clipboard!');
    });
}

// Toast Notification
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
