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
            
            const data = await api.get(url); // Expecting array of orders
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format');
            }

            renderOrders(data);
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
            
            // Calculate total items from JSON array if available, or use count
            // The JSON_ARRAYAGG gives us 'items' array.
            let items = order.items;
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch(e) { items = []; }
            }
            const totalItems = Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity, 0) : (order.total_items || 0);
            
            const tr = document.createElement('tr');
            tr.className = 'bg-white border-b border-gray6 last:border-0 text-start mx-9';
            
            tr.innerHTML = `
                <td class="pr-3 whitespace-nowrap">
                    <div class="tp-checkbox">
                        <input id="order-${order.id}" type="checkbox">
                        <label for="order-${order.id}"></label>
                    </div>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B]">
                    #${order.order_number || order.id.substring(0,8)}
                </td>
                <td class="pr-8 py-5 whitespace-nowrap">
                    <a href="order-details.html?id=${order.id}" class="flex items-center space-x-5 text-hover-primary text-heading">
                         <!-- Placeholder image or gravatar could be better -->
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
                        <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">
                    ${date}
                </td>
                <td class="px-9 py-3 text-end">
                   <!-- Action buttons existing code -->
                   <div class="flex items-center justify-end space-x-2">
                        <a href="order-details.html?id=${order.id}" class="w-auto px-3 h-10 leading-10 text-tiny bg-success text-white rounded-md hover:bg-green-600 inline-block">View</a>
                   </div>
                </td>
            `;
            
            orderListBody.appendChild(tr);
        });
        
        // Add event listeners for status change
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => updateStatus(e.target.dataset.id, e.target.value));
        });

        // Add delete event listeners
        /* existing delete logic if needed, simplifed above */
    }

    async function updateStatus(id, newStatus) {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            // Optional: Show toast
            // toast.success('Status updated'); 
            // Since we don't have a toast lib ready-to-hand in plain JS without analyzing, console log for now
            console.log(`Order ${id} updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
            fetchOrders(); // Revert UI on failure
        }
    }

    /* existing delete logic helper if needed */
    /* getStatusColor helper removed as we use select now */

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
