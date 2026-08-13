<template>
  <div>
    <div class="d-flex justify-content-end mb-3">
      <button
        class="btn btn-primary"
        @click="openAddModal"
      >
        <IconPlus stroke="{3}" size="20" class="me-1" />Tambah User
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto">
          <!-- Filter Role -->
          <select v-model="filterRole" class="form-select" style="width: 180px" @change="fetchUsers(1)">
            <option value="">Semua Role</option>
            <option v-for="r in masterRoles" :key="r.id" :value="r.id">{{ r.nama_role }}</option>
          </select>

          <!-- Search -->
          <div class="input-group" style="width: 240px">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Cari User..."
              @input="onSearchInput"
              @keyup.enter="fetchUsers(1)"
            />
            <button class="btn btn-outline-secondary" type="button" @click="fetchUsers(1)">
              <IconSearch size="16" />
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter table-striped table-hover">
          <thead>
            <tr>
              <th width="5">No</th>
              <th>Nama Pengguna</th>
              <th>Username</th>
              <th>Jabatan</th>
              <th>Departemen</th>
              <th>Role</th>
              <th>Status</th>
              <th class="text-center" width="100">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div> Memuat data...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">Data user tidak ditemukan</td>
            </tr>
            <tr v-for="(item, index) in users" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="fw-bold">{{ item.nama }}</td>
              <td><code>{{ item.username }}</code></td>
              <td>{{ item.nama_jabatan || '-' }}</td>
              <td>{{ item.nama_departemen || '-' }}</td>
              <td>
                <span class="badge bg-blue-lt">{{ item.nama_role || 'User' }}</span>
              </td>
              <td>
                <span
                  class="badge cursor-pointer"
                  :class="item.disabled === 0 ? 'bg-success-lt' : 'bg-danger-lt'"
                  style="cursor: pointer"
                  title="Klik untuk mengubah status"
                  @click="toggleStatus(item)"
                >
                  {{ item.disabled === 0 ? "Aktif" : "Nonaktif" }}
                </span>
              </td>
              <td class="text-center">
                <div class="btn-list flex-nowrap justify-content-center">
                  <button
                    class="btn btn-icon btn-sm"
                    :class="item.disabled === 0 ? 'btn-ghost-warning' : 'btn-ghost-success'"
                    :title="item.disabled === 0 ? 'Nonaktifkan User' : 'Aktifkan User'"
                    @click="toggleStatus(item)"
                  >
                    <IconPower size="18" />
                  </button>
                  <button class="btn btn-icon btn-sm btn-ghost-primary me-1" title="Edit User" @click="openEditModal(item)">
                    <IconEdit size="18" />
                  </button>
                  <button class="btn btn-icon btn-sm btn-ghost-danger" title="Hapus User" @click="confirmDelete(item)">
                    <IconTrash size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Pagination -->
      <div class="card-footer d-flex align-items-center justify-content-between py-2" v-if="total > 0">
        <p class="m-0 text-muted">
          Menampilkan <span>{{ (page - 1) * limit + 1 }}</span> hingga <span>{{ Math.min(page * limit, total) }}</span> dari <span>{{ total }}</span> entri
        </p>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" :class="{ disabled: page <= 1 }">
            <button class="page-link" @click="fetchUsers(page - 1)" :disabled="page <= 1">
              Sebelumnya
            </button>
          </li>
          <li
            v-for="pNum in totalPages"
            :key="pNum"
            class="page-item"
            :class="{ active: pNum === page }"
          >
            <button class="page-link" @click="fetchUsers(pNum)">{{ pNum }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page >= totalPages }">
            <button class="page-link" @click="fetchUsers(page + 1)" :disabled="page >= totalPages">
              Selanjutnya
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal Form User (Tambah User) -->
    <div class="modal fade" id="modal-user-form" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit User' : 'Tambah User Baru' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="saveUser">
            <div class="modal-body">
              <div v-if="modalError" class="alert alert-danger py-2 small mb-3">
                {{ modalError }}
              </div>

              <!-- Autosuggest Nama Pengguna (Data Pegawai) -->
              <div class="mb-3 position-relative">
                <label class="form-label required">Nama Pengguna (Data Pegawai)</label>
                <input
                  v-model="suggestQuery"
                  type="text"
                  class="form-control"
                  placeholder="Ketik min 2 huruf nama pegawai..."
                  @input="onSuggestInput"
                  required
                />
                <small class="text-muted" v-if="selectedPegawai">
                  Terpilih: <strong>{{ selectedPegawai.nama_pegawai }}</strong> ({{ selectedPegawai.nama_jabatan || '-' }})
                </small>

                <!-- Dropdown Autosuggest -->
                <div v-if="suggestions.length > 0" class="list-group position-absolute w-100 shadow-lg mt-1 bg-white border rounded" style="max-height: 200px; overflow-y: auto; z-index: 1050; top: 100%;">
                  <button
                    type="button"
                    class="list-group-item list-group-item-action py-2 bg-white text-dark"
                    v-for="s in suggestions"
                    :key="s.id"
                    @click="selectPegawai(s)"
                  >
                    <strong class="text-dark">{{ s.nama_pegawai }}</strong> <small class="text-secondary">({{ s.nip }}) - {{ s.nama_jabatan || 'No Jabatan' }}</small>
                  </button>
                </div>
              </div>

              <!-- Username -->
              <div class="mb-3">
                <label class="form-label required">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  class="form-control"
                  placeholder="hanya huruf kecil & angka, min 6 karakter"
                  @input="onUsernameInput"
                  required
                />
                <small class="text-muted">Min 6 karakter, lowercase, tanpa spasi</small>
              </div>

              <!-- Jabatan (Data Pegawai) -->
              <div class="mb-3">
                <label class="form-label">Jabatan (Data Pegawai)</label>
                <input
                  type="text"
                  class="form-control bg-light"
                  :value="selectedPegawai?.nama_jabatan || '-'"
                  readonly
                  placeholder="Terisi otomatis dari Data Pegawai"
                />
              </div>

              <!-- Departemen (Data Pegawai) -->
              <div class="mb-3">
                <label class="form-label">Departemen (Data Pegawai)</label>
                <input
                  type="text"
                  class="form-control bg-light"
                  :value="selectedPegawai?.nama_departemen || '-'"
                  readonly
                  placeholder="Terisi otomatis dari Data Pegawai"
                />
              </div>

              <!-- Role Akun -->
              <div class="mb-3">
                <label class="form-label required">Role Akun</label>
                <select v-model="form.id_role" class="form-select" required>
                  <option value="" disabled>Pilih Role Akun</option>
                  <option v-for="r in masterRoles" :key="r.id" :value="r.id">{{ r.nama_role }}</option>
                </select>
              </div>

              <!-- Status Akun -->
              <div class="mb-3">
                <label class="form-check">
                  <input v-model="form.isActive" type="checkbox" class="form-check-input" />
                  <span class="form-check-label fw-bold">Status Akun (Aktif / Nonaktif)</span>
                </label>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label class="form-label" :class="{ required: !isEdit }">Password {{ isEdit ? '(Opsional - Isi untuk ubah)' : '' }}</label>
                <div class="input-group">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Min 8 karakter, A-Z, a-z, @!#"
                    :required="!isEdit"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary px-2"
                    title="Tampilkan/Sembunyikan Password"
                    @click="showPassword = !showPassword"
                  >
                    <component :is="showPassword ? IconEyeOff : IconEye" size="18" />
                  </button>
                  <button type="button" class="btn btn-outline-secondary" @click="generatePassword">
                    Generate Password
                  </button>
                </div>
                <small class="text-muted">Policy: Min 8 karakter, ada huruf besar, kecil, & simbol</small>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                Simpan User
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
  title: "Kelola User",
});

useSeoMeta({
  title: "Kelola User",
});

import { ref, onMounted } from "vue";
import { IconPlus, IconSearch, IconTrash, IconEdit, IconEye, IconEyeOff, IconPower } from "@tabler/icons-vue";

const users = ref([]);
const masterRoles = ref([]);
const loading = ref(false);
const saving = ref(false);
const search = ref("");
const filterRole = ref("");
const modalError = ref("");
const isEdit = ref(false);
const showPassword = ref(false);

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const totalPages = ref(1);

const suggestQuery = ref("");
const suggestions = ref([]);
const selectedPegawai = ref(null);

const form = ref({
  id_pegawai: null,
  nama: "",
  username: "",
  password: "",
  id_role: "",
  isActive: true
});

let suggestTimer = null;
let searchTimer = null;

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    fetchUsers(1);
  }, 350);
};

const fetchUsers = async (targetPage = null) => {
  if (targetPage !== null) {
    page.value = targetPage;
  }
  loading.value = true;
  try {
    const params = { page: page.value, limit: limit.value };
    if (search.value) params.search = search.value;
    if (filterRole.value) params.role = filterRole.value;

    const res = await $fetch("/api/user", { params });
    if (res && res.success) {
      users.value = res.data || [];
      if (res.pagination) {
        total.value = res.pagination.total;
        totalPages.value = res.pagination.totalPages;
      }
    }
  } catch (err) {
    console.error("Failed to fetch users:", err);
    users.value = [];
    if (err.statusCode === 401 || err.statusCode === 403) {
      alert("Akses ditolak: Hanya Superadmin yang diizinkan mengakses halaman Manajemen User.");
    }
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const res = await $fetch("/api/master");
    if (res.success) {
      masterRoles.value = res.data.roles;
    }
  } catch (err) {
    console.error("Failed to fetch roles:", err);
  }
};

const onSuggestInput = () => {
  selectedPegawai.value = null;
  form.value.id_pegawai = null;
  form.value.nama = suggestQuery.value;

  if (suggestTimer) clearTimeout(suggestTimer);
  if (suggestQuery.value.length < 2) {
    suggestions.value = [];
    return;
  }

  suggestTimer = setTimeout(async () => {
    try {
      const res = await $fetch(`/api/user/suggest?q=${encodeURIComponent(suggestQuery.value)}`);
      if (res.success) {
        suggestions.value = res.data;
      }
    } catch (err) {
      console.error("Autosuggest error:", err);
    }
  }, 300);
};

const selectPegawai = (p) => {
  selectedPegawai.value = p;
  form.value.id_pegawai = p.id;
  form.value.nama = p.nama_pegawai;
  suggestQuery.value = p.nama_pegawai;
  suggestions.value = [];
};

const onUsernameInput = (e) => {
  // Rule: lowercase, alphanumeric, no spaces
  form.value.username = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let pass = "";
  pass += "A"; // 1 uppercase
  pass += "a"; // 1 lowercase
  pass += "9"; // 1 number
  pass += "!"; // 1 special
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  form.value.password = pass;
};

const openAddModal = () => {
  isEdit.value = false;
  showPassword.value = false;
  modalError.value = "";
  suggestQuery.value = "";
  selectedPegawai.value = null;
  form.value = {
    id: null,
    id_pegawai: null,
    nama: "",
    username: "",
    password: "",
    id_role: masterRoles.value[0]?.id || 1,
    isActive: true
  };
  generatePassword();

  if (import.meta.client) {
    const modalEl = document.getElementById("modal-user-form");
    if (modalEl && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  }
};

const openEditModal = (userItem) => {
  isEdit.value = true;
  showPassword.value = false;
  modalError.value = "";
  suggestQuery.value = userItem.nama_pegawai || userItem.nama;
  selectedPegawai.value = {
    id: userItem.id_pegawai,
    nama_pegawai: userItem.nama_pegawai || userItem.nama,
    nama_jabatan: userItem.nama_jabatan,
    nama_departemen: userItem.nama_departemen
  };
  form.value = {
    id: userItem.id,
    id_pegawai: userItem.id_pegawai,
    nama: userItem.nama,
    username: userItem.username,
    password: "",
    id_role: userItem.id_role,
    isActive: userItem.disabled === 0
  };

  if (import.meta.client) {
    const modalEl = document.getElementById("modal-user-form");
    if (modalEl && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  }
};

const saveUser = async () => {
  modalError.value = "";
  if (!selectedPegawai.value) {
    modalError.value = "Nama pengguna wajib dipilih dari daftar autosuggestion pegawai";
    return;
  }

  saving.value = true;
  try {
    const endpoint = isEdit.value ? `/api/user/${form.value.id}` : "/api/user";
    const method = isEdit.value ? "PUT" : "POST";

    const res = await $fetch(endpoint, {
      method,
      body: {
        id: form.value.id,
        id_pegawai: form.value.id_pegawai,
        nama: form.value.nama,
        username: form.value.username,
        password: form.value.password || undefined,
        id_role: form.value.id_role,
        disabled: !form.value.isActive
      }
    });

    if (res.success) {
      alert(res.message);
      if (import.meta.client) {
        const modalEl = document.getElementById("modal-user-form");
        const modal = window.bootstrap?.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      fetchUsers();
    }
  } catch (err) {
    const errorData = err.data?.data;
    if (errorData && errorData.errors) {
      const firstErr = Object.values(errorData.errors)[0];
      modalError.value = `Validasi Gagal: ${firstErr}`;
    } else {
      modalError.value = err.data?.statusMessage || err.data?.message || err.message || "Gagal menyimpan user";
    }
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (u) => {
  if (u.id === 1) {
    alert("Dilarang menghapus akun Superadmin awal!");
    return;
  }
  if (!confirm(`Hapus user ${u.username}?`)) return;
  try {
    const res = await $fetch(`/api/user/${u.id}`, { method: "DELETE" });
    alert(res.message);
    fetchUsers();
  } catch (err) {
    alert(err.data?.statusMessage || "Gagal menghapus user");
  }
};

const toggleStatus = async (u) => {
  const newStatus = u.disabled === 0 ? "Nonaktif" : "Aktif";
  if (!confirm(`Ubah status user ${u.username} menjadi ${newStatus}?`)) return;

  try {
    const res = await $fetch(`/api/user/${u.id}`, {
      method: "PATCH",
      body: { disabled: u.disabled === 0 ? 1 : 0 }
    });
    alert(res.message);
    fetchUsers();
  } catch (err) {
    alert(err.data?.statusMessage || err.message || "Gagal mengubah status user");
  }
};

onMounted(() => {
  fetchRoles();
  fetchUsers();
});
</script>
