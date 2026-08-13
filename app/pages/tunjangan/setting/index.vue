<template>
  <div class="row">
    <div class="col-12">
      <SettingFrom />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Setting Tunjangan Transport",
});

useSeoMeta({
  title: "Setting Tunjangan Transport",
});

import SettingFrom from "~/features/Tunjangan/components/SettingForm.vue";
</script>
