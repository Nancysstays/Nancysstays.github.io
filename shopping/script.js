class ShoppingListManager {
  #lists; // Private: Stores the shopping lists data

  constructor() {
    this.#lists = {};
    this.loadLists();
    this.mapDOMOperations();
  }

  // Public: Load lists from localStorage
  loadLists() {
    this.#lists = JSON.parse(localStorage.getItem('shoppingLists')) || {};
    this.renderLists();
  }

  // Private: Save lists to localStorage
  #saveLists() {
    localStorage.setItem('shoppingLists', JSON.stringify(this.#lists));
    this.#saveDataToFile();
  }
  
  //Private: Save data to a file (simulated)
  #saveDataToFile(){
      const jsonData = JSON.stringify(this.#lists);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const link = document.createElement('a');

      link.href = URL.createObjectURL(blob);
      link.download = 'index.db';
      link.click();
      URL.revokeObjectURL(link.href);
  }

  // Public: Add a new list
  addList(listName) {
    if (listName && !this.#lists[listName]) {
      this.#lists[listName] = new ShoppingList(listName);
      this.renderLists();
      this.#saveLists();
      return true;
    }
    return false;
  }

  // Public: Rename a list
  renameList(oldName, newName) {
    if (this.#lists[oldName] && !this.#lists[newName]) {
      this.#lists[newName] = this.#lists[oldName];
      this.#lists[newName].setName(newName);
      delete this.#lists[oldName];
      this.renderLists();
      this.#saveLists();
      return true;
    }
    return false;
  }

  // Public: Delete a list
  deleteList(listName) {
    if (this.#lists[listName]) {
      if (this.currentList === listName) {
        this.clearListItems();
        this.currentList = null;
      }
      delete this.#lists[listName];
      this.renderLists();
      this.#saveLists();
      return true;
    }
    return false;
  }

  // Public: Add an item to a list
  addItem(listName, itemName, quantity = 1, price = 0) {
    if (this.#lists[listName]) {
      this.#lists[listName].addItem(new ShoppingListItem(itemName, quantity, price));
      this.renderListItems(listName);
      this.#saveLists();
      return true;
    }
    return false;
  }

  // Public: Remove an item from a list
  removeItem(listName, itemName) {
    if (this.#lists[listName]) {
      this.#lists[listName].removeItem(itemName);
      this.renderListItems(listName);
      this.#saveLists();
      return true;
    }
    return false;
  }

  // Public: Update item details in a list
  updateItem(listName, itemName, newItemName, newQuantity, newPrice) {
    if (this.#lists[listName]) {
      this.#lists[listName].updateItem(itemName, newItemName, newQuantity, newPrice);
      this.renderListItems(listName);
      this.#saveLists();
      return true;
    }
    return false;
  }

  // Public: Get the currently selected list
  get currentList() {
    return Object.keys(this.#lists).find(listName => this.#lists[listName].selected);
  }

  // Public: Set the currently selected list
  set currentList(listName) {
    for (const name in this.#lists) {
      this.#lists[name].selected = (name === listName);
    }
  }

  // Protected: Render the list of lists in the UI (can be overridden by subclasses)
  renderLists() {
    const listsContainer = document.getElementById('lists-container');
    listsContainer.innerHTML = '';

    for (const listName in this.#lists) {
      const listItem = this.createListElement(this.#lists[listName]);
      listsContainer.appendChild(listItem);
    }
  }

  // Protected: Create a list element for the UI
  createListElement(shoppingList) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = shoppingList.name;

    const editButton = this.createEditListButton(shoppingList.name);
    listItem.appendChild(editButton);

    const deleteButton = this.createDeleteListButton(shoppingList.name);
    listItem.appendChild(deleteButton);

    listItem.addEventListener('click', () => {
      this.currentList = shoppingList.name;
      this.renderListItems(shoppingList.name);
    });

    return listItem;
  }

  // Protected: Create an edit button for a list
  createEditListButton(listName) {
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-sm', 'btn-outline-primary', 'me-2');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const newListName = prompt('Enter new list name:', listName);
      if (newListName && newListName !== listName) {
        this.renameList(listName, newListName);
      }
    });
    return editButton;
  }

  // Protected: Create a delete button for a list
  createDeleteListButton(listName) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-sm', 'btn-outline-danger');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (confirm(`Are you sure you want to delete "${listName}"?`)) {
        this.deleteList(listName);
      }
    });
    return deleteButton;
  }

  // Public: Render the items of the selected list
  renderListItems(listName) {
    const listItemsContainer = document.getElementById('list-items');
    listItemsContainer.innerHTML = '';

    if (this.#lists[listName]) {
      const items = this.#lists[listName].items;
      items.forEach(item => {
        const listItem = this.createListItemElement(listName, item);
        listItemsContainer.appendChild(listItem);
      });

      // Display totals
      const totalItems = this.#lists[listName].getTotalItems();
      const totalPrice = this.#lists[listName].getTotalPrice();

      const totalsElement = document.createElement('li');
      totalsElement.classList.add('list-group-item');
      totalsElement.innerHTML = `<strong>Total Items:</strong> ${totalItems} <br> <strong>Total Price:</strong> $${totalPrice.toFixed(2)}`;
      listItemsContainer.appendChild(totalsElement);
    }
  }

  // Private: Clear the list items in the UI
  clearListItems() {
    const listItemsContainer = document.getElementById('list-items');
    listItemsContainer.innerHTML = '';
  }

  // Protected: Create a list item element for the UI
  createListItemElement(listName, item) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');

    const itemNameSpan = document.createElement('span');
    itemNameSpan.classList.add('item-name');
    itemNameSpan.textContent = `${item.name} (Qty: ${item.quantity}, Price: $${item.price.toFixed(2)})`;
    listItem.appendChild(itemNameSpan);

    const editButton = this.createEditItemButton(listName, item);
    listItem.appendChild(editButton);

    const deleteButton = this.createDeleteItemButton(listName, item);
    listItem.appendChild(deleteButton);

    return listItem;
  }

  // Protected: Create an edit button for a list item
  createEditItemButton(listName, item) {
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-sm', 'btn-outline-primary', 'me-2');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      const newItemName = prompt('Enter new item name:', item.name);
      const newQuantity = parseInt(prompt('Enter new quantity:', item.quantity) || item.quantity);
      const newPrice = parseFloat(prompt('Enter new price:', item.price) || item.price);

      if (newItemName) {
        this.updateItem(listName, item.name, newItemName, newQuantity, newPrice);
      }
    });
    return editButton;
  }

  // Protected: Create a delete button for a list item
  createDeleteItemButton(listName, item) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-sm', 'btn-outline-danger');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      this.removeItem(listName, item.name);
    });
    return deleteButton;
  }

  // Public: Map DOM operations to event listeners
  mapDOMOperations() {
    const newListNameInput = document.getElementById('new-list-name');
    const createListButton = document.getElementById('create-list');
    const newItemInput = document.getElementById('new-item');
    const newItemQuantityInput = document.getElementById('new-item-quantity');
    const newItemPriceInput = document.getElementById('new-item-price');
    const addItemButton = document.getElementById('add-item');

    createListButton.addEventListener('click', () => {
      const listName = newListNameInput.value.trim();
      if (this.addList(listName)) {
        newListNameInput.value = '';
      }
    });

    addItemButton.addEventListener('click', () => {
      const itemName = newItemInput.value.trim();
      const quantity = parseInt(newItemQuantityInput.value) || 1;
      const price = parseFloat(newItemPriceInput.value) || 0;
      if (itemName && this.currentList) {
        if (this.addItem(this.currentList, itemName, quantity, price)) {
          newItemInput.value = '';
          newItemQuantityInput.value = '';
          newItemPriceInput.value = '';
        }
      }
    });
  }
}

class ShoppingList {
  #name; //Private
  #items; //Private
  #selected; //Private
  constructor(name) {
    this.#name = name;
    this.#items = [];
    this.#selected = false;
  }
  get name() {
    return this.#name;
  }
  setName(newName) {
    this.#name = newName;
  }
  get items() {
    return this.#items;
  }
  get selected() {
    return this.#selected;
  }
  set selected(value) {
    this.#selected = value;
  }
  addItem(item) {
    this.#items.push(item);
  }
  removeItem(itemName) {
    this.#items = this.#items.filter(item => item.name !== itemName);
  }
  updateItem(itemName, newItemName, newQuantity, newPrice) {
    const item = this.#items.find(item => item.name === itemName);
    if (item) {
      item.name = newItemName;
      item.quantity = newQuantity;
      item.price = newPrice;
    }
  }
  getTotalItems() {
    return this.#items.reduce((total, item) => total + item.quantity, 0);
  }
  getTotalPrice() {
    return this.#items.reduce((total, item) => total + (item.quantity * item.price), 0);
  }
}

class ShoppingListItem {
  #name; //Private
  #quantity; //Private
  #price; //Private
  constructor(name, quantity, price) {
    this.#name = name;
    this.#quantity = quantity;
    this.#price = price;
  }
  get name() {
    return this.#name;
  }
  set name(value) {
    this.#name = value;
  }
  get quantity() {
    return this.#quantity;
  }
  set quantity(value) {
    this.#quantity = value;
  }
  get price() {
    return this.#price;
  }
  set price(value) {
    this.#price = value;
  }
}

// Initialize the application
const shoppingListManager = new ShoppingListManager();