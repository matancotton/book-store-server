const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const auth = async (req, res, next, userType) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user =
            userType === "admin"
                ? await Admin.findOne({
                      _id: decoded._id,
                      "tokens.token": token,
                  })
                : await User.findOne({
                      _id: decoded._id,
                      "tokens.token": token,
                  });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send({
            error: "Please login or signup as " + userType,
        });
    }
};

module.exports = auth;
