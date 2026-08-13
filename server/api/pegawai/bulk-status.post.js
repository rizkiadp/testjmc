import pool, { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event, 'Data Pegawai', 'update');

  const body = await readBody(event);
  const { ids, status } = body || {};

  if (!Array.isArray(ids) || ids.length === 0 || !['Aktif', 'Nonaktif'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Payload bulk status tidak valid' });
  }

  // Sanitize IDs (array of numbers)
  const validIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
  if (validIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID pegawai tidak valid' });
  }

  // Get a connection for ACID Transaction
  const connection = await pool.getConnection();

  try {
    // 1. BEGIN TRANSACTION
    await connection.beginTransaction();

    // 2. Validate all target employees exist
    const placeholders = validIds.map(() => '?').join(',');
    const [existing] = await connection.query(
      `SELECT id FROM pegawai WHERE id IN (${placeholders}) FOR UPDATE`,
      validIds
    );

    if (!existing || existing.length !== validIds.length) {
      await connection.rollback();
      throw createError({
        statusCode: 404,
        statusMessage: 'Sebagian atau seluruh data pegawai target tidak ditemukan'
      });
    }

    // 3. UPDATE BULK STATUS PEGAWAI & SYNC ACCOUNT USER
    await connection.query(
      `UPDATE pegawai SET status = ?, updated_at = NOW() WHERE id IN (${placeholders})`,
      [status, ...validIds]
    );

    const userDisabledVal = status === 'Nonaktif' ? 1 : 0;
    await connection.query(
      `UPDATE user SET disabled = ?, updated_at = NOW() WHERE id_pegawai IN (${placeholders})`,
      [userDisabledVal, ...validIds]
    );

    // 4. COMMIT TRANSACTION
    await connection.commit();

    await logActivity(event, user, 'Bulk Update Status Pegawai', `Berhasil mengubah status pegawai menjadi ${status} untuk ID: ${validIds.join(', ')}`);

    return {
      success: true,
      message: `Berhasil mengubah status ${validIds.length} pegawai menjadi ${status}`
    };
  } catch (err) {
    // ROLLBACK ON ERROR
    await connection.rollback();
    if (err.statusCode) throw err;
    console.error('Bulk status transaction error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memperbarui status masal pegawai'
    });
  } finally {
    // Release connection back to pool
    connection.release();
  }
});
