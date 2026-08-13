import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  await checkRole(event);

  const id = event.context.params.id;

  const rows = await query(
    `SELECT u.id, u.username, u.nama, u.email, u.nomor_hp, u.disabled, u.created_at, u.id_role, u.id_pegawai,
            r.nama_role, p.nama_pegawai
     FROM user u
     LEFT JOIN user_role r ON u.id_role = r.id
     LEFT JOIN pegawai p ON u.id_pegawai = p.id
     WHERE u.id = ?`,
    [id]
  );

  if (!rows || rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' });
  }

  return {
    success: true,
    data: rows[0]
  };
});
