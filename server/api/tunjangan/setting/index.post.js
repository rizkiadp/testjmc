import { query } from '../../../utils/db.js';
import { requireRoles, logActivity } from '../../../utils/auth.js';
import { validateTunjanganSetting } from '../../../utils/settingValidation.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event, 'Setting Tunjangan', 'create');

  const body = await readBody(event);
  
  // Strict Validation Check (HTTP 422)
  validateTunjanganSetting(body || {});

  const { tarif_per_km, berlaku_mulai, min_km, max_km, min_hari_masuk } = body;

  const result = await query(
    `INSERT INTO setting_tunjangan_transport (tarif_per_km, berlaku_mulai, min_km, max_km, min_hari_masuk) 
     VALUES (?, ?, ?, ?, ?)`,
    [tarif_per_km, berlaku_mulai, min_km, max_km, min_hari_masuk]
  );

  await logActivity(event, user, 'Setting Tunjangan', `Memperbarui setting tarif tunjangan transport menjadi Rp ${tarif_per_km}`);

  return {
    success: true,
    message: 'Setting tunjangan transport berhasil disimpan',
    id: result.insertId
  };
});
