<script setup lang="ts">
defineProps({
  height: {
    type: [String, Number],
    default: 35,
  },
  width: {
    type: [String, Number],
    default: 35,
  },
})
</script>

<template>
  <div class="app-logo" :style="{ height: `${height}px`, width: `${width}px` }"></div>
</template>

<style scoped>
.app-logo {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center left;
  transition: background-image 0.2s ease-in-out;
}

.app-logo {
  background-image: url('@/assets/logo-kairos-icon-light.svg');
}

.v-theme--dark .app-logo {
  background-image: url('@/assets/logo-kairos-icon.svg');
}
</style>
