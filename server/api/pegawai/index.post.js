import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';
import { validatePegawaiData } from '../../utils/pegawaiValidation.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event, 'Data Pegawai', 'create');

  const body = await readBody(event);
  
  // Comprehensive Backend Validations (HTTP 422 & HTTP 409)
  await validatePegawaiData(body, false);

  const {
    nip, nama_pegawai, email, nomor_hp, tempat_lahir, tanggal_lahir,
    id_kecamatan, alamat_lengkap, jarak_rumah_kantor, status_kawin,
    jumlah_anak, tanggal_masuk, id_jabatan, id_departemen, status_kontrak,
    jenis_kelamin, status, foto_pegawai, pendidikan
  } = body || {};

  // Calculate age automatically from tanggal_lahir
  let usia = 0;
  if (tanggal_lahir) {
    const birthDate = new Date(tanggal_lahir);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    usia = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  // Insert pegawai
  const result = await query(
    `INSERT INTO pegawai 
     (nip, nama_pegawai, email, nomor_hp, tempat_lahir, tanggal_lahir, id_kecamatan, alamat_lengkap,
      jarak_rumah_kantor, status_kawin, jumlah_anak, tanggal_masuk, id_jabatan, id_departemen,
      status_kontrak, jenis_kelamin, usia, status, foto_pegawai)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nip, nama_pegawai, email, nomor_hp, tempat_lahir, tanggal_lahir,
      id_kecamatan || null, alamat_lengkap || null, jarak_rumah_kantor || 0,
      status_kawin || 'tidak kawin', jumlah_anak || 0, tanggal_masuk,
      id_jabatan || null, id_departemen || null, status_kontrak || 'PKWTT',
      jenis_kelamin || 'Laki-laki', usia, status || 'Aktif', foto_pegawai || null
    ]
  );

  const pegawaiId = result.insertId;

  // Insert dinamis pendidikan if provided
  if (Array.isArray(pendidikan) && pendidikan.length > 0) {
    for (const p of pendidikan) {
      if (p.tingkat_pendidikan && p.nama_sekolah) {
        await query(
          `INSERT INTO pegawai_pendidikan (id_pegawai, tingkat_pendidikan, nama_sekolah, tahun_lulus) VALUES (?, ?, ?, ?)`,
          [pegawaiId, p.tingkat_pendidikan, p.nama_sekolah, p.tahun_lulus || null]
        );
      }
    }
  }

  await logActivity(event, user, 'Tambah Pegawai', `Menambahkan data pegawai baru: ${nama_pegawai} (${nip})`);

  return {
    success: true,
    message: 'Data pegawai berhasil disimpan',
    id: pegawaiId
  };
});
