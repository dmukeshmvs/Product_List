let productcontainer = document.getElementById("products-container");
let pagingContainer = document.getElementById("paging");

// Pagination variables
let currentPage = 1;
let itemsPerPage = 18;
let allProducts = [];
let totalPages = 0;

function displayProducts(data, page = 1) {
    // Calculate pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    productcontainer.style.display = 'grid';
    productcontainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    productcontainer.style.gap = '20px';
    productcontainer.innerHTML = '';
    
    paginatedData.forEach(product =>{
        let productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
        `;
        productcontainer.appendChild(productDiv);
        productDiv.addEventListener("click", ()=>{
            window.location.href = `productdetails.html?id=${product.id}`;
        });
    });
    
    // Show pagination controls
    showPagination(data.length, page);
}

function showPagination(totalItems, currentPageNum) {
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
            displayProducts(allProducts, currentPage);
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
            displayProducts(allProducts, currentPage);
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
        displayProducts(allProducts, currentPage);
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

async function fetchProducts() {
    try {
        let response = await fetch("https://dummyjson.com/products?limit=100");
        let data = await response.json();
        console.log(data.products);
        allProducts = data.products;
        currentPage = 1;
        displayProducts(allProducts, currentPage);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

fetchProducts();



const searchbtn = document.getElementById("searchbtn");
const searchinput = document.getElementById("searchinput");
searchbtn.addEventListener("click", () => {
    const query = searchinput.value.trim();
    console.log("Searching for:", query);
    if (!query) return;
    
    // save to local storage
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    
    // Check if query already exists
    const existingIndex = history.findIndex(item => item.query === query);
    if (existingIndex === -1) {
        history.push({
            query: query,
            time: Date.now()
        });
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
    
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    searchinput.value="";
});


// History button functionality
const historybtn = document.getElementById("historybtn");
if (historybtn) {
    historybtn.addEventListener("click", () => {
        window.location.href = "history.html";
    });
}

// View history button functionality
const viewhistorybtn = document.getElementById("viewhistory");
if (viewhistorybtn) {
    viewhistorybtn.addEventListener("click", () => {
        window.location.href = "viewhistory.html";
    });
}

const suggestionsbox = document.getElementById("suggestions");
searchinput.addEventListener("input", () => {
    console.log("Suggestion triggered");

    const text = searchinput.value.trim().toLowerCase();
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];


    //filter based on query field
    const matches = history.filter(item => item.query.toLowerCase().includes(text));

    // Clear previous suggestions
    suggestionsbox.innerHTML = '';

    //show suggestions
    matches.forEach(item => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.className = "suggestion-item";
        suggestionDiv.innerText = item.query;

        suggestionDiv.addEventListener("click", () => {
            searchinput.value = item.query;
            suggestionsbox.innerHTML = '';
        });

        suggestionsbox.appendChild(suggestionDiv);
    });
});

//view history
