const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const db = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB bağlantısı başarılı!'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));
};

module.exports = db;