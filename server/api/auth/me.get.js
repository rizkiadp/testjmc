import { getAuthUser } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthenticated / Sesi telah kedaluwarsa'
    });
  }

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      nama: user.nama,
      email: user.email,
      role: user.nama_role,
      id_role: user.id_role,
      rememberMe: user.rememberMe || false
    }
  };
});
