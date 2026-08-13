import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  const user = await checkRole(event, 'Kelola User', 'read');

  const queryParams = getQuery(event);
  const search = queryParams.search || queryParams.q || '';
  const page = Math.max(1, parseInt(queryParams.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit || '10')));
  const offset = (page - 1) * limit;

  const roleId = queryParams.role || queryParams.id_role || '';

  let whereClauses = ['1=1'];
  let params = [];

  if (search) {
    whereClauses.push('(u.username LIKE ? OR u.nama LIKE ? OR u.email LIKE ? OR u.nomor_hp LIKE ? OR p.nama_pegawai LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (roleId) {
    whereClauses.push('u.id_role = ?');
    params.push(parseInt(roleId));
  }

  const whereSql = whereClauses.join(' AND ');

  const countRes = await query(
    `SELECT COUNT(u.id) as total 
     FROM user u 
     LEFT JOIN user_role r ON u.id_role = r.id
     WHERE ${whereSql}`,
    params
  );
  const total = countRes[0]?.total || 0;

  const rows = await query(
    `SELECT u.id, u.username, u.nama, u.email, u.nomor_hp, u.disabled, u.created_at, u.id_role, u.id_pegawai,
            r.nama_role, p.nama_pegawai, j.nama as nama_jabatan, d.nama as nama_departemen
     FROM user u
     LEFT JOIN user_role r ON u.id_role = r.id
     LEFT JOIN pegawai p ON u.id_pegawai = p.id
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     LEFT JOIN master_data d ON p.id_departemen = d.id
     WHERE ${whereSql}
     ORDER BY u.id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
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
