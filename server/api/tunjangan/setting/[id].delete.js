import { query } from '../../../utils/db.js';
import { requireRoles, logActivity } from '../../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event);

  const id = parseInt(event.context.params.id);

  const existingRes = await query('SELECT id FROM setting_tunjangan_transport WHERE id = ?', [id]);
  if (!existingRes || existingRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Setting tunjangan tidak ditemukan' });
  }

  await query('DELETE FROM setting_tunjangan_transport WHERE id = ?', [id]);

  await logActivity(event, user, 'Setting Tunjangan', `Menghapus ID setting tunjangan: ${id}`);

  return {
    success: true,
    message: 'Setting tunjangan transport berhasil dihapus'
  };
});
