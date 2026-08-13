import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD');
  await checkRole(event);

  const queryParams = getQuery(event);
  const bulan = parseInt(queryParams.bulan || '8');
  const tahun = parseInt(queryParams.tahun || '2026');

  const rows = await query(
    `SELECT t.id, t.id_pegawai, t.bulan, t.tahun, t.total_masuk, t.updated_at,
            p.nama_pegawai, p.nip, j.nama as nama_jabatan
     FROM total_masuk_pegawai t
     INNER JOIN pegawai p ON t.id_pegawai = p.id
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     WHERE t.bulan = ? AND t.tahun = ?
     ORDER BY p.nama_pegawai ASC`,
    [bulan, tahun]
  );

  return {
    success: true,
    data: rows
  };
});
