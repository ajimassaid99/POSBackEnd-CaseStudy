const Rating = require('./model');
const Order = require('../order/model');

// Create a new rating
const createRating = async (req, res, next) => {
    try {
        console.log(req.user._id);
        const { order, rating, deskripsi, product } = req.body;

        // Get the order and check if it is in "delivery" status
        const existingOrder = await Order.findById(order);
        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (existingOrder.status !== 'delivery') {
            return res.status(400).json({ error: 'Order is not in "delivery" status' });
        }

        // Check if the user making the rating is the one associated with the order
        if (existingOrder.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to rate this order' });
        }

        // Create a new rating object
        const newRating = new Rating({
            order,
            user: req.user._id,
            rating,
            deskripsi,
            product
        });

        // Save the new rating to the database
        const savedRating = await newRating.save();

        res.status(201).json(savedRating);
    } catch (error) {
        next(error);
    }
};

const getRatingsByProductId = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const ratings = await Rating.find({ product: productId });

        res.json(ratings);
    } catch (error) {
        next(error);
    }
};
// Update a rating
const updateRating = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, deskripsi } = req.body;

        const updatedRating = await Rating.findByIdAndUpdate(id, { rating, deskripsi }, { new: true });

        if (!updatedRating) {
            return res.status(404).json({ error: 'Rating not found' });
        }

        res.json(updatedRating);
    } catch (error) {
        next(error);
    }
};

// Delete a rating
const deleteRating = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedRating = await Rating.findByIdAndDelete(id);

        if (!deletedRating) {
            return res.status(404).json({ error: 'Rating not found' });
        }

        res.json({ message: 'Rating deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRating,
    updateRating,
    deleteRating,
    getRatingsByProductId
};
