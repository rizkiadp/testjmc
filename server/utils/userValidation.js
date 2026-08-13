import { query } from './db.js';

export function validatePasswordPolicy(password) {
  if (!password) {
    return 'Password wajib diisi';
  }
  if (password.length < 8) {
    return 'Password minimal 8 karakter';
  }
  if (/\s/.test(password)) {
    return 'Password tidak boleh mengandung spasi';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password harus mengandung minimal 1 huruf besar (uppercase)';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password harus mengandung minimal 1 huruf kecil (lowercase)';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password harus mengandung minimal 1 karakter khusus / simbol';
  }
  return null;
}

export async function validateUsername(username, isUpdate = false, currentId = null) {
  if (!username) {
    return 'Username wajib diisi';
  }
  if (username.length < 6) {
    return 'Username minimal 6 karakter';
  }
  if (!/^[a-z0-9]+$/.test(username)) {
    return 'Username hanya boleh huruf kecil dan angka tanpa spasi atau simbol';
  }

  // Duplicate check
  let dupQuery = 'SELECT id FROM user WHERE username = ?';
  let dupParams = [username];
  if (isUpdate && currentId) {
    dupQuery += ' AND id != ?';
    dupParams.push(currentId);
  }

  const dupRes = await query(dupQuery, dupParams);
  if (dupRes && dupRes.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Username sudah digunakan',
      data: { success: false, message: 'Username sudah digunakan' }
    });
  }

  return null;
}
