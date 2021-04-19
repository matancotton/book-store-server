const express = require("express");
const User = require("../models/userModel");
const auth = require("../middleweare/auth");
const router = new express.Router();

const userAuth = (req, res, next) => {
    auth(req, res, next, "user");
};

router.post("/user/subscribe", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.username,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post("/user/logout", userAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get("/my-cart", userAuth, async (req, res) => {
    try {
        await req.user.populate({ path: "books" }).execPopulate();
        if (!req.user.books) return res.send([]);
        res.send(req.user.books);
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
});

router.post("/my-cart/save", userAuth, async (req, res) => {
    const user = req.user;
    try {
        user.books = req.body.books;
        await user.save();
        return res.send({ message: "books were added to cart successfuly!" });
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
});

module.exports = router;
