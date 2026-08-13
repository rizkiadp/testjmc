import { query } from '../../../utils/db.js';
import { requireRoles } from '../../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event);

  const list = await query('SELECT * FROM setting_tunjangan_transport ORDER BY berlaku_mulai DESC, id DESC');
  const activeSetting = list[0] || null;

  return {
    success: true,
    activeSetting,
    data: list
  };
});
