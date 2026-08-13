import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  const user = await checkRole(event);

  const id = parseInt(event.context.params.id);

  // Check target user exists
  const targetRes = await query('SELECT * FROM user WHERE id = ?', [id]);
  if (!targetRes || targetRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' });
  }
  const targetUser = targetRes[0];

  // Self protection: Superadmin cannot delete self
  if (id === user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Anda tidak dapat menghapus akun Anda sendiri'
    });
  }

  // Protection: Cannot delete last active Superadmin
  if (targetUser.id_role === 1 && (targetUser.disabled === 0 || targetUser.disabled === null)) {
    const superadmins = await query(
      'SELECT COUNT(id) as total FROM user WHERE id_role = 1 AND (disabled = 0 OR disabled IS NULL)'
    );
    if (superadmins[0]?.total <= 1) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Tindakan ditolak. Sistem harus memiliki minimal satu akun Superadmin yang aktif.'
      });
    }
  }

  await query('DELETE FROM user WHERE id = ?', [id]);
  await logActivity(event, user, 'Hapus User', `Menghapus user ${targetUser.username} (ID: ${id})`);

  return {
    success: true,
    message: 'User berhasil dihapus'
  };
});
