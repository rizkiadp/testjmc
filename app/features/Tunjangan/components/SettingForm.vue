<template>
  <div class="row g-3">
    <!-- Section Form (Tambah / Edit) -->
    <div class="col-lg-5">
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between">
          <h3 class="card-title m-0">
            {{ isEdit ? 'Edit Setting Tunjangan' : 'Tambah Setting Tunjangan Baru' }}
          </h3>
          <button v-if="isEdit" class="btn btn-sm btn-outline-secondary" @click="resetForm">
            + Tambah Baru
          </button>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveSetting">
            <div v-if="successMessage" class="alert alert-success py-2 small mb-3">
              {{ successMessage }}
            </div>

            <!-- Base Fare / Tarif per KM -->
            <div class="mb-3">
              <label class="form-label required">Base Fare (Tarif per KM)</label>
              <div class="input-group">
                <span class="input-group-text">Rp</span>
                <input
                  v-model="displayTarif"
                  type="text"
                  class="form-control"
                  placeholder="5.000"
                  @input="onTarifInput"
                  required
                />
                <span class="input-group-text">/ km</span>
              </div>
              <small class="text-muted">Ketik angka saja, format Rupiah terbentuk otomatis</small>
            </div>

            <!-- Berlaku Mulai -->
            <div class="mb-3">
              <label class="form-label required">Berlaku Mulai</label>
              <input v-model="form.berlaku_mulai" type="date" class="form-control" required />
            </div>

            <!-- Min & Max KM -->
            <div class="row g-2 mb-3">
              <div class="col-md-6">
                <label class="form-label required">Min Jarak (KM)</label>
                <input v-model="form.min_km" type="number" min="0" max="99" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label required">Max Jarak (KM)</label>
                <input v-model="form.max_km" type="number" min="1" max="99" class="form-control" required />
              </div>
            </div>

            <!-- Minimum Hari Masuk -->
            <div class="mb-4">
              <label class="form-label required">Minimum Hari Masuk Kerja</label>
              <input v-model="form.min_hari_masuk" type="number" min="1" max="31" class="form-control" required />
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button v-if="isEdit" type="button" class="btn btn-secondary" @click="resetForm">
                Batal
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                {{ isEdit ? 'Update Setting' : 'Simpan Setting' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Section Table Daftar Setting Tunjangan -->
    <div class="col-lg-7">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daftar Riwayat Setting Tunjangan Transport</h3>
        </div>
        <div class="table-responsive card-body p-0">
          <table class="table table-vcenter table-striped table-hover">
            <thead>
              <tr>
                <th width="5">ID</th>
                <th>Tarif / KM</th>
                <th>Berlaku Mulai</th>
                <th class="text-center">Min-Max KM</th>
                <th class="text-center">Min Hari</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="settingList.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  Belum ada data setting tunjangan transport
                </td>
              </tr>
              <tr v-for="item in settingList" :key="item.id">
                <td class="text-muted fw-bold">#{{ item.id }}</td>
                <td class="fw-bold text-success">
                  Rp {{ parseFloat(item.tarif_per_km).toLocaleString('id-ID') }}
                </td>
                <td>{{ item.berlaku_mulai }}</td>
                <td class="text-center">{{ item.min_km }} - {{ item.max_km }} KM</td>
                <td class="text-center">{{ item.min_hari_masuk }} Hari</td>
                <td class="text-center">
                  <div class="btn-list flex-nowrap justify-content-center">
                    <button class="btn btn-sm btn-outline-primary" title="Edit Setting" @click="editSetting(item)">
                      <IconEdit size="16" />
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Hapus Setting" @click="deleteSetting(item.id)">
                      <IconTrash size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { IconEdit, IconTrash } from '@tabler/icons-vue';

const settingList = ref([]);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
  tarif_per_km: 5000,
  berlaku_mulai: new Date().toISOString().split('T')[0],
  min_km: 5,
  max_km: 25,
  min_hari_masuk: 19
});

const displayTarif = ref('5.000');
const loading = ref(false);
const successMessage = ref('');

const formatRupiahInput = (val) => {
  const numberString = (val || 0).toString().replace(/[^,\d]/g, '');
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const onTarifInput = (e) => {
  const raw = e.target.value.replace(/\./g, '');
  const parsed = parseInt(raw) || 0;
  form.value.tarif_per_km = parsed;
  displayTarif.value = formatRupiahInput(parsed);
};

const resetForm = () => {
  isEdit.value = false;
  editId.value = null;
  form.value = {
    tarif_per_km: 5000,
    berlaku_mulai: new Date().toISOString().split('T')[0],
    min_km: 5,
    max_km: 25,
    min_hari_masuk: 19
  };
  displayTarif.value = '5.000';
  successMessage.value = '';
};

const fetchSettings = async () => {
  try {
    const res = await $fetch('/api/tunjangan/setting');
    if (res.success) {
      settingList.value = res.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch settings:', err);
  }
};

const editSetting = (item) => {
  isEdit.value = true;
  editId.value = item.id;
  form.value = {
    tarif_per_km: parseInt(item.tarif_per_km),
    berlaku_mulai: item.berlaku_mulai,
    min_km: item.min_km,
    max_km: item.max_km,
    min_hari_masuk: item.min_hari_masuk
  };
  displayTarif.value = formatRupiahInput(item.tarif_per_km);
  successMessage.value = '';
};

const saveSetting = async () => {
  loading.value = true;
  successMessage.value = '';
  try {
    const endpoint = isEdit.value ? `/api/tunjangan/setting/${editId.value}` : '/api/tunjangan/setting';
    const method = isEdit.value ? 'PUT' : 'POST';

    const res = await $fetch(endpoint, {
      method,
      body: form.value
    });

    if (res.success) {
      successMessage.value = res.message;
      fetchSettings();
      if (!isEdit.value) {
        resetForm();
      }
    }
  } catch (err) {
    alert(err.data?.statusMessage || 'Gagal menyimpan setting tunjangan');
  } finally {
    loading.value = false;
  }
};

const deleteSetting = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data setting tunjangan ini?')) return;
  try {
    const res = await $fetch(`/api/tunjangan/setting/${id}`, { method: 'DELETE' });
    alert(res.message);
    if (editId.value === id) {
      resetForm();
    }
    fetchSettings();
  } catch (err) {
    alert(err.data?.statusMessage || 'Gagal menghapus setting tunjangan');
  }
};

onMounted(() => {
  fetchSettings();
});
</script>
