const express = require('express');
const router = express.Router();
// Pastikan titiknya dua (../) karena models ada di luar folder routes
const User = require('../models/User'); 

router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        console.log("--- Mencoba Login ---");
        console.log("Mencari User:", username, role);

        // Jika User sudah ter-export dengan benar, findOne pasti ada
        const user = await User.findOne({ username, password, role });
        
        if (user) {
            console.log("✅ Berhasil ditemukan:", user.nama);
            res.json(user);
        } else {
            console.log("❌ Tidak ditemukan di database");
            res.status(401).json({ msg: "User tidak ditemukan!" });
        }
    } catch (err) {
        console.error("🔥 Error di auth.js:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
