<template>
  <div>
    <div class="card mb-3">
      <div class="card-header">
        <h3 class="card-title">Detail Hak Akses Role (Read Only)</h3>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4 col-lg-3">
            <label class="form-label">Nama Role</label>
            <input type="text" class="form-control bg-light" :value="roleInfo.nama_role" readonly disabled />
          </div>
          <div class="col-md-8 col-lg-9">
            <label class="form-label">Deskripsi Role</label>
            <input type="text" class="form-control bg-light" :value="roleInfo.deskripsi" readonly disabled />
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter table-striped">
          <thead>
            <tr>
              <th width="5">No</th>
              <th>Modul / Fitur</th>
              <th class="text-center">Akses</th>
              <th class="text-center">Create</th>
              <th class="text-center">Read</th>
              <th class="text-center">Update</th>
              <th class="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="permissions.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">Belum ada pemetaan hak akses untuk role ini di database</td>
            </tr>
            <tr v-for="(item, index) in permissions" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="fw-bold">{{ item.modul_fitur }}</td>
              <td class="text-center">
                <IconCircleCheckFilled v-if="item.akses === 1" class="text-success" />
                <IconXboxXFilled v-else class="text-danger" />
              </td>
              <td class="text-center">
                <IconCircleCheckFilled v-if="item.create === 1" class="text-success" />
                <IconXboxXFilled v-else class="text-danger" />
              </td>
              <td class="text-center">
                <span class="badge" :class="item.read === 'All' ? 'bg-success-lt' : (item.read === 'Own' ? 'bg-warning-lt' : 'bg-secondary-lt')">
                  {{ item.read }}
                </span>
              </td>
              <td class="text-center">
                <span class="badge" :class="item.update === 'All' ? 'bg-success-lt' : (item.update === 'Own' ? 'bg-warning-lt' : 'bg-secondary-lt')">
                  {{ item.update }}
                </span>
              </td>
              <td class="text-center">
                <span class="badge" :class="item.delete === 'All' ? 'bg-danger-lt' : (item.delete === 'Own' ? 'bg-warning-lt' : 'bg-secondary-lt')">
                  {{ item.delete }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Detail Hak Akses Role",
});

useSeoMeta({
  title: "Detail Hak Akses Role",
});

import { ref, onMounted } from "vue";
import { IconCircleCheckFilled, IconXboxXFilled } from "@tabler/icons-vue";

const route = useRoute();
const roleId = route.params.id;

const roleInfo = ref({ nama_role: '', deskripsi: '' });
const permissions = ref([]);

const fetchPermissions = async () => {
  try {
    const res = await $fetch(`/api/role/${roleId}`);
    if (res.success) {
      roleInfo.value = res.data.role;
      permissions.value = res.data.permissions;
    }
  } catch (err) {
    console.error("Failed to fetch permissions:", err);
  }
};

onMounted(() => {
  fetchPermissions();
});
</script>
