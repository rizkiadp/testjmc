import pool, { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD');
  const user = await checkRole(event);

  const body = await readBody(event);
  const bulan = parseInt(body?.bulan || (new Date().getMonth() + 1));
  const tahun = parseInt(body?.tahun || new Date().getFullYear());

  // 1. Effective Date Check: Ambil setting di mana berlaku_mulai <= tanggal akhir bulan periode
  // Format tanggal akhir bulan: YYYY-MM-DD
  const lastDayOfMonth = new Date(tahun, bulan, 0).getDate();
  const periodeEndDate = `${tahun}-${String(bulan).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

  const settingRes = await query(
    `SELECT * FROM setting_tunjangan_transport 
     WHERE berlaku_mulai <= ? 
     ORDER BY berlaku_mulai DESC, id DESC 
     LIMIT 1`,
    [periodeEndDate]
  );

  // Tanpa fallback dummy palsu - Jika belum ada setting yang berlaku, lempar error HTTP 400
  if (!settingRes || settingRes.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Setting Tunjangan Transport yang berlaku untuk periode ${bulan}/${tahun} belum ditemukan. Silakan atur Setting Tunjangan terlebih dahulu.`
    });
  }

  const setting = settingRes[0];
  const baseFare = parseFloat(setting.tarif_per_km);
  const minKm = setting.min_km;
  const maxKm = setting.max_km;
  const minHari = setting.min_hari_masuk;

  // 2. Fetch Active Permanent Employees ('PKWTT' / Pegawai Tetap)
  const pegawaiList = await query(
    `SELECT id, nama_pegawai, jarak_rumah_kantor, status_kontrak 
     FROM pegawai 
     WHERE status = 'Aktif' AND (status_kontrak = 'PKWTT' OR status_kontrak IS NULL)`
  );

  let totalPenerima = 0;
  let totalNominal = 0;
  const detailData = [];

  // Hitung jumlah hari masuk presensi/aktivitas real untuk setiap pegawai pada periode tersebut
  for (const p of pegawaiList) {
    const rawJarak = p.jarak_rumah_kantor || 0;

    // Rule Pembulatan KM: < 0.5 ke bawah, >= 0.5 ke atas (Standard Math.round)
    const kmRounded = Math.round(rawJarak);

    // Ambil Total Masuk per Bulan dari data inputan bulanan pegawai (total_masuk_pegawai)
    const totalMasukRes = await query(
      `SELECT total_masuk 
       FROM total_masuk_pegawai 
       WHERE id_pegawai = ? AND bulan = ? AND tahun = ?`,
      [p.id, bulan, tahun]
    );

    const hariMasuk = totalMasukRes[0]?.total_masuk || 0;

    // Constraint Rule Check: Hari masuk >= min_hari_masuk & KM > min_km
    let nominal = 0;
    if (hariMasuk >= minHari && kmRounded > minKm) {
      // Batasi jarak maksimum sesuai max_km (misal 25 KM)
      const effectiveKm = Math.min(kmRounded, maxKm);
      nominal = baseFare * effectiveKm * hariMasuk;
    }

    if (nominal > 0) {
      totalPenerima += 1;
      totalNominal += nominal;
      detailData.push({
        id_pegawai: p.id,
        nama_pegawai: p.nama_pegawai,
        jarak_km: kmRounded,
        jumlah_hari: hariMasuk,
        nominal
      });
    }
  }

  // 3. DATABASE TRANSACTION (BEGIN / COMMIT / ROLLBACK)
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check existing header for this month/year
    const [headerCheck] = await connection.query(
      'SELECT id FROM tunjangan_transport WHERE bulan = ? AND tahun = ? FOR UPDATE',
      [bulan, tahun]
    );

    let headerId;
    if (headerCheck && headerCheck.length > 0) {
      headerId = headerCheck[0].id;
      await connection.query(
        `UPDATE tunjangan_transport SET total_penerima = ?, total_nominal = ?, updated_at = NOW() WHERE id = ?`,
        [totalPenerima, totalNominal, headerId]
      );
      await connection.query('DELETE FROM tunjangan_transport_detail WHERE id_tunjangan_transport = ?', [headerId]);
    } else {
      const [insertHeader] = await connection.query(
        `INSERT INTO tunjangan_transport (bulan, tahun, total_penerima, total_nominal) VALUES (?, ?, ?, ?)`,
        [bulan, tahun, totalPenerima, totalNominal]
      );
      headerId = insertHeader.insertId;
    }

    // Insert Detail Items
    for (const d of detailData) {
      await connection.query(
        `INSERT INTO tunjangan_transport_detail (id_tunjangan_transport, id_pegawai, jarak_km, jumlah_hari, nominal) 
         VALUES (?, ?, ?, ?, ?)`,
        [headerId, d.id_pegawai, d.jarak_km, d.jumlah_hari, d.nominal]
      );
    }

    // Commit Transaction
    await connection.commit();

    await logActivity(event, user, 'Hitung Tunjangan Transport', `Kalkulasi tunjangan transport periode ${bulan}/${tahun} selesai`);

    return {
      success: true,
      message: `Perhitungan tunjangan berhasil. Total penerima: ${totalPenerima}, Total nominal: Rp ${totalNominal.toLocaleString('id-ID')}`,
      data: {
        headerId,
        bulan,
        tahun,
        totalPenerima,
        totalNominal,
        detail: detailData
      }
    };
  } catch (err) {
    await connection.rollback();
    console.error('Tunjangan calculation transaction error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memproses transaksi perhitungan tunjangan transport'
    });
  } finally {
    connection.release();
  }
});
