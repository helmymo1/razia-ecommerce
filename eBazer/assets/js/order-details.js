document.addEventListener('DOMContentLoaded', () => {
    /*
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    */

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
        alert('No order ID provided');
        window.location.href = 'order-list.html';
        return;
    }

    const elements = {
        orderId: document.getElementById('orderIdDisplay'),
        orderDate: document.getElementById('orderDateDisplay'),
        statusSelect: document.getElementById('orderStatusSelect'),
        saveBtn: document.getElementById('saveOrderBtn'),
        customerName: document.getElementById('customerName'),
        customerEmail: document.getElementById('customerEmail'),
        customerPhone: document.getElementById('customerPhone'),
        summaryDate: document.getElementById('summaryDate'),
        addressLine1: document.getElementById('shippingAddressLine1'),
        addressLine2: document.getElementById('shippingAddressLine2'),
        addressCity: document.getElementById('shippingAddressCity'),
        itemsBody: document.getElementById('orderItemsBody'),
        subtotal: document.getElementById('orderSubtotal'),
        shipping: document.getElementById('orderShippingCost'),
        total: document.getElementById('orderGrandTotal')
    };

    fetchOrderDetails();

    async function fetchOrderDetails() {
        try {
            const order = await api.get(`/orders/${orderId}`);
            renderOrder(order);
        } catch (error) {
            console.error('Error fetching order details:', error);
            alert(`Failed to load order details: ${error.message}`);
        }
    }

    function renderOrder(order) {
        // Header
        elements.orderId.textContent = `Order ID : #${order.id}`;
        elements.orderDate.textContent = `Order Created : ${new Date(order.created_at).toLocaleString()}`;
        elements.statusSelect.value = order.status;
        
        // Customer
        elements.customerName.textContent = order.user_name;
        elements.customerEmail.textContent = order.user_email;
        elements.customerEmail.href = `mailto:${order.user_email}`;
        elements.customerPhone.textContent = order.shipping_phone || 'N/A';
        elements.customerPhone.href = order.shipping_phone ? `tel:${order.shipping_phone}` : '#';

        // Summary
        elements.summaryDate.textContent = new Date(order.created_at).toLocaleDateString();
        
        // Address
        elements.addressLine1.textContent = order.shipping_address || 'N/A';
        elements.addressLine2.textContent = ''; 
        elements.addressCity.textContent = `${order.shipping_city || ''} ${order.shipping_zip || ''}`;

        // Items
        elements.itemsBody.innerHTML = '';
        let subtotal = 0;
        
        if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const tr = document.createElement('tr');
                tr.className = 'bg-white border-b border-gray6 last:border-0 text-start mx-9';
                tr.innerHTML = `
                    <td class="pr-8 py-5 whitespace-nowrap">
                        <div class="flex items-center space-x-5">
                            <img class="w-[40px] h-[40px] rounded-md" src="${item.image || 'assets/img/product/prodcut-1.jpg'}" alt="">
                            <span class="font-medium text-heading text-hover-primary transition">${item.product_name}</span>
                        </div>
                    </td>
                    <td class="px-3 py-3 font-normal text-[#55585B] text-end">$${Number(item.price).toFixed(2)}</td>
                    <td class="px-3 py-3 font-normal text-[#55585B] text-end">${item.quantity}</td>
                    <td class="px-3 py-3 font-normal text-[#55585B] text-end">$${Number(itemTotal).toFixed(2)}</td>
                `;
                elements.itemsBody.appendChild(tr);
            });
        } else {
             elements.itemsBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">No items found</td></tr>';
        }

        // Totals
        elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
        elements.shipping.textContent = '$0.00'; // Placeholder or from DB if available
        elements.total.textContent = `$${Number(order.total).toFixed(2)}`;
    }

    // Save Status
    elements.saveBtn.addEventListener('click', async () => {
        const newStatus = elements.statusSelect.value;
        const originalText = elements.saveBtn.textContent;
        elements.saveBtn.textContent = 'Saving...';
        elements.saveBtn.disabled = true;

        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            alert('Order status updated');
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        } finally {
            elements.saveBtn.textContent = originalText;
            elements.saveBtn.disabled = false;
        }
    });
});
