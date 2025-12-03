document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mcuForm');
    const messageElement = document.getElementById('message');
    const submitButton = form.querySelector('.btn-submit');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmzbJosB8UR6JdwspkwTJrYDeLq8XBxyC1rTJhT7ZByyHh1LS1ErfJCHr0m-ajf8Ua/exec';

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nipNik = document.getElementById('nip_nik').value.trim();
        const namaPeserta = document.getElementById('nama_peserta').value.trim();
        const departemen = document.getElementById('departemen').value.trim();
        const noHandphone = document.getElementById('no_handphone').value.trim();

        if (nipNik === '' || namaPeserta === '' || departemen === '' || noHandphone === '') {
            showMessage('Semua kolom WAJIB diisi!', 'error');
            return;
        }

        const phoneRegex = /^\d{9,15}$/;
        if (!phoneRegex.test(noHandphone)) {
            showMessage('Format No Handphone tidak valid (hanya angka, 9-15 digit).', 'error');
            return;
        }
        
        submitButton.disabled = true;
        submitButton.textContent = '⏳ Mengirim Data...';

        const formData = new FormData();
        formData.append('nip_nik', nipNik);
        formData.append('nama_peserta', namaPeserta);
        formData.append('departemen', departemen);
        formData.append('no_handphone', noHandphone);

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Gagal koneksi ke server. Status: ${response.status}`);
            }
            
            const result = await response.json();

            if (result && result.result === 'success') {
                showMessage(`✅ Data berhasil disimpan di baris #${result.row_added}!`, 'success');
                form.reset();
            } else {
                throw new Error('Respon server tidak valid.');
            }

        } catch (error) {
            console.error('Error:', error);
            showMessage('❌ Terjadi kesalahan. Pastikan Script & Deployment sudah aktif.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'SIMPAN DATA';
        }
    });

    function showMessage(msg, type) {
        messageElement.textContent = msg;
        messageElement.className = 'message-status';
        messageElement.style.display = 'block';

        if (type === 'success') {
            messageElement.classList.add('success');
        } else {
            messageElement.classList.add('error');
        }

        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
});

