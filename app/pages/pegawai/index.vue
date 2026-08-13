<script setup>
definePageMeta({
  title: "Data Pegawai",
});

useSeoMeta({
  title: "Data Pegawai",
});

import { ref, onMounted, watch } from "vue";
import {
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconFileDescription,
  IconCloudDownload,
  IconFileSpreadsheet
} from "@tabler/icons-vue";

const pegawaiList = ref([]);
const masterJabatan = ref([]);
const loading = ref(false);

const search = ref("");
const filterJabatanArr = ref([]);
const filterKontrak = ref("");
const minMasaKerja = ref("");
const maxMasaKerja = ref("");

const filterJabatanSelectedLabels = computed(() => {
  if (filterJabatanArr.value.length === 0) return 'Semua Jabatan';
  if (filterJabatanArr.value.length === 1) {
    const found = masterJabatan.value.find(j => j.id === filterJabatanArr.value[0]);
    return found ? found.nama : '1 Jabatan';
  }
  return `${filterJabatanArr.value.length} Jabatan Terpilih`;
});

const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const totalRecords = ref(0);

const sortBy = ref("id");
const sortDir = ref("asc");

const selectedIds = ref([]);
const selectAll = ref(false);
const bulkStatus = ref("");

const fetchMaster = async () => {
  try {
    const res = await $fetch("/api/master");
    if (res.success) {
      masterJabatan.value = res.data.masterData.filter(d => d.tipe === "jabatan");
    }
  } catch (err) {
    console.error("Failed to fetch master data:", err);
  }
};

const fetchPegawai = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit: limit.value,
      search: search.value,
      jabatan: filterJabatanArr.value.join(','),
      statusKontrak: filterKontrak.value,
      minMasaKerja: minMasaKerja.value,
      maxMasaKerja: maxMasaKerja.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    });

    const res = await $fetch(`/api/pegawai?${params.toString()}`);
    if (res.success) {
      pegawaiList.value = res.data;
      totalPages.value = res.pagination.totalPages;
      totalRecords.value = res.pagination.total;
    }
  } catch (err) {
    console.error("Failed to fetch pegawai list:", err);
  } finally {
    loading.value = false;
  }
};

const toggleSort = (col) => {
  if (sortBy.value === col) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = col;
    sortDir.value = "asc";
  }
  fetchPegawai();
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = pegawaiList.value.map(p => p.id);
  } else {
    selectedIds.value = [];
  }
};

const applyBulkStatus = async () => {
  if (selectedIds.value.length === 0 || !bulkStatus.value) return;
  try {
    const res = await $fetch("/api/pegawai/bulk-status", {
      method: "POST",
      body: {
        ids: selectedIds.value,
        status: bulkStatus.value
      }
    });
    alert(res.message);
    selectedIds.value = [];
    selectAll.value = false;
    bulkStatus.value = "";
    fetchPegawai();
  } catch (err) {
    alert(err.data?.statusMessage || "Gagal mengubah status masal");
  }
};

const deleteSingle = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data pegawai ini?")) return;
  try {
    const res = await $fetch(`/api/pegawai/${id}`, { method: "DELETE" });
    alert(res.message);
    fetchPegawai();
  } catch (err) {
    alert(err.data?.statusMessage || "Gagal menghapus data pegawai");
  }
};

const exportData = (type) => {
  const params = new URLSearchParams({
    type,
    search: search.value,
    jabatan: filterJabatanArr.value.join(','),
    statusKontrak: filterKontrak.value,
    minMasaKerja: minMasaKerja.value,
    maxMasaKerja: maxMasaKerja.value,
    sortBy: sortBy.value,
    sortDir: sortDir.value
  });
  window.open(`/api/pegawai/export?${params.toString()}`, "_blank");
};

watch([search, filterJabatanArr, filterKontrak, minMasaKerja, maxMasaKerja], () => {
  page.value = 1;
  fetchPegawai();
});

const currentUserRole = ref("");
const isManagerHrd = computed(() => currentUserRole.value === 'Manager HRD');

onMounted(() => {
  if (import.meta.client) {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      if (u) currentUserRole.value = u.role || '';
    } catch(e) {}
  }
  fetchMaster();
  fetchPegawai();
});
</script>

<template>
  <div>
    <div class="d-flex justify-content-end gap-2 mb-3">
      <button class="btn btn-outline-success" @click="exportData('excel')">
        <IconFileSpreadsheet size="18" class="me-1" /> Excel
      </button>
      <button class="btn btn-outline-danger" @click="exportData('pdf')">
        <IconCloudDownload size="18" class="me-1" /> PDF
      </button>
      <NuxtLink v-if="!isManagerHrd" to="/pegawai/form" class="btn btn-primary">
        <IconPlus stroke="{3}" size="20" class="me-1" /> Tambah Data
      </NuxtLink>
    </div>

    <div class="card">
      <!-- Filter Bar -->
      <div class="card-header">
        <div class="d-flex flex-wrap gap-2 w-100 align-items-center">
          <!-- Masa Kerja Filter -->
          <div class="d-flex align-items-center gap-1">
            <span class="text-nowrap small fw-bold">Masa Kerja (Thn):</span>
            <input v-model="minMasaKerja" type="number" min="0" placeholder="Min" class="form-control form-control-sm" style="width: 70px" />
            -
            <input v-model="maxMasaKerja" type="number" min="0" placeholder="Max" class="form-control form-control-sm" style="width: 70px" />
          </div>

          <!-- Filter Jabatan (Multi-select) -->
          <div class="dropdown">
            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
              {{ filterJabatanSelectedLabels }}
            </button>
            <div class="dropdown-menu p-2" style="max-height: 200px; overflow-y: auto; min-width: 200px;">
              <div v-for="j in masterJabatan" :key="j.id" class="form-check py-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="j.id"
                  :id="`jbt-${j.id}`"
                  v-model="filterJabatanArr"
                />
                <label class="form-check-label small" :for="`jbt-${j.id}`">
                  {{ j.nama }}
                </label>
              </div>
            </div>
          </div>

          <!-- Filter Kontrak -->
          <select v-model="filterKontrak" class="form-select form-select-sm" style="width: 150px">
            <option value="">Status Kontrak</option>
            <option value="PKWTT">PKWTT (Tetap)</option>
            <option value="PKWT">PKWT (Kontrak)</option>
            <option value="Magang">Magang</option>
          </select>

          <!-- Search Input -->
          <div class="input-group input-group-sm ms-auto" style="width: 220px">
            <input v-model="search" type="text" class="form-control" placeholder="Cari NIP / Nama..." />
            <button class="btn btn-outline-secondary" type="button" @click="fetchPegawai">
              <IconSearch size="16" />
            </button>
          </div>
        </div>

        <!-- Bulk Status Bar (Appears when checkbox selected for Admin HRD) -->
        <div v-if="!isManagerHrd && selectedIds.length > 0" class="alert alert-info mt-2 mb-0 py-2 d-flex align-items-center gap-2 w-100">
          <span>Terpilih <strong>{{ selectedIds.length }}</strong> data pegawai:</span>
          <select v-model="bulkStatus" class="form-select form-select-sm" style="width: 160px">
            <option value="">Ubah Status Ke...</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
          <button class="btn btn-sm btn-primary" @click="applyBulkStatus">Terapkan</button>
        </div>
      </div>

      <!-- Table View -->
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter table-hover table-striped">
          <thead>
            <tr>
              <th v-if="!isManagerHrd" width="30" class="text-center">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="form-check-input" />
              </th>
              <th width="5">No</th>
              <th style="cursor: pointer;" @click="toggleSort('nip')">
                NIP <span v-if="sortBy === 'nip'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th style="cursor: pointer;" @click="toggleSort('nama')">
                Nama <span v-if="sortBy === 'nama'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th style="cursor: pointer;" @click="toggleSort('jabatan')">
                Jabatan <span v-if="sortBy === 'jabatan'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th style="cursor: pointer;" @click="toggleSort('tanggal_masuk')">
                Tanggal Masuk <span v-if="sortBy === 'tanggal_masuk'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th style="cursor: pointer;" @click="toggleSort('masa_kerja')">
                Masa Kerja <span v-if="sortBy === 'masa_kerja'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th>Status</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div> Memuat data...
              </td>
            </tr>
            <tr v-else-if="pegawaiList.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">Data pegawai tidak ditemukan</td>
            </tr>
            <tr v-for="(p, index) in pegawaiList" :key="p.id">
              <td v-if="!isManagerHrd" class="text-center">
                <input type="checkbox" :value="p.id" v-model="selectedIds" class="form-check-input" />
              </td>
              <td class="text-center">{{ (page - 1) * limit + index + 1 }}</td>
              <td><code>{{ p.nip }}</code></td>
              <td class="fw-bold">{{ p.nama_pegawai }}</td>
              <td>{{ p.nama_jabatan || '-' }}</td>
              <td>{{ p.tanggal_masuk }}</td>
              <td>{{ p.masa_kerja_tahun || 0 }} Tahun</td>
              <td>
                <span class="badge" :class="p.status === 'Aktif' ? 'bg-success-lt' : 'bg-danger-lt'">
                  {{ p.status }}
                </span>
              </td>
              <td class="text-center">
                <div class="btn-list flex-nowrap justify-content-center">
                  <a :href="`/api/pegawai/${p.id}/pdf`" target="_blank" class="btn btn-icon btn-sm btn-ghost-danger" title="Download PDF Biodata">
                    <IconCloudDownload size="18" />
                  </a>
                  <NuxtLink :to="`/pegawai/detail/${p.id}`" class="btn btn-icon btn-sm btn-ghost-info" title="Detail">
                    <IconFileDescription size="18" />
                  </NuxtLink>
                  <NuxtLink v-if="!isManagerHrd" :to="`/pegawai/form/${p.id}`" class="btn btn-icon btn-sm btn-ghost-warning" title="Edit">
                    <IconPencil size="18" />
                  </NuxtLink>
                  <button v-if="!isManagerHrd" class="btn btn-icon btn-sm btn-ghost-danger" title="Hapus" @click="deleteSingle(p.id)">
                    <IconTrash size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="card-footer d-flex align-items-center" v-if="totalPages > 1">
        <span class="text-muted small">Total {{ totalRecords }} pegawai</span>
        <ul class="pagination ms-auto m-0">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="page--; fetchPegawai()">Prev</button>
          </li>
          <li class="page-item disabled">
            <span class="page-link">{{ page }} / {{ totalPages }}</span>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <button class="page-link" @click="page++; fetchPegawai()">Next</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
