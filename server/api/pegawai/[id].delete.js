import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event, 'Data Pegawai', 'delete');

  const id = event.context.params.id;

  // Check if employee exists
  const existingRes = await query('SELECT id FROM pegawai WHERE id = ?', [id]);
  if (!existingRes || existingRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Data Pegawai tidak ditemukan' });
  }

  // Check if superadmin employee (restriction from requirement)
  const checkUser = await query('SELECT u.id_role FROM user u WHERE u.id_pegawai = ?', [id]);
  if (checkUser && checkUser.length > 0 && checkUser[0].id_role === 1) {
    throw createError({ statusCode: 403, statusMessage: 'Dilarang menghapus data pegawai Superadmin' });
  }

  await query('DELETE FROM pegawai_pendidikan WHERE id_pegawai = ?', [id]);
  await query('DELETE FROM pegawai WHERE id = ?', [id]);
  
  await logActivity(event, user, 'Hapus Pegawai', `Menghapus data pegawai ID: ${id}`);
  
  return { success: true, message: 'Data pegawai berhasil dihapus' };
});
