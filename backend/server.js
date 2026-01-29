const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
connectDB(); // Pastikan db.js sudah benar juga
const User = require('./models/User'); // Pastikan import modelnya ada di atas

const seedData = async () => {
    try {
        const userExist = await User.findOne({ username: "452024611009" });
        if (!userExist) {
            await User.create([
                { username: "452024611050", password: "170603", role: "mahasiswa", nama: "Akhoqi" },
                { username: "452024611009", password: "180106", role: "dosen", nama: "Jibran" }
            ]);
            console.log("🌱 Data Jibran & Akhoqi Berhasil Dibuat!");
        }
    } catch (err) {
        console.log("Gagal buat data:", err.message);
    }
};
seedData();
app.use(cors());
app.use(express.json());

// Pastikan path filenya benar
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/krs', require('./routes/krs'));

app.listen(5000, () => console.log('🚀 Server ON di port 5000'));