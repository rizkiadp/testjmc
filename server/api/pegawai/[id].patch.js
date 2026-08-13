import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event);

  const id = event.context.params.id;
  const body = await readBody(event);
  const { status } = body || {};

  const allowedStatus = ['Aktif', 'Nonaktif'];
  if (!status || !allowedStatus.includes(status)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: {
        success: false,
        message: 'Validation failed',
        errors: { status: 'Status harus Aktif atau Nonaktif' }
      }
    });
  }

  // Check if employee exists
  const existingRes = await query('SELECT id FROM pegawai WHERE id = ?', [id]);
  if (!existingRes || existingRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Data Pegawai tidak ditemukan' });
  }

  await query('UPDATE pegawai SET status = ? WHERE id = ?', [status, id]);

  // Synchronize user account disabled status if linked user exists
  const isUserDisabled = status === 'Nonaktif' ? 1 : 0;
  await query('UPDATE user SET disabled = ? WHERE id_pegawai = ?', [isUserDisabled, id]);

  await logActivity(event, user, 'Update Status Pegawai', `Ubah status pegawai ID ${id} menjadi ${status}`);

  return { success: true, message: `Status pegawai berhasil diubah menjadi ${status}` };
});
