/* assets/js/dashboard.js */

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadRecentOrders();
    loadBestSellers();
    loadLowStock();
    loadSalesChart();
});

async function loadDashboardStats() {
    try {
        const stats = await api.get('/dashboard/stats');
        
        // Update DOM elements
        const revenueEl = document.getElementById('stat-revenue');
        const ordersEl = document.getElementById('stat-orders');
        const productsEl = document.getElementById('stat-products');
        const customersEl = document.getElementById('stat-customers'); // Expected ID in index.html
        const monthEarnEl = document.getElementById('stat-month-earn');
        const pendingEl = document.getElementById('stat-pending');

        if (revenueEl) revenueEl.innerText = `$${stats.revenue.toLocaleString()}`;
        if (ordersEl) ordersEl.innerText = stats.totalOrders.toLocaleString();
        if (productsEl) productsEl.innerText = stats.totalProducts.toLocaleString();
        if (customersEl) customersEl.innerText = stats.totalCustomers.toLocaleString();
        if (monthEarnEl) monthEarnEl.innerText = `$${stats.monthlyEarning.toLocaleString()}`;
        if (pendingEl) pendingEl.innerText = stats.pendingOrders.toLocaleString();

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentOrders() {
    try {
        const orders = await api.get('/dashboard/recent-orders');
        const container = document.querySelector('.overflow-scroll tbody'); // Targeting the recent orders table body
        
        if (!container) return;
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center py-4">No recent orders</td></tr>';
            return;
        }

        orders.forEach(order => {
            const statusClass = getStatusClass(order.status);
            const row = `
                <tr class="bg-white border-b border-gray6 last:border-0 text-start">
                    <td class="pr-8 whitespace-nowrap">
                        <span class="font-medium text-heading text-hover-primary">${order.user_name}</span>
                    </td>
                    <td class="px-3 py-3 font-normal text-slate-600">
                        #${order.id}
                    </td>
                    <td class="px-3 py-3 font-normal text-slate-600">
                        $${order.total_amount}
                    </td>
                    <td class="px-3 py-3">
                        <span class="text-[11px] px-3 py-1 rounded-md leading-none font-medium ${statusClass}">${order.status}</span>
                    </td>
                    <td class="px-3 py-3 w-14">
                        <a href="order-details.html?id=${order.id}" class="bg-info/10 text-info hover:bg-info hover:text-white inline-block text-center leading-5 text-tiny font-medium py-2 px-4 rounded-md">
                            View
                        </a>
                    </td>
                </tr>
            `;
            container.innerHTML += row;
        });

    } catch (error) {
        console.error('Error loading recent orders:', error);
    }
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'delivered': return 'text-success bg-success/10';
        case 'pending': return 'text-warning bg-warning/10';
        case 'cancelled': return 'text-danger bg-danger/10';
        default: return 'text-info bg-info/10';
    }
}

async function loadBestSellers() {
    try {
        const products = await api.get('/dashboard/best-sellers');
        const container = document.getElementById('bestSellersContainer');
        
        if (!container) return;
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No sales yet</p>';
            return;
        }

        products.forEach(product => {
            const html = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="">
                            <img class="w-[50px] h-[50px] rounded-md" src="${product.image || 'assets/img/product/prodcut-1.jpg'}" alt="${product.name}">
                        </div>
                        <div class="">
                            <h5 class="text-base mb-0 leading-none">${product.name}</h5>
                            <span class="text-tiny leading-none">${product.sold} sold</span>
                        </div>
                    </div>
                    <div class="">
                        <span class="font-medium text-base text-slate-700">$${product.price}</span>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

    } catch (error) {
        console.error('Error loading best sellers:', error);
    }
}

async function loadLowStock() {
    try {
        const products = await api.get('/dashboard/low-stock');
        const container = document.getElementById('lowStockContainer');
        
        if (!container) return;
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 py-4">No low stock items</p>';
            return;
        }

        products.forEach(product => {
            const html = `
                <div class="flex items-center justify-between border-b border-gray6 pb-4 mb-4 last:border-0 last:mb-0">
                    <div class="flex items-center space-x-3">
                        <div class="">
                            <img class="w-[40px] h-[40px] rounded-md" src="${product.image || 'assets/img/product/prodcut-1.jpg'}" alt="${product.name}">
                        </div>
                        <div class="">
                            <h5 class="text-base mb-1 leading-none">${product.name}</h5>
                            <p class="mb-0 text-tiny leading-none text-danger">Stock: ${product.stock}</p>
                        </div>
                    </div>
                    <div class="">
                        <a href="edit-product.html?id=${product.id}" class="text-tiny text-info hover:text-info/70">Restock</a>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

    } catch (error) {
        console.error('Error loading low stock:', error);
    }
}

async function loadSalesChart() {
    try {
        const data = await api.get('/dashboard/sales-chart'); // Returns { labels: [], data: [] }
       
        // Verify ApexCharts is loaded
        if (typeof ApexCharts === 'undefined') return;

        // We need to render the chart into #salesStatics or equivalent div used by ApexCharts
        // Note: The template likely uses a specific ID or class for the chart container.
        // Looking at the template code (usually main.js initializes charts), we might need to override it or use our own ID.
        // Let's assume there is a canvas or div with id 'salesStatics' BUT ApexCharts usually needs a div, not canvas.
        // Looking at index.html, it has <canvas id="salesStatics"></canvas>. This suggests it might be using Chart.js, OR the template wrapper uses Chart.js.
        // Wait, line 629 in index.html is <canvas id="salesStatics"></canvas>. That is definitely Chart.js, NOT ApexCharts.
        // But the head includes apexcharts.css. Let's check main.js or just assume Chart.js based on the tag.
        
        // Actually, let's just use the existing canvas if Chart.js is available.
        if (window.Chart && document.getElementById('salesStatics')) {
            const ctx = document.getElementById('salesStatics').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Revenue',
                        data: data.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

    } catch (error) {
        console.error('Error loading sales chart:', error);
    }
}
