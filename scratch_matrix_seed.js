import pool from './server/utils/db.js';

async function seedExactMatrix() {
  await pool.query('TRUNCATE TABLE role_permission');

  const permissionsData = [
    // Superadmin (id_role: 1)
    [1, 'Login/Logout', 1, 1, 'All', 'All', 'All'],
    [1, 'Kelola Role', 1, 0, 'All', 'No', 'No'],
    [1, 'Kelola User', 1, 1, 'All', 'All', 'All'],
    [1, 'My Profile', 1, 0, 'Own', 'Own', 'No'],
    [1, 'Dashboard', 1, 0, 'All', 'No', 'No'],
    [1, 'Data Pegawai', 0, 0, 'No', 'No', 'No'],
    [1, 'Tunjangan Transport', 0, 0, 'No', 'No', 'No'],
    [1, 'Setting Tunjangan', 0, 0, 'No', 'No', 'No'],
    [1, 'Activity Log', 1, 0, 'All', 'No', 'No'],

    // Manager HRD (id_role: 2)
    [2, 'Login/Logout', 1, 1, 'All', 'All', 'All'],
    [2, 'Kelola Role', 0, 0, 'No', 'No', 'No'],
    [2, 'Kelola User', 0, 0, 'No', 'No', 'No'],
    [2, 'My Profile', 1, 0, 'Own', 'Own', 'No'],
    [2, 'Dashboard', 1, 0, 'All', 'No', 'No'],
    [2, 'Data Pegawai', 1, 0, 'All', 'No', 'No'],
    [2, 'Tunjangan Transport', 1, 0, 'All', 'No', 'No'],
    [2, 'Setting Tunjangan', 0, 0, 'No', 'No', 'No'],
    [2, 'Activity Log', 0, 0, 'No', 'No', 'No'],

    // Admin HRD (id_role: 3)
    [3, 'Login/Logout', 1, 1, 'All', 'All', 'All'],
    [3, 'Kelola Role', 0, 0, 'No', 'No', 'No'],
    [3, 'Kelola User', 0, 0, 'No', 'No', 'No'],
    [3, 'My Profile', 1, 0, 'Own', 'Own', 'No'],
    [3, 'Dashboard', 1, 0, 'All', 'No', 'No'],
    [3, 'Data Pegawai', 1, 1, 'All', 'All', 'All'],
    [3, 'Tunjangan Transport', 1, 0, 'All', 'No', 'No'],
    [3, 'Setting Tunjangan', 1, 1, 'All', 'All', 'All'],
    [3, 'Activity Log', 0, 0, 'No', 'No', 'No']
  ];

  for (const item of permissionsData) {
    await pool.query(
      "INSERT INTO role_permission (id_role, modul_fitur, akses, `create`, `read`, `update`, `delete`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      item
    );
  }

  const [rows] = await pool.query("SELECT r.nama_role, p.modul_fitur, p.akses, p.create, p.read, p.update, p.delete FROM role_permission p JOIN user_role r ON p.id_role = r.id ORDER BY p.id_role, p.id");
  console.log("UPDATED EXACT MATRIX PERMISSIONS:");
  console.table(rows);
  process.exit(0);
}

seedExactMatrix().catch(console.error);
