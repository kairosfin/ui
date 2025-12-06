<script setup lang="ts">
import { computed } from 'vue'

import logoDark from '@/assets/logo-kairos-light.svg'
import logoLight from '@/assets/logo-kairos.svg'

const props = defineProps({
  height: { type: [String, Number], default: 40 },
  width: { type: [String, Number], default: 120 },
  isDark: { type: Boolean, default: false },
})

const currentLogo = computed(() => {
  return props.isDark ? logoDark : logoLight
})
</script>

<template>
  <VImg :src="currentLogo" :height="height" :width="width" alt="Logo Kairos" eager />
</template>
