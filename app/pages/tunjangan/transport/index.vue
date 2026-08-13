<template>
  <div>
    <!-- Navigation Tabs -->
    <div class="card mb-3">
      <div class="card-header border-0 pb-0">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'rekap' }"
              @click="activeTab = 'rekap'"
            >
              Rekap Tunjangan Bulanan
            </button>
          </li>
          <li class="nav-item" v-if="isAdminHrd">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'inputHari' }"
              @click="activeTab = 'inputHari'"
            >
              Input Total Hari Masuk Kerja
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- TAB 1: REKAP TUNJANGAN BULANAN -->
    <div v-if="activeTab === 'rekap'" class="card">
      <div class="card-header">
        <h3 class="card-title">Daftar Rekap Tunjangan Transport Per Bulan</h3>
        <div class="d-flex gap-2 ms-auto">
          <!-- Filter Tahun -->
          <select v-model="selectedTahun" class="form-select" style="width: 150px" @change="fetchTunjangan">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <!-- Tombol Hitung Tunjangan Bulan Berjalan (Khusus Admin HRD) -->
          <button v-if="isAdminHrd" class="btn btn-success" @click="triggerHitungTunjangan" :disabled="calculating">
            <span v-if="calculating" class="spinner-border spinner-border-sm me-1"></span>
            Hitung Tunjangan Bulan Ini
          </button>
        </div>
      </div>
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter table-striped">
          <thead>
            <tr>
              <th width="5">No</th>
              <th>Nama Bulan</th>
              <th>Tahun</th>
              <th class="text-center">Total Penerima</th>
              <th class="text-end">Total Tunjangan Transport</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tunjanganList.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                Belum ada data perhitungan tunjangan transport di tahun {{ selectedTahun }}. Klik tombol "Hitung Tunjangan Bulan Ini" di atas.
              </td>
            </tr>
            <tr v-for="(item, index) in tunjanganList" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="fw-bold">{{ getNamaBulan(item.bulan) }}</td>
              <td>{{ item.tahun }}</td>
              <td class="text-center">{{ item.total_penerima }} Pegawai</td>
              <td class="text-end fw-bold text-success">
                Rp {{ parseFloat(item.total_nominal).toLocaleString('id-ID') }}
              </td>
              <td class="text-center">
                <NuxtLink :to="`/tunjangan/transport/detail/${item.id}`" class="btn btn-sm btn-outline-primary">
                  Detail Rincian
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: INPUT TOTAL HARI MASUK KERJA (ADMIN HRD) -->
    <div v-if="activeTab === 'inputHari' && isAdminHrd" class="row">
      <!-- FORM INPUT -->
      <div class="col-md-5">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Form Input Total Hari Masuk Kerja</h3>
          </div>
          <div class="card-body">
            <div v-if="successMessage" class="alert alert-success alert-dismissible py-2 mb-3">
              {{ successMessage }}
            </div>
            <div v-if="formError" class="alert alert-danger py-2 mb-3">
              {{ formError }}
            </div>

            <form @submit.prevent="submitTotalMasuk">
              <!-- Periode Bulan & Tahun -->
              <div class="row mb-3">
                <div class="col-6">
                  <label class="form-label required">Bulan</label>
                  <select v-model.number="inputBulan" class="form-select" @change="fetchSavedTotalMasuk" required>
                    <option v-for="(bName, bIdx) in namaBulanList" :key="bIdx + 1" :value="bIdx + 1">
                      {{ bName }}
                    </option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label required">Tahun</label>
                  <select v-model.number="inputTahun" class="form-select" @change="fetchSavedTotalMasuk" required>
                    <option :value="2026">2026</option>
                    <option :value="2025">2025</option>
                    <option :value="2024">2024</option>
                  </select>
                </div>
              </div>

              <!-- Autosuggest Pegawai -->
              <div class="mb-3 position-relative">
                <label class="form-label required">Pegawai</label>
                <input
                  v-model="pegawaiSearch"
                  type="text"
                  class="form-control"
                  placeholder="Ketik min 2 huruf nama pegawai..."
                  @input="onPegawaiSearchInput"
                  required
                />
                <small class="text-muted" v-if="selectedPegawai">
                  Terpilih: <strong>{{ selectedPegawai.nama_pegawai }}</strong> ({{ selectedPegawai.nip }})
                </small>

                <!-- Dropdown Autosuggest -->
                <div v-if="pegawaiSuggestions.length > 0" class="list-group position-absolute w-100 shadow-lg mt-1 bg-white border rounded" style="max-height: 200px; overflow-y: auto; z-index: 1050; top: 100%;">
                  <button
                    type="button"
                    class="list-group-item list-group-item-action py-2 bg-white text-dark"
                    v-for="s in pegawaiSuggestions"
                    :key="s.id"
                    @click="selectPegawai(s)"
                  >
                    <strong class="text-dark">{{ s.nama_pegawai }}</strong> <small class="text-secondary">({{ s.nip }}) - {{ s.nama_jabatan || 'Staff' }}</small>
                  </button>
                </div>
              </div>

              <!-- Total Hari Masuk -->
              <div class="mb-3">
                <label class="form-label required">Total Hari Masuk</label>
                <input
                  v-model.number="totalMasukVal"
                  type="number"
                  class="form-control"
                  :min="0"
                  :max="maxDaysInSelectedMonth"
                  placeholder="Jumlah hari masuk kerja"
                  required
                />
                <small class="text-muted">
                  Batas maksimal untuk {{ namaBulanList[inputBulan - 1] }} {{ inputTahun }} adalah {{ maxDaysInSelectedMonth }} hari.
                </small>
              </div>

              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                  Simpan Total Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- DAFTAR DATA TERSIMPAN -->
      <div class="col-md-7">
        <div class="card">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h3 class="card-title">Data Total Masuk ({{ namaBulanList[inputBulan - 1] }} {{ inputTahun }})</h3>
          </div>
          <div class="table-responsive card-body p-0">
            <table class="table table-vcenter table-striped">
              <thead>
                <tr>
                  <th width="5">No</th>
                  <th>Nama Pegawai</th>
                  <th class="text-center">Bulan</th>
                  <th class="text-center">Tahun</th>
                  <th class="text-center">Total Masuk</th>
                  <th class="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="savedTotalMasukList.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    Belum ada data total masuk untuk periode {{ namaBulanList[inputBulan - 1] }} {{ inputTahun }}.
                  </td>
                </tr>
                <tr v-for="(row, idx) in savedTotalMasukList" :key="row.id">
                  <td class="text-center">{{ idx + 1 }}</td>
                  <td class="fw-bold">{{ row.nama_pegawai }}</td>
                  <td class="text-center">{{ getNamaBulan(row.bulan) }}</td>
                  <td class="text-center">{{ row.tahun }}</td>
                  <td class="text-center fw-bold text-blue">{{ row.total_masuk }} Hari</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary" @click="editSavedRow(row)">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Tunjangan Transport",
});

useSeoMeta({
  title: "Tunjangan Transport",
});

import { ref, computed, onMounted } from "vue";

const activeTab = ref("rekap");
const selectedTahun = ref("2026");
const tunjanganList = ref([]);
const calculating = ref(false);

// Role Check for Admin HRD
const currentUserRole = ref("");
const isAdminHrd = computed(() => {
  return currentUserRole.value === 'Admin HRD' || currentUserRole.value === '3';
});

// Input Hari Masuk Form State
const inputBulan = ref(8); // Default Agustus
const inputTahun = ref(2026);
const pegawaiSearch = ref("");
const selectedPegawai = ref(null);
const pegawaiSuggestions = ref([]);
const totalMasukVal = ref(22);
const saving = ref(false);
const successMessage = ref("");
const formError = ref("");
const savedTotalMasukList = ref([]);

const namaBulanList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const maxDaysInSelectedMonth = computed(() => {
  return new Date(inputTahun.value, inputBulan.value, 0).getDate();
});

const getNamaBulan = (bInt) => {
  return namaBulanList[bInt - 1] || bInt;
};

let suggestTimer = null;
const onPegawaiSearchInput = () => {
  selectedPegawai.value = null;
  if (suggestTimer) clearTimeout(suggestTimer);
  if (pegawaiSearch.value.trim().length < 2) {
    pegawaiSuggestions.value = [];
    return;
  }
  suggestTimer = setTimeout(async () => {
    try {
      const res = await $fetch(`/api/pegawai/suggest?q=${encodeURIComponent(pegawaiSearch.value)}`);
      pegawaiSuggestions.value = res.data || [];
    } catch (err) {
      pegawaiSuggestions.value = [];
    }
  }, 250);
};

const selectPegawai = (p) => {
  selectedPegawai.value = p;
  pegawaiSearch.value = p.nama_pegawai;
  pegawaiSuggestions.value = [];
};

const fetchSavedTotalMasuk = async () => {
  try {
    const res = await $fetch(`/api/tunjangan/total-masuk?bulan=${inputBulan.value}&tahun=${inputTahun.value}`);
    if (res.success) {
      savedTotalMasukList.value = res.data || [];
    }
  } catch (err) {
    savedTotalMasukList.value = [];
  }
};

const editSavedRow = (row) => {
  selectedPegawai.value = { id: row.id_pegawai, nama_pegawai: row.nama_pegawai, nip: row.nip };
  pegawaiSearch.value = row.nama_pegawai;
  totalMasukVal.value = row.total_masuk;
};

const submitTotalMasuk = async () => {
  formError.value = "";
  successMessage.value = "";

  // 1. Frontend validation: Pegawai wajib dipilih
  if (!selectedPegawai.value || !selectedPegawai.value.id) {
    formError.value = "Pegawai wajib dipilih dari autosuggestion";
    return;
  }

  // 2. Frontend validation: Total masuk bounds
  const tm = Number(totalMasukVal.value);
  if (isNaN(tm) || !Number.isInteger(tm)) {
    formError.value = "Total masuk harus berupa bilangan bulat (integer)";
    return;
  }

  if (tm < 0) {
    formError.value = "Total masuk tidak boleh negatif";
    return;
  }

  if (tm > maxDaysInSelectedMonth.value) {
    formError.value = `Total masuk untuk bulan ${namaBulanList[inputBulan.value - 1]} ${inputTahun.value} maksimal ${maxDaysInSelectedMonth.value} hari`;
    return;
  }

  saving.value = true;
  try {
    const res = await $fetch('/api/tunjangan/total-masuk', {
      method: 'POST',
      body: {
        id_pegawai: selectedPegawai.value.id,
        bulan: inputBulan.value,
        tahun: inputTahun.value,
        total_masuk: tm
      }
    });

    if (res.success) {
      successMessage.value = res.message || "Data total hari masuk berhasil disimpan!";
      fetchSavedTotalMasuk();
    }
  } catch (err) {
    formError.value = err.data?.data?.errors?.total_masuk || err.data?.data?.errors?.id_pegawai || err.data?.statusMessage || "Gagal menyimpan total masuk";
  } finally {
    saving.value = false;
  }
};

const fetchTunjangan = async () => {
  try {
    const res = await $fetch(`/api/tunjangan?tahun=${selectedTahun.value}`);
    if (res.success) {
      tunjanganList.value = res.data || [];
    }
  } catch (err) {
    console.error("Gagal mengambil daftar tunjangan:", err);
  }
};

const triggerHitungTunjangan = async () => {
  calculating.value = true;
  try {
    const now = new Date();
    const res = await $fetch("/api/tunjangan/hitung", {
      method: "POST",
      body: {
        bulan: now.getMonth() + 1,
        tahun: now.getFullYear()
      }
    });

    if (res.success) {
      alert(res.message || "Perhitungan tunjangan transport berhasil diproses!");
      fetchTunjangan();
    }
  } catch (err) {
    alert(err.data?.statusMessage || "Gagal menghitung tunjangan transport");
  } finally {
    calculating.value = false;
  }
};

onMounted(async () => {
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        currentUserRole.value = parsed.role || parsed.nama_role || '';
      }
    } catch (e) {}
  }
  
  try {
    const me = await $fetch('/api/auth/me');
    if (me.user) {
      currentUserRole.value = me.user.nama_role || me.user.role || '';
    }
  } catch (e) {}

  fetchTunjangan();
  if (isAdminHrd.value) {
    fetchSavedTotalMasuk();
  }
});
</script>
