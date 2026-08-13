import { query } from './db.js';

export async function validatePegawaiData(body, isUpdate = false, currentId = null) {
  const errors = {};

  const {
    nip, nama_pegawai, email, nomor_hp, tempat_lahir, tanggal_lahir,
    id_kecamatan, alamat_lengkap, jarak_rumah_kantor, status_kawin,
    jumlah_anak, tanggal_masuk, id_jabatan, id_departemen, status_kontrak,
    jenis_kelamin, status
  } = body || {};

  // 1. NIP Validation (required, min 8 digits, numeric only, no spaces)
  if (!nip) {
    errors.nip = 'NIP wajib diisi';
  } else if (!/^\d{8,}$/.test(nip)) {
    errors.nip = 'NIP minimal 8 digit angka tanpa spasi';
  } else {
    // Unique check
    let dupQuery = 'SELECT id FROM pegawai WHERE nip = ?';
    let dupParams = [nip];
    if (isUpdate && currentId) {
      dupQuery += ' AND id != ?';
      dupParams.push(currentId);
    }
    const dupRes = await query(dupQuery, dupParams);
    if (dupRes && dupRes.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'NIP sudah digunakan',
        data: { success: false, message: 'NIP sudah digunakan' }
      });
    }
  }

  // 2. Nama Pegawai Validation (required, letters, numbers, apostrophe, spaces)
  if (!nama_pegawai) {
    errors.nama_pegawai = 'Nama Pegawai wajib diisi';
  } else if (!/^[a-zA-Z0-9' ]+$/.test(nama_pegawai)) {
    errors.nama_pegawai = 'Nama Pegawai hanya boleh huruf, angka, tanda petik atas (\') dan spasi';
  }

  // 3. Email Validation (required, valid email)
  if (!email) {
    errors.email = 'Email wajib diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Format Email tidak valid';
  }

  // 4. Nomor HP Validation (required, international format +62...)
  if (!nomor_hp) {
    errors.nomor_hp = 'Nomor HP wajib diisi';
  } else if (!/^\+62\d+$/.test(nomor_hp)) {
    errors.nomor_hp = 'Nomor HP harus format internasional (+62...) tanpa spasi';
  }

  // 5. Tempat Lahir
  if (!tempat_lahir) {
    errors.tempat_lahir = 'Tempat Lahir wajib diisi';
  }

  // 6. Tanggal Lahir
  if (!tanggal_lahir || isNaN(Date.parse(tanggal_lahir))) {
    errors.tanggal_lahir = 'Tanggal Lahir wajib diisi dengan format tanggal yang valid';
  }

  // 7. Tanggal Masuk
  if (!tanggal_masuk || isNaN(Date.parse(tanggal_masuk))) {
    errors.tanggal_masuk = 'Tanggal Masuk wajib diisi dengan format tanggal yang valid';
  }

  // 8. Alamat Lengkap
  if (!alamat_lengkap) {
    errors.alamat_lengkap = 'Alamat Lengkap wajib diisi';
  }

  // 9. Jarak Rumah Kantor (numeric, max 2 digits)
  if (jarak_rumah_kantor !== undefined && jarak_rumah_kantor !== null && jarak_rumah_kantor !== '') {
    const numJarak = Number(jarak_rumah_kantor);
    if (isNaN(numJarak) || numJarak < 0 || numJarak > 99) {
      errors.jarak_rumah_kantor = 'Jarak Rumah-Kantor harus berupa angka maksimal 2 digit (0-99)';
    }
  }

  // 10. Jumlah Anak (numeric, max 2 digits)
  if (jumlah_anak !== undefined && jumlah_anak !== null && jumlah_anak !== '') {
    const numAnak = Number(jumlah_anak);
    if (isNaN(numAnak) || numAnak < 0 || numAnak > 99) {
      errors.jumlah_anak = 'Jumlah Anak harus berupa angka maksimal 2 digit (0-99)';
    }
  }

  // 11. Status Kawin Whitelist Enum
  const allowedStatusKawin = ['kawin', 'tidak kawin', 'duda', 'janda'];
  if (status_kawin && !allowedStatusKawin.includes(status_kawin.toLowerCase())) {
    errors.status_kawin = `Status Kawin harus salah satu dari: ${allowedStatusKawin.join(', ')}`;
  }

  // 12. Status Whitelist Enum
  const allowedStatus = ['Aktif', 'Nonaktif'];
  if (status && !allowedStatus.includes(status)) {
    errors.status = `Status harus salah satu dari: ${allowedStatus.join(', ')}`;
  }

  // 13. Status Kontrak Whitelist Enum
  const allowedKontrak = ['PKWT', 'PKWTT', 'Magang'];
  if (status_kontrak && !allowedKontrak.includes(status_kontrak)) {
    errors.status_kontrak = `Status Kontrak harus salah satu dari: ${allowedKontrak.join(', ')}`;
  }

  // 14. Jenis Kelamin Whitelist Enum
  const allowedJK = ['Laki-laki', 'Perempuan'];
  if (jenis_kelamin && !allowedJK.includes(jenis_kelamin)) {
    errors.jenis_kelamin = `Jenis Kelamin harus salah satu dari: ${allowedJK.join(', ')}`;
  }

  // 15. FK Validations
  if (id_kecamatan) {
    const kecRes = await query('SELECT id FROM master_wilayah WHERE id = ?', [id_kecamatan]);
    if (!kecRes || kecRes.length === 0) {
      errors.id_kecamatan = 'Kecamatan tidak ditemukan di master data';
    }
  }

  if (id_jabatan) {
    const jabRes = await query("SELECT id FROM master_data WHERE id = ? AND tipe = 'jabatan'", [id_jabatan]);
    if (!jabRes || jabRes.length === 0) {
      errors.id_jabatan = 'Jabatan tidak ditemukan di master data';
    }
  }

  if (id_departemen) {
    const depRes = await query("SELECT id FROM master_data WHERE id = ? AND tipe = 'departemen'", [id_departemen]);
    if (!depRes || depRes.length === 0) {
      errors.id_departemen = 'Departemen tidak ditemukan di master data';
    }
  }

  if (Object.keys(errors).length > 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: {
        success: false,
        message: 'Validation failed',
        errors
      }
    });
  }

  return true;
}
