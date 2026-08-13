import bcrypt from 'bcryptjs';
import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';
import { validateUsername, validatePasswordPolicy } from '../../utils/userValidation.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Superadmin');
  const user = await checkRole(event, 'Kelola User', 'create');

  const body = await readBody(event);
  const { id_pegawai, nama, username, password, id_role, disabled } = body || {};

  // 1. Validasi id_pegawai wajib & harus ada di database pegawai
  if (!id_pegawai) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { id_pegawai: 'Pegawai wajib dipilih' } }
    });
  }

  const pegawaiRes = await query('SELECT id, nama_pegawai, email, nomor_hp FROM pegawai WHERE id = ?', [id_pegawai]);
  if (!pegawaiRes || pegawaiRes.length === 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { id_pegawai: 'Data pegawai tidak ditemukan di database' } }
    });
  }
  const pegawaiData = pegawaiRes[0];

  // 2. Username validation
  const usernameError = await validateUsername(username, false);
  if (usernameError) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { username: usernameError } }
    });
  }

  // 3. Password policy validation
  const passwordError = validatePasswordPolicy(password);
  if (passwordError) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { password: passwordError } }
    });
  }

  // 4. Role ID & Official Role Name Whitelist Validation (HTTP 422)
  const roleRes = await query('SELECT id, nama_role FROM user_role WHERE id = ?', [id_role]);
  const officialRoles = ['Superadmin', 'Manager HRD', 'Admin HRD'];
  
  if (!roleRes || roleRes.length === 0 || !officialRoles.includes(roleRes[0].nama_role)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, message: 'Validation failed', errors: { id_role: 'Role aplikasi harus salah satu dari: Superadmin, Manager HRD, Admin HRD' } }
    });
  }

  // 5. Hash password with bcrypt
  const password_hash = await bcrypt.hash(password, 10);

  // 6. Insert user (Ambil nama asli dari database pegawai)
  const result = await query(
    `INSERT INTO user (id_role, id_pegawai, username, password_hash, nama, email, nomor_hp, disabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_role,
      id_pegawai,
      username,
      password_hash,
      pegawaiData.nama_pegawai,
      pegawaiData.email || null,
      pegawaiData.nomor_hp || null,
      disabled ? 1 : 0
    ]
  );

  await logActivity(event, user, 'Tambah User', `Menambahkan user baru: ${username} (${roleRes[0].nama_role})`);

  return {
    success: true,
    message: 'User baru berhasil ditambahkan',
    id: result.insertId
  };
});
