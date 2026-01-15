document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const tableBody = document.querySelector('tbody'); // We'll assume the first tbody is the one. Ideally use ID.
    const form = document.querySelector('form'); // Note: multiple forms? upload form and main form.
    // Let's use specific IDs when we edit HTML. For now writing JS assuming IDs are there.
    
    // Elements
    const nameInput = document.getElementById('catName');
    const slugInput = document.getElementById('catSlug');
    const parentSelect = document.getElementById('catParent');
    const descInput = document.getElementById('catDescription');
    const imageInput = document.getElementById('catImage');
    const submitBtn = document.getElementById('catSubmitBtn');
    const formTitle = document.querySelector('.page-title h3'); // Just to update title if needed

    let isEditing = false;
    let editId = null;

    // Load Categories
    const loadCategories = async () => {
        try {
            const categories = await api.get('/categories');
            renderTable(categories);
            renderParentOptions(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    // Render Table
    const renderTable = (categories) => {
        const tbody = document.getElementById('categoryTableBody');
        tbody.innerHTML = '';

        categories.forEach(cat => {
            const tr = document.createElement('tr');
            tr.className = 'bg-white border-b border-gray6 last:border-0 text-start mx-9';
            tr.innerHTML = `
                <td class="pr-3 whitespace-nowrap">
                    <div class="tp-checkbox">
                        <input id="cat-${cat.id}" type="checkbox">
                        <label for="cat-${cat.id}"></label>
                    </div>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B]">#${cat.id}</td>
                <td class="pr-8 py-5 whitespace-nowrap">
                    <a href="#" class="flex items-center space-x-5">
                        ${cat.image ? `<img class="w-10 h-10 rounded-full" src="${cat.image}" alt="">` : '<div class="w-10 h-10 rounded-full bg-gray-200"></div>'}
                        <span class="font-medium text-heading text-hover-primary transition">${cat.name}</span>
                    </a>
                </td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">${cat.description || '-'}</td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">${cat.slug}</td>
                <td class="px-3 py-3 font-normal text-[#55585B] text-end">-</td> <!-- Items count not in API yet -->
                <td class="px-9 py-3 text-end">
                    <div class="flex items-center justify-end space-x-2">
                        <button class="edit-btn w-10 h-10 leading-10 text-tiny bg-success text-white rounded-md hover:bg-green-600" data-id="${cat.id}">
                            Edit
                        </button>
                        <button class="delete-btn w-10 h-10 leading-[33px] text-tiny bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white" data-id="${cat.id}">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Add Event Listeners for Edit/Delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => handleEdit(btn.dataset.id, categories));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => handleDelete(btn.dataset.id));
        });
    };

    // Render Parent Options
    const renderParentOptions = (categories) => {
        parentSelect.innerHTML = '<option value="">Select Parent</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            parentSelect.appendChild(option);
        });
    };

    // Handle Edit
    const handleEdit = (id, categories) => {
        const cat = categories.find(c => c.id == id);
        if (!cat) return;

        isEditing = true;
        editId = id;
        
        nameInput.value = cat.name;
        slugInput.value = cat.slug;
        descInput.value = cat.description || '';
        if (cat.parent_id) parentSelect.value = cat.parent_id;
        
        submitBtn.textContent = 'Update Category';
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            loadCategories();
            alert('Category deleted');
        } catch (error) {
            console.error(error);
            alert('Failed to delete category');
        }
    };

    // Handle Submit
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Button is likely inside form or just button

        const data = {
            name: nameInput.value,
            slug: slugInput.value,
            description: descInput.value,
            parent_id: parentSelect.value || null,
            image: '' // Handle image later if possible
        };

        try {
            if (isEditing) {
                await api.put(`/categories/${editId}`, data);
                alert('Category updated');
            } else {
                await api.post('/categories', data);
                alert('Category created');
            }
            
            // Reset form
            nameInput.value = '';
            slugInput.value = '';
            descInput.value = '';
            parentSelect.value = '';
            submitBtn.textContent = 'Add Category';
            isEditing = false;
            editId = null;
            
            loadCategories();

        } catch (error) {
            console.error(error);
            alert('Operation failed');
        }
    });

    loadCategories();
});
