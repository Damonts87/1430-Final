const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const priceInput = document.getElementById('price-input');
const dateInput = document.getElementById('date-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterInput = document.getElementById('filter');
const sortSelect = document.getElementById('sort');
const totalDisplay = document.getElementById('total');
const nameDisplay = document.getElementById('name');
const themeToggle = document.getElementById('theme-toggle');
const reportBtn = document.getElementById('report-btn');

let editItem = null;
let editElement = null;
const submitBtn = itemForm.querySelector('button');

// Class
class Expense {
  constructor(name, price, date) {
    this.name = name;
    this.price = price;
    this.date = date;
  }
}

// Username
function setUserName() {
  let name = localStorage.getItem('username');

  if (!name) {
    name = prompt('What is your name?');
    if (name && name.trim() !== '') {
      localStorage.setItem('username', name);
    } else {
      name = 'User';
    }
  }

  nameDisplay.textContent = `Welcome ${name}`;
}

// Add item 
function onAddItemSubmit(e) {
  e.preventDefault();

  const name = itemInput.value.trim();
  const price = priceInput.value.trim();
  const date = dateInput.value;

  if (name === '' || price === '' || date === '') {
    alert('Please fill in all fields');
    return;
  }

  const expense = new Expense(name, Number(price), date);

  if (editItem) {
    updateItemInStorage(editItem, expense);
    editItem = null;

    submitBtn.textContent = 'Add Expense';

    if (editElement) {
      editElement.classList.remove('editing');
      editElement = null;
    }
  } else {
    addItemToStorage(expense);
  }

  sortItems();
  updateTotal();
  clearInputs();
}

function addItemToDOM(item) {
  const li = document.createElement('li');

  li.innerHTML = `
    <div>
      <strong>${item.name}</strong><br>
      $${item.price.toFixed(2)}<br>
      <small>${item.date}</small>
    </div>
    <div>
      <button class="edit">Edit</button>
      <button class="delete">X</button>
    </div>
  `;

  li.querySelector('.delete').addEventListener('click', () => {
    removeItem(li, item);
  });

  li.querySelector('.edit').addEventListener('click', () => {
    startEditItem(item, li);
  });

  itemList.appendChild(li);
}

// Storage
function getItemsFromStorage() {
  return JSON.parse(localStorage.getItem('items')) || [];
}

function addItemToStorage(item) {
  const items = getItemsFromStorage();
  items.push(item);
  localStorage.setItem('items', JSON.stringify(items));
}

function removeItemFromStorage(item) {
  let items = getItemsFromStorage();
  items = items.filter(i => !(i.name === item.name && i.date === item.date));
  localStorage.setItem('items', JSON.stringify(items));
}

// update storage
function updateItemInStorage(oldItem, newItem) {
  let items = getItemsFromStorage();

  items = items.map(item => {
    if (item.name === oldItem.name && item.date === oldItem.date) {
      return newItem;
    }
    return item;
  });

  localStorage.setItem('items', JSON.stringify(items));
}

// Remove
function removeItem(element, item) {
  element.remove();
  removeItemFromStorage(item);
  updateTotal();
}

// Display
function displayItems() {
  sortItems();
  updateTotal();
}

// Clear
function clearItems() {
  itemList.innerHTML = '';
  localStorage.removeItem('items');
  updateTotal();
}

// Total
function updateTotal() {
  const items = getItemsFromStorage();
  const total = items.reduce((sum, item) => sum + item.price, 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Filter
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach(item => {
    const name = item.querySelector('strong').textContent.toLowerCase();
    item.style.display = name.includes(text) ? 'flex' : 'none';
  });
}

// Sort
function sortItems() {
  let items = getItemsFromStorage();
  const sortValue = sortSelect.value;

  if (sortValue === 'az') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortValue === 'za') {
    items.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (sortValue === 'high') {
    items.sort((a, b) => b.price - a.price);
  }

  if (sortValue === 'low') {
    items.sort((a, b) => a.price - b.price);
  }

  if (sortValue === 'new') {
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (sortValue === 'old') {
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  itemList.innerHTML = '';
  items.forEach(addItemToDOM);
}

// Start edit
function startEditItem(item, element) {
  itemInput.value = item.name;
  priceInput.value = item.price;
  dateInput.value = item.date;

  editItem = item;

  if (editElement) {
    editElement.classList.remove('editing');
  }

  editElement = element;
  editElement.classList.add('editing');

  submitBtn.textContent = 'Update Expense';
}

// Clear inputs
function clearInputs() {
  itemInput.value = '';
  priceInput.value = '';
  dateInput.value = '';
}

// Theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// report
function showReport() {
  const items = getItemsFromStorage();

  if (items.length === 0) {
    alert('No expenses to report.');
    return;
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const count = items.length;
  const average = total / count;

  alert(
    `📊 Expense Report\n\n` +
    `Total Cost: $${total.toFixed(2)}\n` +
    `Number of Items: ${count}\n` +
    `Average Cost: $${average.toFixed(2)}`
  );
}

// Events
themeToggle.addEventListener('click', toggleTheme);

// Init
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  clearBtn.addEventListener('click', clearItems);
  filterInput.addEventListener('input', filterItems);
  sortSelect.addEventListener('change', sortItems);
  reportBtn.addEventListener('click', showReport);

  document.addEventListener('DOMContentLoaded', displayItems);

  setUserName();
  loadTheme();
}

init();