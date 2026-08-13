import bcrypt from 'bcryptjs';
import { query } from '../../utils/db.js';
import { getAuthUser, logActivity, verifyCsrfToken } from '../../utils/auth.js';
import { validatePasswordPolicy } from '../../utils/userValidation.js';

export default defineEventHandler(async (event) => {
  verifyCsrfToken(event);
  const user = await getAuthUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated / Sesi telah kedaluwarsa' });
  }

  const body = await readBody(event);
  const { currentPassword, newPassword, confirmPassword } = body || {};

  if (!currentPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password saat ini wajib diisi'
    });
  }

  if (!newPassword || !confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password baru dan Konfirmasi Password wajib diisi'
    });
  }

  // Confirm password check
  if (newPassword !== confirmPassword) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { confirmPassword: 'Konfirmasi password tidak cocok dengan password baru' } }
    });
  }

  // Password policy check
  const policyErr = validatePasswordPolicy(newPassword);
  if (policyErr) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { newPassword: policyErr } }
    });
  }

  // Fetch full user record from DB for password verification
  const dbUserRes = await query('SELECT * FROM user WHERE id = ?', [user.id]);
  if (!dbUserRes || dbUserRes.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'User tidak ditemukan' });
  }
  const dbUser = dbUserRes[0];

  // Verify current password
  const isCurrentValid = await bcrypt.compare(currentPassword, dbUser.password_hash);
  if (!isCurrentValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Password saat ini yang Anda masukkan salah'
    });
  }

  // Password reuse prevention: newPassword cannot equal currentPassword
  if (currentPassword === newPassword) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { newPassword: 'Password baru tidak boleh sama dengan password saat ini' } }
    });
  }

  // Hash new password & update DB
  const newHash = await bcrypt.hash(newPassword, 10);
  await query('UPDATE user SET password_hash = ? WHERE id = ?', [newHash, user.id]);

  await logActivity(event, user, 'Ubah Password', `User ${user.username} berhasil mengubah password mandiri`);

  return {
    success: true,
    message: 'Password berhasil diperbarui. Silakan login kembali dengan password baru Anda.'
  };
});
