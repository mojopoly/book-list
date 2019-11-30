// Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI constructor
function UI() {}

// Store constructor
function Store() {}

Store.prototype.getBooks = function() {
  let books;
  if (localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books')); //it needs to be a JS object and that is why we parse ir
  }
  return books;
};

Store.prototype.displayBooks = function() {
  const books = Store.prototype.getBooks();
  books.forEach(book => {
    const ui = new UI();
    ui.addBookToList(book);
  });
};
Store.prototype.addBook = function(book) {
  const books = Store.prototype.getBooks();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
};

Store.prototype.removeBook = function(isbn) {
  const books = Store.prototype.getBooks();
  books.forEach(function(book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });
  localStorage.setItem('books', JSON.stringify(books));
};

//DOM Load event for session persistence
document.addEventListener('DOMContentLoaded', Store.prototype.displayBooks);

UI.prototype.addBookToList = function(book) {
  //console.log(book);
  const list = document.getElementById('book-list');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;
  list.appendChild(row);
};

UI.prototype.clearFields = function() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
};

UI.prototype.showAlert = function(msg, className) {
  const div = document.createElement('div');
  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(msg));
  const container = document.querySelector('.container');
  const form = document.querySelector('#book-form');
  container.insertBefore(div, form);

  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 3000);
};

UI.prototype.removeBook = function(e) {
  if (e.target.className === 'delete') {
    console.log(e.target.parentElement.parentElement);
    e.target.parentElement.parentElement.remove();
  }
};

// Event listeners
document.getElementById('book-form').addEventListener('submit', function(e) {
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;
  //console.log(title, author, isbn);
  const book = new Book(title, author, isbn);
  const ui = new UI();
  const store = new Store();
  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill out all fields', 'error');
  } else {
    ui.addBookToList(book);
    store.addBook(book);
    ui.showAlert('Book Added', 'success');
    ui.clearFields();
  }
  e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function(e) {
  ui = new UI();
  store = new Store();
  ui.removeBook(e);
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Book Removed!', 'success');
  e.preventDefault();
});
