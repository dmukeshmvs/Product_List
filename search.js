// Back button functionality
const backbtn = document.getElementById("backbtn");
if (backbtn) {
    backbtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

const searchbtn = document.getElementById("searchbtn");
const searchinput = document.getElementById("searchinput");
searchbtn.addEventListener("click", () => {
    const query = searchinput.value.trim();
    console.log("Searching for:", query);
    if (!query) return;

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

let params = new URLSearchParams(window.location.search);
let query = params.get("q");

fetch(`https://dummyjson.com/products`)
    .then(response => response.json())
    .then(data => {
        let products = data.products;
        let filteredProducts = products.filter((p)=>{
            return p.title.toLowerCase().includes(query.toLowerCase());
        });
        
        let container = document.getElementById("results");
        let heading = document.getElementById("heading");
        heading.textContent = `Search results for: "${query}"`;
        
        if (filteredProducts.length === 0) {
            container.innerHTML = '<p>No products found.</p>';
        } else {
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            container.style.gap = '20px';
            
            filteredProducts.forEach(product => {
                let productDiv = document.createElement('div');
                productDiv.style.border = '1px solid #ddd';
                productDiv.style.padding = '10px';
                productDiv.style.borderRadius = '5px';
                productDiv.style.cursor = 'pointer';
                productDiv.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}" style="width: 100%; height: 150px; object-fit: cover;" />
                    <h3>${product.title}</h3>
                    <p>Price: $${product.price}</p>
                `;
                productDiv.addEventListener('click', () => {
                    window.location.href = `productdetails.html?id=${product.id}`;
                });
                container.appendChild(productDiv);
            });
        }
    });

