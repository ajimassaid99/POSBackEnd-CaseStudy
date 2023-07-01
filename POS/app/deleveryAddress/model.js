const {Schema,model}=require('mongoose');

const deliveryAddressSchema = Schema({
    nama:{
        type:String,
        required: [true,'Nama Alamat Harus Diisi'],
        maxLength:[255,'Panjang Maksimal Nama Alamat adalah 255 Karakter']
    },
    kelurahan:{
        type:String,
        required: [true,'Nama Kelurahan Harus Diisi'],
        maxLength:[255,'Panjang Maksimal Nama Kecamatan adalah 255 Karakter']
    },
    kecamatan:{
        type:String,
        required: [true,'Nama Kecamatan Harus Diisi'],
        maxLength:[255,'Panjang Maksimal Nama Kecamatan adalah 255 Karakter']
    },
    kabupaten:{
        type:String,
        required: [true,'Nama Kabupaten Harus Diisi'],
        maxLength:[255,'Panjang Maksimal Nama Kabupaten adalah 255 Karakter']
    },
    provinsi:{
        type:String,
        required: [true,'Nama provinsi Harus Diisi'],
        maxLength:[255,'Panjang Maksimal Nama provinsi adalah 255 Karakter']
    },
    detail:{
        type:String,
        required: [true,'detail Harus Diisi'],
        maxLength:[1000,'Panjang Maksimal detail adalah 1000 Karakter']
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

},{timestamps:true});

module.exports = model('DeliveryAddress',deliveryAddressSchema);