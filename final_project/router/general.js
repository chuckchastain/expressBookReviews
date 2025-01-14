const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password });
      return res.status(200).json({ message: "Customer successfully registered.  Now you can login" });
    }
    else {
      return res.status(404).json({message: "User already exists!"}); 
    }
  }
  return res.status(404).json({message: "Unable to register user."}); 
});

// Common Functions
// Common Promise callback
function getBooksPromise(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

// Commom async function
async function getBooksAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error; 
  }
}


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 2));
});

//Get Book list with Promise Callback
public_users.get('/promise', function (req, res) {
  try {
    getBooksPromise('http://localhost:5000/') 
      .then(bookList => {
        res.json(bookList);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Book list with Async
public_users.get('/async', async function (req, res) {
  try {
    const bookList = await getBooksAsync('http://localhost:5000/'); //
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });

 // Get book details based on ISBN with Promise callback
public_users.get('/promise/isbn/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    getBooksPromise("http://localhost:5000/isbn/" + isbn) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Book Not Found" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN using Async
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await getBooksAsync("http://localhost:5000/isbn/" + isbn);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;  
  const authorBooks = [];  
   
  for (const book in books) {  
    if (books[book].author === author) {  
      authorBooks.push(books[book]);
    }
  }
   
  if (authorBooks.length > 0) {  
    res.send(authorBooks);  
  } else {
    res.status(404).send('No books found for author');  
  }
});
 
//Get book details based on author using Promise callback 
public_users.get('/promise/author/:author', function (req, res) {
  try {
    const author = req.params.author;
    getBooksPromise("http://localhost:5000/author/" + author) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Book not Found" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get book details based on Author using Async
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const book = await getBooksAsync("http://localhost:5000/author/" + author);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
  if(filteredBooks.length > 0){
    return res.status(200).json(filteredBooks);
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
});

//Get all books based on title using Promise callback
public_users.get('/promise/title/:title', function (req, res) {
  try {
    const title = req.params.title;
    getBooksPromise("http://localhost:5000/title/" + title) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Book Not Found" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get all books based on title using Async
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const book = await getBooksAsync("http://localhost:5000/title/" + title);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = books[isbn].reviews;
  return res.status(200).json({ reviews: reviews });
});


module.exports.general = public_users;
