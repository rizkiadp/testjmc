<template>
  <div class="page">
    <Sidebar />
    <Header />

    <!-- Content -->
    <div class="page-wrapper">
      <!-- Page Content -->
      <div class="page-body">
        <div class="container-xl">
          <!-- Breadcrumb -->
          <div
            class="page-header d-print-none mb-3"
            v-if="pageTitle || $slots.header"
          >
            <div class="row align-items-center">
              <div class="col-auto">
                <AppBreadcrumb />
                <h2 class="page-title">
                  {{ pageTitle }}
                </h2>
              </div>
              <div class="col-auto ms-auto d-print-none" v-if="$slots.actions">
                <slot name="actions" />
              </div>
            </div>
          </div>

          <!-- Slot konten halaman -->
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";
import Header from "@/components/layout/Header.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import { onMounted, onUnmounted } from 'vue';

const { initTheme } = useTheme();
const route = useRoute();

const pageTitle = computed(() => route.meta?.title || "");

let idleTimer = null;

// Auth check is handled by middleware/auth.global.js

// Auto Logout setelah 3 menit tanpa aktivitas mouse/keyboard (idle) jika Remember Me false
const resetIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);

  const storedUser = localStorage.getItem('user');
  let isRememberMe = false;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      isRememberMe = !!parsed.rememberMe;
    } catch (e) {}
  }

  // Jika tidak remember me -> auto logout dalam 3 menit (180.000 ms)
  if (!isRememberMe) {
    idleTimer = setTimeout(async () => {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {}
      localStorage.removeItem('user');
      window.location.href = '/login?reason=idle';
    }, 180000); // 3 menit
  }
};

onMounted(() => {
  initTheme();

  // Attach idle listeners
  window.addEventListener('mousemove', resetIdleTimer);
  window.addEventListener('keypress', resetIdleTimer);
  window.addEventListener('click', resetIdleTimer);
  window.addEventListener('scroll', resetIdleTimer);
  resetIdleTimer();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', resetIdleTimer);
  window.removeEventListener('keypress', resetIdleTimer);
  window.removeEventListener('click', resetIdleTimer);
  window.removeEventListener('scroll', resetIdleTimer);
  if (idleTimer) clearTimeout(idleTimer);
});
</script>
