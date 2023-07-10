const midtransClient = require('midtrans-client');
const config = require('../config');
const Order = require('../order/model');
const Invoice = require('../invoice/model');
const { ObjectId } = require('mongodb');

const handleMidtransNotification = async (req, res, next) => {
    try {
      const { body } = req;
  
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: config.serverKey,
        clientKey: config.clientKey,
      });
  

        const { order_id, transaction_status } = body;
  
  
  
          if (transaction_status === 'settlement') {
            await Order.findOneAndUpdate(
                { _id: order_id },
                { $set: { status: 'processing' } },
                { new: true }
              );
             const a = await Invoice.findOneAndUpdate(
                { order: new ObjectId(order_id) },
                { $set: { payment_status: 'paid' } },
                { new: true }
              );
              console.log(a);
              
  
          return res.sendStatus(200);
        }

      return res.status(400).json({ error: 'Invalid notification' });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    handleMidtransNotification
  }