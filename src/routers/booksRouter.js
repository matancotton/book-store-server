const express = require("express");
const Book = require("../models/bookModel");
const auth = require("../middleweare/auth");
const router = new express.Router();

const adminAuth = (req, res, next) => {
    auth(req, res, next, "admin");
};

router.get("/books", async (req, res) => {
    try {
        const searchValue = !!req.query.value
            ? { title: { $regex: new RegExp(req.query.value, "i") } }
            : {};
        const skip = parseInt(req.query.skip) || 0;
        const books = await Book.find(searchValue).skip(skip).limit(8);
        let length = undefined;
        if (!req.query.skip) length = (await Book.find(searchValue)).length;
        res.send({ books, length });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post("/books/new", adminAuth, async (req, res) => {
    const book = new Book(req.body.book);
    try {
        await book.save();
        res.status(201).send({ message: "book was added to database!" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.patch("/books/:id", adminAuth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "title",
        "author",
        "price",
        "picture",
        "description",
    ];
    const isValidUpdates = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidUpdates) {
        return res
            .status(400)
            .send({ error: "Invalid Updates has been enterd!!" });
    }
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) return res.status(404).send({ error: "No book was found" });
        updates.forEach((update) => (book[update] = req.body[update]));
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(400).send({ eror: err.message });
    }
});

router.delete("/books/:id", adminAuth, async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ _id: req.params.id });
        if (!book) return res.status(404).send({ error: "No book was found" });
        res.send(book);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
