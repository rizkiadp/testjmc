<template>
  <div class="row g-3">
    <div class="col-lg-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Data Diri Pegawai</h3>
          <div class="ms-auto d-flex gap-2">
            <button class="btn btn-sm btn-outline-danger" @click="downloadPdf" :disabled="!pegawai">
              <IconCloudDownload size="16" class="me-1" /> PDF Biodata
            </button>
            <NuxtLink to="/pegawai" class="btn btn-sm btn-secondary">
              &larr; Kembali
            </NuxtLink>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div v-else-if="!pegawai" class="alert alert-warning">
            Data pegawai tidak ditemukan
          </div>
          <div v-else class="row g-4">
            <div class="col-12">
              <div class="row align-items-center">
                <div class="col-auto">
                  <div class="bg-primary-lt text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2" style="width: 70px; height: 70px;">
                    {{ getInitials(pegawai.nama_pegawai) }}
                  </div>
                </div>
                <div class="col">
                  <div class="datagrid-item mb-2">
                    <div class="datagrid-title">NIP</div>
                    <div class="datagrid-content"><code>{{ pegawai.nip }}</code></div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Nama Lengkap</div>
                    <div class="datagrid-content fw-bold fs-3 text-primary">{{ pegawai.nama_pegawai }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Email</div>
                <div class="datagrid-content">{{ pegawai.email }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Nomor HP</div>
                <div class="datagrid-content">{{ pegawai.nomor_hp }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Tempat & Tanggal Lahir</div>
                <div class="datagrid-content">{{ pegawai.tempat_lahir }}, {{ pegawai.tanggal_lahir }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Usia</div>
                <div class="datagrid-content fw-bold">{{ pegawai.usia || 0 }} Tahun</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Status Kawin</div>
                <div class="datagrid-content text-capitalize">{{ pegawai.status_kawin }} ({{ pegawai.jumlah_anak || 0 }} Anak)</div>
              </div>
            </div>

            <!-- Riwayat Pendidikan -->
            <div class="col-12">
              <div class="datagrid-item">
                <div class="datagrid-title mb-2">Riwayat Pendidikan</div>
                <div class="table-responsive">
                  <table class="table table-sm table-bordered mb-0">
                    <thead>
                      <tr>
                        <th>Tingkat</th>
                        <th>Nama Sekolah / Kampus</th>
                        <th>Tahun Lulus</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="!pegawai.pendidikan || pegawai.pendidikan.length === 0">
                        <td colspan="3" class="text-muted text-center">Belum ada riwayat pendidikan</td>
                      </tr>
                      <tr v-for="p in pegawai.pendidikan" :key="p.id">
                        <td><span class="badge bg-blue-lt">{{ p.tingkat_pendidikan }}</span></td>
                        <td>{{ p.nama_sekolah }}</td>
                        <td>{{ p.tahun_lulus || '-' }}</td>
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

    <!-- Sisi Kanan: Alamat, Jabatan & Tunjangan -->
    <div class="col-lg-6" v-if="pegawai">
      <div class="card mb-3">
        <div class="card-header">
          <h3 class="card-title">Alamat & Wilayah</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="datagrid-item">
                <div class="datagrid-title">Kecamatan</div>
                <div class="datagrid-content">{{ pegawai.kecamatan || '-' }}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="datagrid-item">
                <div class="datagrid-title">Kabupaten / Kota</div>
                <div class="datagrid-content">{{ pegawai.kabupaten || '-' }}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="datagrid-item">
                <div class="datagrid-title">Provinsi</div>
                <div class="datagrid-content">{{ pegawai.provinsi || '-' }}</div>
              </div>
            </div>
            <div class="col-12">
              <div class="datagrid-item">
                <div class="datagrid-title">Alamat Lengkap</div>
                <div class="datagrid-content">{{ pegawai.alamat_lengkap || '-' }}</div>
              </div>
            </div>
            <div class="col-12">
              <div class="datagrid-item">
                <div class="datagrid-title">Jarak Rumah ke Kantor</div>
                <div class="datagrid-content font-monospace fw-bold text-primary">{{ pegawai.jarak_rumah_kantor || 0 }} KM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Jabatan & Status Kepegawaian</h3>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Jabatan</div>
                <div class="datagrid-content fw-bold">{{ pegawai.nama_jabatan || '-' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Departemen</div>
                <div class="datagrid-content">{{ pegawai.nama_departemen || '-' }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Tanggal Masuk</div>
                <div class="datagrid-content">{{ pegawai.tanggal_masuk }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Status Kontrak</div>
                <div class="datagrid-content">
                  <span class="badge" :class="pegawai.status_kontrak === 'PKWTT' ? 'bg-success' : 'bg-warning'">
                    {{ pegawai.status_kontrak || 'PKWTT' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="datagrid-item">
                <div class="datagrid-title">Status Kepegawaian</div>
                <div class="datagrid-content">
                  <span class="badge" :class="pegawai.status === 'Aktif' ? 'bg-success-lt' : 'bg-danger-lt'">
                    {{ pegawai.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Detail Data Pegawai",
});

useSeoMeta({
  title: "Detail Data Pegawai",
});

import { ref, onMounted } from 'vue';
import { IconCloudDownload } from '@tabler/icons-vue';

const route = useRoute();
const pegawaiId = route.params.id;

const pegawai = ref(null);
const loading = ref(true);

const downloadPdf = () => {
  if (pegawai.value && pegawai.value.id) {
    window.open(`/api/pegawai/${pegawai.value.id}/pdf`, '_blank');
  }
};

const getInitials = (name) => {
  if (!name) return 'P';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const fetchDetail = async () => {
  try {
    const res = await $fetch(`/api/pegawai/${pegawaiId}`);
    if (res.success) {
      pegawai.value = res.data;
    }
  } catch (err) {
    console.error('Failed to fetch detail pegawai:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDetail();
});
</script>
