$(document).ready(function() {
    // IndexedDB logic (simplified)
    let db;
    let request = window.indexedDB.open("productDB", 1);

    request.onerror = function(event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadProducts();
    };

    request.onupgradeneeded = function(event) { 
        let db = event.target.result;
        let objectStore = db.createObjectStore("products", { keyPath: "id" });
        objectStore.createIndex("name", "name", { unique: false });
    };

    function loadProducts() {
        let transaction = db.transaction(["products"], "readonly");
        let objectStore = transaction.objectStore("products");
        let request = objectStore.getAll();

        request.onsuccess = function(event) {
            let products = event.target.result;
            displayProducts(products);
        };
    }

    // AJAX request to fetch products (replace with your actual API endpoint)
    $.ajax({
        url: '/api/products',
        method: 'GET',
        success: function(products) {
            // Store products in IndexedDB
            let transaction = db.transaction(["products"], "readwrite");
            let objectStore = transaction.objectStore("products");
            products.forEach(product => objectStore.add(product)); 

            displayProducts(products);
        },
        error: function() {
            console.error("Error fetching products");
        }
    });

    function displayProducts(products) {
        let productList = $('#product-list');
        productList.empty(); // Clear previous results

        products.forEach(product => {
            let productCard = `
                <div class="col-md-4">
                    <div class="product-card">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                    </div>
                </div>
            `;
            productList.append(productCard);
        });
    }
});
