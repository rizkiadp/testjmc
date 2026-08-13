<template>
  <form @submit.prevent="handleLogin">
    <!-- Alert Error -->
    <div v-if="errorMessage" class="alert alert-danger mb-3 py-2 small" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Username / Email / No HP -->
    <div class="mb-2">
      <input
        v-model="form.identifier"
        type="text"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Username / Email / No. HP"
        required
      />
    </div>

    <!-- Password -->
    <div class="mb-2">
      <input
        v-model="form.password"
        type="password"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Password"
        required
      />
    </div>

    <!-- Captcha SVG Interaktif -->
    <div class="mb-3">
      <label class="form-label mb-1 text-muted small">Kode Keamanan Captcha:</label>
      <div class="d-flex align-items-center gap-2 mb-2">
        <div v-if="captchaSvg" v-html="captchaSvg" class="border rounded bg-white p-1" style="cursor: pointer;" @click="fetchCaptcha" title="Klik untuk me-refresh Captcha"></div>
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="fetchCaptcha" title="Refresh Captcha">
          ↻ Refresh
        </button>
      </div>
      <input
        v-model="form.captchaInput"
        type="text"
        class="form-control py-2 border-0 bg-light text-dark"
        placeholder="Masukkan 4 Karakter Captcha"
        required
      />
    </div>

    <div class="mb-2">
      <label class="form-check">
        <input v-model="form.rememberMe" type="checkbox" class="form-check-input" />
        <span class="form-check-label">Remember Me (Sesi Tetap Aktif)</span>
      </label>
    </div>

    <!-- Submit -->
    <div class="d-grid mt-4">
      <button class="btn btn-primary text-uppercase shadow py-3" type="submit" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ loading ? 'Memproses...' : 'Masuk' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const form = ref({
  identifier: '',
  password: '',
  captchaInput: '',
  captchaId: '',
  rememberMe: false
});

const captchaSvg = ref('');
const errorMessage = ref('');
const loading = ref(false);

const fetchCaptcha = async () => {
  try {
    const res = await $fetch('/api/auth/captcha');
    form.value.captchaId = res.captchaId;
    captchaSvg.value = res.data;
    form.value.captchaInput = '';
  } catch (err) {
    console.error('Failed to fetch captcha:', err);
  }
};

const handleLogin = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    });

    if (res.success) {
      // Store user session state
      localStorage.setItem('user', JSON.stringify(res.user));
      window.location.href = '/';
    }
  } catch (err) {
    errorMessage.value = err.data?.statusMessage || err.message || 'Login gagal, periksa data Anda';
    await fetchCaptcha(); // Refresh captcha on failure
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCaptcha();
});
</script>
