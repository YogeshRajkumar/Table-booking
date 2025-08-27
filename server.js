const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

let users = []; // stores registered users
let books = {
    "1234": { title: "Book One", author: "Author A", reviews: {} },
    "5678": { title: "Book Two", author: "Author B", reviews: {} },
    "9101": { title: "Book Three", author: "Author A", reviews: {} }
};

// ----------------- General Users -----------------

// Task 1: Get book list
app.get("/books", (req, res) => {
    res.json(books);
});

// Task 2: Get books based on ISBN
app.get("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    res.json(books[isbn] || { error: "Book not found" });
});

// Task 3: Get all books by Author
app.get("/books/author/:author", (req, res) => {
    let result = {};
    let author = req.params.author;
    for (let key in books) {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    }
    res.json(result);
});

// Task 4: Get all books by Title
app.get("/books/title/:title", (req, res) => {
    let result = {};
    let title = req.params.title;
    for (let key in books) {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    }
    res.json(result);
});

// Task 5: Get book Review
app.get("/books/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    res.json(books[isbn]?.reviews || { error: "No reviews found" });
});

// Task 6: Register new user
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username, password });
    res.json({ message: "User registered successfully" });
});

// Task 7: Login as registered user
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: "Invalid login" });
    res.json({ message: "Login successful", user });
});

// ----------------- Registered Users -----------------

// Task 8: Add/Modify a book review
app.put("/auth/review/:isbn", (req, res) => {
    const { username, review } = req.body;
    const isbn = req.params.isbn;
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

    books[isbn].reviews[username] = review;
    res.json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Task 9: Delete a book review
app.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.body;
    const isbn = req.params.isbn;
    if (books[isbn]?.reviews[username]) {
        delete books[isbn].reviews[username];
        return res.json({ message: "Review deleted" });
    }
    res.status(404).json({ message: "Review not found" });
});

// ----------------- Run Server -----------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
