<template>
  <PegawaiForm :edit-id="id" />
</template>

<script setup>
definePageMeta({
  title: "Edit Pegawai",
});

useSeoMeta({
  title: "Edit Pegawai",
});

import PegawaiForm from "~/features/DataPegawai/components/PegawaiForm.vue";

const route = useRoute();
const id = route.params.id;
</script>
