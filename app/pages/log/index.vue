<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Audit Trail & Log Aktivitas Sistem</h3>
    </div>
    <div class="table-responsive card-body p-0">
      <table class="table table-vcenter table-striped">
        <thead>
          <tr>
            <th width="5">No</th>
            <th>Nama User / Username</th>
            <th>Role</th>
            <th>Aktivitas (Title)</th>
            <th>Detail Content</th>
            <th>IP Address</th>
            <th>Waktu (Timestamp)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="logs.length === 0">
            <td colspan="7" class="text-center py-4 text-muted">Belum ada riwayat aktivitas log recorded</td>
          </tr>
          <tr v-for="(item, index) in logs" :key="item.id">
            <td class="text-center">{{ (page - 1) * limit + index + 1 }}</td>
            <td>
              <span class="fw-bold">{{ item.nama_user || item.username || 'System' }}</span>
            </td>
            <td>
              <span class="badge bg-secondary">{{ item.nama_role || '-' }}</span>
            </td>
            <td class="fw-bold text-primary">{{ item.title }}</td>
            <td><small class="text-muted">{{ item.content }}</small></td>
            <td><code>{{ item.ip || '127.0.0.1' }}</code></td>
            <td>{{ item.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex align-items-center" v-if="totalPages > 1">
      <span class="text-muted small">Total {{ totalLogs }} record log</span>
      <ul class="pagination ms-auto m-0">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="page--; fetchLogs()">Prev</button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">{{ page }} / {{ totalPages }}</span>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button class="page-link" @click="page++; fetchLogs()">Next</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Log Aktifitas",
});

useSeoMeta({
  title: "Log Aktifitas",
});

import { ref, onMounted } from 'vue';

const logs = ref([]);
const page = ref(1);
const limit = ref(15);
const totalPages = ref(1);
const totalLogs = ref(0);

const fetchLogs = async () => {
  try {
    const res = await $fetch(`/api/log?page=${page.value}&limit=${limit.value}`);
    if (res.success) {
      logs.value = res.data;
      totalPages.value = res.pagination.totalPages;
      totalLogs.value = res.pagination.total;
    }
  } catch (err) {
    console.error('Failed to fetch logs:', err);
  }
};

onMounted(() => {
  fetchLogs();
});
</script>
