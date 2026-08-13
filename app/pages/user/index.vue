<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/user/manage');
    }
  ]
});
</script>
