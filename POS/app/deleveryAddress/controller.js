const { subject } = require('@casl/ability');
const DeleveryAddress = require('./model');
const { policyFor } = require('../../utils');

const getdeleveryAddress = async (req, res, next) => {
  try {
    let user = req.user;
    let deleveryAddress = await DeleveryAddress.find({user:user._id});
    return res.json(deleveryAddress);
  } catch (error) {
    next(error);
  }
};

const createDeleveryAddress = async (req, res, next) => {
  try {
    let user = req.user;
    let payload = req.body;
    let deleveryAddress = new DeleveryAddress({...payload,user:user._id});
    await deleveryAddress.save();
    return res.json(deleveryAddress);
  } catch (error) {
    next(error);
  }
};

const updateDeleveryAddressById = async (req, res, next) => {
    try {
      const payload = req.body;
      const { id } = req.params;
      let address = await DeleveryAddress.findById(id);
      const subjectAddress = subject('DeliveryAddress',{...address, user_id: address.user});
      let policy = policyFor(req.user);

      if(!policy.can('update',subjectAddress)){
        return res.json({
            error:1,
            message:`You're not allowed to modify this resource`
        });
      }
      
      address = await DeleveryAddress.findByIdAndUpdate( id,payload, {new:true} );
      res.json(address);
     
    } catch (err) {
      if(err && err.name === 'ValidationError'){
        return res.json({
            error: 1,
            message: err.message,
            fields: err.errors
        })
      }
      next(err);

    }
  };

const deleteDeleveryAddressById = async (req, res, next) => {
  let { id } = req.params;

  try {
    const address = await deliveryAddress.findById(id);
    const subjectAddress = subject('DeliveryAddress',{...address, user_id: address.user});
    let policy = policyFor(req.user);
    if(policy.can('delete',subjectAddress)){
        return res.json({
            error:1,
            message:`You're not allowed to modify this resource`
        });
      }
    let result = await DeleveryAddress.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'DeleveryAddress not found' });
    }

    return res.json({ message: 'DeleveryAddress deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getdeleveryAddress,
  createDeleveryAddress,
  updateDeleveryAddressById,
  deleteDeleveryAddressById
};