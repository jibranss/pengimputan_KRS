const mongoose = require('mongoose');
module.exports = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/akademika');
        console.log('✅ MongoDB Connected');
    } catch (err) { console.error(err); }
};