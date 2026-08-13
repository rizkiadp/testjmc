<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 class="card-title m-0">Bulan {{ period || '-' }}</h3>
      <NuxtLink to="/tunjangan/transport" class="btn btn-outline-secondary btn-sm">
        &larr; Kembali
      </NuxtLink>
    </div>

    <!-- Ringkasan Rekap Header -->
    <div class="row g-3 mb-3" v-if="headerInfo">
      <div class="col-md-6">
        <div class="card card-sm">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="bg-primary text-white avatar">
                  <IconUsers size="20" />
                </span>
              </div>
              <div class="col">
                <div class="font-weight-medium">Total Penerima</div>
                <div class="text-muted">{{ headerInfo.totalRecipients }} Pegawai</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card card-sm">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="bg-success text-white avatar">
                  <IconCash size="20" />
                </span>
              </div>
              <div class="col">
                <div class="font-weight-medium">Total Nominal Tunjangan</div>
                <div class="text-success fw-bold">Rp {{ parseFloat(headerInfo.totalAmount || 0).toLocaleString('id-ID') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto align-items-center">
          <div class="input-group input-group-sm" style="width: 240px">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Cari Nama Penerima..."
              @input="onSearchInput"
              @keyup.enter="fetchDetail(1)"
            />
            <button class="btn btn-outline-secondary" type="button" @click="fetchDetail(1)">
              <IconSearch size="16" />
            </button>
          </div>
        </div>
      </div>
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter table-striped table-hover">
          <thead>
            <tr>
              <th width="5" class="text-center">No</th>
              <th class="cursor-pointer" @click="toggleSort('nama')">
                Nama Penerima
                <span v-if="sortBy === 'nama'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="text-center cursor-pointer" @click="toggleSort('km')">
                Kilometer (KM)
                <span v-if="sortBy === 'km'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="text-center cursor-pointer" @click="toggleSort('hari')">
                Jumlah Hari
                <span v-if="sortBy === 'hari'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="text-end cursor-pointer" @click="toggleSort('nominal')">
                Nominal
                <span v-if="sortBy === 'nominal'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th v-if="isAdminHrd" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="isAdminHrd ? 6 : 5" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div> Memuat detail penerima...
              </td>
            </tr>
            <tr v-else-if="detailList.length === 0">
              <td :colspan="isAdminHrd ? 6 : 5" class="text-center py-4 text-muted">Tidak ada data penerima tunjangan</td>
            </tr>
            <tr v-else v-for="(item, index) in detailList" :key="item.id">
              <td class="text-center">{{ (page - 1) * limit + index + 1 }}</td>
              <td class="fw-bold">{{ item.name }}</td>
              <td class="text-center">{{ item.km }} KM</td>
              <td class="text-center">{{ item.workingDays }} Hari</td>
              <td class="text-end fw-bold text-success">Rp {{ parseFloat(item.amount).toLocaleString('id-ID') }}</td>
              <td v-if="isAdminHrd" class="text-center">
                <button
                  class="btn btn-sm btn-outline-primary"
                  title="Input / Edit Total Masuk"
                  @click="openInputModal(item)"
                >
                  <IconEdit size="16" class="me-1" /> Edit Hari
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Real Dynamic Pagination Footer -->
      <div class="card-footer d-flex align-items-center justify-content-between py-2" v-if="total > 0">
        <p class="m-0 text-muted">
          Menampilkan <span>{{ (page - 1) * limit + 1 }}</span> hingga <span>{{ Math.min(page * limit, total) }}</span> dari <span>{{ total }}</span> entri
        </p>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" :class="{ disabled: page <= 1 }">
            <button class="page-link" @click="fetchDetail(page - 1)" :disabled="page <= 1">
              Sebelumnya
            </button>
          </li>
          <li
            v-for="pNum in totalPages"
            :key="pNum"
            class="page-item"
            :class="{ active: pNum === page }"
          >
            <button class="page-link" @click="fetchDetail(pNum)">{{ pNum }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page >= totalPages }">
            <button class="page-link" @click="fetchDetail(page + 1)" :disabled="page >= totalPages">
              Selanjutnya
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Modal Edit Total Masuk -->
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Input / Edit Total Masuk per Bulan</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <form @submit.prevent="saveTotalMasuk">
          <div class="modal-body">
            <div v-if="modalError" class="alert alert-danger py-2 small mb-3">
              {{ modalError }}
            </div>
            <div class="mb-3">
              <label class="form-label">Nama Pegawai</label>
              <input type="text" class="form-control bg-light" :value="selectedItem?.name" readonly />
            </div>
            <div class="mb-3">
              <label class="form-label required">Total Masuk per Bulan</label>
              <input
                v-model="inputHari"
                type="number"
                class="form-control"
                min="0"
                max="31"
                placeholder="Jumlah hari masuk (0 - 31)"
                required
              />
              <small class="text-muted">Masukkan bilangan bulat antara 0 sampai jumlah hari kalender bulan ini.</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              Simpan Total Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Detail Tunjangan Transport",
});

useSeoMeta({
  title: "Detail Tunjangan Transport",
});

import { ref, computed, onMounted } from "vue";
import { IconSearch, IconUsers, IconCash, IconEdit } from "@tabler/icons-vue";

const route = useRoute();
const headerId = route.params.id;

const currentUserRole = ref("");
const isAdminHrd = computed(() => {
  return currentUserRole.value === 'Admin HRD' || currentUserRole.value === '3';
});

const detailList = ref([]);
const period = ref("");
const headerInfo = ref(null);
const loading = ref(false);
const search = ref("");
const sortBy = ref("id");
const sortDir = ref("asc");

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const totalPages = ref(1);

const showModal = ref(false);
const selectedItem = ref(null);
const inputHari = ref(0);
const saving = ref(false);
const modalError = ref("");

let searchTimer = null;

const openInputModal = (item) => {
  selectedItem.value = item;
  inputHari.value = item.workingDays || 0;
  modalError.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

const saveTotalMasuk = async () => {
  saving.value = true;
  modalError.value = "";
  try {
    const periodParts = period.value.split('/');
    const b = parseInt(periodParts[0]);
    const t = parseInt(periodParts[1]);

    const res = await $fetch('/api/tunjangan/total-masuk', {
      method: 'POST',
      body: {
        id_pegawai: selectedItem.value.idPegawai || selectedItem.value.id_pegawai || selectedItem.value.id,
        bulan: b,
        tahun: t,
        total_masuk: inputHari.value
      }
    });

    if (res.success) {
      closeModal();
      // Recalculate tunjangan for this period
      await $fetch('/api/tunjangan/hitung', {
        method: 'POST',
        body: { bulan: b, tahun: t }
      });
      fetchDetail();
    }
  } catch (err) {
    modalError.value = err.data?.data?.errors?.total_masuk || err.data?.statusMessage || "Gagal menyimpan total masuk";
  } finally {
    saving.value = false;
  }
};

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    fetchDetail(1);
  }, 350);
};

const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortDir.value = "asc";
  }
  fetchDetail(1);
};

const fetchDetail = async (targetPage = null) => {
  if (targetPage !== null) {
    page.value = targetPage;
  }
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit: limit.value,
      search: search.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    });

    const res = await $fetch(`/api/tunjangan/${headerId}?${params.toString()}`);
    if (res.success) {
      detailList.value = res.data || [];
      period.value = res.period;
      headerInfo.value = {
        totalRecipients: res.totalRecipients,
        totalAmount: res.totalAmount
      };
      total.value = res.total || 0;
      totalPages.value = res.totalPages || 1;
    }
  } catch (err) {
    console.error("Gagal mengambil detail tunjangan:", err);
  } finally {
    loading.value = false;
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

  fetchDetail();
});
</script>
