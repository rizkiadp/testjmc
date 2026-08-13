import { query } from '../../utils/db.js';
import { requireRoles, logActivity } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD');
  const user = await checkRole(event, 'Data Pegawai', 'read');

  const queryParams = getQuery(event);
  const page = parseInt(queryParams.page || '1');
  const limit = parseInt(queryParams.limit || '10');
  const offset = (page - 1) * limit;

  const search = queryParams.search || '';
  const jabatanId = queryParams.jabatan || '';
  const minMasaKerja = queryParams.minMasaKerja ? parseInt(queryParams.minMasaKerja) : null;
  const maxMasaKerja = queryParams.maxMasaKerja ? parseInt(queryParams.maxMasaKerja) : null;
  const statusKontrak = queryParams.statusKontrak || '';
  const sortBy = queryParams.sortBy || 'id';
  const sortDir = queryParams.sortDir === 'asc' ? 'ASC' : 'DESC';

  let whereClauses = ['1=1'];
  let params = [];

  if (search) {
    whereClauses.push('(p.nama_pegawai LIKE ? OR p.nip LIKE ? OR j.nama LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (jabatanId) {
    const ids = jabatanId.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    if (ids.length > 0) {
      whereClauses.push(`p.id_jabatan IN (${ids.map(() => '?').join(',')})`);
      params.push(...ids);
    }
  }

  if (statusKontrak) {
    whereClauses.push('p.status_kontrak = ?');
    params.push(statusKontrak);
  }

  // SQL WHERE clause for Masa Kerja (TIMESTAMPDIFF in SQL)
  if (minMasaKerja !== null) {
    whereClauses.push('TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) >= ?');
    params.push(minMasaKerja);
  }

  if (maxMasaKerja !== null) {
    whereClauses.push('TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) <= ?');
    params.push(maxMasaKerja);
  }

  const whereSql = whereClauses.join(' AND ');

  // Allowed sort columns map
  const sortMap = {
    nip: 'p.nip',
    nama: 'p.nama_pegawai',
    jabatan: 'j.nama',
    tanggal_masuk: 'p.tanggal_masuk',
    masa_kerja: 'p.tanggal_masuk',
    id: 'p.id'
  };
  const sortColumn = sortMap[sortBy] || 'p.id';

  // Count total records AFTER masa kerja filtering
  const countRes = await query(
    `SELECT COUNT(p.id) as total 
     FROM pegawai p 
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     WHERE ${whereSql}`,
    params
  );
  const total = countRes[0]?.total || 0;

  // Fetch paginated data AFTER masa kerja filtering
  const sql = `
    SELECT 
      p.id, p.nip, p.nama_pegawai, p.email, p.nomor_hp, p.tanggal_masuk, p.status, p.status_kontrak, p.foto_pegawai,
      j.nama as nama_jabatan, d.nama as nama_departemen, w.kecamatan, w.kabupaten, w.provinsi,
      TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) as masa_kerja_tahun
    FROM pegawai p
    LEFT JOIN master_data j ON p.id_jabatan = j.id
    LEFT JOIN master_data d ON p.id_departemen = d.id
    LEFT JOIN master_wilayah w ON p.id_kecamatan = w.id
    WHERE ${whereSql}
    ORDER BY ${sortColumn} ${sortDir}
    LIMIT ? OFFSET ?
  `;

  let rows = await query(sql, [...params, limit, offset]);

  await logActivity(event, user, 'View Data Pegawai', `Melihat daftar pegawai page ${page}`);

  return {
    success: true,
    data: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
});
