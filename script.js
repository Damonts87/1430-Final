const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const priceInput = document.getElementById('price-input');
const dateInput = document.getElementById('date-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterInput = document.getElementById('filter');
const totalDisplay = document.getElementById('total');
const nameDisplay = document.getElementById('name');
const themeToggle = document.getElementById('theme-toggle');

// OOP Class
class Expense {
  constructor(name, price, date) {
    this.name = name;
    this.price = price;
    this.date = date;
  }
}

// get user name
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

// add item
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

  addItemToDOM(expense);
  addItemToStorage(expense);
  updateTotal();
  clearInputs();
}

// add to DOM
function addItemToDOM(item) {
  const li = document.createElement('li');

  li.innerHTML = `
    <div>
      <strong>${item.name}</strong><br>
      $${item.price.toFixed(2)}<br>
      <small>${item.date}</small>
    </div>
    <button class="delete">X</button>
  `;

  li.querySelector('.delete').addEventListener('click', () => {
    removeItem(li, item);
  });

  itemList.appendChild(li);
}

// storage
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

// remove item
function removeItem(element, item) {
  element.remove();
  removeItemFromStorage(item);
  updateTotal();
}

// display
function displayItems() {
  const items = getItemsFromStorage();

  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  items.forEach(addItemToDOM);

  updateTotal();
}

// clear all
function clearItems() {
  itemList.innerHTML = '';
  localStorage.removeItem('items');
  updateTotal();
}

// total
function updateTotal() {
  const items = getItemsFromStorage();
  const total = items.reduce((sum, item) => sum + item.price, 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// filter
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach(item => {
    const name = item.querySelector('strong').textContent.toLowerCase();
    item.style.display = name.includes(text) ? 'flex' : 'none';
  });
}

// clear inputs
function clearInputs() {
  itemInput.value = '';
  priceInput.value = '';
  dateInput.value = '';
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

// Toggle theme
function toggleTheme() {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Event listener
themeToggle.addEventListener('click', toggleTheme);

// Run on start
loadTheme();

// INIT
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  clearBtn.addEventListener('click', clearItems);
  filterInput.addEventListener('input', filterItems);

  document.addEventListener('DOMContentLoaded', displayItems);

  setUserName(); // 👈 runs name prompt
}

init();