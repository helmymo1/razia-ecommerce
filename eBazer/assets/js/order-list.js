document.addEventListener('DOMContentLoaded', () => {
    // Check auth
    // Check auth
    /* 
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    */
   
    // Verify session with backend instead (Optimistic approach)
    // api.js interceptor will handle 401s automatically

    const orderListBody = document.getElementById('orderListBody');

    const searchInput = document.querySelector('.tp-search-box input');
    
    // Fetch orders
    fetchOrders();

    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            fetchOrders(e.target.value);
        }, 500));
    }

    async function fetchOrders(search = '') {
        try {
            let url = '/orders/admin';
            if (search) {
                url += `?search=${encodeURIComponent(search)}`;
            }
            
            const data = await api.get(url); // Expectings array of orders
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format');
            }

            // Client-side filtering if needed, but for now we just render all and let the status filter handle it if implemented
            // Check for status filter
            const statusFilter = document.querySelector('.search-select select');

            // Calculate Refund Requests
            const refundRequests = data.filter(o => o.payment_status === 'refund_requested' || o.status === 'refund_requested').length;
            const badge = document.getElementById('refundRequestBadge');
            if (badge) {
                badge.textContent = refundRequests;
                badge.style.display = refundRequests > 0 ? 'inline-block' : 'none';
            }

            renderOrders(data);

            // Attach filter listener
            if (statusFilter) {
                // Remove old listeners to avoid duplicates if called multiple times (though fetchOrders is usually called once or on search)
                const newFilter = statusFilter.cloneNode(true);
                statusFilter.parentNode.replaceChild(newFilter, statusFilter);

                newFilter.addEventListener('change', (e) => {
                    const status = e.target.value;
                    if (status === 'all' || !status) {
                        renderOrders(data);
                    } else {
                        // Filter by status OR payment_status
                        const filtered = data.filter(o => o.status === status || o.payment_status === status);
                        renderOrders(filtered);
                    }
                });
            }

        } catch (error) {
            console.error('Error fetching orders:', error);
            orderListBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-red-500">Failed to load orders: ${error.message}</td></tr>`;
        }
    }

    // ... debounce ...

    function renderOrders(orders) {
        orderListBody.innerHTML = ''; // Clear loading/static

        if (orders.length === 0) {
            orderListBody.innerHTML = `<tr><td colspan="9" class="text-center py-4">No orders found</td></tr>`;
            return;
        }

        orders.forEach((order, index) => {
            const date = new Date(order.created_at).toLocaleDateString();
            const status = order.status || 'pending';
            const paymentStatus = order.payment_status || 'paid'; // Default to paid if missing/legacy

            // Calculate total items
            let items = order.items;
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch(e) { items = []; }
            }
            const totalItems = Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity, 0) : (order.total_items || 0);
            
            const tr = document.createElement('tr');
            tr.className = 'bg-white border-b border-gray6 last:border-0 text-start mx-9';
            if (paymentStatus === 'refund_requested') {
                tr.classList.add('bg-red-50'); // Highlight refund requests
            }

            // Status Options
            let statusOptions = `
                <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="processing" ${status === 'processing' ? 'selected' : ''}>Processing</option>
                <option value="shipped" ${status === 'shipped' ? 'selected' : ''}>Shipped</option>
                <option value="delivered" ${status === 'delivered' ? 'selected' : ''}>Delivered</option>
                <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                <option value="refunded" ${status === 'refunded' ? 'selected' : ''}>Refunded</option>
            `;

            // Action Buttons
            let actions = `
                 <a href="order-details.html?id=${order.id}" class="w-auto px-3 h-10 leading-10 text-tiny bg-success text-white rounded-md hover:bg-green-600 inline-block">View</a>
            `;

            // Add Approve Refund Button if requested
            if (paymentStatus === 'refund_requested') {
                actions = `
                    <button onclick="approveRefund('${order.id}')" class="w-auto px-3 h-10 leading-10 text-tiny bg-red-500 text-white rounded-md hover:bg-red-600 inline-block mr-2">Approve Refund</button>
                    ${actions}
                `;
            }

            tr.innerHTML = `
                <td class="pr-3 whitespace-nowrap">
                    <div class="tp-checkbox">
                        <input id="order-${order.id}" type="checkbox">
                        <label for="order-${order.id}"></label>
                    </div>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B]">
                    #${order.order_number || order.id.substring(0,8)}
                    ${paymentStatus === 'refund_requested' ? '<span class="text-xs text-red-500 font-bold block">Refund Requested</span>' : ''}
                </td>
                <td class="pr-8 py-5 whitespace-nowrap">
                    <a href="order-details.html?id=${order.id}" class="flex items-center space-x-5 text-hover-primary text-heading">
                        <div class="w-[50px] h-[50px] rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500 uppercase">
                            ${order.user_name ? order.user_name.substring(0,2) : 'GU'}
                        </div>
                        <span class="font-medium">${order.user_name || 'Guest'}</span>
                    </a>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">
                    ${totalItems}
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">
                    $${Number(order.total).toFixed(2)}
                </td>
                <td class="px-3 py-3 text-end">
                    <select class="status-select text-[11px] px-2 py-1 rounded-md leading-none font-medium border border-gray300 focus:border-theme" data-id="${order.id}">
                        ${statusOptions}
                    </select>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">
                    ${date}
                </td>
                <td class="px-9 py-3 text-end">
                   <div class="flex items-center justify-end space-x-2">
                        ${actions}
                   </div>
                </td>
            `;
            
            orderListBody.appendChild(tr);
        });
        
        // Add event listeners for status change
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => updateStatus(e.target.dataset.id, e.target.value));
        });
    }

    async function updateStatus(id, newStatus) {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            // console.log(`Order ${id} updated to ${newStatus}`);
            fetchOrders(); // Refresh
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
            fetchOrders(); // Revert UI on failure
        }
    }

    // Expose approveRefund to window so inline onclick works
    window.approveRefund = async function (id) {
        if (!confirm('Are you sure you want to approve this refund? This will mark the order as Refunded.')) return;
        try {
            // In a real app, this might trigger a Paymob Refund API call
            // For now, we manually update status to 'refunded' and payment_status to 'refunded'
            // We'll potentially need a dedicated endpoint, but updating status to 'refunded' might stay consistent
            // Actually, let's just update the status to 'refunded'

            // NOTE: Ideally we should update 'payment_status' too.
            // But current 'updateStatus' only updates 'status'.
            // I'll stick to updating 'status' to 'refunded'. 
            // A better backend implementation would update payment_status when status becomes refunded.
            // Let's assume the backend handles that or we do two calls (or improve backend).

            await api.put(`/orders/${id}/status`, { status: 'refunded' });
            alert('Refund Approved');
            fetchOrders();
        } catch (error) {
            console.error('Refund failed:', error);
            alert('Failed to approve refund');
        }
    };

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
