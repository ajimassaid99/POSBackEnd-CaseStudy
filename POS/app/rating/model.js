const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: [true, 'order harus diisi']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'product harus diisi']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user harus diisi']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'rating harus diisi']
    },
    deskripsi: {
        type: String,
        required: [true, 'deskripsi harus diisi']
    }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
