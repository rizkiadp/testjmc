<script setup>
definePageMeta({
  title: "Dashboard",
});

useSeoMeta({
  title: "Dashboard",
});

import { ref, onMounted } from 'vue';
import { IconUsers, IconUserCheck, IconUserCircle, IconUserExclamation } from "@tabler/icons-vue";

const welcomeMessage = ref('Selamat Datang di Aplikasi Kepegawaian');
const widgets = ref(null);
const loading = ref(true);

const statusPegawaiSeries = ref([0, 0, 0]);
const genderPegawaiSeries = ref([0, 0]);

const statusPegawaiOptions = {
  chart: { type: "donut", height: 200 },
  labels: ["PKWTT (Tetap)", "PKWT (Kontrak)", "Magang"],
  colors: [
    "rgba(43, 80, 142, 1)",
    "rgba(84, 128, 199, 1)",
    "rgba(254, 126, 0, 1)",
  ],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
};

const genderPegawaiOptions = {
  chart: { type: "donut", height: 200 },
  labels: ["Laki-laki", "Perempuan"],
  colors: ["rgba(43, 80, 142, 1)", "rgba(254, 126, 0, 1)"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
};

const totalStatistik = ref([
  { title: "Total Pegawai", value: 0, backgroundColor: "#2b508e", icon: IconUsers },
  { title: "Total Pegawai Kontrak", value: 0, backgroundColor: "#5480c7", icon: IconUserCheck },
  { title: "Total Pegawai Tetap", value: 0, backgroundColor: "#1e3a8a", icon: IconUserCircle },
  { title: "Total Peserta Magang", value: 0, backgroundColor: "#fe7e00", icon: IconUserExclamation }
]);

const fetchDashboard = async () => {
  try {
    const res = await $fetch('/api/dashboard');
    if (res.success) {
      welcomeMessage.value = res.welcomeMessage;
      if (res.widgets) {
        widgets.value = res.widgets;
        totalStatistik.value[0].value = res.widgets.totalPegawai;
        totalStatistik.value[1].value = res.widgets.totalKontrak;
        totalStatistik.value[2].value = res.widgets.totalTetap;
        totalStatistik.value[3].value = res.widgets.totalMagang;

        statusPegawaiSeries.value = res.widgets.chartStatusKontrak.series;
        genderPegawaiSeries.value = res.widgets.chartJenisKelamin.series;
      }
    }
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboard();
});
</script>

<template>
  <div class="row g-3">
    <!-- Card Greeting -->
    <div class="col-md-3">
      <div class="card bg-dark h-100 position-relative">
        <div class="card-body">
          <div class="text-center">
            <img
              src="@/assets/images/greeting-img.svg"
              alt=""
              class="img-fluid mb-4"
            />
          </div>
          <h3 class="card-title text-white">
            {{ welcomeMessage }}
          </h3>
          <p class="text-white fw-lighter fst-italic">
            "Fokuskan tujuan yang ingin didapat, jangan biarkan faktor lain menghalangi tujuan Anda"
          </p>
        </div>
      </div>
    </div>

    <!-- Manager HRD Widgets View -->
    <div class="col-md-9" v-if="widgets">
      <div class="row g-3">
        <!-- Card Total -->
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row g-3">
                <div
                  class="col-md-6 col-lg-3"
                  v-for="(item, index) in totalStatistik"
                  :key="index"
                >
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <div
                        class="d-flex rounded-circle"
                        :style="{
                          width: '56px',
                          height: '56px',
                          background: item.backgroundColor,
                        }"
                      >
                        <component
                          :is="item.icon"
                          :stroke="2"
                          class="m-auto text-white"
                        />
                      </div>
                    </div>

                    <div class="col">
                      <h3 class="fs-2 mb-1">{{ item.value }}</h3>
                      <p class="text-secondary fw-light mb-0">
                        {{ item.title }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Status Kontrak -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Total Pegawai Berdasarkan Status Kontrak</h3>
              <ClientOnly>
                <apexchart
                  type="donut"
                  height="200"
                  :options="statusPegawaiOptions"
                  :series="statusPegawaiSeries"
                />
              </ClientOnly>
            </div>
          </div>
        </div>

        <!-- Chart Gender -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Total Pegawai Berdasarkan Gender</h3>
              <ClientOnly>
                <apexchart
                  type="donut"
                  height="200"
                  :options="genderPegawaiOptions"
                  :series="genderPegawaiSeries"
                />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Welcome Banner for Superadmin & Admin HRD -->
    <div class="col-md-9" v-else>
      <div class="card p-5 text-center">
        <h2 class="text-primary">{{ welcomeMessage }}</h2>
        <p class="text-muted">Gunakan menu navigasi di sebelah kiri untuk mengelola data kepegawaian, user, dan perhitungan tunjangan transport.</p>
      </div>
    </div>

    <!-- Pegawai Terbaru Table for Manager HRD -->
    <div class="col-12" v-if="widgets && widgets.pegawaiTerbaru && widgets.pegawaiTerbaru.length > 0">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">5 Pegawai Paling Baru Bergabung</h3>
        </div>
        <div class="table-responsive card-body p-0">
          <table class="table table-vcenter table-striped card-table">
            <thead>
              <tr>
                <th class="w-1">No</th>
                <th>NIP</th>
                <th>Nama Lengkap</th>
                <th>Jabatan</th>
                <th>Tanggal Masuk</th>
                <th>Status Kontrak</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, idx) in widgets.pegawaiTerbaru" :key="p.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ p.nip }}</td>
                <td>{{ p.nama_pegawai }}</td>
                <td>{{ p.nama_jabatan || '-' }}</td>
                <td>{{ p.tanggal_masuk }}</td>
                <td>
                  <span class="badge" :class="p.status_kontrak === 'PKWTT' ? 'bg-success' : 'bg-warning'">
                    {{ p.status_kontrak }}
                  </span>
                </td>
                <td class="text-center">
                  <NuxtLink :to="`/pegawai/detail/${p.id}`" class="btn btn-sm btn-outline-primary">
                    Detail
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
