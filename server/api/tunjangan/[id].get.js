import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD');
  const user = await checkRole(event);

  const headerId = event.context.params.id;

  // Get header data
  const headerRes = await query(
    'SELECT id, bulan, tahun, total_penerima, total_nominal FROM tunjangan_transport WHERE id = ?',
    [headerId]
  );

  if (!headerRes || headerRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Data tunjangan tidak ditemukan' });
  }

  const header = headerRes[0];

  // Query params for search, sort, pagination
  const queryParams = getQuery(event);
  const search = queryParams.search || '';
  const sortBy = queryParams.sortBy || 'id';
  const sortDir = queryParams.sortDir === 'asc' ? 'ASC' : 'DESC';
  const page = Math.max(1, parseInt(queryParams.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit) || 25));
  const offset = (page - 1) * limit;

  // Whitelist sort fields (Section 20 PRD 1.4)
  const allowedSortFields = {
    nama: 'p.nama_pegawai',
    km: 'd.jarak_km',
    hari: 'd.jumlah_hari',
    nominal: 'd.nominal',
    id: 'd.id'
  };
  const sortColumn = allowedSortFields[sortBy] || 'd.id';

  // Build WHERE clause with parameterized search (Section 19 PRD 1.4)
  let whereSql = 'd.id_tunjangan_transport = ?';
  let params = [headerId];

  if (search) {
    whereSql += ' AND p.nama_pegawai LIKE ?';
    params.push('%' + search + '%');
  }

  // Count total for pagination
  const countRes = await query(
    `SELECT COUNT(*) as total FROM tunjangan_transport_detail d
     LEFT JOIN pegawai p ON d.id_pegawai = p.id
     WHERE ${whereSql}`,
    params
  );
  const total = countRes[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Fetch detail rows with pagination
  const rows = await query(
    `SELECT d.id, d.id_pegawai, d.id_pegawai as employee_id, p.nama_pegawai as name, p.nip as nip,
            d.jarak_km as km, d.jumlah_hari as workingDays, d.nominal as amount
     FROM tunjangan_transport_detail d
     LEFT JOIN pegawai p ON d.id_pegawai = p.id
     WHERE ${whereSql}
     ORDER BY ${sortColumn} ${sortDir}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  // Build period string
  const bulanNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const period = `${bulanNames[header.bulan] || header.bulan} ${header.tahun}`;

  return {
    success: true,
    period,
    totalRecipients: header.total_penerima,
    totalAmount: header.total_nominal,
    data: rows,
    page,
    limit,
    total,
    totalPages
  };
});
