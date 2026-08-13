import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { query } from '../../utils/db.js';
import { requireRoles } from '../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD');
  const user = await checkRole(event);

  const queryParams = getQuery(event);
  const type = queryParams.type || 'excel'; // 'excel' or 'pdf'

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

  if (minMasaKerja !== null) {
    whereClauses.push('TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) >= ?');
    params.push(minMasaKerja);
  }

  if (maxMasaKerja !== null) {
    whereClauses.push('TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) <= ?');
    params.push(maxMasaKerja);
  }

  const whereSql = whereClauses.join(' AND ');

  const sortMap = {
    nip: 'p.nip',
    nama: 'p.nama_pegawai',
    jabatan: 'j.nama',
    tanggal_masuk: 'p.tanggal_masuk',
    masa_kerja: 'p.tanggal_masuk',
    id: 'p.id'
  };
  const sortColumn = sortMap[sortBy] || 'p.id';

  const pegawaiList = await query(
    `SELECT p.nip, p.nama_pegawai, p.email, p.nomor_hp, p.tanggal_masuk, p.status, p.status_kontrak,
            j.nama as nama_jabatan, d.nama as nama_departemen,
            TIMESTAMPDIFF(YEAR, p.tanggal_masuk, CURDATE()) as masa_kerja
     FROM pegawai p
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     LEFT JOIN master_data d ON p.id_departemen = d.id
     WHERE ${whereSql}
     ORDER BY ${sortColumn} ${sortDir}`,
    params
  );

  if (type === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daftar Pegawai');

    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'NIP', key: 'nip', width: 15 },
      { header: 'Nama Pegawai', key: 'nama_pegawai', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Nomor HP', key: 'nomor_hp', width: 18 },
      { header: 'Jabatan', key: 'nama_jabatan', width: 18 },
      { header: 'Departemen', key: 'nama_departemen', width: 18 },
      { header: 'Tanggal Masuk', key: 'tanggal_masuk', width: 15 },
      { header: 'Masa Kerja (Thn)', key: 'masa_kerja', width: 15 },
      { header: 'Status Kontrak', key: 'status_kontrak', width: 15 },
      { header: 'Status', key: 'status', width: 10 }
    ];

    pegawaiList.forEach((p, idx) => {
      worksheet.addRow({
        no: idx + 1,
        nip: p.nip,
        nama_pegawai: p.nama_pegawai,
        email: p.email,
        nomor_hp: p.nomor_hp,
        nama_jabatan: p.nama_jabatan || '-',
        nama_departemen: p.nama_departemen || '-',
        tanggal_masuk: p.tanggal_masuk,
        masa_kerja: p.masa_kerja || 0,
        status_kontrak: p.status_kontrak || 'PKWTT',
        status: p.status
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    setHeader(event, 'content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    setHeader(event, 'content-disposition', 'attachment; filename="daftar_pegawai_jmc.xlsx"');
    return buffer;
  }

  // PDF Export using PDFKit
  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  // Header Title
  doc.fontSize(16).fillColor('#2b508e').text('DAFTAR PEGAWAI JMC KEPEGAWAIAN', { align: 'center' });
  doc.fontSize(9).fillColor('#666666').text(`Dicetak Pada: ${new Date().toLocaleString('id-ID')}`, { align: 'center' });
  doc.moveDown(1.5);

  // Table Configuration
  const startX = 30;
  let startY = doc.y;
  const colWidths = [25, 110, 130, 140, 100, 70, 70, 60];
  const headers = ['No', 'NIP', 'Nama Pegawai', 'Email', 'Jabatan', 'Tgl Masuk', 'Kontrak', 'Status'];

  // Draw Header Row
  doc.fontSize(9).fillColor('#000000').font('Helvetica-Bold');
  let currentX = startX;

  doc.rect(startX, startY - 2, colWidths.reduce((a, b) => a + b, 0), 18).fillAndStroke('#eef2f7', '#cccccc');
  doc.fillColor('#1d273b');

  headers.forEach((h, i) => {
    doc.text(h, currentX + 3, startY + 2, { width: colWidths[i] - 6, align: i === 0 ? 'center' : 'left' });
    currentX += colWidths[i];
  });

  startY += 20;

  // Draw Body Rows
  doc.font('Helvetica').fontSize(8);
  pegawaiList.forEach((p, idx) => {
    if (startY > 520) {
      doc.addPage({ margin: 30, size: 'A4', layout: 'landscape' });
      startY = 40;
    }

    currentX = startX;
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.rect(startX, startY - 2, colWidths.reduce((a, b) => a + b, 0), 16).fill('#f8fafc');
    }

    const rowData = [
      String(idx + 1),
      p.nip || '-',
      p.nama_pegawai || '-',
      p.email || '-',
      p.nama_jabatan || '-',
      p.tanggal_masuk || '-',
      p.status_kontrak || 'PKWTT',
      p.status || 'Aktif'
    ];

    doc.fillColor('#333333');
    rowData.forEach((val, i) => {
      doc.text(val, currentX + 3, startY + 2, { width: colWidths[i] - 6, align: i === 0 ? 'center' : 'left' });
      currentX += colWidths[i];
    });

    startY += 18;
  });

  doc.end();

  const pdfBuffer = await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  setHeader(event, 'content-type', 'application/pdf');
  setHeader(event, 'content-disposition', 'attachment; filename="daftar_pegawai_jmc.pdf"');
  return pdfBuffer;
});
