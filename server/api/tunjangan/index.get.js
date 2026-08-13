import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD');
  const user = await checkRole(event, 'Tunjangan Transport', 'read');

  const queryParams = getQuery(event);
  const tahun = queryParams.tahun || new Date().getFullYear();

  const rows = await query(
    `SELECT * FROM tunjangan_transport WHERE tahun = ? ORDER BY bulan ASC`,
    [tahun]
  );

  return {
    success: true,
    data: rows
  };
});
