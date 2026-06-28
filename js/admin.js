/* ========================================
   Kaizen VPS Server - Admin Panel Logic
   ======================================== */

const ADMIN_PASSWORD = 'kaizen2024';
let editingPlanId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (sessionStorage.getItem('kaizen_admin_auth') === 'true') {
        showAdminPanel();
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Modal close on overlay click
    const modal = document.getElementById('planModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Plan form submit
    const planForm = document.getElementById('planForm');
    if (planForm) {
        planForm.addEventListener('submit', handlePlanSubmit);
    }
});

// === AUTH ===
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('kaizen_admin_auth', 'true');
        showAdminPanel();
    } else {
        errorEl.style.display = 'block';
        errorEl.textContent = '❌ Incorrect password. Try again.';
    }
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminLayout').style.display = 'block';
    refreshAdminView();
}

function logout() {
    sessionStorage.removeItem('kaizen_admin_auth');
    location.reload();
}

// === ADMIN VIEWS ===
function refreshAdminView() {
    const plans = getPlans();
    updateStats(plans);
    renderPlansTable(plans);
}

function updateStats(plans) {
    document.getElementById('statTotal').textContent = plans.length;
    document.getElementById('statBandwidth').textContent =
        plans.filter(p => p.category === 'bandwidth').length;
    document.getElementById('statUnlimited').textContent =
        plans.filter(p => p.category === 'unlimited').length;
    document.getElementById('statRenewal').textContent =
        plans.filter(p => p.category === 'renewal').length;
}

function renderPlansTable(plans) {
    const tbody = document.getElementById('plansTableBody');
    if (!tbody) return;

    tbody.innerHTML = plans.map(plan => {
        const badgeClass = plan.category === 'bandwidth' ? 'badge-bandwidth'
            : plan.category === 'unlimited' ? 'badge-unlimited'
            : 'badge-renewal';

        return `
        <tr>
            <td><strong>${plan.name}</strong></td>
            <td><span class="badge ${badgeClass}">${plan.category}</span></td>
            <td>${plan.currency}${plan.price}</td>
            <td>${plan.specs.ram}</td>
            <td>${plan.specs.cpu}</td>
            <td>${plan.specs.storage}</td>
            <td>${plan.specs.bandwidth}</td>
            <td>${plan.validity}</td>
            <td class="actions">
                <button class="btn btn-sm btn-edit" onclick="editPlan('${plan.id}')">Edit</button>
                <button class="btn btn-sm btn-delete" onclick="deletePlan('${plan.id}')">Delete</button>
            </td>
        </tr>`;
    }).join('');
}

// === CRUD OPERATIONS ===
function openAddModal() {
    editingPlanId = null;
    document.getElementById('modalTitle').textContent = 'Add New Plan';
    document.getElementById('planForm').reset();
    document.getElementById('planModal').classList.add('active');
}

function editPlan(id) {
    const plans = getPlans();
    const plan = plans.find(p => p.id === id);
    if (!plan) return;

    editingPlanId = id;
    document.getElementById('modalTitle').textContent = 'Edit Plan';

    // Fill form
    document.getElementById('formName').value = plan.name;
    document.getElementById('formCategory').value = plan.category;
    document.getElementById('formPrice').value = plan.price;
    document.getElementById('formCurrency').value = plan.currency;
    document.getElementById('formBadge').value = plan.badge || '';
    document.getElementById('formLocations').value = plan.locations.join(', ');
    document.getElementById('formRam').value = plan.specs.ram;
    document.getElementById('formCpu').value = plan.specs.cpu;
    document.getElementById('formStorage').value = plan.specs.storage;
    document.getElementById('formBandwidth').value = plan.specs.bandwidth;
    document.getElementById('formLatency').value = plan.specs.latency;
    document.getElementById('formSpeed').value = plan.specs.speed;
    document.getElementById('formValidity').value = plan.validity;
    document.getElementById('formWarranty').value = plan.warranty;

    document.getElementById('planModal').classList.add('active');
}

function deletePlan(id) {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    let plans = getPlans();
    plans = plans.filter(p => p.id !== id);
    savePlans(plans);
    refreshAdminView();
    showAdminToast('Plan deleted successfully');
}

function handlePlanSubmit(e) {
    e.preventDefault();

    const planData = {
        id: editingPlanId || generateId(),
        name: document.getElementById('formName').value.trim(),
        category: document.getElementById('formCategory').value,
        price: parseInt(document.getElementById('formPrice').value),
        currency: document.getElementById('formCurrency').value || '₹',
        badge: document.getElementById('formBadge').value || null,
        locations: document.getElementById('formLocations').value
            .split(',').map(l => l.trim()).filter(l => l),
        specs: {
            ram: document.getElementById('formRam').value.trim(),
            cpu: document.getElementById('formCpu').value.trim(),
            storage: document.getElementById('formStorage').value.trim(),
            bandwidth: document.getElementById('formBandwidth').value.trim(),
            latency: document.getElementById('formLatency').value.trim(),
            speed: document.getElementById('formSpeed').value.trim()
        },
        validity: document.getElementById('formValidity').value.trim(),
        warranty: document.getElementById('formWarranty').value.trim()
    };

    let plans = getPlans();

    if (editingPlanId) {
        // Update existing
        const index = plans.findIndex(p => p.id === editingPlanId);
        if (index !== -1) plans[index] = planData;
    } else {
        // Add new
        plans.push(planData);
    }

    savePlans(plans);
    closeModal();
    refreshAdminView();
    showAdminToast(editingPlanId ? 'Plan updated!' : 'Plan added!');
}

function closeModal() {
    document.getElementById('planModal').classList.remove('active');
    editingPlanId = null;
}

// === IMPORT / EXPORT ===
function exportPlans() {
    const plans = getPlans();
    const json = JSON.stringify(plans, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kaizen-vps-plans.json';
    a.click();
    URL.revokeObjectURL(url);
    showAdminToast('Plans exported!');
}

function importPlans() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const plans = JSON.parse(ev.target.result);
                if (Array.isArray(plans)) {
                    savePlans(plans);
                    refreshAdminView();
                    showAdminToast(`Imported ${plans.length} plans!`);
                } else {
                    alert('Invalid file format. Expected a JSON array.');
                }
            } catch (err) {
                alert('Error reading file: ' + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetToDefaults() {
    if (!confirm('Reset all plans to defaults? This will remove any custom changes.')) return;
    resetPlans();
    refreshAdminView();
    showAdminToast('Plans reset to defaults');
}

// === HELPERS ===
function generateId() {
    return 'plan_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
}

function showAdminToast(message) {
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
