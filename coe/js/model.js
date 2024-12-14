// Sample product data (replace with your actual product information)
const products = [
    {
        imageUrl: 'images/product1.jpg',
        name: '[Product Name 1]',
        description: 'Immerse yourself in crystal-clear audio with our advanced noise-canceling technology. Experience unparalleled sound quality and comfort.',
        price: 199.99,
        sku: '123456',
        quantity: 10,
        shipping: 'Free'
    },
    // ... more products
];

// Function to get product data
function getProductData() {
    return products;
}

// Shopping cart model (illustrative example)
const cart = {
    items: [],
    addItem(product) {
        this.items.push(product);
    },
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
    },
    // ... other cart functions (update quantity, clear cart, etc.)
};
