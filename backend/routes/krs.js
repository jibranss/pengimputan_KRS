const express = require('express');
const router = express.Router();
const KRS = require('../models/KRS');

// 1. Simpan KRS Baru (Digunakan Mahasiswa)
router.post('/tambah', async (req, res) => {
    try {
        const { mahasiswaId, namaMatkul, jadwal } = req.body;
        // Pastikan semua data terisi
        if (!mahasiswaId || !namaMatkul || !jadwal) {
            return res.status(400).json({ msg: "Data tidak lengkap" });
        }
        const newKrs = new KRS({ mahasiswaId, namaMatkul, jadwal });
        await newKrs.save();
        res.status(201).json({ msg: "Berhasil disimpan" });
    } catch (err) {
        console.error("Error Simpan KRS:", err);
        res.status(500).json({ msg: "Gagal simpan ke database" });
    }
});

// 2. Ambil Semua KRS (Digunakan Dosen & Mahasiswa)
router.get('/', async (req, res) => {
    try {
        // .populate('mahasiswaId') berfungsi mengambil detail nama mahasiswa dari koleksi User
        const data = await KRS.find().populate('mahasiswaId');
        res.json(data);
    } catch (err) {
        console.error("Error Get KRS:", err);
        res.status(500).json({ msg: "Gagal ambil data" });
    }
});

// 3. Update Status KRS (INI YANG KAMU KURANG - Untuk tombol Approve/Reject)
router.put('/update/:id', async (req, res) => {
    try {
        const { status } = req.body; // Menerima 'approved' atau 'rejected'
        const updatedKrs = await KRS.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true }
        );
        
        if (!updatedKrs) {
            return res.status(404).json({ msg: "Data KRS tidak ditemukan" });
        }
        
        res.json({ msg: "Status berhasil diperbarui", data: updatedKrs });
    } catch (err) {
        console.error("Error Update KRS:", err);
        res.status(500).json({ msg: "Gagal memperbarui status" });
    }
});

module.exports = router;