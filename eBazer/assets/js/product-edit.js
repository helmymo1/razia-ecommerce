document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) {
        alert('No product ID specified');
        window.location.href = 'product-list.html';
        return;
    }

    let tagsChoice, sizeChoice, colorChoice;

    const loadProductData = async () => {
        try {
            // Load Categories
            const categoriesRes = await API.categories.getAll();
            const categories = categoriesRes.data; // Axios: .data
            
            const categorySelect = document.getElementById('productCategory');
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
            
             // Init Choices
             const choices = new Choices('#productCategory', {
                 searchEnabled: true,
                 itemSelectText: '',
                 shouldSort: false,
             });

            // Load Product
            const productRes = await API.products.getById(productId);
            const product = productRes.data.orderItems ? productRes.data : productRes.data; // Handle potential wrapping

            // Populate Basic Fields
            document.getElementById('productName').value = product.name || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productSku').value = product.sku || '';
            document.getElementById('productQuantity').value = product.stock || ''; 

 
            
             if (product.category_id) {
                 categorySelect.value = product.category_id;
                 choices.setChoiceByValue(product.category_id);
            }
            
            // Init Choices Helpers
            const initChoices = (id, placeholder) => {
                const element = document.getElementById(id);
                if (element) {
                    return new Choices(element, {
                        removeItemButton: true,
                        duplicateItemsAllowed: false,
                        editItems: true,
                        addItems: true,
                        placeholderValue: placeholder,
                        searchPlaceholderValue: placeholder,
                    });
                }
                return null;
            };

            tagsChoice = initChoices('tag-input1', 'Type and enter tags');
            sizeChoice = initChoices('productSize', 'Type and enter sizes (S, M, L)');
            colorChoice = initChoices('productColor', 'Type and enter colors (Red, #ff0000)');

            // Set Values for Choices
            const setChoicesValue = (choiceInstance, value) => {
                if (!choiceInstance || !value) return;
                try {
                    let items = [];
                    if (Array.isArray(value)) {
                        items = value;
                    } else if (typeof value === 'string') {
                         // Attempt to parse JSON or split by comma
                         if (value.startsWith('[')) {
                             items = JSON.parse(value);
                         } else {
                             items = value.split(',').map(s => s.trim());
                         }
                    }
                    choiceInstance.setValue(items);
                } catch (e) {
                    console.error('Error setting choices values', e);
                }
            };
            
            if (product.tags) setChoicesValue(tagsChoice, product.tags);
            if (product.sizes) setChoicesValue(sizeChoice, product.sizes);
            if (product.colors) setChoicesValue(colorChoice, product.colors);

            // Image Preview (Existing Images)
            const previewContainer = document.getElementById('imagePreviewContainer');
            if (previewContainer) {
                 const imagesToMsg = product.images_details || (product.image_url ? [{image_url: product.image_url}] : []);
                 imagesToMsg.forEach(img => {
                     const div = document.createElement('div');
                     div.className = 'relative inline-block';
                     const src = img.image_url.startsWith('http') ? img.image_url : window.IMAGE_BASE_URL + img.image_url;
                     div.innerHTML = `
                         <img src="${src}" class="w-[80px] h-[80px] object-cover rounded-md border border-gray200">
                     `;
                     previewContainer.appendChild(div);
                 });
            }
            
            // Image Upload Preview Listener
            const imageInput = document.getElementById('productImage');
             if (imageInput && previewContainer) {
                imageInput.addEventListener('change', function() {
                    // Start fresh or append? Usually replace NEW previews, keep OLD ones?
                    // For simplicity, let's keep old ones and just append new previews.
                    // But if user re-selects execution flows usually reset "selected" files.
                    // Let's remove only "new-preview" class items?
                    // Simpler: Just clear all if user upload new files, assuming they replace everything? 
                    // No, usually "upload new" adds to existing in a sophisticated app, but standard HTML file input replaces the SELECTION.
                    // The backend APPENDS. So we should visually Append. 
                    // But input[type=file] content is replaced on new selection.
                    
                    // Let's just append previews.
                    Array.from(this.files).forEach(file => {
                        if (file.type.match('image.*')) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const div = document.createElement('div');
                                div.className = 'relative inline-block border-2 border-theme rounded-md'; // Highlight new ones
                                div.innerHTML = `
                                    <img src="${e.target.result}" class="w-[80px] h-[80px] object-cover rounded-md">
                                `;
                                previewContainer.appendChild(div);
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                });
            }
            
            // Description
            const editor = document.querySelector('.ql-editor');
            if (editor) editor.innerHTML = product.description || '';

            // Shipping
            if (document.getElementById('shippingWidth')) document.getElementById('shippingWidth').value = product.shipping_width || '';
            if (document.getElementById('shippingHeight')) document.getElementById('shippingHeight').value = product.shipping_height || '';
            if (document.getElementById('shippingWeight')) document.getElementById('shippingWeight').value = product.shipping_weight || '';
            if (document.getElementById('shippingCost')) document.getElementById('shippingCost').value = product.shipping_cost || '';
            


            // Discount Logic
            if (product.discount_type === 'percentage') {
                const rb = document.getElementById('percentDiscount');
                if(rb) rb.checked = true;
                const pContainer = document.querySelector('div[x-show="priceData === 1"]');
                if(pContainer) pContainer.style.display = 'block'; 
                const percentInput = document.querySelector('div[x-show="priceData === 1"] input');
                if(percentInput) percentInput.value = product.discount_value || '';

            } else if (product.discount_type === 'fixed') {
                const rb = document.getElementById('fixedDiscount');
                if(rb) rb.checked = true;
                 const fContainer = document.querySelector('div[x-show="priceData === 2"]');
                if(fContainer) fContainer.style.display = 'block';
                const fixedInput = document.getElementById('example_id');
                if(fixedInput) fixedInput.value = product.discount_value || '';
            } else {
                const rb = document.getElementById('noDiscount');
                if(rb) rb.checked = true;
            }

        } catch (error) {
            console.error('Error loading product:', error);
            alert('Failed to load product data');
        }
    };

    loadProductData();

    // Handle Save
    const saveBtns = document.querySelectorAll('.save-btn');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            try {
                const formData = new FormData();
                formData.append('name', document.getElementById('productName').value);
                formData.append('price', document.getElementById('productPrice').value);
                formData.append('sku', document.getElementById('productSku').value);
                formData.append('quantity', document.getElementById('productQuantity').value);
                formData.append('category', document.getElementById('productCategory').value);
                
                const description = document.querySelector('.ql-editor').innerHTML;
                formData.append('description', description);

                if (tagsChoice) formData.append('tags', JSON.stringify(tagsChoice.getValue(true)));
                if (sizeChoice) formData.append('sizes', JSON.stringify(sizeChoice.getValue(true)));
                if (colorChoice) formData.append('colors', JSON.stringify(colorChoice.getValue(true)));

                // Optional Fields Helpers
                const appendIfElementStr = (id, key) => {
                    const el = document.getElementById(id);
                    if(el && el.value) formData.append(key, el.value);
                };

                appendIfElementStr('shippingWidth', 'shipping_width');
                appendIfElementStr('shippingHeight', 'shipping_height');
                appendIfElementStr('shippingWeight', 'shipping_weight');
                appendIfElementStr('shippingCost', 'shipping_cost');

                // Discount
                let discountType = 'no_discount';
                if (document.getElementById('percentDiscount') && document.getElementById('percentDiscount').checked) discountType = 'percentage';
                if (document.getElementById('fixedDiscount') && document.getElementById('fixedDiscount').checked) discountType = 'fixed';
                formData.append('discount_type', discountType);

                let discountValue = 0;
                if (discountType === 'percentage') {
                     const pInput = document.querySelector('div[x-show="priceData === 1"] input');
                     if (pInput) discountValue = pInput.value;
                } else if (discountType === 'fixed') {
                     const fInput = document.getElementById('example_id');
                     if (fInput) discountValue = fInput.value;
                }
                formData.append('discount_value', discountValue);

                // Image
                const imageInput = document.getElementById('productImage');
                if (imageInput && imageInput.files.length > 0) {
                     Array.from(imageInput.files).forEach(file => {
                         formData.append('images', file);
                     });
                }

                // Call API
                await API.products.update(productId, formData);

                alert('Product updated successfully');
                window.location.href = 'product-list.html';

            } catch (error) {
                console.error('Error updating product:', error);
                alert('Failed to update product: ' + (error.response?.data?.message || error.message));
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    });

    // Handle Delete (Cleanup if redundant)
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!confirm('Are you sure you want to delete this product?')) return;

            btn.textContent = 'Deleting...';
            btn.disabled = true;

            try {
                await API.products.delete(productId);
                alert('Product deleted successfully');
                window.location.href = 'product-list.html';
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
                btn.textContent = 'Delete';
                btn.disabled = false;
            }
        });
    });
    
     // Handle Cancel
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'product-list.html';
        });
    });
});
