import { query } from '../../utils/db.js';
import { getAuthUser, logActivity, verifyCsrfToken } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  verifyCsrfToken(event);
  const user = await getAuthUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated / Sesi telah kedaluwarsa' });
  }

  const body = await readBody(event);
  const { nama, email } = body || {};

  if (!nama || !email) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { nama: 'Nama dan Email wajib diisi' } }
    });
  }

  // Update ONLY allowed fields for self profile (strips id_role, disabled, etc.)
  await query(
    'UPDATE user SET nama = ?, email = ? WHERE id = ?',
    [nama, email, user.id]
  );

  await logActivity(event, user, 'Update Profile', `User ${user.username} memperbarui data profil mandiri`);

  return {
    success: true,
    message: 'Profil berhasil diperbarui'
  };
});
