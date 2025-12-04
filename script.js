document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mcuForm');
    const messageElement = document.getElementById('message');
    const submitButton = form.querySelector('.btn-submit');

    // URL GOOGLE APPS SCRIPT
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmzbJosB8UR6JdwspkwTJrYDeLq8XBxyC1rTJhT7ZByyHh1LS1ErfJCHr0m-ajf8Ua/exec';

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nipNik = document.getElementById('nip_nik').value.trim();
        const namaPeserta = document.getElementById('nama_peserta').value.trim();
        const departemen = document.getElementById('departemen').value.trim();
        const noHandphone = document.getElementById('no_handphone').value.trim();

        if (nipNik === '' || namaPeserta === '' || departemen === '' || noHandphone === '') {
            showMessage('⚠️ Semua kolom wajib diisi!', 'error');
            return;
        }

        const phoneRegex = /^\d{9,15}$/;
        if (!phoneRegex.test(noHandphone)) {
            showMessage('📵 Nomor handphone tidak valid (hanya angka 9–15 digit).', 'error');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = '⏳ Mengirim...';

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
                throw new Error(`Koneksi gagal. Status: ${response.status}`);
            }

            const result = await response.json();

            if (result && result.result === 'success') {

                /** PESAN SUKSES FIX */
                messageElement.style.display = 'block';
                messageElement.style.backgroundColor = '#d4edda';
                messageElement.style.color = '#155724';
                messageElement.style.border = '2px solid #28a745';
                messageElement.style.padding = '15px';
                messageElement.style.fontSize = '1.2rem';
                messageElement.style.fontWeight = 'bold';
                messageElement.style.textAlign = 'center';
                messageElement.style.borderRadius = '8px';
                messageElement.innerHTML = 
                `✅ DATA BERHASIL DISIMPAN.<br>
                📩 Hasil MCU akan dikirim melalui WhatsApp.`;

                form.reset();
            } else {
                throw new Error('Respon sistem tidak valid.');
            }

        } catch (error) {
            console.error(error);
            showMessage('❌ Gagal menyimpan! Periksa koneksi dan script Google.', 'error');
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
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #28a745';
        } else {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
        }
    }
});
