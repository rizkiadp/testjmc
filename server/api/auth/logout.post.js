import { getAuthUser, logActivity, verifyCsrfToken } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  verifyCsrfToken(event);
  const user = await getAuthUser(event);

  if (user) {
    await logActivity(event, user, 'Logout System', `User ${user.username} logout dari aplikasi`);
  }

  deleteCookie(event, 'token', { path: '/' });

  return {
    success: true,
    message: 'Berhasil logout'
  };
});
