const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Field Name Harus Ada'],
    minlenght: [3,'nama Minimal 3 karakter'],
    maxlenght: [20,'nama category maksimal 20 karakter']
  },
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
