const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        adminName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("email is invalid");
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

adminSchema.pre("save", async function (next) {
    const admin = this;
    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

adminSchema.statics.findByCredentials = async (adminName, password) => {
    const admin = await Admin.findOne({ adminName });
    if (!admin) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return admin;
};

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign(
        { _id: admin._id.toString() },
        process.env.JWT_SECRET
    );
    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return token;
};

adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();
    delete adminObject.password;
    delete adminObject.tokens;
    return adminObject;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
