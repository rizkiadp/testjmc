<template>
  <form @submit.prevent="handleSubmit" class="row g-3">
    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Diri Pegawai</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <!-- NIP -->
            <div class="col-md-6">
              <label class="form-label required">NIP</label>
              <input
                v-model="form.nip"
                type="text"
                class="form-control"
                placeholder="Contoh: 1990010101"
                required
              />
              <small class="text-muted">Min 8 digit angka tanpa spasi</small>
            </div>

            <!-- Nama Lengkap -->
            <div class="col-md-6">
              <label class="form-label required">Nama Lengkap</label>
              <input
                v-model="form.nama_pegawai"
                type="text"
                class="form-control"
                placeholder="Nama sesuai KTP"
                required
              />
            </div>

            <!-- Email -->
            <div class="col-md-6">
              <label class="form-label required">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="contoh@jmc.co.id"
                required
              />
            </div>

            <!-- No HP -->
            <div class="col-md-6">
              <label class="form-label required">Nomor HP</label>
              <input
                v-model="form.nomor_hp"
                type="text"
                class="form-control"
                placeholder="+6282218458888"
                required
              />
              <small class="text-muted">Format +62...</small>
            </div>

            <!-- Tempat Lahir -->
            <div class="col-md-5">
              <label class="form-label required">Tempat Lahir</label>
              <input v-model="form.tempat_lahir" type="text" class="form-control" required />
            </div>

            <!-- Tanggal Lahir -->
            <div class="col-md-5">
              <label class="form-label required">Tanggal Lahir</label>
              <input v-model="form.tanggal_lahir" type="date" class="form-control" @change="calculateAge" required />
            </div>

            <!-- Usia (Otomatis) -->
            <div class="col-md-2">
              <label class="form-label">Usia</label>
              <input v-model="form.usia" type="number" class="form-control bg-light" readonly />
            </div>

            <!-- Status Kawin & Anak -->
            <div class="col-md-6">
              <label class="form-label required">Status Kawin</label>
              <div class="d-flex gap-3 pt-2">
                <label class="form-check">
                  <input v-model="form.status_kawin" type="radio" value="kawin" class="form-check-input" />
                  <span class="form-check-label">Kawin</span>
                </label>
                <label class="form-check">
                  <input v-model="form.status_kawin" type="radio" value="tidak kawin" class="form-check-input" />
                  <span class="form-check-label">Tidak Kawin</span>
                </label>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Jumlah Anak</label>
              <input v-model="form.jumlah_anak" type="number" min="0" max="99" class="form-control" required />
            </div>

            <!-- Form Pendidikan Dinamis -->
            <div class="col-12 mt-3">
              <div class="card border">
                <div class="card-header py-2 d-flex justify-content-between align-items-center">
                  <span class="fw-bold small">Riwayat Pendidikan</span>
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="addPendidikan">
                    <IconPlus size="16" /> Tambah (+)
                  </button>
                </div>
                <div class="table-responsive p-0">
                  <table class="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Tingkat</th>
                        <th>Nama Sekolah / Kampus</th>
                        <th>Tahun Lulus</th>
                        <th width="40"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(p, idx) in form.pendidikan" :key="idx">
                        <td>
                          <input v-model="p.tingkat_pendidikan" type="text" placeholder="SD / SMP / S1" class="form-control form-control-sm" required />
                        </td>
                        <td>
                          <input v-model="p.nama_sekolah" type="text" placeholder="Nama Sekolah" class="form-control form-control-sm" required />
                        </td>
                        <td>
                          <input v-model="p.tahun_lulus" type="number" placeholder="2020" class="form-control form-control-sm" style="width: 90px" />
                        </td>
                        <td class="text-center">
                          <button type="button" class="btn btn-icon btn-sm btn-ghost-danger" @click="removePendidikan(idx)">
                            <IconXboxXFilled size="18" />
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
      </div>
    </div>

    <!-- Sisi Kanan: Alamat, Pekerjaan & Jabatan -->
    <div class="col-lg-6">
      <div class="card mb-3">
        <div class="card-header">
          <h3 class="card-title">Alamat & Wilayah</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <!-- Kecamatan Autocomplete -->
            <div class="col-12">
              <label class="form-label required">Kecamatan</label>
              <select v-model="form.id_kecamatan" class="form-select" @change="onKecamatanChange" required>
                <option value="">-- Pilih Kecamatan --</option>
                <option v-for="w in masterWilayah" :key="w.id" :value="w.id">
                  {{ w.kecamatan }} ({{ w.kabupaten }}, {{ w.provinsi }})
                </option>
              </select>
            </div>

            <!-- Kabupaten & Provinsi (Auto Disabled) -->
            <div class="col-md-6">
              <label class="form-label">Kabupaten / Kota</label>
              <input v-model="selectedKabupaten" type="text" class="form-control bg-light" readonly />
            </div>

            <div class="col-md-6">
              <label class="form-label">Provinsi</label>
              <input v-model="selectedProvinsi" type="text" class="form-control bg-light" readonly />
            </div>

            <!-- Alamat Lengkap -->
            <div class="col-12">
              <label class="form-label required">Alamat Lengkap</label>
              <textarea v-model="form.alamat_lengkap" class="form-control" rows="2" required></textarea>
            </div>

            <!-- Jarak Rumah-Kantor -->
            <div class="col-12">
              <label class="form-label required">Jarak Rumah ke Kantor (KM)</label>
              <input v-model="form.jarak_rumah_kantor" type="number" min="0" max="99" class="form-control" placeholder="Contoh: 15" required />
            </div>
          </div>
        </div>
      </div>

      <!-- Pekerjaan & Status -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Jabatan & Status</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label required">Tanggal Masuk</label>
              <input v-model="form.tanggal_masuk" type="date" class="form-control" required />
            </div>

            <div class="col-md-6">
              <label class="form-label required">Status Kontrak</label>
              <select v-model="form.status_kontrak" class="form-select" required>
                <option value="PKWTT">PKWTT (Pegawai Tetap)</option>
                <option value="PKWT">PKWT (Pegawai Kontrak)</option>
                <option value="Magang">Magang</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Jabatan</label>
              <select v-model="form.id_jabatan" class="form-select" required>
                <option value="">-- Pilih Jabatan --</option>
                <option v-for="j in masterJabatan" :key="j.id" :value="j.id">{{ j.nama }}</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Departemen</label>
              <select v-model="form.id_departemen" class="form-select" required>
                <option value="">-- Pilih Departemen --</option>
                <option v-for="d in masterDepartemen" :key="d.id" :value="d.id">{{ d.nama }}</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Status Kepegawaian</label>
              <select v-model="form.status" class="form-select" required>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <NuxtLink to="/pegawai" class="btn btn-secondary">Batal</NuxtLink>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              Simpan Data Pegawai
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { IconPlus, IconXboxXFilled } from '@tabler/icons-vue';

const props = defineProps({
  editId: { type: [Number, String], default: null }
});

const masterJabatan = ref([]);
const masterDepartemen = ref([]);
const masterWilayah = ref([]);

const selectedKabupaten = ref('');
const selectedProvinsi = ref('');
const loading = ref(false);

const form = ref({
  nip: '',
  nama_pegawai: '',
  email: '',
  nomor_hp: '+62',
  tempat_lahir: '',
  tanggal_lahir: '',
  usia: 0,
  status_kawin: 'kawin',
  jumlah_anak: 0,
  id_kecamatan: '',
  alamat_lengkap: '',
  jarak_rumah_kantor: 5,
  tanggal_masuk: new Date().toISOString().split('T')[0],
  id_jabatan: '',
  id_departemen: '',
  status_kontrak: 'PKWTT',
  status: 'Aktif',
  pendidikan: [
    { tingkat_pendidikan: 'S1', nama_sekolah: '', tahun_lulus: 2020 }
  ]
});

const calculateAge = () => {
  if (form.value.tanggal_lahir) {
    const birthDate = new Date(form.value.tanggal_lahir);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    form.value.usia = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
};

const onKecamatanChange = () => {
  const found = masterWilayah.value.find(w => w.id === parseInt(form.value.id_kecamatan));
  if (found) {
    selectedKabupaten.value = found.kabupaten;
    selectedProvinsi.value = found.provinsi;
  } else {
    selectedKabupaten.value = '';
    selectedProvinsi.value = '';
  }
};

const addPendidikan = () => {
  form.value.pendidikan.push({ tingkat_pendidikan: '', nama_sekolah: '', tahun_lulus: '' });
};

const removePendidikan = (index) => {
  if (form.value.pendidikan.length > 1) {
    form.value.pendidikan.splice(index, 1);
  }
};

const fetchMaster = async () => {
  try {
    const res = await $fetch('/api/master');
    if (res.success) {
      masterJabatan.value = res.data.masterData.filter(d => d.tipe === 'jabatan');
      masterDepartemen.value = res.data.masterData.filter(d => d.tipe === 'departemen');
      masterWilayah.value = res.data.wilayah;
    }
  } catch (err) {
    console.error('Failed to fetch master:', err);
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const endpoint = props.editId ? `/api/pegawai/${props.editId}` : '/api/pegawai';
    const method = props.editId ? 'PUT' : 'POST';

    const res = await $fetch(endpoint, {
      method,
      body: form.value
    });

    if (res.success) {
      alert(res.message);
      navigateTo('/pegawai');
    }
  } catch (err) {
    const errorData = err.data?.data;
    if (errorData && errorData.errors) {
      const firstErr = Object.values(errorData.errors)[0];
      alert(`Validasi Gagal: ${firstErr}`);
    } else {
      alert(err.data?.statusMessage || err.data?.message || err.message || 'Gagal menyimpan data pegawai');
    }
  } finally {
    loading.value = false;
  }
};

const fetchDetail = async () => {
  if (!props.editId) return;
  try {
    const res = await $fetch(`/api/pegawai/${props.editId}`);
    if (res.success && res.data) {
      const d = res.data;
      form.value = {
        nip: d.nip || '',
        nama_pegawai: d.nama_pegawai || '',
        email: d.email || '',
        nomor_hp: d.nomor_hp || '+62',
        tempat_lahir: d.tempat_lahir || '',
        tanggal_lahir: d.tanggal_lahir ? d.tanggal_lahir.split('T')[0] : '',
        usia: d.usia || 0,
        status_kawin: d.status_kawin || 'kawin',
        jumlah_anak: d.jumlah_anak || 0,
        id_kecamatan: d.id_kecamatan || '',
        alamat_lengkap: d.alamat_lengkap || '',
        jarak_rumah_kantor: d.jarak_rumah_kantor || 5,
        tanggal_masuk: d.tanggal_masuk ? d.tanggal_masuk.split('T')[0] : new Date().toISOString().split('T')[0],
        id_jabatan: d.id_jabatan || '',
        id_departemen: d.id_departemen || '',
        status_kontrak: d.status_kontrak || 'PKWTT',
        status: d.status || 'Aktif',
        pendidikan: d.pendidikan && d.pendidikan.length > 0 ? d.pendidikan : [
          { tingkat_pendidikan: 'S1', nama_sekolah: '', tahun_lulus: 2020 }
        ]
      };
      if (d.id_kecamatan) {
        onKecamatanChange();
      }
    }
  } catch (err) {
    console.error('Failed to fetch pegawai detail:', err);
  }
};

onMounted(async () => {
  await fetchMaster();
  await fetchDetail();
});
</script>
