import pool from './server/utils/db.js';

async function seed() {
  await pool.query('UPDATE user_role SET deskripsi = ? WHERE id = 1', ['Hak akses penuh seluruh sistem']);
  await pool.query('UPDATE user_role SET deskripsi = ? WHERE id = 2', ['Melihat statistik dashboard dan rekap tunjangan']);
  await pool.query('UPDATE user_role SET deskripsi = ? WHERE id = 3', ['Kelola pegawai dan input total hari masuk kerja']);

  await pool.query('TRUNCATE TABLE role_permission');
  await pool.query(`
    INSERT INTO role_permission (id_role, modul_fitur, akses, \`create\`, \`read\`, \`update\`, \`delete\`) VALUES 
    (1, 'Data Pegawai', 1, 1, 'All', 'All', 'All'),
    (1, 'User Management', 1, 1, 'All', 'All', 'All'),
    (1, 'Tunjangan Transport', 1, 1, 'All', 'All', 'All'),
    (2, 'Dashboard', 1, 0, 'All', 'No', 'No'),
    (2, 'Rekap Tunjangan', 1, 0, 'All', 'No', 'No'),
    (3, 'Data Pegawai', 1, 1, 'All', 'All', 'All'),
    (3, 'Input Total Masuk', 1, 1, 'All', 'All', 'All')
  `);
  console.log('SEED COMPLETED SUCCESS');
  process.exit(0);
}

seed().catch(console.error);
