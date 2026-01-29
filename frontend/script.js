const API = "http://localhost:5000/api";

// === FUNGSI LOGIN ===
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password, role })
        });

        if (res.ok) {
            const user = await res.json();
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = user.role + '.html';
        } else {
            alert("Login Gagal! Periksa Username dan Password.");
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Tidak dapat terhubung ke server.");
    }
}

// === FUNGSI KHUSUS MAHASISWA ===

async function tambahKRS() {
    const userData = localStorage.getItem('user');
    if (!userData) return alert("Sesi berakhir, silakan login ulang.");
    
    const user = JSON.parse(userData);
    const namaMatkul = document.getElementById('selectMatkul').value;
    const jadwal = document.getElementById('jadwalMatkul').value;

    try {
        const res = await fetch(`${API}/krs/tambah`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mahasiswaId: user._id,
                namaMatkul: namaMatkul,
                jadwal: jadwal
            })
        });

        if (res.ok) {
            alert("Mata kuliah berhasil diajukan! Menunggu persetujuan dosen.");
            location.reload(); 
        } else {
            alert("Gagal menambah mata kuliah.");
        }
    } catch (err) {
        console.error("Error Tambah KRS:", err);
    }
}

async function loadKRSMahasiswa() {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const user = JSON.parse(userData);
    
    try {
        const res = await fetch(`${API}/krs`);
        const data = await res.json();
        const krsSaya = data.filter(item => item.mahasiswaId && item.mahasiswaId._id === user._id);
        const tableBody = document.getElementById('tabelKRS');
        if (!tableBody) return;

        let html = '';
        krsSaya.forEach(item => {
            const badgeColor = item.status === 'pending' ? 'bg-warning' : (item.status === 'approved' ? 'bg-success' : 'bg-danger');
            html += `
                <tr>
                    <td class="fw-bold">${item.namaMatkul}</td>
                    <td>3</td>
                    <td>${item.jadwal}</td>
                    <td><span class="badge ${badgeColor} text-uppercase">${item.status}</span></td>
                </tr>`;
        });
        tableBody.innerHTML = html || '<tr><td colspan="4" class="text-center text-muted">Belum ada mata kuliah yang diambil.</td></tr>';
    } catch (err) {
        console.error("Error Load KRS Mahasiswa:", err);
    }
}

// === FUNGSI KHUSUS DOSEN ===

async function loadDosen() {
    const tableBody = document.getElementById('tabelDosen');
    if (!tableBody) return;

    try {
        const res = await fetch(`${API}/krs`);
        const data = await res.json();
        
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Belum ada pengajuan KRS masuk.</td></tr>';
            return;
        }

        let html = '';
        data.forEach(item => {
            const statusBadge = item.status === 'pending' ? 'bg-warning text-dark' : (item.status === 'approved' ? 'bg-success' : 'bg-danger');
            html += `<tr>
                <td class="fw-bold">${item.mahasiswaId ? item.mahasiswaId.nama : 'Tanpa Nama'}</td>
                <td>${item.namaMatkul}</td>
                <td><span class="badge ${statusBadge} p-2 text-uppercase">${item.status}</span></td>
                <td class="text-center">
                    <button class="btn btn-outline-success btn-sm me-1" onclick="updateKrs('${item._id}', 'approved')">
                        <i class="fa fa-check"></i> Approve
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="updateKrs('${item._id}', 'rejected')">
                        <i class="fa fa-times"></i> Reject
                    </button>
                </td>
            </tr>`;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Error Load Dosen:", err);
    }
}

// INI BAGIAN YANG DIPERBAGUS:
async function updateKrs(id, status) {
    if (!confirm(`Yakin ingin mengubah status menjadi ${status}?`)) return;

    try {
        const res = await fetch(`${API}/krs/update/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status: status })
        });

        if (res.ok) {
            alert(`Berhasil: KRS telah di-${status}`);
            loadDosen(); // Muat ulang tabel dosen tanpa refresh halaman
        } else {
            alert("Gagal memperbarui status.");
        }
    } catch (err) {
        console.error("Error Update KRS:", err);
        alert("Terjadi kesalahan koneksi ke server.");
    }
}

// === AUTO RUN ===
window.onload = () => {
    const path = window.location.pathname;
    if (path.includes('mahasiswa.html')) {
        loadKRSMahasiswa();
    } else if (path.includes('dosen.html')) {
        loadDosen();
    }
};
