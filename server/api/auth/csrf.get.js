import crypto from 'crypto';
import { setCookie } from 'h3';

export default defineEventHandler((event) => {
  // Generate cryptographically secure random CSRF token
  const csrfToken = crypto.randomBytes(32).toString('hex');

  // Set httpOnly: false CSRF cookie so frontend JS can read XSRF-TOKEN or header
  setCookie(event, 'XSRF-TOKEN', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60
  });

  return {
    success: true,
    csrfToken
  };
});
