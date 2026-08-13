<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
      <!-- Profile Data Card -->
      <div class="card mb-4">
        <div class="card-header">
          <h3 class="card-title">My Profile</h3>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3" style="width: 60px; height: 60px;">
              {{ getInitials(profile.nama) }}
            </div>
            <div>
              <h3 class="mb-0">{{ profile.nama }}</h3>
              <span class="badge bg-blue-lt mt-1">{{ profile.nama_role || profile.role }}</span>
            </div>
          </div>

          <form @submit.prevent="updateProfile">
            <div v-if="profileMessage" class="alert alert-success py-2 small mb-3">
              {{ profileMessage }}
            </div>
            <div v-if="profileError" class="alert alert-danger py-2 small mb-3">
              {{ profileError }}
            </div>

            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control bg-light" :value="profile.username" readonly disabled />
            </div>

            <div class="mb-3">
              <label class="form-label required">Nama Lengkap</label>
              <input v-model="profile.nama" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label required">Email</label>
              <input v-model="profile.email" type="email" class="form-control" required />
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="submit" class="btn btn-primary" :disabled="savingProfile">
                <span v-if="savingProfile" class="spinner-border spinner-border-sm me-1"></span>
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password Card -->
      <div class="card mb-3">
        <div class="card-header">
          <h3 class="card-title">Ubah Password (Mandiri)</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="changePassword">
            <div v-if="pwdMessage" class="alert alert-success py-2 small mb-3">
              {{ pwdMessage }}
            </div>
            <div v-if="pwdError" class="alert alert-danger py-2 small mb-3">
              {{ pwdError }}
            </div>

            <div class="mb-3">
              <label class="form-label required">Password Saat Ini</label>
              <input v-model="pwdForm.currentPassword" type="password" class="form-control" required autocomplete="current-password" />
            </div>

            <div class="mb-3">
              <label class="form-label required">Password Baru</label>
              <input v-model="pwdForm.newPassword" type="password" class="form-control" required autocomplete="new-password" placeholder="Min 8 karakter, A-Z, a-z, @!#" />
              <small class="text-muted">Aturan: Minimal 8 karakter, ada huruf besar, kecil, & simbol, tanpa spasi</small>
            </div>

            <div class="mb-3">
              <label class="form-label required">Konfirmasi Password Baru</label>
              <input v-model="pwdForm.confirmPassword" type="password" class="form-control" required autocomplete="new-password" />
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="submit" class="btn btn-warning" :disabled="savingPwd">
                <span v-if="savingPwd" class="spinner-border spinner-border-sm me-1"></span>
                Ubah Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "My Profile",
});

useSeoMeta({
  title: "My Profile",
});

import { ref, onMounted } from 'vue';

const profile = ref({
  nama: '',
  username: '',
  email: '',
  nama_role: '',
  role: ''
});

const pwdForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const savingProfile = ref(false);
const savingPwd = ref(false);

const profileMessage = ref('');
const profileError = ref('');

const pwdMessage = ref('');
const pwdError = ref('');

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const fetchProfile = async () => {
  try {
    const res = await $fetch('/api/auth/me');
    if (res.user) {
      profile.value = res.user;
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err);
  }
};

const updateProfile = async () => {
  profileMessage.value = '';
  profileError.value = '';
  savingProfile.value = true;
  try {
    const res = await $fetch('/api/user/profile', {
      method: 'PUT',
      body: {
        nama: profile.value.nama,
        email: profile.value.email
      }
    });
    if (res.success) {
      profileMessage.value = res.message;
      if (import.meta.client) {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.nama = profile.value.nama;
          parsed.email = profile.value.email;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      }
    }
  } catch (err) {
    const errorData = err.data?.data;
    if (errorData && errorData.errors) {
      const firstErr = Object.values(errorData.errors)[0];
      profileError.value = `Validasi Gagal: ${firstErr}`;
    } else {
      profileError.value = err.data?.statusMessage || err.data?.message || err.message || 'Gagal mengupdate profile';
    }
  } finally {
    savingProfile.value = false;
  }
};

const changePassword = async () => {
  pwdMessage.value = '';
  pwdError.value = '';

  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    pwdError.value = 'Konfirmasi password tidak cocok dengan password baru';
    return;
  }

  savingPwd.value = true;
  try {
    const res = await $fetch('/api/user/change-password', {
      method: 'POST',
      body: pwdForm.value
    });
    if (res.success) {
      pwdMessage.value = res.message;
      pwdForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  } catch (err) {
    const errorData = err.data?.data;
    if (errorData && errorData.errors) {
      const firstErr = Object.values(errorData.errors)[0];
      pwdError.value = `Validasi Gagal: ${firstErr}`;
    } else {
      pwdError.value = err.data?.statusMessage || err.data?.message || err.message || 'Gagal mengubah password';
    }
  } finally {
    savingPwd.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>
