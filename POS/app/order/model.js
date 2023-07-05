const mongoose = require('mongoose');
const Invoice = require('../invoice/model');


const orderSchema = mongoose.Schema({
    status:{
        type:String,
        enum:['waiting_payment','processing','in_delivery','delivery'],
        default:'waiting_payment'
    },
    delivery_fee:{
        type:Number,
        default:0
    },
    delivery_address:{
        provinsi:{type:String,required:[true,'provinsi harus di isi']},
        kabupaten:{type:String,required:[true,'kabupaten harus di isi']},
        kecamatan:{type:String,required:[true,'kecamatan harus di isi']},
        kelurahan:{type:String,required:[true,'kelurahan harus di isi']},
        detail:{type:String,required:[true,'detail harus di isi']}
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    redirect_url: {
        type: String
    },
    order_items: [{type: mongoose.Schema.Types.ObjectId, ref:'OrderItem'}]
},{timeStamps:true});


orderSchema.virtual('items_count').get(function(){
    return this.order_items.reduce((total,item)=>total + parseInt(item.qty),0);
});
orderSchema.post('save', async function(){
    let sub_total = this.order_items.reduce((total,item)=>total += (item.price * item.qty),0);
    let invoice = new Invoice({
        user: this.user,
        order:this._id,
        sub_total:sub_total,
        delivery_fee:parseInt(this.delivery_fee),
        total:parseInt(sub_total+this.delivery_fee),
        delivery_address:this.delivery_address
    });
    await invoice.save();
});

const order = mongoose.model('Order',orderSchema); 

module.exports = order;