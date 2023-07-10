const Order = require('./model');
const { Types } = require('mongoose');
const OrderItem = require('../order-items/model');
const CartItems = require('../cart-items/model');
const DeleveryAddress = require('../deleveryAddress/model');
const User = require('../user/model');
const midtransClient = require('midtrans-client');
const config = require('../config');

const store = async (req, res, next) => {
    try {
        let { delivery_fee, delivery_address } = req.body;
        let items = await CartItems.find({ user: req.user._id }).populate('product');
        if (!items || items.length === 0) {
            return res.json({
                error: 1,
                message: `You're not able to create an order because you don't have any items in the cart.`
            });
        }

        let user = await User.findById(req.user._id);
        // Initialize Midtrans API client
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: config.serverKey,
            clientKey: config.clientKey
        });

        let address = await DeleveryAddress.findById(delivery_address);
        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail
            },
            user: req.user._id
        });

        let orderItems = await OrderItem.insertMany(items.map(item => ({
            ...item,
            name: item.product.name,
            qty: parseInt(item.qty),
            price: parseInt(item.product.price),
            order: order._id,
            product: item.product._id
        })));

        orderItems.forEach(item => order.order_items.push(item));

        let sub_total = orderItems.reduce((total, item) => total += (item.price * item.qty), 0);
        let parameter = {
            "transaction_details": {
                "order_id": order._id.toString(),
                "gross_amount": parseInt(sub_total + delivery_fee),
            },
            "credit_card": {
                "secure": true
            },
            "customer_details": {
                "first_name":user.full_name,
                "last_name": "",
                "email": user.email,
              }
        };

        const transaction = await snap.createTransaction(parameter);
        let redirectUrl = transaction.redirect_url;
        order.redirect_url = redirectUrl;

        await order.save();
        await CartItems.deleteMany({ user: req.user._id });

        return res.json(order);
    } catch (e) {
        if (e && e.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: e.message,
                fields: e.errors
            });
        }
        next(e);
    }
}

const getOrder = async (req, res, next) => {
    try {
        let { skip = 0, limit = 10 } = req.query;
        let count = await Order.find({ user: req.user._id }).countDocuments();
        let orders =
            await Order.find({ user: req.user._id })
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .populate('order_items')
                .sort({ _id: -1 });
        return res.json({
            data: orders.map(order => order.toJSON({ virtuals: true })),
            count
        });
    } catch (e) {
        if (e && e.name === 'ValidationError') {
            returnres.json({
                error: 1,
                message: e.message,
                fields: e.errors
            });
        }
        next(e);
    }
}

module.exports = {
    store,
    getOrder
}
