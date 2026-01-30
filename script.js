const card = document.getElementById('card');
const searchBtn = document.getElementById('search');
const searchInput = document.getElementById('searchInput');

let allProducts = [];

// Render products
function renderProducts(products) {
    card.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';

        div.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>₹ ${product.price}</p>
        `;

        card.appendChild(div);
    });
}

// Initial fetch
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        renderProducts(allProducts);
    })
    .catch(err => console.error(err));

// Search button click
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();

    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(query)
    );

    renderProducts(filtered);

    // Save suggestion
    let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    if (!suggestions.some(s => s.query === query)) {
        suggestions.push({ query, time: Date.now() });
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
    }
});

const suggestionBox = document.getElementById("suggestions");

searchInput.addEventListener("input", () => {
    console.log("Suggestion working");

    const text =searchInput.value.toLowerCase();
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    //filter based on query field
    const matches = history.filter(item =>
        item.query.toLowerCase().includes(text)
    );

    //Clear previous suggestions
    suggestionBox.innerHTML="";

    //show suggestions
    matches.forEach(item=>{
        const div=document.createElement("div");
        div.className="suggestion-item";
        div.innerText=item.query;

        div.addEventListener("click",()=>{
            searchInput.value=item.query;
            suggestionBox.innerHTML="";
        });

        suggestionBox.appendChild(div);
    });
});