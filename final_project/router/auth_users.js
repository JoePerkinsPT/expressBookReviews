const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
    req.session.token = token;

    res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    const { review } = req.body;

    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const user = jwt.verify(req.session.token, "fingerprint_customer");
    const username = user.username;

    if (!reviews[isbn]) {
        reviews[isbn] = [];
    }

    // Check if the user has already reviewed the book
    const existingReview = reviews[isbn].find((r) => r.username === username);

    if (existingReview) {
        existingReview.review = review; // Modify the review
        res.status(200).json({ message: "Review updated successfully" });
    } else {
        reviews[isbn].push({ username, review }); // Add a new review
        res.status(201).json({ message: "Review added successfully" });
    }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const user = jwt.verify(req.session.token, "fingerprint_customer");
    const username = user.username;

    if (!reviews[isbn]) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    // Filter out the user's review
    const initialLength = reviews[isbn].length;
    reviews[isbn] = reviews[isbn].filter((r) => r.username !== username);

    if (reviews[isbn].length === initialLength) {
        return res.status(404).json({ message: "Review not found or you are not authorized to delete it" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
