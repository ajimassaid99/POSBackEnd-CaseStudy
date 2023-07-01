const Order = require('./model');
const {Types} = require('mongoose');
const OrderItem = require('../order-items/model');
const CartItems = require('../cart-items/model');
const DeleveryAddress = require('../deleveryAddress/model');

const store = async(req,res,next)=>{
    try{
        let {delivery_fee, delivery_address} = req.body;
        let items = await CartItems.find({user:req.user._id}).populate('product');
        if(!items){
            return res.json({
                error:1,
                message: `You're not create order because you have not items in cart`
            });
        }
        let address = await DeleveryAddress.findById(delivery_address);
        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee:delivery_fee,
            delivery_address:{
                provinsi:address.provinsi,
                kabupaten:address.kabupaten,
                kecamatan:address.kecamatan,
                kelurahan:address.kelurahan,
                detail:address.detail
            },
            user:req.user._id,
        });
        let orderItems =
        await OrderItem.insertMany(items.map(item=>({
            ...item,
            name:item.product.name,
            qty:parseInt(item.qty),
            price: parseInt(item.product.price),
            order:order._id,
            product:item.product._id
        })));
        console.log(typeof order.order_items)
        orderItems.forEach(item => order.order_items.push(item));
        await order.save();
        return res.json(order);
    }catch(e){
        if(e && e.name==='ValidationError'){
            return res.json({
                error:1,
                message:e.message,
                fields: e.errors
            })
        }
        next(e);
    }
}

const getOrder = async(req,res,next)=>{
    try{
        let {skip=0,limit=10} = req.query;
        let count = await Order.find({user:req.user._id}).countDocuments();
        let orders = 
            await Order.find({user:req.user._id})
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('order_items')
            .sort('-createAt');
        return res.json({
            data:orders.map(order=>order.toJSON({virtuals:true})),
            count
        });
    }catch(e){
        if(e && e.name==='ValidationError'){
            return res.json({
                error:1,
                message:e.message,
                fields:e.errors
            });
        }
        next(e);
    }
}

module.exports ={
    store,
    getOrder
}