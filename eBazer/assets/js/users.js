// users.js - Debug Version
function valLog(msg) {
    const d = document.getElementById('debug-console');
    if (d) {
        d.innerHTML += `<div>${new Date().toLocaleTimeString()} - ${msg}</div>`;
        d.scrollTop = d.scrollHeight;
    }
    console.log(msg);
}

valLog("Users.js loaded - DEBUG MODE");

// Helpers to get elements safely
const getEl = (id) => document.getElementById(id);

let isEditing = false;
let currentUserId = null;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    valLog("DOMContentLoaded fired");
    fetchUsers();
});

// Global Error Handler
window.onerror = function(msg, url, line) {
    valLog(`ERROR: ${msg} at ${line}`);
};

// Expose functions globally
window.openModal = function(userStr = null) {
    valLog("openModal called");
    
    // Lazy Fetch
    const userModal = getEl('user-modal');
    const modalTitle = getEl('modal-title');
    const submitBtn = getEl('user-submit-btn');
    const userForm = getEl('user-form');

    try {
        let user = null;
        if (userStr) {
            try {
                user = typeof userStr === 'string' ? JSON.parse(decodeURIComponent(userStr)) : userStr;
                valLog("User data parsed for edit");
            } catch (e) {
                valLog("Error parsing user data: " + e.message);
            }
        } else {
            valLog("No user data (Add Mode)");
        }

        if (!userModal) {
            valLog("Error: userModal is null");
            return;
        }

        userModal.classList.remove('hidden');
    userModal.style.display = 'flex'; // Force display
    userModal.style.zIndex = '99999'; // Force super high z-index
    
    // Debug Computed Style
    setTimeout(() => {
        const style = window.getComputedStyle(userModal);
        valLog(`COMPUTED: Display=${style.display}, Z=${style.zIndex}, Opacity=${style.opacity}, Vis=${style.visibility}`);
        valLog(`Modal Rect: ${JSON.stringify(userModal.getBoundingClientRect())}`);
        valLog(`Classes: ${userModal.className}`);
    }, 100);

    if (user) {
        isEditing = true;
        currentUserId = user.id;
        modalTitle.textContent = 'Edit User';
        submitBtn.textContent = 'Update User';
        
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-role').value = user.role || 'customer';
        document.getElementById('user-password').value = '';
        document.getElementById('user-password').placeholder = 'Leave blank to keep current';
    } else {
        isEditing = false;
        currentUserId = null;
        modalTitle.textContent = 'Add User';
        submitBtn.textContent = 'Add User';
        if(userForm) userForm.reset();
        document.getElementById('user-password').placeholder = 'Password';
    }
    } catch (err) {
        valLog("Exception in openModal: " + err.message);
    }
}

window.closeModal = function() {
    valLog("closeModal called");
    const userModal = getEl('user-modal');
    const userForm = getEl('user-form');
    
    if (userModal) {
        userModal.classList.add('hidden');
        userModal.style.display = 'none'; // Force hide
    }
    if(userForm) userForm.reset();
    isEditing = false;
    currentUserId = null;
}

window.handleFormSubmit = async function(e) {
    if(e) e.preventDefault(); // Handle both form submit and button click
    valLog("handleFormSubmit called");

    const name = getEl('user-name').value;
    const email = getEl('user-email').value;
    const role = getEl('user-role').value;
    const password = getEl('user-password').value;

    const userData = { name, email, role };
    if (password) userData.password = password;

    try {
        if (isEditing && currentUserId) {
            valLog("Updating user " + currentUserId);
            await api.put(`/admin/users/${currentUserId}`, userData);
            alert('User updated successfully');
        } else {
            valLog("Creating new user");
            if (!password) {
                alert('Password is required for new users');
                return;
            }
            await api.post('/admin/users', userData);
            alert('User added successfully');
        }
        window.closeModal();
        fetchUsers();
    } catch (error) {
        valLog("Save failed: " + error.message);
        alert('Failed to save user: ' + error.message);
    }
}

window.deleteUser = async function(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        valLog("Deleting user " + id);
        await api.delete(`/admin/users/${id}`);
        alert('User deleted successfully');
        fetchUsers();
    } catch (error) {
        valLog("Delete failed: " + error.message);
        alert('Failed to delete user');
    }
}

async function fetchUsers() {
    valLog("fetchUsers called");
    const userListBody = getEl('user-list-body');
    try {
        const users = await api.get('/admin/users');
        valLog(`Fetched ${users.length} users`);
        renderUsers(users);
    } catch (error) {
        valLog("Error fetching users: " + error.message);
        console.error("FULL ERROR:", error);
        alert("Failed to load users from server. Please check 'test-connection.html' for details.\n\nError: " + error.message);
        if(userListBody) userListBody.innerHTML = '<tr><td colspan="6" class="text-center text-red-500 py-4">Failed to load users: ' + error.message + '</td></tr>';
    }
}

function renderUsers(users) {
    const userListBody = getEl('user-list-body');
    if(!userListBody) {
        valLog("userListBody missing during render");
        return;
    }
    userListBody.innerHTML = '';
    if (users.length === 0) {
        userListBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No users found</td></tr>';
        return;
    }

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white border-b border-gray6 last:border-0 text-start mx-9';
        
        const userJson = encodeURIComponent(JSON.stringify(user));

        tr.innerHTML = `
            <td class="pr-3 whitespace-nowrap">
                <div class="tp-checkbox">
                    <input id="user-${user.id}" type="checkbox">
                    <label for="user-${user.id}"></label>
                </div>
            </td>
            <td class="px-3 py-3 font-normal text-[#55585B]">#${user.id}</td>
            <td class="pr-8 py-5 whitespace-nowrap">
                <div class="flex items-center space-x-5 text-heading">
                    <span class="font-medium">${user.name}</span>
                </div>
            </td>
            <td class="px-3 py-3">${user.email}</td>
            <td class="px-3 py-3">
                <span class="text-[11px] px-3 py-1 rounded-md leading-none font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}">
                    ${user.role}
                </span>
            </td>
            <td class="px-9 py-3 text-end">
                <div class="flex items-center justify-end space-x-2">
                    <button class="w-10 h-10 leading-10 text-tiny bg-success text-white rounded-md hover:bg-green-600" 
                            type="button" 
                            onclick="window.openModal('${userJson}')">
                        Edit
                    </button>
                    <button class="w-10 h-10 leading-[33px] text-tiny bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white" 
                            type="button" 
                            onclick="window.deleteUser(${user.id})">
                        Delete
                    </button>
                </div>
            </td>
        `;
        userListBody.appendChild(tr);
    });
}

