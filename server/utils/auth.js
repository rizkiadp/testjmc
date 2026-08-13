import jwt from 'jsonwebtoken';
import { getHeader, getCookie, setCookie, getRequestURL, createError } from 'h3';
import { query } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured in .env environment file');
}

export function generateToken(payload, expiresIn = '3m') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Middleware helper to authenticate request
export async function getAuthUser(event) {
  const authHeader = getHeader(event, 'authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Check cookie fallback
    token = getCookie(event, 'token');
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  // Verify user still active in DB
  const users = await query(
    'SELECT u.id, u.username, u.nama, u.email, u.id_role, u.disabled, r.nama_role FROM user u LEFT JOIN user_role r ON u.id_role = r.id WHERE u.id = ?',
    [decoded.id]
  );

  if (!users || users.length === 0 || users[0].disabled === 1) {
    return null;
  }

  const isRememberMe = decoded.rememberMe || false;

  // SLIDING SESSION (3m Idle Activity Extension)
  // Perbarui token & cookie secara otomatis jika pengguna aktif melakukan request API
  try {
    const sessionDuration = isRememberMe ? '7d' : '3m';
    const maxAgeSeconds = isRememberMe ? 7 * 24 * 60 * 60 : 3 * 60;

    const newToken = generateToken(
      {
        id: users[0].id,
        username: users[0].username,
        role: users[0].nama_role,
        rememberMe: isRememberMe
      },
      sessionDuration
    );

    setCookie(event, 'token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeSeconds,
      path: '/'
    });
  } catch (e) {}

  users[0].rememberMe = isRememberMe;
  return users[0];
}

// Explicit CSRF Token Verification Helper for State-Changing Requests (POST, PUT, PATCH, DELETE)
export function verifyCsrfToken(event) {
  const method = event.node.req.method.toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfHeader = getHeader(event, 'x-csrf-token') || getHeader(event, 'x-xsrf-token');
    const csrfCookie = getCookie(event, 'XSRF-TOKEN');

    // If request originates from state-changing HTTP method, enforce CSRF Header vs Cookie matching
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Proteksi CSRF: Token CSRF tidak valid atau tidak cocok'
      });
    }
  }
}

// Backend Authorization Guard (Strict Dynamic DB RBAC Check & CSRF Protection)
export function requireRoles(...allowedRoles) {
  return async (event, moduleName = null, action = 'read') => {
    // 1. Explicit CSRF Verification on Mutating API Endpoints
    verifyCsrfToken(event);

    // 2. Authenticate User Session
    const user = await getAuthUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Sesi login Anda telah berakhir atau belum terautentikasi'
      });
    }

    // 3. Strict DB role_permission table enforcement
    const dbPerms = await query(
      'SELECT * FROM role_permission WHERE id_role = ? AND akses = 1',
      [user.id_role]
    );

    user.permissions = dbPerms || [];

    // Role-based & DB-based combined authorization check
    const isRoleAllowed = allowedRoles.includes(user.nama_role);
    const hasDbPermission = dbPerms && dbPerms.length > 0;

    // 4. Granular CRUD verification if moduleName specified
    if (moduleName && hasDbPermission) {
      const p = dbPerms.find(item => item.modul_fitur === moduleName);
      if (!p) {
        throw createError({
          statusCode: 403,
          statusMessage: `Akses ditolak. Peran '${user.nama_role}' tidak memiliki akses ke modul '${moduleName}'.`
        });
      }

      let isActionAllowed = false;
      if (action === 'create' && p.create === 1) isActionAllowed = true;
      else if (action === 'read' && ['All', 'Own'].includes(p.read)) isActionAllowed = true;
      else if (action === 'update' && ['All', 'Own'].includes(p.update)) isActionAllowed = true;
      else if (action === 'delete' && ['All', 'Own'].includes(p.delete)) isActionAllowed = true;

      if (!isActionAllowed) {
        throw createError({
          statusCode: 403,
          statusMessage: `Akses ditolak. Peran '${user.nama_role}' tidak diizinkan melakukan tindakan '${action}' pada modul '${moduleName}'.`
        });
      }
    }

    if (!isRoleAllowed || !hasDbPermission) {
      throw createError({
        statusCode: 403,
        statusMessage: `Akses ditolak. Peran '${user.nama_role}' tidak diizinkan untuk mengakses modul/tindakan ini.`
      });
    }

    return user;
  };
}

// Granular DB Permission Guard (Checking Specific Module & CRUD Action: create, read, update, delete)
export function requirePermission(moduleName, action = 'read') {
  return async (event) => {
    verifyCsrfToken(event);
    const user = await getAuthUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Sesi login Anda telah berakhir atau belum terautentikasi'
      });
    }

    const perms = await query(
      'SELECT * FROM role_permission WHERE id_role = ? AND modul_fitur = ? AND akses = 1',
      [user.id_role, moduleName]
    );

    if (!perms || perms.length === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: `Akses ditolak. Peran '${user.nama_role}' tidak memiliki akses modul '${moduleName}'.`
      });
    }

    const p = perms[0];
    let isAllowed = false;

    if (action === 'create' && p.create === 1) isAllowed = true;
    else if (action === 'read' && ['All', 'Own'].includes(p.read)) isAllowed = true;
    else if (action === 'update' && ['All', 'Own'].includes(p.update)) isAllowed = true;
    else if (action === 'delete' && ['All', 'Own'].includes(p.delete)) isAllowed = true;

    if (!isAllowed) {
      throw createError({
        statusCode: 403,
        statusMessage: `Akses ditolak. Peran '${user.nama_role}' tidak diizinkan melakukan tindakan '${action}' pada modul '${moduleName}'.`
      });
    }

    user.permissions = perms;
    return user;
  };
}

// Helper to log user activity
export async function logActivity(event, user, module, title) {
  if (!user || !user.id) return;

  const reqUrl = getRequestURL(event).pathname;
  const userAgent = getHeader(event, 'user-agent') || '';
  const ip = getHeader(event, 'x-forwarded-for') || event.node?.req?.socket?.remoteAddress || '127.0.0.1';

  try {
    await query(
      `INSERT INTO activities (title, content, ua, ip, url, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [title, `Aktivitas di modul ${module}`, userAgent, ip, reqUrl, user.id]
    );
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
}
