<template>
  <header class="navbar navbar-expand-lg d-print-none sticky-top" id="navbar">
    <div class="container-xl justify-content">
      <button
        class="sidebar-toggler d-none d-lg-block"
        type="button"
        @click="toggleSidebar()"
      >
        <span class="sidebar-icon"></span>
      </button>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar-menu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-nav flex-row order-md-last ms-md-auto">
        <button
          @click="toggleTheme()"
          class="nav-link px-0 btn-toggle-theme hide-theme-dark me-3"
          title="Enable dark mode"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
            />
          </svg>
        </button>
        <button
          @click="toggleTheme()"
          class="nav-link px-0 btn-toggle-theme hide-theme-light me-3"
          title="Enable light mode"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
            <path
              d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"
            ></path>
          </svg>
        </button>

        <!-- User Profile Dropdown Header -->
        <div class="nav-item dropdown">
          <a
            href="#"
            class="nav-link d-flex lh-1 text-reset p-0 dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <span class="bg-primary text-white avatar rounded-circle">
              {{ getInitials(currentUser.nama) }}
            </span>
            <div class="d-none d-xl-block ps-2">
              <div class="fw-bold">{{ currentUser.nama }}</div>
              <div class="mt-1 small text-primary">{{ currentUser.role }}</div>
            </div>
          </a>
          <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <NuxtLink to="/profile" class="dropdown-item">
              <i class="bi bi-person me-2"></i> My Profile
            </NuxtLink>
            <div class="dropdown-divider"></div>
            <button @click="handleLogout" class="dropdown-item text-danger border-0 bg-transparent text-start w-100">
              <i class="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { toggleTheme } = useTheme();
const { toggleSidebar } = useSidebar();

const currentUser = ref({
  nama: '',
  role: ''
});

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Immediately try to load from localStorage (client only)
if (import.meta.client) {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      currentUser.value = {
        nama: parsed.nama || '',
        role: parsed.role || ''
      };
    }
  } catch (e) {}
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {}
  if (import.meta.client) {
    localStorage.removeItem('user');
    sessionStorage.clear();
    // Replace current location to prevent going back to authenticated state
    window.location.replace('/login');
  }
};

onMounted(async () => {
  // If still empty after localStorage check, try fetching from API
  if (!currentUser.value.nama) {
    try {
      const res = await $fetch('/api/auth/me');
      if (res.success && res.user) {
        currentUser.value = {
          nama: res.user.nama || '',
          role: res.user.role || res.user.nama_role || ''
        };
        // Sync to localStorage
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    } catch (e) {}
  }
});
</script>

