import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD');
  const user = await checkRole(event, 'Data Pegawai', 'read');

  const id = event.context.params.id;

  const pegawaiRes = await query(
    `SELECT p.*, j.nama as nama_jabatan, d.nama as nama_departemen,
            w.kecamatan, w.kabupaten, w.provinsi
     FROM pegawai p
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     LEFT JOIN master_data d ON p.id_departemen = d.id
     LEFT JOIN master_wilayah w ON p.id_kecamatan = w.id
     WHERE p.id = ?`,
    [id]
  );

  if (!pegawaiRes || pegawaiRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Data Pegawai tidak ditemukan' });
  }

  const pegawai = pegawaiRes[0];

  // Fetch pendidikan list
  const pendidikan = await query(
    `SELECT * FROM pegawai_pendidikan WHERE id_pegawai = ? ORDER BY id ASC`,
    [id]
  );

  pegawai.pendidikan = pendidikan;

  return {
    success: true,
    data: pegawai
  };
});
