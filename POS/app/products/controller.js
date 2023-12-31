const multer = require('multer');
const Product = require('./model');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const config = require('../config');
const Category = require('../category/model');
const Tag = require('../tag/model');
const Invoice = require('../invoice/model');
const Order = require('../order/model');
const Rating = require('../rating/model');

const getProducts = async (req, res, next) => {
  try {
    let { search, skip = 0, limit = 10, category = '', tags = [] } = req.query;
    let criteria = {};

    if (search) {
      criteria = { ...criteria, name: { $regex: search, $options: 'i' } };
    }

    if (category) {
      let categoryResult = await Category.findOne({ name: { $regex: category, $options: 'i' } });
      if (categoryResult) {
        criteria = { ...criteria, category: categoryResult._id };
      }
    }

    if (tags.length > 0) {
      let tagsResult = await Tag.find({ name: { $in: tags } });
      if (tagsResult.length > 0) {
        criteria = { ...criteria, tags: { $in: tagsResult.map((tag) => tag._id) } };
      }
    }

    let count = await Product.countDocuments(criteria);
    let orderIds = await Invoice.distinct('order', { payment_status: 'paid' });

    const products = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tags');

    const productIds = products.map((product) => product._id);

    const productRatings = await Rating.aggregate([
      {
        $match: { product: { $in: productIds } },
      },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    const productRatingsMap = new Map();
    productRatings.forEach((rating) => {
      productRatingsMap.set(rating._id.toString(), rating.averageRating);
    });

    const orders = await Order.find({ _id: { $in: orderIds } }).populate({
      path: 'order_items',
      select: 'product qty',
    });

    const data = products.map((product) => {
      const matchingOrders = orders.filter((order) =>
        order.order_items.some((item) => item.product.equals(product._id))
      );

      let qty = 0;
      matchingOrders.forEach((order) => {
        const matchingItems = order.order_items.filter((item) => item.product.equals(product._id));
        const orderQty = matchingItems.reduce((total, item) => total + item.qty, 0);
        qty += orderQty;
      });

      const rating = productRatingsMap.get(product._id.toString()) || 0;

      return {
        ...product.toObject(),
        sold: qty,
        rating,
      };
    });

    return res.json({
      data,
      count,
    });
  } catch (error) {
    next(error);
  }
};







const getProductById = (req, res) => {
  const {id} = req.params;

  Product.findOne({ _id: new ObjectId(id) })
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.send({ status: 'Produk tidak ditemukan' });
      }
    })
    .catch((error) => res.send(error));
};
  

const storeProduct = async (req,res,next) =>{
    try{
        let payload = req.body;
        
        if(payload.category){
            let category = await Category
            .findOne({name:{$regex: payload.category,$options:'i'}});
            if(category){
                payload={...payload,category:category._id};
            }else{
                delete payload.category;
            }
        }
        if (payload.tags) {
            let tags = await Promise.all(
              payload.tags.map(async (tagName) => {
                let tag = await Tag.findOne({ name: { $regex: tagName, $options: 'i' } });
                if (!tag) {
                  tag = await new Tag({ name: tagName }).save();
                }
                return tag._id;
              })
            );
            payload = { ...payload, tags };
          }

        if(req.file){
            let tmp_path = req.file.path;
            let originalEXT = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename+'.'+originalEXT;
            let target_path = path.resolve(config.rootPath,`public/images/products/${filename}`);
            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);


            src.pipe(dest);
            
            src.on('end',async()=>{
                try{


                    let  product = new Product({...payload,image_url:`http://localhost:3002/images/products/${filename}`})
                    await product.save()
                    return res.json(product);

                }catch(err){
                    fs.unlinkSync(target_path);
                    if(err && err.name == 'ValidationError'){
                     return res.json({
                        error:1,
                        message:err.message,
                        fields:err.errors
                     })   
                    }   
                next(err);
                }
            });
            src.on('error',async()=>{
                next(err);
            });
        }else{
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }
    }catch(err){
        if(err && err.name == 'ValidationError'){
            return res.json({
               error:1,
               message:err.message,
               fields:err.errors
            }); 
    }
}
};

const updateProductById = async (req, res, next) => {
    try {
      let payload = req.body;
      let { id } = req.params;
  
      if (payload.category) {
        let category = await Category.findOne({
          name: { $regex: payload.category, $options: 'i' },
        });
        if (category) {
          payload = { ...payload, category: category._id };
        } else {
          delete payload.category;
        }
      }
      if (payload.tags) {
        let tags = await Promise.all(
          payload.tags.map(async (tagName) => {
            let tag = await Tag.findOne({ name: { $regex: tagName, $options: 'i' } });
            if (!tag) {
             return null;
            }
            return tag._id;
          })
        );
        payload = { ...payload, tags };
      }
  
      if (req.file) {
        let tmp_path = req.file.path;
        let originalEXT = req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ];
        let filename = req.file.filename + '.' + originalEXT;
        let target_path = path.resolve(
          config.rootPath,
          `public/images/products/${filename}`
        );
  
        let result = await Product.findById(id);
        let currentImage =`${config.rootPath}/public/images/products/${result.image_url}`;
  
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
  
        src.pipe(dest);
  
        src.on('end', async () => {
          try {
            // Hapus file gambar lama
            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage);
            }
  
            let product = await Product.findByIdAndUpdate(
              id,
              payload,
              { new: true, runValidators: true }
            );
            return res.json(product);
          } catch (err) {
            fs.unlinkSync(target_path);
            if (err && err.name == 'ValidationError') {
              return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
              });
            }
            next(err);
          }
        });
        src.on('error', async () => {
          next(err);
        });
      } else {
        let product = await Product.findByIdAndUpdate(
          id,
          payload,
          { new: true, runValidators: true }
        );
        return res.json(product);
      }
    } catch (err) {
      if (err && err.name == 'ValidationError') {
        return res.json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  };
  
  const deleteProductById = async (req, res,next) => {
    const productId = req.params.id;
  
    try {
      let result = await Product.findByIdAndDelete(productId);
      let currentImage = `${config.rootPath}/public/images/products/${result.image_url}`

      
      if (!result) {
        return res.status(404).send({ message: 'Product not found' });
      }
      if(fs.existsSync(currentImage)){
        fs.unlinkSync(currentImage);
      }
  
      res.send({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  };


module.exports = {
    getProducts,
    storeProduct,
    getProductById,
    updateProductById,
    deleteProductById
}