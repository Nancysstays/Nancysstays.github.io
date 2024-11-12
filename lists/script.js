// script.js
const listNameInput = document.getElementById('list-name');
const shoppingList = document.getElementById('shopping-list');
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const addButton = document.getElementById('add-item');
const saveButton = document.getElementById('save-list');
const loadButton = document.getElementById('load-list');
const deleteButton = document.getElementById('delete-list');

let currentList = []; // Array to store the current list items

// IndexedDB setup
const request = window.indexedDB.open('shoppingListsDB', 1);
let db;

request.onerror = function(event) {
  console.error("IndexedDB error:", event.target.errorCode);
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("IndexedDB opened successfully");
  loadListNames(); // Load list names when DB is ready
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const objectStore = db.createObjectStore("lists", { keyPath: "name" });
};

// Function to add an item to the list
function addItem(name, price = null) {
  const newItem = { name, price };
  currentList.push(newItem);
  renderList();
}

// Function to render the list in the UI
function renderList() {
  shoppingList.innerHTML = ''; // Clear the list

  currentList.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `
      ${item.name} 
      <span class="badge bg-primary rounded-pill">${item.price ? '$' + item.price : ''}</span>
      <div>
        <button class="btn btn-sm btn-warning edit-btn" data-index="${index}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
      </div>
    `;
    shoppingList.appendChild(listItem);
  });

  // Add event listeners for edit and delete buttons
  addEventListenersToButtons();
}

// Function to add event listeners to the dynamically created buttons
function addEventListenersToButtons() {
  const editButtons = document.querySelectorAll('.edit-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');

  editButtons.forEach(button => {
    button.addEventListener('click', editItem);
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteItem);
  });
}

// Function to edit an item
function editItem(event) {
  const index = event.target.dataset.index;
  const item = currentList[index];

  const newName = prompt("Edit item name:", item.name);
  const newPrice = prompt("Edit item price:", item.price);

  if (newName !== null) {
    currentList[index].name = newName;
    currentList[index].price = newPrice;
    renderList();
  }
}

// Function to delete an item
function deleteItem(event) {
  const index = event.target.dataset.index;
  currentList.splice(index, 1);
  renderList();
}

// Function to save the list to IndexedDB
function saveList() {
  const listName = listNameInput.value;
  if (listName === '') {
    alert("Please enter a list name.");
    return;
  }

  const transaction = db.transaction(["lists"], "readwrite");
  const objectStore = transaction.objectStore("lists");
  const request = objectStore.put({ name: listName, items: currentList });

  request.onsuccess = function(event) {
    console.log("List saved successfully!");
    loadListNames(); // Refresh list names after saving
  };

  request.onerror = function(event) {
    console.error("Error saving list:", event.target.errorCode);
  };
}

// Function to load a list from IndexedDB
function loadList() {
  const listName = listNameInput.value;
  if (listName === '') {
    alert("Please enter a list name.");
    return;
  }

  const transaction = db.transaction(["lists"], "readonly");
  const objectStore = transaction.objectStore("lists");
  const request = objectStore.get(listName);

  request.onsuccess = function(event) {
    if (request.result) {
      currentList = request.result.items;
      renderList();
      console.log("List loaded successfully!");
    } else {
      alert("List not found.");
    }
  };

  request.onerror = function(event) {
    console.error("Error loading list:", event.target.errorCode);
  };
}

// Function to delete a list from IndexedDB
function deleteList() {
  const listName = listNameInput.value;
  if (listName === '') {
    alert("Please enter a list name.");
    return;
  }

  const transaction = db.transaction(["lists"], "readwrite");
  const objectStore = transaction.objectStore("lists");
  const request = objectStore.delete(listName);

  request.onsuccess = function(event) {
    console.log("List deleted successfully!");
    currentList = []; // Clear current list
    renderList();
    loadListNames(); // Refresh list names after deleting
  };

  request.onerror = function(event) {
    console.error("Error deleting list:", event.target.errorCode);
  };
}

// Function to load saved list names and display them (Example with console log)
function loadListNames() {
  const transaction = db.transaction(['lists'], 'readonly');
  const objectStore = transaction.objectStore('lists');

  const request = objectStore.openCursor();
  const listNames = []; // Array to store list names

  request.onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      listNames.push(cursor.key); // Add the list name (key) to the array
      cursor.continue(); // Move to the next list
    } else {
      console.log('Saved Lists:', listNames); 
      // You can update a select element or display the names in a list here
    }
  };

  request.onerror = function(event) {
    console.error('Error loading list names:', event.target.errorCode);
  };
}

// Event listeners for buttons
addButton.addEventListener('click', () => {
  const itemName = itemNameInput.value;
  const itemPrice = itemPrice
