const mongoose = require('mongoose');
const{dbHost,dbPass,dbName,dbPort,dbUser}= require('../app/config');

mongoose.connect(`mongodb+srv://rmassaid99:XYsppT49ReEXpCfu@cluster0.egisxkz.mongodb.net/?retryWrites=true&w=majority`);

const db=mongoose.connection;

module.exports =db;