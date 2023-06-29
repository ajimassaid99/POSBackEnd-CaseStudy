const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Field Name Harus Ada'],
    minlenght: [3,'nama Tag Minimal 3 karakter'],
    maxlenght: [20,'nama Tag maksimal 20 karakter']
  },
});

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;
