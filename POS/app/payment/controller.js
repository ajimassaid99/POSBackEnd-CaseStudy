const midtransClient = require('midtrans-client');
const config = require('../config');
const Order = require('../order/model');
const Invoice = require('../invoice/model');
const { ObjectId } = require('mongodb');

const handleMidtransNotification = async (req, res, next) => {
    try {
      // Mendapatkan data notifikasi dari Midtrans
      const { body } = req;
  
      // Membuat instance Midtrans API client
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: config.serverKey,
        clientKey: config.clientKey,
      });
  

        const { order_id, transaction_status } = body;
  
  
  
          // Jika status settlement, ubah status pembayaran menjadi "paid"
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
              
  
  
          // Mengirim respons 200 OK
          return res.sendStatus(200);
        }
  
      // Jika notifikasi tidak valid atau order tidak ditemukan, kirim respons error
      return res.status(400).json({ error: 'Invalid notification' });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    handleMidtransNotification
  }