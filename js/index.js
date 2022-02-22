// Book Class: Represents a Book
class Book {
    constructor(developerName, projectName, duration) {
      this.developerName = developerName;
      this.projectName = projectName;
      this.duration = duration;
    }
  }
  
  // UI Class: Handle UI Tasks
  class UI {
    static displayBooks() {
      const books = Store.getBooks();
  
      books.forEach((book) => UI.addBookToList(book));
    }
  
    static addBookToList(book) {
      const list = document.querySelector('#book-list');
  
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${book.developerName}</td>
        <td>${book.projectName}</td>
        <td>${book.duration}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
  
      list.appendChild(row);
    }
  
    static deleteBook(el) {
      /*validate through deleteBook to check whether the 
        event clicked has the DELETE CLASS*/

      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
        /*parentElement.parentElement.remove is the method
            used to remove the book from the book-list, looking
            precisely on the DOM the button is contained within 
            list that makes its to contained within parentElement
            of which list referred as <row> and that row is contained
            within the main book-list*/

      }
    }
  
    static showAlert(message, className) {
      /*create showAlert static method that which help 
        us get rid of an ordinary javascript alert message
        and also create the new <div> tag that is implemented
        in between the container and form on our HTLM code
        <div class="alert alert-danger">Message to be displayed</div>*/
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
  
      /*Utilizing setTimeout method to make the error 
        message dissapeared after 3 seconds*/
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#developerName').value = '';
      document.querySelector('#projectName').value = '';
      document.querySelector('#duration').value = '';
    }
  }
  
  // Store Class: Handles Storage
  class Store {
    static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
  
      return books;
    }
  
    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    static removeBook(duration) {
      const books = Store.getBooks();
  
      books.forEach((book, index) => {
        if(book.duration === duration) {
          books.splice(index, 1);
        }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }
  }
  
  // Event: Display Books
  document.addEventListener('DOMContentLoaded', UI.displayBooks);
  
  // Event: Add a Book
  document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
  
    // Get form values
    const developerName = document.querySelector('#developerName').value;
    const projectName = document.querySelector('#projectName').value;
    const duration = document.querySelector('#duration').value;
  
    // Validate through the fields to see if they are not empty
    if(developerName === '' || projectName === '' || duration === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {
      // Instatiate book
      const book = new Book(developerName, projectName, duration);
  
      // Add Book to UI
      UI.addBookToList(book);
  
      // Add book to store
      Store.addBook(book);
  
      // Show success message
      UI.showAlert('Book Added', 'success');
  
      // Clear fields
      UI.clearFields();
    }
  });
  
  // Event: Remove a Book
  document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);
  
    // Remove book from store
    /*I utilize on something called event propagation, of which 
    fires from the window down to the DOM tree until it reach
    the targeted node REASON FOR THAT DOING IS THAT IF I USED
    ONLY THE CLICK EVENT WILL ONLY REMOVE THE FIRST BOOK IN
    LIST*/

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
    // Show success message
    UI.showAlert('Book Removed', 'warning');
  });