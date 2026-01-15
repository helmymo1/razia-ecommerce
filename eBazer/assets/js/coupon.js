/* assets/js/coupon.js */

document.addEventListener('DOMContentLoaded', () => {
    loadCoupons();
    
    // Attach event listener to the "Add Coupon" button in the offcanvas
    // We need to find the button. The template uses a div with buttons at the bottom.
    // We'll trust the ID 'add-coupon-submit-btn' which we will add to the HTML.
    const addBtn = document.getElementById('add-coupon-submit-btn');
    if (addBtn) {
        addBtn.addEventListener('click', createCoupon);
    }
});

async function loadCoupons() {
    try {
        const tbody = document.getElementById('coupon-list');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="9" class="text-center py-5">Loading...</td></tr>';

        // Use the global 'api' object from api.js
        const coupons = await api.get('/coupons');
        
        renderCoupons(coupons);
    } catch (error) {
        console.error('Error loading coupons:', error);
        const tbody = document.getElementById('coupon-list');
        if (tbody) tbody.innerHTML = `<tr><td colspan="9" class="text-center py-5 text-red-500">Error loading coupons: ${error.message}</td></tr>`;
    }
}

function renderCoupons(coupons) {
    const tbody = document.getElementById('coupon-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (!coupons || coupons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center py-5">No coupons found</td></tr>';
        return;
    }

    coupons.forEach(coupon => {
        const isActive = new Date(coupon.end_date) > new Date(); // Simple active check
        const statusClass = isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger';
        const statusText = isActive ? 'Active' : 'Expired';

        const row = `
            <tr class="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                <td class="pr-3 whitespace-nowrap">
                    <div class="tp-checkbox">
                        <input id="coupon-${coupon.id}" type="checkbox">
                        <label for="coupon-${coupon.id}"></label>
                    </div>
                </td>
                <td class="pr-8 py-5 whitespace-nowrap">
                    <span class="font-medium text-heading">${coupon.code}</span>
                </td>
                <td class="px-3 py-3 text-black font-normal text-end">
                    <span class="uppercase rounded-md px-3 py-1 bg-gray">${coupon.code}</span>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">
                    ${coupon.discount_type === 'percent' ? coupon.discount_value + '%' : '$' + coupon.discount_value}
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">
                    <span class="text-[11px] px-3 py-1 rounded-md leading-none font-medium ${statusClass}">${statusText}</span>
                </td>
                <td class="px-3 py-3 text-end">
                    ${new Date(coupon.start_date || Date.now()).toLocaleDateString()}
                </td>
                <td class="px-3 py-3 text-end">
                    ${new Date(coupon.end_date).toLocaleDateString()}
                </td>
                <td class="px-3 py-3 text-end">
                    ${coupon.usage_count || 0} / ${coupon.usage_limit || '∞'}
                </td>
                <td class="px-9 py-3 text-end">
                    <div class="flex items-center justify-end space-x-2">
                        <button onclick="deleteCoupon(${coupon.id})" class="w-10 h-10 leading-[33px] text-tiny bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white">
                            <svg class="-translate-y-px" width="13" height="13" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.0697 4.23C17.4597 4.07 15.8497 3.95 14.2297 3.86V3.85L14.0097 2.55C13.8597 1.63 13.6397 0.25 11.2997 0.25H8.67967C6.34967 0.25 6.12967 1.57 5.96967 2.54L5.75967 3.82C4.82967 3.88 3.89967 3.94 2.96967 4.03L0.929669 4.23C0.509669 4.27 0.209669 4.64 0.249669 5.05C0.289669 5.46 0.649669 5.76 1.06967 5.72L3.10967 5.52C8.34967 5 13.6297 5.2 18.9297 5.73C18.9597 5.73 18.9797 5.73 19.0097 5.73C19.3897 5.73 19.7197 5.44 19.7597 5.05C19.7897 4.64 19.4897 4.27 19.0697 4.23Z" fill="currentColor"/>
                                <path d="M17.2297 7.14C16.9897 6.89 16.6597 6.75 16.3197 6.75H3.67975C3.33975 6.75 2.99975 6.89 2.76975 7.14C2.53975 7.39 2.40975 7.73 2.42975 8.08L3.04975 18.34C3.15975 19.86 3.29975 21.76 6.78975 21.76H13.2097C16.6997 21.76 16.8398 19.87 16.9497 18.34L17.5697 8.09C17.5897 7.73 17.4597 7.39 17.2297 7.14ZM11.6597 16.75H8.32975C7.91975 16.75 7.57975 16.41 7.57975 16C7.57975 15.59 7.91975 15.25 8.32975 15.25H11.6597C12.0697 15.25 12.4097 15.59 12.4097 16C12.4097 16.41 12.0697 16.75 11.6597 16.75ZM12.4997 12.75H7.49975C7.08975 12.75 6.74975 12.41 6.74975 12C6.74975 11.59 7.08975 11.25 7.49975 11.25H12.4997C12.9097 11.25 13.2497 11.59 13.2497 12C13.2497 12.41 12.9097 12.75 12.4997 12.75Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function createCoupon() {
    // Collect data from inputs (IDs expected to be added to HTML)
    const code = document.getElementById('coupon-code').value;
    const endDate = document.getElementById('coupon-end-date').value;
    const discountType = document.querySelector('input[name="couponPrice"]:checked').id.includes('percent') ? 'percent' : 'fixed';
    
    let discountValue = 0;
    if (discountType === 'fixed') {
        discountValue = document.getElementById('coupon-price').value;
    } else {
        discountValue = document.getElementById('coupon-percent').value;
    }
    
    const startDateRaw = document.getElementById('coupon-start-date').value;  // Only if publish later
    const startDate = startDateRaw ? startDateRaw : new Date().toISOString().split('T')[0];

    // Basic validation
    if (!code || !discountValue || !endDate) {
        alert('Please fill in all required fields (Code, Value, End Date)');
        return;
    }

    const payload = {
        code,
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        end_date: endDate,
        start_date: startDate,
        usage_limit: 100 // Default limit since we lack an input for it
    };

    try {
        await api.post('/coupons', payload);
        alert('Coupon created successfully!');
        
        // Close offcanvas (simulated click on close btn)
        const closeBtn = document.querySelector('.offcanvas-close-btn');
        if (closeBtn) closeBtn.click();
        
        // Reload list
        loadCoupons();
    } catch (error) {
        console.error('Error creating coupon:', error);
        alert('Failed to create coupon: ' + error.message);
    }
}

async function deleteCoupon(id) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
        await api.delete(`/coupons/${id}`);
        loadCoupons(); // Reload to refresh
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete coupon');
    }
}
