import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  const user = await checkRole(event);

  const queryParams = getQuery(event);
  const page = parseInt(queryParams.page || '1');
  const limit = parseInt(queryParams.limit || '15');
  const offset = (page - 1) * limit;

  const countRes = await query('SELECT COUNT(id) as total FROM activities');
  const total = countRes[0]?.total || 0;

  const rows = await query(
    `SELECT a.*, u.username, u.nama as nama_user, r.nama_role
     FROM activities a
     LEFT JOIN user u ON a.created_by = u.id
     LEFT JOIN user_role r ON u.id_role = r.id
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return {
    success: true,
    data: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
});
