const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Field Name Harus Ada'],
    minlenght: [3,'nama Minimal 3 karakter'],
  },
  price: {
    type: Number,
    default:0
  },
  description: {
    type: String,
    maxlenght:[1000,'Maksimal 1000 karakter']
  },
  image_url: {
    type: String
  }
},{timestamps:true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
