import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';
import { validateUsername } from '../../utils/userValidation.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  const user = await checkRole(event);

  const id = parseInt(event.context.params.id);
  const body = await readBody(event);
  const { id_role, id_pegawai, nama, email, username, disabled } = body || {};

  // Check target user exists
  const targetRes = await query('SELECT * FROM user WHERE id = ?', [id]);
  if (!targetRes || targetRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' });
  }
  const targetUser = targetRes[0];

  // Self protection 1: Superadmin cannot deactivate self
  if (id === user.id && (disabled === 1 || disabled === true)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Anda tidak dapat menonaktifkan akun Anda sendiri'
    });
  }

  // Self protection 2: Superadmin cannot demote self from Superadmin role
  if (id === user.id && id_role !== undefined && parseInt(id_role) !== 1) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Anda tidak dapat mengubah role Anda sendiri menjadi selain Superadmin'
    });
  }

  // Protection 3: Check if demoting/deactivating the last active Superadmin
  if (targetUser.id_role === 1 && (parseInt(id_role) !== 1 || disabled === 1 || disabled === true)) {
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

  // Validate username if provided
  if (username && username !== targetUser.username) {
    const usernameError = await validateUsername(username, true, id);
    if (usernameError) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation failed',
        data: { success: false, message: 'Validation failed', errors: { username: usernameError } }
      });
    }
  }

  // Validate id_pegawai if provided
  let pegawaiData = null;
  if (id_pegawai) {
    const pegawaiRes = await query('SELECT id, nama_pegawai, email, nomor_hp FROM pegawai WHERE id = ?', [id_pegawai]);
    if (!pegawaiRes || pegawaiRes.length === 0) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation failed',
        data: { success: false, message: 'Validation failed', errors: { id_pegawai: 'Data pegawai tidak ditemukan di database' } }
      });
    }
    pegawaiData = pegawaiRes[0];
  }

  // Role ID & Official Role Name Whitelist Validation (HTTP 422)
  if (id_role) {
    const roleRes = await query('SELECT id, nama_role FROM user_role WHERE id = ?', [id_role]);
    const officialRoles = ['Superadmin', 'Manager HRD', 'Admin HRD'];

    if (!roleRes || roleRes.length === 0 || !officialRoles.includes(roleRes[0].nama_role)) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation failed',
        data: { success: false, message: 'Validation failed', errors: { id_role: 'Role aplikasi harus salah satu dari: Superadmin, Manager HRD, Admin HRD' } }
      });
    }
  }

  const newDisabledStatus = disabled !== undefined ? (disabled ? 1 : 0) : targetUser.disabled;

  await query(
    `UPDATE user SET 
       id_role = ?, id_pegawai = ?, nama = ?, email = ?, username = ?, disabled = ?
     WHERE id = ?`,
    [
      id_role || targetUser.id_role,
      id_pegawai !== undefined ? id_pegawai : targetUser.id_pegawai,
      pegawaiData ? pegawaiData.nama_pegawai : (nama || targetUser.nama),
      pegawaiData && pegawaiData.email ? pegawaiData.email : (email !== undefined ? email : targetUser.email),
      username || targetUser.username,
      newDisabledStatus,
      id
    ]
  );

  // Synchronize status with linked pegawai if exists
  const targetPegawaiId = id_pegawai !== undefined ? id_pegawai : targetUser.id_pegawai;
  if (targetPegawaiId) {
    const newPegawaiStatus = newDisabledStatus === 1 ? 'Nonaktif' : 'Aktif';
    await query('UPDATE pegawai SET status = ? WHERE id = ?', [newPegawaiStatus, targetPegawaiId]);
  }

  await logActivity(event, user, 'Update User', `Memperbarui data user ID: ${id}`);

  return {
    success: true,
    message: 'Data user berhasil diperbarui'
  };
});
