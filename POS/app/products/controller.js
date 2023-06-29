const multer = require('multer');
const Product = require('./model');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const config = require('../config');

const getProducts = async (req, res) => {
    try {
      let { search,skip=0,limit=10 } = req.query;
  
      const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  
      const products = await Product
      .find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

      return res.json(products);
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

        if(req.file){
            let tmp_path = req.file.path;
            let originalEXT = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename+'.'+originalEXT;
            let target_path = path.resolve(config.rootPath,`public/images/products/${filename}`);

            console.log(target_path);
            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);

            src.pipe(dest);
            
            src.on('end',async()=>{
                try{

                    let  product = new Product({...payload,image_url:filename})
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

const updateProductById = async (req, res,next) => {
    try{
        let payload = req.body;
        let {id} = req.params;

        console.log(payload);
        if(req.file){
            let tmp_path = req.file.path;
            let originalEXT = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename+'.'+originalEXT;
            let target_path = path.resolve(config.rootPath,`public/images/products/${filename}`);

            console.log(target_path);
            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);

            src.pipe(dest);
            
            src.on('end',async()=>{
                try{

                    let  product = await Product.findByIdAndUpdate(id,{...payload,image_url:filename},{new:true,runValidators:true});
                    console.log(product);
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
            let product = await Product.findByIdAndUpdate(id,payload,{new:true,runValidators:true});
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