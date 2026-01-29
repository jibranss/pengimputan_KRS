const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['mahasiswa', 'dosen'], required: true },
    nama: { type: String, required: true }
});

// PASTIKAN BARIS INI ADA DAN TIDAK TYPO
module.exports = mongoose.model('User', UserSchema);