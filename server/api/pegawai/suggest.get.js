import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD', 'Superadmin');
  await checkRole(event);

  const queryParams = getQuery(event);
  const q = queryParams.q || '';

  if (!q || q.length < 2) {
    return { success: true, data: [] };
  }

  const pegawai = await query(
    `SELECT p.id, p.nama_pegawai, p.nip, j.nama as nama_jabatan, d.nama as nama_departemen
     FROM pegawai p
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     LEFT JOIN master_data d ON p.id_departemen = d.id
     WHERE p.status = 'Aktif' AND (p.nama_pegawai LIKE ? OR p.nip LIKE ?)
     LIMIT 10`,
    [`%${q}%`, `%${q}%`]
  );

  return { success: true, data: pegawai };
});
