const API_URL = 'http://localhost:3000/downloads';

// 1. READ: Ambil dan render riwayat unduhan
async function loadHistory() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888;">Belum ada riwayat unduhan.</td></tr>';
      return;
    }

    data.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${item.title}</strong><br><small style="color: #666;">${item.url}</small></td>
        <td>${item.format}</td>
        <td><span class="badge ${item.status === 'selesai' ? 'bg-success' : 'bg-warning text-dark'}">${item.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary" style="margin-right: 4px;" onclick="updateStatus(${item.id})">Tandai Selesai</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteHistory(${item.id})">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Gagal mengambil data:', err);
  }
}

// 2. CREATE: Tambah unduhan baru (POST)
async function createDownload(url, format) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url,
        format: format,
        title: 'Video YouTube ' + format,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      const msg = Array.isArray(result.message) ? result.message.join('\n') : result.message;
      alert('Validasi / Error:\n' + msg);
      return;
    }

    alert('Berhasil! Unduhan berhasil ditambahkan ke riwayat.');
    loadHistory();
  } catch (err) {
    alert('Koneksi ke backend gagal. Pastikan server NestJS aktif di port 3000.');
  }
}

// 3. UPDATE: Ubah status unduhan (PATCH)
async function updateStatus(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'selesai' }),
    });

    if (res.ok) {
      loadHistory();
    } else {
      alert('Gagal memperbarui status');
    }
  } catch (err) {
    alert('Koneksi backend gagal');
  }
}

// 4. DELETE: Hapus riwayat unduhan (DELETE)
async function deleteHistory(id) {
  if (!confirm('Yakin ingin menghapus riwayat unduhan ini?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      loadHistory();
    } else {
      alert('Gagal menghapus data');
    }
  } catch (err) {
    alert('Koneksi backend gagal');
  }
}

// Pasang Event Listeners saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  loadHistory();

  // Form input atas
  const downloadForm = document.getElementById('download-form');
  if (downloadForm) {
    downloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const urlInput = document.getElementById('yt-url');
      const formatSelect = document.getElementById('format');
      const format = formatSelect ? formatSelect.value : 'mp4-720';
      if (!urlInput.value) return;
      createDownload(urlInput.value, format);
    });
  }

  // Form opsi unduh bawah
  const optionsForm = document.querySelector('form[action="/download"]');
  if (optionsForm) {
    optionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const urlInput = document.getElementById('yt-url');
      const formatSelect = document.getElementById('format');
      if (!urlInput || !urlInput.value) {
        alert('Silakan masukkan tautan URL YouTube di atas terlebih dahulu!');
        urlInput?.focus();
        return;
      }
      createDownload(urlInput.value, formatSelect.value);
    });
  }
});
