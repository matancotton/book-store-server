const express = require("express");
const Admin = require("../models/adminModel");
const router = new express.Router();

const adminAuth = (req, res, next) => {
    auth(req, res, next, "admin");
};

router.post("/admin/subscribe", async (req, res) => {
    const admin = new Admin(req.body);
    try {
        await admin.save();
        const token = await admin.generateAuthToken();
        res.status(201).send({ admin, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/admin/login", async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(
            req.body.username,
            req.body.password
        );
        const token = await admin.generateAuthToken();
        res.send({ admin, token });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post("/admin/logout", adminAuth, async (req, res) => {
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

module.exports = router;
