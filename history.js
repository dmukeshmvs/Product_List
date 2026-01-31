
// Back button functionality
const backbtn = document.getElementById("backbtn");
if (backbtn) {
    backbtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

let historydiv = document.getElementById("history-container");
let deleteselectedbtn = document.getElementById("deleteselectedbtn");
let clearbtn = document.getElementById("clearhistorybtn");
let selectedItems = [];

function updateDeleteButtonVisibility() {
    if (!deleteselectedbtn) return;
    if (selectedItems.length > 0) {
        deleteselectedbtn.classList.add('show');
    } else {
        deleteselectedbtn.classList.remove('show');
    }
}

function searchHistory() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    historydiv.innerHTML = '';
    selectedItems = [];
    updateDeleteButtonVisibility();
    
    if (history.length === 0) {
        historydiv.innerHTML = '<p>No search history found.</p>';
    } else {
        // Sort history by time, most recent first
        history.sort((a, b) => b.time - a.time);
        history.forEach((item, index) => {
            let itemDiv = document.createElement("div");
            itemDiv.className = "history-item";
            itemDiv.id = `history-item-${index}`;
            let date = new Date(item.time);
            
            let contentDiv = document.createElement("div");
            contentDiv.style.flex = '1';
            contentDiv.innerHTML = `
                <strong>${item.query}</strong><br/>
                <small>${date.toLocaleString()}</small>
            `;
            contentDiv.addEventListener("click", () => {
                window.location.href = `search.html?q=${encodeURIComponent(item.query)}`;
            });
            
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "history-checkbox";
            checkbox.dataset.index = index;
            checkbox.dataset.query = item.query;
            checkbox.title = "Select this history item";
            checkbox.addEventListener("change", handleCheckboxChange);
            
            itemDiv.appendChild(contentDiv);
            itemDiv.appendChild(checkbox);
            historydiv.appendChild(itemDiv);
        });
    }
}

function handleCheckboxChange(e) {
    const checkbox = e.target;
    const itemDiv = checkbox.parentElement;
    const query = checkbox.dataset.query;
    
    if (checkbox.checked) {
        selectedItems.push(query);
        itemDiv.classList.add('selected');
    } else {
        selectedItems = selectedItems.filter(q => q !== query);
        itemDiv.classList.remove('selected');
    }
    
    // Show/hide delete button based on selection
    updateDeleteButtonVisibility();
}

function deleteSelectedItems() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    // Filter out selected items
    history = history.filter(item => !selectedItems.includes(item.query));
    localStorage.setItem("searchHistory", JSON.stringify(history));
    searchHistory();
}

// Clear all history
clearbtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all search history?")) {
        localStorage.removeItem("searchHistory");
        searchHistory();
    }
});

// Delete selected items
if (deleteselectedbtn) {
    deleteselectedbtn.addEventListener("click", () => {
        if (selectedItems.length > 0 && confirm(`Delete ${selectedItems.length} selected item(s)?`)) {
            deleteSelectedItems();
        }
    });
}

// Initial render
searchHistory();