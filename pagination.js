let currentPage=1;
let itemsPerPage=8;
let allProducts=[];

let container=document.getElementById("productList");
let prevBtn=document.getElementById("prevBtn");
let nextBtn=document.getElementById("nextBtn");
let pageInfo=document.getElementById("pageInfo");

fetch("https://dummyjson.com/products")
    .then(res=>res.json())
    .then(data=>{
        allProducts=data.products;
        if(allProducts.length===0){
            container.innerHTML="<p>No products available</p>";
            prevBtn.disabled=true;
            nextBtn.disabled=true;
            pageInfo.innerText="";
            return;
        }
        renderPage();
    });

function renderPage(){
    container.innerHTML="";

    let start=(currentPage-1)*itemsPerPage;
    let end=start+itemsPerPage;

    let pageItems=allProducts.slice(start,end);

    pageItems.forEach(product=>{
        let card=document.createElement("div");
        card.className="card";
        card.innerHTML=`
        <img src="${product.thumbnail}">
        <h3>${product.title}</h3>
        <p>₹ ${product.price}</p>
        `;

        card.addEventListener("click",()=>{
            window.location.href=`../product.html?id=${product.id}`;
        })

        container.appendChild(card);
    });

    let totalPages=Math.ceil(allProducts.length/itemsPerPage);
    pageInfo.innerText=`Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled=currentPage===1;
    nextBtn.disabled=currentPage===totalPages;
}

prevBtn.addEventListener("click",()=>{
    currentPage--;
    renderPage();
    window.scrollTo({top:0, behaviour:"smooth"});
});

nextBtn.addEventListener("click",()=>{
    currentPage++;
    renderPage();
    window.scrollTo({top:0, behaviour:"smooth"});
});

searchBtn.addEventListener("click", () => {
    let text = searchInput.value.toLowerCase();
    let filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(text)
    );

    let h = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!h.includes(text)) {
        h.push(text);
        localStorage.setItem("searchHistory", JSON.stringify(h));
    }

    container.innerHTML = "";
    filtered.forEach(product => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${product.thumbnail}">
            <h3>${product.title}</h3>
            <p>₹ ${product.price}</p>
        `;
        container.appendChild(card);
    });
});

searchInput.addEventListener("input", () => {
    let text = searchInput.value.toLowerCase();
    let h = JSON.parse(localStorage.getItem("searchHistory")) || [];

    suggestionBox.innerHTML = "";

    let match = h.filter(item => item.includes(text));

    if (match.length === 0 || text === "") {
        suggestionBox.style.display = "none";
        return;
    }

    suggestionBox.style.display = "block";

    match.forEach(item => {
        let div = document.createElement("div");
        div.className = "suggestion-item";
        div.innerText = item;

        div.addEventListener("click", () => {
            searchInput.value = item;
            suggestionBox.style.display = "none";
        });

        suggestionBox.appendChild(div);
    });
});