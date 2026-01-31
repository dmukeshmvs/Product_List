// Back button functionality
const backbtn = document.getElementById("backbtn");
if (backbtn) {
    backbtn.addEventListener("click", () => {
        window.history.back();
    });
}

let params = new URLSearchParams(window.location.search);
let productId = params.get('id');

fetch("https://dummyjson.com/products/" + productId)
    .then(response => response.json())
    .then(product => {
        console.log("Product details:", product);

        // Save to view history
        saveToViewHistory(product);

        // Set main product info
        document.getElementById("title").innerText = product.title;
        document.getElementById("thumbnail").src = product.images[0] || product.thumbnail;
        document.getElementById("description").innerText = product.description;
        document.getElementById("price").innerText = "$" + product.price;
        document.getElementById("rating").innerText = "★ " + product.rating;
        
        // Set availability status
        const availabilityEl = document.getElementById("availability");
        if (product.stock > 0) {
            availabilityEl.textContent = "In Stock";
            availabilityEl.className = "stock-status in-stock";
        } else {
            availabilityEl.textContent = "Out of Stock";
            availabilityEl.className = "stock-status out-of-stock";
        }

        // Build product details list
        const detailsList = document.getElementById("product-details");
        detailsList.innerHTML = `
            <li><b>Brand:</b> ${product.brand || 'N/A'}</li>
            <li><b>Category:</b> ${product.category || 'N/A'}</li>
            <li><b>Stock:</b> ${product.stock}</li>
            <li><b>Discount:</b> ${product.discountPercentage || 0}%</li>
            <li><b>SKU:</b> ${product.sku || 'N/A'}</li>
            <li><b>Weight:</b> ${product.weight || 'N/A'} kg</li>
            <li><b>Warranty:</b> ${product.warrantyInformation || 'N/A'}</li>
            <li><b>Return Policy:</b> ${product.returnPolicy || 'N/A'}</li>
        `;

        // Load image gallery
        const imageGallery = document.getElementById("imageGallery");
        imageGallery.innerHTML = '';
        
        if (product.images && product.images.length > 0) {
            product.images.forEach((img, index) => {
                const imgElement = document.createElement("img");
                imgElement.src = img;
                imgElement.className = "gallery-img" + (index === 0 ? " active" : "");
                imgElement.addEventListener("click", () => {
                    document.getElementById("thumbnail").src = img;
                    // Update active class
                    document.querySelectorAll(".gallery-img").forEach(el => el.classList.remove("active"));
                    imgElement.classList.add("active");
                });
                imageGallery.appendChild(imgElement);
            });
        }

        // Load tags
        const tagsDiv = document.getElementById("tags");
        tagsDiv.innerHTML = '';
        if (product.tags && product.tags.length > 0) {
            product.tags.forEach(tag => {
                const span = document.createElement("span");
                span.className = "tag";
                span.innerText = tag;
                tagsDiv.appendChild(span);
            });
        }
    })  
    .catch(error => {
        console.error("Error fetching product details:", error);
        document.body.innerHTML = '<p style="text-align: center; padding: 40px;">Failed to load product details. Please try again.</p>';
    });

// Function to save viewed product to localStorage
function saveToViewHistory(product) {
    let viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];
    
    // Create history item
    const historyItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] || product.thumbnail,
        rating: product.rating,
        timestamp: Date.now()
    };
    
    // Remove if already exists (to update timestamp)
    viewHistory = viewHistory.filter(item => item.id !== product.id);
    
    // Add to beginning
    viewHistory.unshift(historyItem);
    
    // Keep only last 50 items
    if (viewHistory.length > 50) {
        viewHistory = viewHistory.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem("viewHistory", JSON.stringify(viewHistory));
}
