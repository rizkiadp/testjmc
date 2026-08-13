import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event);

  const body = await readBody(event);
  const { id_pegawai, bulan, tahun, total_masuk } = body || {};

  // 1. Validation id_pegawai
  const pegawaiId = parseInt(id_pegawai);
  if (isNaN(pegawaiId)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { id_pegawai: 'Pegawai wajib dipilih' } }
    });
  }

  const pegawaiRes = await query('SELECT id, nama_pegawai FROM pegawai WHERE id = ?', [pegawaiId]);
  if (!pegawaiRes || pegawaiRes.length === 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { id_pegawai: 'Data pegawai tidak ditemukan' } }
    });
  }

  // 2. Validation bulan & tahun
  const b = parseInt(bulan);
  const t = parseInt(tahun);

  if (isNaN(b) || b < 1 || b > 12) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { bulan: 'Bulan harus antara 1 dan 12' } }
    });
  }

  if (isNaN(t) || t < 2000 || t > 2100) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { tahun: 'Tahun tidak valid' } }
    });
  }

  // 3. Validation total_masuk (Max days in specific month/year)
  const maxDaysInMonth = new Date(t, b, 0).getDate();
  const tm = parseInt(total_masuk);

  if (typeof total_masuk !== 'number' && typeof total_masuk !== 'string') {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { total_masuk: 'Total masuk harus berupa angka' } }
    });
  }

  if (isNaN(tm) || String(total_masuk).includes('.') || String(total_masuk).includes(',')) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { total_masuk: 'Total masuk harus berupa bilangan bulat (integer)' } }
    });
  }

  if (tm < 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { total_masuk: 'Total masuk tidak boleh negatif' } }
    });
  }

  if (tm > maxDaysInMonth) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { success: false, errors: { total_masuk: `Total masuk untuk bulan ${b}/${t} maksimal ${maxDaysInMonth} hari` } }
    });
  }

  // 4. Save or Update with Unique Constraint (id_pegawai + bulan + tahun)
  await query(
    `INSERT INTO total_masuk_pegawai (id_pegawai, bulan, tahun, total_masuk)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE total_masuk = VALUES(total_masuk), updated_at = NOW()`,
    [pegawaiId, b, t, tm]
  );

  await logActivity(
    event,
    user,
    'Input Total Masuk Pegawai',
    `Menyimpan total masuk ${tm} hari untuk ${pegawaiRes[0].nama_pegawai} (Periode ${b}/${t})`
  );

  return {
    success: true,
    message: `Berhasil menyimpan total masuk ${tm} hari untuk ${pegawaiRes[0].nama_pegawai}`
  };
});
