import { query } from '../../../utils/db.js';
import { requireRoles, logActivity } from '../../../utils/auth.js';
import { validateTunjanganSetting } from '../../../utils/settingValidation.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event);

  const id = parseInt(event.context.params.id);
  const body = await readBody(event);

  // Validate setting existence
  const existingRes = await query('SELECT id FROM setting_tunjangan_transport WHERE id = ?', [id]);
  if (!existingRes || existingRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Setting tunjangan tidak ditemukan' });
  }

  // Strict Validation Check (HTTP 422)
  validateTunjanganSetting(body || {});

  const { tarif_per_km, berlaku_mulai, min_km, max_km, min_hari_masuk } = body;

  await query(
    `UPDATE setting_tunjangan_transport SET 
       tarif_per_km = ?, berlaku_mulai = ?, min_km = ?, max_km = ?, min_hari_masuk = ?
     WHERE id = ?`,
    [tarif_per_km, berlaku_mulai, min_km, max_km, min_hari_masuk, id]
  );

  await logActivity(event, user, 'Setting Tunjangan', `Memperbarui ID setting tunjangan: ${id}`);

  return {
    success: true,
    message: 'Setting tunjangan transport berhasil diperbarui'
  };
});
