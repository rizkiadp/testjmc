import { query } from '../../utils/db.js';
import { getAuthUser } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' });
  }

  const masterData = await query('SELECT * FROM master_data ORDER BY tipe, nama');
  const wilayah = await query('SELECT * FROM master_wilayah LIMIT 100');
  const roles = await query('SELECT * FROM user_role ORDER BY id');

  return {
    success: true,
    data: {
      masterData,
      wilayah,
      roles
    }
  };
});
