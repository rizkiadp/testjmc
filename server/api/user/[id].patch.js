import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  const user = await checkRole(event);

  const id = parseInt(event.context.params.id);
  const body = await readBody(event);
  const { disabled, status } = body || {};

  const isDisabled = disabled !== undefined ? (disabled ? 1 : 0) : (status === 'Inactive' || status === 'Nonaktif' ? 1 : 0);

  // Check target user
  const targetRes = await query('SELECT * FROM user WHERE id = ?', [id]);
  if (!targetRes || targetRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' });
  }
  const targetUser = targetRes[0];

  // Self protection: Superadmin cannot deactivate self
  if (id === user.id && isDisabled === 1) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Anda tidak dapat menonaktifkan akun Anda sendiri'
    });
  }

  // Protection: Cannot deactivate last Superadmin
  if (targetUser.id_role === 1 && isDisabled === 1) {
    const activeSuperadmins = await query(
      'SELECT COUNT(id) as total FROM user WHERE id_role = 1 AND (disabled = 0 OR disabled IS NULL)'
    );
    if (activeSuperadmins[0]?.total <= 1) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Tindakan ditolak. Sistem harus memiliki minimal satu Superadmin aktif.'
      });
    }
  }

  await query('UPDATE user SET disabled = ? WHERE id = ?', [isDisabled, id]);

  // Synchronize status with linked pegawai if exists
  if (targetUser.id_pegawai) {
    const newPegawaiStatus = isDisabled === 1 ? 'Nonaktif' : 'Aktif';
    await query('UPDATE pegawai SET status = ? WHERE id = ?', [newPegawaiStatus, targetUser.id_pegawai]);
  }

  await logActivity(event, user, 'Ubah Status User', `Ubah status user ${targetUser.username} menjadi ${isDisabled ? 'Nonaktif' : 'Aktif'}`);

  return {
    success: true,
    message: `Status user berhasil diubah menjadi ${isDisabled ? 'Nonaktif' : 'Aktif'}`
  };
});
