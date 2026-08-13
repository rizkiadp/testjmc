<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Daftar Role Aplikasi (RBAC)</h3>
    </div>
    <div class="table-responsive card-body p-0">
      <table class="table table-vcenter table-striped table-hover">
        <thead>
          <tr>
            <th width="5">No</th>
            <th>Role (Nama Role)</th>
            <th>Deskripsi</th>
            <th class="text-center" width="120">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="4" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary" role="status"></div> Memuat data role...
            </td>
          </tr>
          <tr v-for="(item, index) in roles" :key="item.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="fw-bold text-primary">{{ item.nama_role }}</td>
            <td>{{ item.deskripsi || '-' }}</td>
            <td class="text-center">
              <NuxtLink
                :to="`/user/role/hak-akses/${item.id}`"
                class="btn btn-sm btn-outline-primary"
              >
                Hak Akses
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Manajemen Role",
});

useSeoMeta({
  title: "Manajemen Role",
});

import { ref, onMounted } from "vue";

const roles = ref([]);
const loading = ref(true);

const fetchRoles = async () => {
  try {
    const res = await $fetch("/api/master");
    if (res.success) {
      roles.value = res.data.roles;
    }
  } catch (err) {
    console.error("Failed to fetch roles:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRoles();
});
</script>
