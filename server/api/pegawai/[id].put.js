import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';
import { validatePegawaiData } from '../../utils/pegawaiValidation.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event, 'Data Pegawai', 'update');

  const id = event.context.params.id;
  const body = await readBody(event);

  // Validate employee existence
  const existingRes = await query('SELECT id FROM pegawai WHERE id = ?', [id]);
  if (!existingRes || existingRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Data Pegawai tidak ditemukan' });
  }

  // Validate request body (HTTP 422 / HTTP 409)
  await validatePegawaiData(body, true, id);

  const {
    nip, nama_pegawai, email, nomor_hp, tempat_lahir, tanggal_lahir,
    id_kecamatan, alamat_lengkap, jarak_rumah_kantor, status_kawin,
    jumlah_anak, tanggal_masuk, id_jabatan, id_departemen, status_kontrak,
    jenis_kelamin, status, foto_pegawai, pendidikan
  } = body || {};

  let usia = 0;
  if (tanggal_lahir) {
    const birthDate = new Date(tanggal_lahir);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    usia = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  await query(
    `UPDATE pegawai SET 
       nip = ?, nama_pegawai = ?, email = ?, nomor_hp = ?, tempat_lahir = ?,
       tanggal_lahir = ?, id_kecamatan = ?, alamat_lengkap = ?, jarak_rumah_kantor = ?,
       status_kawin = ?, jumlah_anak = ?, tanggal_masuk = ?, id_jabatan = ?,
       id_departemen = ?, status_kontrak = ?, jenis_kelamin = ?, usia = ?,
       status = ?, foto_pegawai = ?
     WHERE id = ?`,
    [
      nip, nama_pegawai, email, nomor_hp, tempat_lahir, tanggal_lahir,
      id_kecamatan || null, alamat_lengkap || null, jarak_rumah_kantor || 0,
      status_kawin || 'tidak kawin', jumlah_anak || 0, tanggal_masuk,
      id_jabatan || null, id_departemen || null, status_kontrak || 'PKWTT',
      jenis_kelamin || 'Laki-laki', usia, status || 'Aktif', foto_pegawai || null,
      id
    ]
  );

  // Update pendidikan: delete old & insert new
  await query('DELETE FROM pegawai_pendidikan WHERE id_pegawai = ?', [id]);
  if (Array.isArray(pendidikan) && pendidikan.length > 0) {
    for (const p of pendidikan) {
      if (p.tingkat_pendidikan && p.nama_sekolah) {
        await query(
          `INSERT INTO pegawai_pendidikan (id_pegawai, tingkat_pendidikan, nama_sekolah, tahun_lulus) VALUES (?, ?, ?, ?)`,
          [id, p.tingkat_pendidikan, p.nama_sekolah, p.tahun_lulus || null]
        );
      }
    }
  }

  await logActivity(event, user, 'Update Pegawai', `Memperbarui data pegawai ID: ${id}`);

  return { success: true, message: 'Data pegawai berhasil diperbarui' };
});
