// Back button functionality
const backbtn = document.getElementById("backbtn");
if (backbtn) {
    backbtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

// Clear history button
const clearhistorybtn = document.getElementById("clearhistorybtn");
if (clearhistorybtn) {
    clearhistorybtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all view history?")) {
            localStorage.removeItem("viewHistory");
            currentPage = 1;
            renderViewHistory();
        }
    });
}

// Pagination variables
let currentPage = 1;
let itemsPerPage = 12;
let viewHistory = [];
let totalPages = 0;

function displayProducts(data, page = 1) {
    // Calculate pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    const container = document.getElementById("products-container");
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    container.style.gap = '20px';
    container.innerHTML = '';
    
    paginatedData.forEach(product => {
        let productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
        `;
        container.appendChild(productDiv);
        productDiv.addEventListener("click", () => {
            window.location.href = `productdetails.html?id=${product.id}`;
        });
    });
    
    // Show pagination controls
    showPagination(data.length, page);
}

function showPagination(totalItems, currentPageNum) {
    const pagingContainer = document.getElementById("paging");
    pagingContainer.innerHTML = '';
    totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) return;
    
    // Create pagination container
    const paginationDiv = document.createElement('div');
    paginationDiv.style.display = 'flex';
    paginationDiv.style.justifyContent = 'center';
    paginationDiv.style.alignItems = 'center';
    paginationDiv.style.gap = '10px';
    paginationDiv.style.marginTop = '30px';
    paginationDiv.style.flexWrap = 'wrap';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.style.padding = '8px 16px';
    prevBtn.style.cursor = currentPageNum === 1 ? 'not-allowed' : 'pointer';
    prevBtn.style.backgroundColor = currentPageNum === 1 ? '#ccc' : '#2196F3';
    prevBtn.style.color = 'white';
    prevBtn.style.border = 'none';
    prevBtn.style.borderRadius = '5px';
    prevBtn.disabled = currentPageNum === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPageNum > 1) {
            currentPage = currentPageNum - 1;
            displayProducts(viewHistory, currentPage);
            window.scrollTo(0, 0);
        }
    });
    
    paginationDiv.appendChild(prevBtn);
    
    // Page numbers
    const startPage = Math.max(1, currentPageNum - 2);
    const endPage = Math.min(totalPages, currentPageNum + 2);
    
    if (startPage > 1) {
        const firstBtn = createPageButton(1, currentPageNum);
        paginationDiv.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 5px';
            paginationDiv.appendChild(dots);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(i, currentPageNum);
        paginationDiv.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 5px';
            paginationDiv.appendChild(dots);
        }
        const lastBtn = createPageButton(totalPages, currentPageNum);
        paginationDiv.appendChild(lastBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.style.padding = '8px 16px';
    nextBtn.style.cursor = currentPageNum === totalPages ? 'not-allowed' : 'pointer';
    nextBtn.style.backgroundColor = currentPageNum === totalPages ? '#ccc' : '#2196F3';
    nextBtn.style.color = 'white';
    nextBtn.style.border = 'none';
    nextBtn.style.borderRadius = '5px';
    nextBtn.disabled = currentPageNum === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPageNum < totalPages) {
            currentPage = currentPageNum + 1;
            displayProducts(viewHistory, currentPage);
            window.scrollTo(0, 0);
        }
    });
    
    paginationDiv.appendChild(nextBtn);
    
    pagingContainer.appendChild(paginationDiv);
}

function createPageButton(pageNum, currentPageNum) {
    const btn = document.createElement('button');
    btn.textContent = pageNum;
    btn.style.padding = '8px 12px';
    btn.style.cursor = pageNum === currentPageNum ? 'default' : 'pointer';
    btn.style.backgroundColor = pageNum === currentPageNum ? '#4CAF50' : '#f0f0f0';
    btn.style.color = pageNum === currentPageNum ? 'white' : '#333';
    btn.style.border = '1px solid #ddd';
    btn.style.borderRadius = '5px';
    btn.style.transition = 'all 0.3s ease';
    btn.disabled = pageNum === currentPageNum;
    
    btn.addEventListener('click', () => {
        currentPage = pageNum;
        displayProducts(viewHistory, currentPage);
        window.scrollTo(0, 0);
    });
    
    btn.addEventListener('mouseover', () => {
        if (pageNum !== currentPageNum) {
            btn.style.backgroundColor = '#e0e0e0';
        }
    });
    
    btn.addEventListener('mouseout', () => {
        if (pageNum !== currentPageNum) {
            btn.style.backgroundColor = '#f0f0f0';
        }
    });
    
    return btn;
}

// Render view history
function renderViewHistory() {
    const container = document.getElementById("products-container");
    viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];
    
    if (viewHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <h2>No viewing history yet</h2>
                <p>Products you view will appear here</p>
            </div>
        `;
        document.getElementById("paging").innerHTML = '';
        return;
    }
    
    // Sort by most recent first
    viewHistory.sort((a, b) => b.timestamp - a.timestamp);
    
    currentPage = 1;
    displayProducts(viewHistory, currentPage);
}

// Initial render
renderViewHistory();
