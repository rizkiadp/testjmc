import PDFDocument from 'pdfkit';
import { query } from '../../../utils/db.js';
import { requireRoles } from '../../../utils/auth.js';

export default defineEventHandler(async (event) => {
  const checkRole = requireRoles('Admin HRD', 'Manager HRD');
  await checkRole(event);

  const id = event.context.params.id;

  const pegawaiRes = await query(
    `SELECT p.*, j.nama as nama_jabatan, d.nama as nama_departemen,
            w.kecamatan, w.kabupaten, w.provinsi
     FROM pegawai p
     LEFT JOIN master_data j ON p.id_jabatan = j.id
     LEFT JOIN master_data d ON p.id_departemen = d.id
     LEFT JOIN master_wilayah w ON p.id_kecamatan = w.id
     WHERE p.id = ? OR p.nip = ?`,
    [id, id]
  );

  if (!pegawaiRes || pegawaiRes.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Data Pegawai tidak ditemukan' });
  }

  const pegawai = pegawaiRes[0];

  // Fetch pendidikan list
  const pendidikan = await query(
    `SELECT * FROM pegawai_pendidikan WHERE id_pegawai = ? ORDER BY id ASC`,
    [pegawai.id]
  );

  // Generate PDF document with PDFKit
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  // Header Title & Header Box
  doc.rect(40, 40, 515, 60).fill('#2b508e');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold').text('BIODATA & DETAIL PEGAWAI', 50, 55, { align: 'center' });
  doc.fontSize(10).fillColor('#e2e8f0').font('Helvetica').text('JMC Kepegawaian System', 50, 78, { align: 'center' });

  doc.moveDown(3);
  let y = 120;

  // Function helper to draw field section
  const drawRow = (label, val, yPos) => {
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b').text(label.toUpperCase(), 40, yPos);
    doc.fontSize(10).font('Helvetica').fillColor('#1e293b').text(val || '-', 200, yPos);
    doc.moveTo(40, yPos + 16).lineTo(555, yPos + 16).strokeColor('#f1f5f9').stroke();
    return yPos + 22;
  };

  // Section 1: Informasi Utam & Data Diri
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#2b508e').text('I. DATA DIRI PEGAWAI', 40, y);
  y += 20;

  y = drawRow('NIP', pegawai.nip, y);
  y = drawRow('Nama Lengkap', pegawai.nama_pegawai, y);
  y = drawRow('Email', pegawai.email, y);
  y = drawRow('Nomor HP', pegawai.nomor_hp, y);
  y = drawRow('Tempat, Tanggal Lahir', `${pegawai.tempat_lahir || '-'}, ${pegawai.tanggal_lahir || '-'}`, y);
  y = drawRow('Usia', `${pegawai.usia || 0} Tahun`, y);
  y = drawRow('Jenis Kelamin', pegawai.jenis_kelamin || 'Laki-laki', y);
  y = drawRow('Status Kawin', `${pegawai.status_kawin || '-'} (${pegawai.jumlah_anak || 0} Anak)`, y);

  y += 10;
  // Section 2: Jabatan & Status
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#2b508e').text('II. JABATAN & KONTRAK', 40, y);
  y += 20;

  y = drawRow('Jabatan', pegawai.nama_jabatan, y);
  y = drawRow('Departemen', pegawai.nama_departemen, y);
  y = drawRow('Tanggal Masuk', pegawai.tanggal_masuk, y);
  y = drawRow('Status Kontrak', pegawai.status_kontrak || 'PKWTT', y);
  y = drawRow('Status Kepegawaian', pegawai.status || 'Aktif', y);

  y += 10;
  // Section 3: Alamat
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#2b508e').text('III. ALAMAT & WILAYAH', 40, y);
  y += 20;

  y = drawRow('Kecamatan', pegawai.kecamatan, y);
  y = drawRow('Kabupaten / Kota', pegawai.kabupaten, y);
  y = drawRow('Provinsi', pegawai.provinsi, y);
  y = drawRow('Alamat Lengkap', pegawai.alamat_lengkap, y);
  y = drawRow('Jarak Rumah-Kantor', `${pegawai.jarak_rumah_kantor || 0} KM`, y);

  y += 10;
  // Section 4: Riwayat Pendidikan
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#2b508e').text('IV. RIWAYAT PENDIDIKAN', 40, y);
  y += 20;

  // Header Table Pendidikan
  doc.rect(40, y, 515, 18).fill('#eef2f7');
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#1d273b');
  doc.text('Tingkat', 50, y + 4, { width: 80 });
  doc.text('Nama Sekolah / Institusi', 140, y + 4, { width: 260 });
  doc.text('Tahun Lulus', 410, y + 4, { width: 100, align: 'center' });

  y += 20;

  if (pendidikan && pendidikan.length > 0) {
    doc.font('Helvetica').fontSize(9).fillColor('#333333');
    pendidikan.forEach((p) => {
      doc.text(p.tingkat_pendidikan || '-', 50, y, { width: 80 });
      doc.text(p.nama_sekolah || '-', 140, y, { width: 260 });
      doc.text(String(p.tahun_lulus || '-'), 410, y, { width: 100, align: 'center' });
      y += 16;
    });
  } else {
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#94a3b8').text('Belum ada data riwayat pendidikan', 50, y);
    y += 16;
  }

  // Footer Document
  doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text(`Dokumen ini dihasilkan secara otomatis oleh sistem pada ${new Date().toLocaleString('id-ID')}`, 40, 780, { align: 'center' });

  doc.end();

  const pdfBuffer = await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  setHeader(event, 'content-type', 'application/pdf');
  setHeader(event, 'content-disposition', `attachment; filename="biodata_pegawai_${pegawai.nip}.pdf"`);
  return pdfBuffer;
});
