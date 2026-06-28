/* ========================================
   Kaizen VPS Server - Render Plans
   Dynamically renders plan cards from data
   ======================================== */

const TELEGRAM_LINK = "https://t.me/Senkaizen";

function renderPlanCard(plan) {
    const badgeHTML = plan.badge === 'popular'
        ? `<div class="plan-badge plan-badge-popular">POPULAR</div>`
        : plan.badge === 'best'
        ? `<div class="plan-badge plan-badge-best">BEST OFFER</div>`
        : '';

    const flagsHTML = plan.locations.map(loc => {
        const flag = loc.split(' ')[0];
        const name = loc.split(' ').slice(1).join(' ');
        return `<span title="${name}">${flag}</span>`;
    }).join('');

    const isUnlimited = plan.specs.bandwidth.toLowerCase().includes('unlimited');

    const specsText = `${plan.specs.ram} RAM, ${plan.specs.cpu} CPU, ${plan.specs.storage}, ${plan.specs.bandwidth} BW, ${plan.specs.latency} Latency, ${plan.specs.speed}`;

    return `
    <div class="plan-card glass-card" data-category="${plan.category}" data-id="${plan.id}">
        ${badgeHTML}
        <div class="plan-header" ${plan.badge ? 'style="margin-top:0.75rem"' : ''}>
            <h3 class="plan-name">${plan.name}</h3>
            <div>
                <span class="plan-price">${plan.currency}${plan.price}</span>
                <span class="plan-price-period">/month</span>
            </div>
        </div>

        <div class="plan-locations">
            <span class="plan-locations-label">Locations:</span>
            <div class="plan-locations-flags">${flagsHTML}</div>
        </div>

        <div class="plan-specs">
            <div class="plan-spec-row">
                <span class="plan-spec-label">RAM</span>
                <span class="plan-spec-value">${plan.specs.ram}</span>
            </div>
            <div class="plan-spec-row">
                <span class="plan-spec-label">CPU</span>
                <span class="plan-spec-value">${plan.specs.cpu}</span>
            </div>
            <div class="plan-spec-row">
                <span class="plan-spec-label">Storage</span>
                <span class="plan-spec-value">${plan.specs.storage}</span>
            </div>
            <div class="plan-spec-row">
                <span class="plan-spec-label">Bandwidth</span>
                <span class="plan-spec-value ${isUnlimited ? 'highlight' : ''}">${plan.specs.bandwidth}</span>
            </div>
            <div class="plan-spec-row">
                <span class="plan-spec-label">Latency</span>
                <span class="plan-spec-value">${plan.specs.latency}</span>
            </div>
            <div class="plan-spec-row">
                <span class="plan-spec-label">Speed</span>
                <span class="plan-spec-value">${plan.specs.speed}</span>
            </div>
        </div>

        <div class="plan-meta">
            <div class="plan-meta-item">
                <div class="plan-meta-label">Validity</div>
                <div class="plan-meta-value">${plan.validity}</div>
            </div>
            <div class="plan-meta-item">
                <div class="plan-meta-label">Warranty</div>
                <div class="plan-meta-value">${plan.warranty}</div>
            </div>
        </div>

        <div class="plan-actions">
            <button class="btn btn-outline btn-copy" onclick="copySpecs('${plan.name}', '${specsText}')">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copy Specs
            </button>
            <a href="${TELEGRAM_LINK}" target="_blank" class="btn btn-green">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                DM to Buy
            </a>
        </div>
    </div>`;
}

function renderAllPlans(container, filter = 'all') {
    const plans = getPlans();
    const filtered = filter === 'all'
        ? plans
        : plans.filter(p => p.category === filter);

    container.innerHTML = filtered.map(renderPlanCard).join('');

    // Animate cards in
    const cards = container.querySelectorAll('.plan-card');
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 80);
    });
}
