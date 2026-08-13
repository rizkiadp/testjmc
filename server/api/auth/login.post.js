import bcrypt from 'bcryptjs';
import { setCookie } from 'h3';
import { query } from '../../utils/db.js';
import { generateToken, logActivity } from '../../utils/auth.js';
import { verifyCaptcha } from './captcha.get.js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { identifier, password, captchaInput, captchaId, rememberMe } = body || {};

  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username/Email/No. HP dan Password wajib diisi'
    });
  }

  // 1. Strict Captcha Verification (No bypass) - Section 1 PRD 1.4
  if (!captchaInput || !captchaId || !verifyCaptcha(captchaId, captchaInput)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kode Captcha salah atau sudah kedaluwarsa'
    });
  }

  // 2. Query Murni dari Database MySQL / MariaDB (Tanpa Mock Fallback) - Section 1 PRD 1.4
  let users = [];
  try {
    users = await query(
      `SELECT u.*, r.nama_role 
       FROM user u 
       LEFT JOIN user_role r ON u.id_role = r.id 
       LEFT JOIN pegawai p ON u.id_pegawai = p.id
       WHERE u.username = ? OR u.email = ? OR u.nomor_hp = ? OR p.nomor_hp = ?`,
      [identifier, identifier, identifier, identifier]
    );
  } catch (dbErr) {
    console.error('DB Query Error:', dbErr.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal terhubung ke database'
    });
  }

  const user = users ? users[0] : null;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Kredensial login tidak ditemukan'
    });
  }

  // 3. Check Account Status (Must be active)
  if (user.disabled === 1) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akun Anda telah dinonaktifkan. Hubungi Administrator.'
    });
  }

  // 4. Verification HANYA Menggunakan bcrypt.compare(password, user.password_hash) - Section 1 PRD 1.4
  if (!user.password_hash) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Password yang Anda masukkan salah'
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Password yang Anda masukkan salah'
    });
  }

  // 5. Update Last Login in DB
  try {
    await query('UPDATE user SET last_login = NOW() WHERE id = ?', [user.id]);
  } catch (e) {}

  // 6. Synchronized Session Expiration (3m default or 7d remember me)
  const sessionDuration = rememberMe ? '7d' : '3m';
  const maxAgeSeconds = rememberMe ? 7 * 24 * 60 * 60 : 3 * 60;

  const tokenPayload = {
    id: user.id,
    username: user.username,
    nama: user.nama,
    role: user.nama_role,
    id_role: user.id_role,
    rememberMe: !!rememberMe
  };

  const token = generateToken(tokenPayload, sessionDuration);

  // Set Auth Cookie (httpOnly: true, secure in production, sameSite: lax) - Section 5 PRD 1.4
  const isProduction = process.env.NODE_ENV === 'production';
  setCookie(event, 'token', token, {
    httpOnly: true,
    secure: isProduction,
    path: '/',
    maxAge: maxAgeSeconds,
    sameSite: 'lax'
  });

  // 7. Log Activity
  try {
    await logActivity(event, user, 'Login System', `User ${user.username} berhasil login`);
  } catch (e) {}

  // Return clean response without token exposure - Section 4 PRD 1.4
  return {
    success: true,
    message: 'Login berhasil',
    user: {
      id: user.id,
      username: user.username,
      nama: user.nama,
      email: user.email,
      role: user.nama_role,
      id_role: user.id_role,
      rememberMe: !!rememberMe
    }
  };
});
