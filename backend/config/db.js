const mongoose = require('mongoose');
const MongoDB_URI = 'mongodb+srv://jacobogarcesoquendo:aFJzVMGN3o7fA38A@cluster0.mqwbn.mongodb.net/logan'

const connectDB = async () => {
  try {
    await mongoose.connect(MongoDB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error de conexión:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
