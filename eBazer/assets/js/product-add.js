document.addEventListener('DOMContentLoaded', () => {
    // Check auth
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            const categorySelect = document.getElementById('productCategory');
            
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            
            response.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
            
            // Re-init Choices.js
            new Choices('#productCategory', {
                searchEnabled: true,
                itemSelectText: '',
                shouldSort: false,
            });

        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };
    
    fetchCategories();

    // Initialize Choices for Inputs
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

    // Tags Choice removed
    // const sizeChoice = initChoices('productSize', 'Type and enter sizes (S, M, L)'); // Replaced by Alpine
    // const colorChoice = initChoices('productColor', 'Type and enter colors (Red, #ff0000)'); // Replaced by Alpine

    // Image Upload & Preview
    const imageInput = document.getElementById('productImage');
    const previewContainer = document.getElementById('imagePreviewContainer');
    let uploadedImageUrls = []; // Store uploaded URLs
    
    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', async function() {
            // Don't clear previewContainer immediately if we want to support cumulative adds, 
            // but the original code cleared it. Let's keep clearing for now to match UI behavior of "replacing selection"
            // OR better: append. But standard file input replaces data unless custom logic. 
            // The existing code cleared: `previewContainer.innerHTML = '';`
            // But if we upload immediately, we might want to keep previous?
            // The input is `multiple`. Usually file input change replaces the `files` list. 
            // So we should reset our array too.
            
            uploadedImageUrls = []; 
            previewContainer.innerHTML = ''; 
            
            const files = Array.from(this.files);
            
            for (const file of files) {
                if (file.type.match('image.*')) {
                    // 1. Show Local Preview (UX)
                    /* 
                    const reader = new FileReader();
                    reader.onload = function(e) { ... } // Standard preview
                    */
                   
                    // 2. Upload Immediately
                    try {
                        const formData = new FormData();
                        formData.append('image', file);
                        
                        // Show generic loading or opacity while uploading?
                        // For simplicity, we just await.
                        
                        const response = await api.post('/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        
                        const imageUrl = response.imageUrl; // /uploads/filename.jpg
                        uploadedImageUrls.push(imageUrl);
                        
                        // Show Preview from Server URL (verification that it worked)
                         const div = document.createElement('div');
                         div.className = 'relative inline-block';
                         div.innerHTML = `
                            <img src="${imageUrl}" class="w-[80px] h-[80px] object-cover rounded-md border border-gray200" title="Uploaded">
                            <span class="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 rounded-bl">✓</span>
                         `;
                         previewContainer.appendChild(div);
                        
                    } catch (error) {
                        console.error('Upload failed for file', file.name, error);
                         const div = document.createElement('div');
                         div.className = 'relative inline-block';
                         div.innerHTML = `
                            <div class="w-[80px] h-[80px] flex items-center justify-center bg-red-100 text-red-500 rounded-md border border-red-200">
                                ❌
                            </div>
                         `;
                         previewContainer.appendChild(div);
                         alert(`Failed to upload ${file.name}`);
                    }
                }
            }
        });
    }


    const publishBtn = document.getElementById('publishBtn');

    if (publishBtn) {
        publishBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Disable button
            publishBtn.disabled = true;
            publishBtn.textContent = 'Publishing...';
    
            try {
                // Collect Form Data
                const formData = new FormData();
                // We use FormData but we will send text fields mostly. 
                // Alternatively, we could send JSON since we aren't sending files anymore.
                // But ProductService likely uses axios which handles both.
                // However, `formData.append` is used for existing fields. I'll stick to it.
                
                formData.append('name', document.getElementById('productName').value);
                formData.append('price', document.getElementById('productPrice').value);
                formData.append('sku', document.getElementById('productSku').value);
                formData.append('quantity', document.getElementById('productQuantity').value);
                formData.append('category', document.getElementById('productCategory').value);
                formData.append('is_featured', document.getElementById('isFeatured').checked ? 1 : 0);
                
                // Optional subcategory
                // Description (Quill)
                const editorContent = document.querySelector('.ql-editor').innerHTML;
                formData.append('description', editorContent);

                // Optional subcategory & Tags removed 
    
                // Alpine.js manages these now, value is already JSON string in hidden input
                formData.append('sizes', document.getElementById('productSize').value);
                formData.append('colors', document.getElementById('productColor').value);
                
                // New Fields Helper
                // Shipping removed
                
                // Discount
                let discountType = 'no_discount';
                if (document.getElementById('percentDiscount') && document.getElementById('percentDiscount').checked) discountType = 'percentage';
                if (document.getElementById('fixedDiscount') && document.getElementById('fixedDiscount').checked) discountType = 'fixed';
                formData.append('discount_type', discountType);
    
                let discountValue = 0;
                // Determine value based on checked radio. 
                // Note: HTML IDs 'percentDiscount' and 'fixedDiscount' seem swapped in label text vs logic, 
                // but we rely on the input that is VISIBLE.
                
                if (document.getElementById('percentDiscount').checked) {
                     // This triggers x-show="priceData === 1", which is the "Price" input (Fixed Amount)
                     const fixedInput = document.querySelector('div[x-show="priceData === 1"] input');
                     discountValue = fixedInput ? fixedInput.value : 0;
                } else if (document.getElementById('fixedDiscount').checked) {
                     // This triggers x-show="priceData === 2", which is the "Percent" input
                     const percentInput = document.getElementById('discountValue');
                     discountValue = percentInput ? percentInput.value : 0;
                }
                formData.append('discount_value', discountValue);
    
                // Images - Send URLs instead of Files
                if (uploadedImageUrls.length > 0) {
                     // Pass as JSON string or array. Controller expects 'images'
                     formData.append('images', JSON.stringify(uploadedImageUrls));
                     // Also set image_url to the first one for primary
                     formData.append('image_url', uploadedImageUrls[0]);
                } else {
                     // If user didn't change image but it's new product, it might be empty.
                     // Or if they used the input but upload failed.
                }
    
                // Send Request using ProductService // NOTE: Ensure ProductService creates correct request
                // Since update is needed in API service, we might need to check standard axios call if ProductService isn't flexible
                // But usually it just passes formData.
                await ProductService.createProduct(formData);
    
                alert('Product created successfully!');
                window.location.href = 'product-list.html';
    
            } catch (error) {
                console.error(error);
                const msg = error.response?.data?.message || error.message;
                alert('Error: ' + msg);
                publishBtn.disabled = false;
                publishBtn.textContent = 'Publish';
            }
        });
    }
});
