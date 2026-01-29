const mongoose = require('mongoose');

const KRSSchema = new mongoose.Schema({
    mahasiswaId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    namaMatkul: { type: String, required: true },
    jadwal: { type: String, required: true },
    status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('KRS', KRSSchema);