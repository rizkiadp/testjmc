import { query } from '../../utils/db.js';
import { getAuthUser } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' });
  }

  // Common response for all roles
  const welcomeMessage = `Selamat Datang ${user.nama} - ${user.nama_role}`;

  // Dashboard widgets only for Manager HRD
  if (user.nama_role !== 'Manager HRD') {
    return {
      success: true,
      welcomeMessage,
      widgets: null
    };
  }

  // MANAGER HRD SPECIFIC DASHBOARD WIDGETS
  const totalPegawaiRes = await query("SELECT COUNT(id) as total FROM pegawai WHERE status = 'Aktif'");
  const totalKontrakRes = await query("SELECT COUNT(id) as total FROM pegawai WHERE status = 'Aktif' AND status_kontrak = 'PKWT'");
  const totalTetapRes = await query("SELECT COUNT(id) as total FROM pegawai WHERE status = 'Aktif' AND (status_kontrak = 'PKWTT' OR status_kontrak IS NULL)");
  const totalMagangRes = await query("SELECT COUNT(id) as total FROM pegawai WHERE status = 'Aktif' AND status_kontrak = 'Magang'");

  const totalPriaRes = await query("SELECT COUNT(id) as total FROM pegawai WHERE status = 'Aktif' AND (jenis_kelamin = 'Laki-laki' OR jenis_kelamin IS NULL)");
  const totalWanitaRes = await query("SELECT COUNT(id) as total FROM pegawai WHERE status = 'Aktif' AND jenis_kelamin = 'Perempuan'");

  const terbaruRes = await query(
    `SELECT p.id, p.nip, p.nama_pegawai, p.tanggal_masuk, p.status_kontrak, j.nama as nama_jabatan
     FROM pegawai p
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     ORDER BY p.tanggal_masuk DESC 
     LIMIT 5`
  );

  return {
    success: true,
    welcomeMessage,
    widgets: {
      totalPegawai: totalPegawaiRes[0]?.total || 0,
      totalKontrak: totalKontrakRes[0]?.total || 0,
      totalTetap: totalTetapRes[0]?.total || 0,
      totalMagang: totalMagangRes[0]?.total || 0,
      chartStatusKontrak: {
        labels: ['Pegawai Tetap (PKWTT)', 'Pegawai Kontrak (PKWT)', 'Magang'],
        series: [
          totalTetapRes[0]?.total || 0,
          totalKontrakRes[0]?.total || 0,
          totalMagangRes[0]?.total || 0
        ]
      },
      chartJenisKelamin: {
        labels: ['Laki-laki', 'Perempuan'],
        series: [
          totalPriaRes[0]?.total || 0,
          totalWanitaRes[0]?.total || 0
        ]
      },
      pegawaiTerbaru: terbaruRes
    }
  };
});
