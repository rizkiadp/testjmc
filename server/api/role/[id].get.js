import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  const user = await checkRole(event);

  const roleId = event.context.params.id;

  const roleRes = await query('SELECT * FROM user_role WHERE id = ?', [roleId]);
  if (!roleRes || roleRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Role tidak ditemukan' });
  }

  const permissions = await query(
    'SELECT * FROM role_permission WHERE id_role = ? ORDER BY modul_fitur ASC',
    [roleId]
  );

  return {
    success: true,
    data: {
      role: roleRes[0],
      permissions
    }
  };
});
