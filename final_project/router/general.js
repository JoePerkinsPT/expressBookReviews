const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let users = [];

public_users.post('/register', function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.find((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    axios.get('http://localhost:5000/books') // Replace with actual endpoint
        .then((response) => {
            res.status(200).send(JSON.stringify(response.data, null, 2));
        })
        .catch((error) => {
            res.status(500).send({ message: "Error fetching book list", error: error.message });
        });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/books/${isbn}`) // Replace with actual endpoint
        .then((response) => {
            res.status(200).send(JSON.stringify(response.data, null, 2));
        })
        .catch((error) => {
            res.status(500).send({ message: "Error fetching book details", error: error.message });
        });
});

  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    axios.get(`http://localhost:5000/books?author=${author}`) // Replace with actual endpoint
        .then((response) => {
            res.status(200).send(JSON.stringify(response.data, null, 2));
        })
        .catch((error) => {
            res.status(500).send({ message: "Error fetching book details", error: error.message });
        });
});


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    axios.get(`http://localhost:5000/books?title=${title}`) // Replace with actual endpoint
        .then((response) => {
            res.status(200).send(JSON.stringify(response.data, null, 2));
        })
        .catch((error) => {
            res.status(500).send({ message: "Error fetching book details", error: error.message });
        });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json({ reviews: book.reviews });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
