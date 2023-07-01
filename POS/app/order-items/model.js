const mongoose = require('mongoose');
const {model,Schema} = mongoose;

const orderItemsSchema=Schema({
    name:{
        type:String,
        minLength:[5,'Panjang Nama Makanan Minimal 5 karakter'],
        required: [true,'nama Harus ada']
    },
    qty:{
        type:Number,
        required:[true,'qty Harus ada'],
        min: [1,'minimal qty 1']
    },
    price:{
        type:Number,
        default:0
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },

    product:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    }

});

const OrderItems =  mongoose.model('OrderItem',orderItemsSchema);

module.exports = OrderItems;