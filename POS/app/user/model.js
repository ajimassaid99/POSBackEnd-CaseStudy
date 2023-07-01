const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Field Name Harus Ada'],
    minlength: [3, 'nama Minimal 3 karakter'],
    maxlength:[255, 'panjang nama maksimal 255 karakter']
  },
  email: {
    type: String,
    maxlength:[255, 'Panjang email maksimal 255'],
    required:[true, 'email Harus diisi']
  },
  password: {
    type: String,
    maxlength:[255, 'Panjang password maksimal 255'],
    required:[true, 'password Harus diisi']
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
 },
 token: [String],

},{timestamps:true});

userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.path('email').validate(function(value){
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_RE.test(value)
}, attr => `${attr.value} harus merupakan email valid!`);

userSchema.path('email').validate(async function(value){
    try{
        const count = await this.model('User').count({email:value});
        return !count;
    }catch(e){
        throw e;
    }
}, attr => `${attr.value} Sudah Terdaftar`);

const User = mongoose.model('User', userSchema);

module.exports = User;