const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: String,
        trim: true,
        default: 'Anonymous',
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        default: 'No Description...'
    },
    price: {
        type: Number,
        default: 0
    },
    picture: {
        type: String
    }
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;